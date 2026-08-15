package user

import (
	"net/mail"
	"strings"
	"time"
)
type User struct {
	id string
	name string
	email string
	passwordHash string
	streakDays int
	lastOrderDate *time.Time
	loyalityPoints int
	createdAt time.Time
	updatedAt time.Time
}

func NewUser(id string, name string, email string, passwordHash string) (*User, error) {
	if strings.TrimSpace(id) == "" {
		return nil, ErrEmptyUserID
	}
	if strings.TrimSpace(name) == "" {
		return nil, ErrEmptyUserName
	}
	if !isValidEmail(email) {
		return nil, ErrInvalidUserEmail
	}
	if strings.TrimSpace(passwordHash) == "" {
		return nil, ErrEmptyPasswordHash
	}
	now := time.Now()
	return &User{
		id: id,
		name: name,
		email: email,
		passwordHash: passwordHash,
		streakDays: 0,
		lastOrderDate: nil,
		loyalityPoints: 0,
		createdAt: now,
		updatedAt: now,
	}, nil
}

func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (u * User) AddPoints(amount float64) {
	earned := int(amount / 5)
	if earned > 0 {
		u.loyalityPoints += earned
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
	if points <= 0 {
		return ErrInvalidPoints
	}
	if points > u.loyalityPoints {
		return ErrInvalidPoints
	}
	u.loyalityPoints -= points
	u.updatedAt = time.Now()
	return nil
}

//getters
func (u *User) GetID() string { return u.id }
func (u *User) GetName() string { return u.name }
func (u *User) GetEmail() string { return u.email }
func (u *User) GetStreakDays() int { return u.streakDays }
func (u *User) GetLastOrderDate() *time.Time { return u.lastOrderDate }
func (u *User) GetLoyalityPoints() int { return u.loyalityPoints }
func (u *User) GetCreatedAt() time.Time { return u.createdAt }
func (u *User) GetUpdatedAt() time.Time { return u.updatedAt }
func (u *User) GetPasswordHash() string { return u.passwordHash }
