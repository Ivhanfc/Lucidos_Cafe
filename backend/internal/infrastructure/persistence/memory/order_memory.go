package memory

import (
	"context"
	"sync"

	"lucidos_cafe/internal/domain/order"
)

type OrderRepository struct {
	mu     sync.RWMutex
	orders map[string]*order.Order
}

func NewOrderRepository() *OrderRepository {
	return &OrderRepository{
		orders: make(map[string]*order.Order),
	}
}

func (r *OrderRepository) Save(ctx context.Context, ord *order.Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.orders[ord.GetID()] = ord
	return nil
}

func (r *OrderRepository) FindByID(ctx context.Context, id string) (*order.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	ord, exists := r.orders[id]
	if !exists {
		return nil, order.ErrOrderNotFound
	}
	return ord, nil
}

func (r *OrderRepository) FindActiveOrders(ctx context.Context) ([]*order.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var active []*order.Order
	for _, ord := range r.orders {
		if ord.GetStatus() == order.StatusPending || ord.GetStatus() == order.StatusPreparing {
			active = append(active, ord)
		}
	}
	return active, nil
}

func (r *OrderRepository) FindByUserID(ctx context.Context, userID string) ([]*order.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var userOrders []*order.Order
	for _, ord := range r.orders {
		if ord.GetCustomerID() == userID {
			userOrders = append(userOrders, ord)
		}
	}
	return userOrders, nil
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, id string, status order.Status) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	ord, exists := r.orders[id]
	if !exists {
		return order.ErrOrderNotFound
	}
	ord.UpdateStatus(status)
	return nil
}