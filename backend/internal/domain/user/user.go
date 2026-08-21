package user

import (
	"net/mail"
	"strings"
	"time"
)


type User struct {
	id            string
	name          string
	email         string
	passwordHash  string
	googleID      string
	streakDays    int
	lastOrderDate *time.Time
	loyaltyPoints int
	createdAt     time.Time
	updatedAt     time.Time
}

// Create a traditional user with a password.
func NewUser(id string, name string, email string, passwordHash string) (*User, error) {
	u, err := newBaseUser(id, name, email)
	if err != nil {
		return nil, err
	}

	if strings.TrimSpace(passwordHash) == "" {
		return nil, ErrEmptyPassword
	}

	u.passwordHash = passwordHash
	return u, nil
}

// Create a user authenticated by an external provider (Google).
func NewOAuthUser(id string, name string, email string, googleID string) (*User, error) {
	u, err := newBaseUser(id, name, email)
	if err != nil {
		return nil, err
	}

	u.googleID = strings.TrimSpace(googleID)
	return u, nil
}

// RestoreUser rebuilds the entity from the database.
func RestoreUser(
	id, name, email, passwordHash, googleID string,
	streakDays int, lastOrderDate *time.Time, loyaltyPoints int,
	createdAt, updatedAt time.Time,
) *User {
	return &User{
		id:            id,
		name:          name,
		email:         email,
		passwordHash:  passwordHash,
		googleID:      googleID,
		streakDays:    streakDays,
		lastOrderDate: lastOrderDate,
		loyaltyPoints: loyaltyPoints,
		createdAt:     createdAt,
		updatedAt:     updatedAt,
	}
}

func newBaseUser(id string, name string, email string) (*User, error) {
	if strings.TrimSpace(id) == "" {
		return nil, ErrEmptyUserID
	}
	if strings.TrimSpace(name) == "" {
		return nil, ErrEmptyUserName
	}
	if !isValidEmail(email) {
		return nil, ErrInvalidUserEmail
	}

	now := time.Now()
	return &User{
		id:            id,
		name:          name,
		email:         email,
		passwordHash:  "",
		googleID:      "",
		streakDays:    0,
		lastOrderDate: nil,
		loyaltyPoints: 0,
		createdAt:     now,
		updatedAt:     now,
	}, nil
}

func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (u *User) AddPoints(amount float64) {
	earned := int(amount / 5)
	if earned > 0 {
		u.loyaltyPoints += earned
		u.updatedAt = time.Now()
	}
}

func (u *User) UpdateStreak() {
	now := time.Now()

	if u.lastOrderDate == nil {
		u.streakDays = 1
	} else {
		last := time.Date(u.lastOrderDate.Year(), u.lastOrderDate.Month(), u.lastOrderDate.Day(), 0, 0, 0, 0, time.UTC)
		current := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

		daysBetween := int(current.Sub(last).Hours() / 24)

		if daysBetween == 1 {
			u.streakDays++
		} else if daysBetween > 1 {
			u.streakDays = 1
		}
	}

	u.lastOrderDate = &now
	u.updatedAt = now
}

func (u *User) RedeemPoints(points int) error {
	if points <= 0 || points > u.loyaltyPoints {
		return ErrInvalidPoints
	}
	u.loyaltyPoints -= points
	u.updatedAt = time.Now()
	return nil
}

// Methods for OAuth and authentication.
func (u *User) LinkGoogleID(googleID string) {
	u.googleID = strings.TrimSpace(googleID)
	u.updatedAt = time.Now()
}

func (u *User) HasPassword() bool {
	return strings.TrimSpace(u.passwordHash) != ""
}

// Getters
func (u *User) GetID() string            { return u.id }
func (u *User) GetName() string          { return u.name }
func (u *User) GetEmail() string         { return u.email }
func (u *User) GetPasswordHash() string  { return u.passwordHash }
func (u *User) GetGoogleID() string      { return u.googleID }
func (u *User) GetStreakDays() int       { return u.streakDays }
func (u *User) GetLastOrderDate() *time.Time { return u.lastOrderDate }
func (u *User) GetLoyaltyPoints() int    { return u.loyaltyPoints }
func (u *User) GetCreatedAt() time.Time  { return u.createdAt }
func (u *User) GetUpdatedAt() time.Time  { return u.updatedAt }