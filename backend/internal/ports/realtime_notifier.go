package ports

import (
	"context"

	"lucidos_cafe/internal/domain/order"
)

type RealtimeNotifier interface {
	NotifyNewOrder(ctx context.Context, ord *order.Order) error
	NotifyStatusChange(ctx context.Context, orderID string, status order.Status) error
	BroadcastMessage(ctx context.Context, eventType string, payload interface{}) error
}