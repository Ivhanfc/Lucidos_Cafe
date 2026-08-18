package ports

import (
	"context"
	"lucidos_cafe/internal/domain/user"
)

type UserRepository interface {
	Save(ctx context.Context, u *user.User) error
	FindByID(ctx context.Context, id string) (*user.User, error)
	FindByEmail(ctx context.Context, email string) (*user.User, error)
	Update(ctx context.Context, u *user.User) error
}