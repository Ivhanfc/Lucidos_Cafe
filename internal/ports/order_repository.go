package ports

import (
	"context"
	"lucidos_cafe/internal/domain/order"
)

type OrderRepository interface {
	Save(ctx context.Context, ord *order.Order) error
	FindByID(ctx context.Context, id string) (*order.Order, error)
	FindActiveOrders(ctx context.Context) ([]*order.Order, error)
	FindByUserID(ctx context.Context, userID string) ([]*order.Order, error)
	UpdateStatus(ctx context.Context, id string, newStatus order.Status) error
}