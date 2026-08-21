package postgres

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"time"

	"lucidos_cafe/internal/domain/user"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Save(ctx context.Context, u *user.User) error {
	log.Printf("[PostgresRepo] Saving user: %s (%s)", u.GetEmail(), u.GetID())

	query := `
		INSERT INTO users (
			id,
			name,
			email,
			password_hash,
			google_id,
			streak_days,
			loyalty_points,
			created_at,
			updated_at,
			last_order_date
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (email) DO UPDATE SET
			name = EXCLUDED.name,
			google_id = COALESCE(EXCLUDED.google_id, users.google_id),
			password_hash = CASE 
				WHEN EXCLUDED.password_hash <> '' THEN EXCLUDED.password_hash 
				ELSE users.password_hash 
			END,
			streak_days = EXCLUDED.streak_days,
			loyalty_points = EXCLUDED.loyalty_points,
			updated_at = EXCLUDED.updated_at,
			last_order_date = EXCLUDED.last_order_date
		RETURNING id;
	`

	var actualID string
	err := r.db.QueryRowContext(ctx, query,
		u.GetID(),            // $1
		u.GetName(),          // $2
		u.GetEmail(),         // $3
		u.GetPasswordHash(),  // $4
		u.GetGoogleID(),      // $5
		u.GetStreakDays(),    // $6
		u.GetLoyaltyPoints(), // $7
		u.GetCreatedAt(),     // $8
		u.GetUpdatedAt(),     // $9
		u.GetLastOrderDate(), // $10
	).Scan(&actualID)

	if err != nil {
		log.Printf("[PostgresRepo ERROR] Failed to save user: %v", err)
		return err
	}

	// Direct mutation of private fields via RestoreUser pointer assignment
	if actualID != u.GetID() {
		*u = *user.RestoreUser(
			actualID,
			u.GetName(),
			u.GetEmail(),
			u.GetPasswordHash(),
			u.GetGoogleID(),
			u.GetStreakDays(),
			u.GetLastOrderDate(),
			u.GetLoyaltyPoints(),
			u.GetCreatedAt(),
			u.GetUpdatedAt(),
		)
	}

	log.Printf("[PostgresRepo SUCCESS] User persisted with ID: %s", actualID)
	return nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	query := `
		SELECT id, name, email, password_hash, google_id, streak_days, last_order_date, loyalty_points, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	return scanUser(row)
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	query := `
		SELECT id, name, email, password_hash, google_id, streak_days, last_order_date, loyalty_points, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	row := r.db.QueryRowContext(ctx, query, email)
	return scanUser(row)
}

func (r *UserRepository) Update(ctx context.Context, u *user.User) error {
	return r.Save(ctx, u)
}

func scanUser(row *sql.Row) (*user.User, error) {
	var id, name, email string
	var passwordHash, googleID sql.NullString
	var streakDays, loyaltyPoints int
	var lastOrderDate sql.NullTime
	var createdAt, updatedAt time.Time

	err := row.Scan(
		&id,
		&name,
		&email,
		&passwordHash,
		&googleID,
		&streakDays,
		&lastOrderDate,
		&loyaltyPoints,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		log.Printf("[PostgresRepo ERROR] Scan failed: %v", err)
		return nil, err
	}

	var passStr, googleIDStr string
	if passwordHash.Valid {
		passStr = passwordHash.String
	}
	if googleID.Valid {
		googleIDStr = googleID.String
	}

	var lastOrderPtr *time.Time
	if lastOrderDate.Valid {
		lastOrderPtr = &lastOrderDate.Time
	}

	return user.RestoreUser(
		id,
		name,
		email,
		passStr,
		googleIDStr,
		streakDays,
		lastOrderPtr,
		loyaltyPoints,
		createdAt,
		updatedAt,
	), nil
}