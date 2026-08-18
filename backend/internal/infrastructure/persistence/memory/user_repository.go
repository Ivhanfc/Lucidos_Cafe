package memory

import (
	"context"
	"sync"

	"lucidos_cafe/internal/domain/user"
)

type UserRepository struct {
	mu    sync.RWMutex
	users map[string]*user.User
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		users: make(map[string]*user.User),
	}
}

func (r *UserRepository) Save(ctx context.Context, u *user.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.users[u.GetID()] = u
	return nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	u, exists := r.users[id]
	if !exists {
		return nil, user.ErrUserNotFound
	}
	return u, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, u := range r.users {
		if u.GetEmail() == email {
			return u, nil
		}
	}
	return nil, user.ErrUserNotFound
}

func (r *UserRepository) Update(ctx context.Context, u *user.User) error {
	return r.Save(ctx, u)
}