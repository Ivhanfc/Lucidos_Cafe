package order

import "time"

type OrderItem struct {
	ProductID string `json:"product_id"`
	Name string `json:"name"`
	Quantity int `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Notes string `json:"notes,omitempty"`
}

type Order struct {
	id string
	customerName string
	items []OrderItem
	status Status
	totalAmount float64
	createdAt time.Time
	updatedAt time.Time
}

func NewOrder(id string, customerName string, items []OrderItem) (*Order, error) {
	if len(items) == 0 {
		return nil, ErrEmptyItems
	}

	var totalAmount float64
	for _, item := range items {
		if item.Quantity <= 0 || item.UnitPrice <= 0 {
			return nil, ErrInvalidQuantity
		}
		totalAmount += float64(item.Quantity) * item.UnitPrice
	}

	now := time.Now()
	
	return &Order{
		id: id,
		customerName: customerName,
		items: items,
		status: StatusPending,
		totalAmount: totalAmount,
		createdAt: now,
		updatedAt: now,
	}, nil
}

func (o *Order) UpdateStatus(newStatus Status) error {
	switch o.status {
	case StatusPending:
		if newStatus != StatusPreparing && newStatus != StatusCancelled {
			return ErrInvalidStatusTransition
		}
	case StatusPreparing:
		if newStatus != StatusReady && newStatus != StatusCancelled {
			return ErrInvalidStatusTransition
		}
	case StatusReady:
		if newStatus != StatusDelivered && newStatus != StatusCancelled {
			return ErrInvalidStatusTransition
		}
	case StatusDelivered, StatusCancelled:
		return ErrInvalidStatusTransition
	default:
		return ErrInvalidStatusTransition
	}

	o.status = newStatus
	o.updatedAt = time.Now()
	return nil
}

func (o *Order) GetID()  string { return o.id}
func (o *Order) GetCustomerName() string { return o.customerName }
func (o *Order) GetItems() []OrderItem { return o.items }
func (o *Order) GetStatus() Status { return o.status }
func (o *Order) GetTotalAmount() float64 { return o.totalAmount }
func (o *Order) GetCreatedAt() time.Time { return o.createdAt }
func (o *Order) GetUpdatedAt() time.Time { return o.updatedAt }





