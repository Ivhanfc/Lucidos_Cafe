package user

import "errors"


var (
	ErrEmptyUserID      = errors.New("user ID cannot be empty")
	ErrEmptyUserName    = errors.New("user name cannot be empty")
	ErrInvalidUserEmail = errors.New("email is invalid")
	ErrEmptyPassword    = errors.New("password is required for traditional registration")
	ErrInvalidPoints    = errors.New("points to redeem are invalid")
	ErrUserNotFound     = errors.New("user not found")
)