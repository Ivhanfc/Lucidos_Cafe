package postgres

import (
	"context"
	"database/sql"
	"errors"

	"lucidos_cafe/internal/domain/order"
)

type OrderRepository struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

// Save inserta o actualiza una orden y sus ítems usando una transacción.
func (r *OrderRepository) Save(ctx context.Context, ord *order.Order) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Insertar o actualizar la cabecera (orders)
	queryOrder := `
		INSERT INTO orders (id, user_id, total_amount, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO UPDATE SET
			status = EXCLUDED.status,
			total_amount = EXCLUDED.total_amount,
			updated_at = EXCLUDED.updated_at
	`
	_, err = tx.ExecContext(ctx, queryOrder,
		ord.GetID(),
		ord.GetCustomerID(),
		ord.GetTotalAmount(),
		ord.GetStatus(),
		ord.GetCreatedAt(),
		ord.GetUpdatedAt(),
	)
	if err != nil {
		return err
	}

	// 2. Limpiar ítems previos e re-insertar los actuales (garantiza sincronización limpia)
	_, err = tx.ExecContext(ctx, `DELETE FROM order_items WHERE order_id = $1`, ord.GetID())
	if err != nil {
		return err
	}

	queryItem := `
		INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, notes)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	for _, item := range ord.GetItems() {
		_, err = tx.ExecContext(ctx, queryItem,
			ord.GetID(),
			item.ProductID,
			item.Name,
			item.Quantity,
			item.UnitPrice,
			item.Notes,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

// FindByID busca una orden por su ID cargando la cabecera y sus order_items.
func (r *OrderRepository) FindByID(ctx context.Context, id string) (*order.Order, error) {
	queryOrder := `
		SELECT o.id, o.user_id, u.name, o.status, o.total_amount, o.created_at, o.updated_at
		FROM orders o
		JOIN users u ON o.user_id = u.id
		WHERE o.id = $1
	`
	var (
		ordID        string
		customerID   string
		customerName string
		statusStr    string
		totalAmount  float64
		createdAt    sql.NullTime
		updatedAt    sql.NullTime
	)

	err := r.db.QueryRowContext(ctx, queryOrder, id).Scan(
		&ordID, &customerID, &customerName, &statusStr, &totalAmount, &createdAt, &updatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, order.ErrOrderNotFound
		}
		return nil, err
	}

	// Consultar ítems de la orden
	items, err := r.fetchOrderItems(ctx, ordID)
	if err != nil {
		return nil, err
	}

	// Reconstruir la entidad usando NewOrder
	return order.NewOrder(ordID, customerID, items)
}

// FindActiveOrders recupera órdenes en estado pending o preparing.
func (r *OrderRepository) FindActiveOrders(ctx context.Context) ([]*order.Order, error) {
	query := `
		SELECT o.id
		FROM orders o
		WHERE o.status IN ($1, $2)
		ORDER BY o.created_at ASC
	`
	rows, err := r.db.QueryContext(ctx, query, order.StatusPending, order.StatusPreparing)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orderIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		orderIDs = append(orderIDs, id)
	}

	var activeOrders []*order.Order
	for _, id := range orderIDs {
		ord, err := r.FindByID(ctx, id)
		if err != nil {
			return nil, err
		}
		activeOrders = append(activeOrders, ord)
	}

	return activeOrders, nil
}

// FindByUserID recupera el historial de órdenes de un usuario específico.
func (r *OrderRepository) FindByUserID(ctx context.Context, userID string) ([]*order.Order, error) {
	query := `
		SELECT id
		FROM orders
		WHERE user_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orderIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		orderIDs = append(orderIDs, id)
	}

	var userOrders []*order.Order
	for _, id := range orderIDs {
		ord, err := r.FindByID(ctx, id)
		if err != nil {
			return nil, err
		}
		userOrders = append(userOrders, ord)
	}

	return userOrders, nil
}

// UpdateStatus actualiza únicamente el estado de la orden en la base de datos.
func (r *OrderRepository) UpdateStatus(ctx context.Context, id string, status order.Status) error {
	query := `
		UPDATE orders
		SET status = $1, updated_at = NOW()
		WHERE id = $2
	`
	res, err := r.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return order.ErrOrderNotFound
	}

	return nil
}

// Auxiliar para traer los ítems asociados a una orden.
func (r *OrderRepository) fetchOrderItems(ctx context.Context, orderID string) ([]order.OrderItem, error) {
	query := `
		SELECT product_id, product_name, quantity, unit_price, COALESCE(notes, '')
		FROM order_items
		WHERE order_id = $1
	`
	rows, err := r.db.QueryContext(ctx, query, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []order.OrderItem
	for rows.Next() {
		var item order.OrderItem
		if err := rows.Scan(&item.ProductID, &item.Name, &item.Quantity, &item.UnitPrice, &item.Notes); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}