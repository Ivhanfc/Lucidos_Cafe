package user
import "errors"

var (
	ErrEmptyUserID = errors.New("user ID cannot be empty")
	ErrEmptyUserName = errors.New("user name cannot be empty")
	ErrInvalidUserEmail = errors.New("user email is invalid")
	ErrUserNotFound = errors.New("user not found")
	ErrEmptyPasswordHash = errors.New("password hash cannot be empty")
	ErrInvalidPoints = errors.New("user points must be greater than or equal to zero")
)
