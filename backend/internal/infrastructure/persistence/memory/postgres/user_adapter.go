package postgres

import (
	"context"
	"database/sql"
	"errors"

	"lucidos_cafe/internal/domain/user"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Save(ctx context.Context, u *user.User) error {
	query := `
		INSERT INTO users (id, name, email, password_hash, streak_days, last_order_date, loyalty_points, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			email = EXCLUDED.email,
			password_hash = EXCLUDED.password_hash,
			streak_days = EXCLUDED.streak_days,
			last_order_date = EXCLUDED.last_order_date,
			loyalty_points = EXCLUDED.loyalty_points,
			updated_at = EXCLUDED.updated_at
	`
	_, err := r.db.ExecContext(ctx, query,
		u.GetID(),
		u.GetName(),
		u.GetEmail(),
		u.GetPasswordHash(),
		u.GetStreakDays(),
		u.GetLastOrderDate(),
		u.GetCreatedAt(),
		u.GetUpdatedAt(),
	)
	return err
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	query := `
		SELECT id, name, email, password_hash, streak_days, last_order_date, loyalty_points, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	return scanUser(row)
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	query := `
		SELECT id, name, email, password_hash, streak_days, last_order_date, loyalty_points, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	row := r.db.QueryRowContext(ctx, query, email)
	return scanUser(row)
}

func (r *UserRepository) Update(ctx context.Context, u *user.User) error {
	return r.Save(ctx, u)
}

// Función auxiliar para mapear de SQL al agregando/entidad de dominio
func scanUser(row *sql.Row) (*user.User, error) {
	var (
		id            string
		name          string
		email         string
		passwordHash  string
		streakDays    int
		lastOrderDate *sql.NullTime
		loyaltyPoints int
		createdAt     sql.NullTime
		updatedAt     sql.NullTime
	)

	err := row.Scan(&id, &name, &email, &passwordHash, &streakDays, &lastOrderDate, &loyaltyPoints, &createdAt, &updatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, err
	}

	// Reconstrucción de la entidad desde la base de datos
	u, err := user.NewUser(id, name, email, passwordHash)
	if err != nil {
		return nil, err
	}

	// Restaurar estado interno persistido
	if lastOrderDate.Valid {
		u.UpdateStreak() // O un método específico de hidratación según tu dominio
	}
	
	return u, nil
}