package dto
type CreateOrderItemRequest struct {
	ProductID string `json:"product_id" binding:"required"`
	Quantity  int    `json:"quantity" binding:"required,min=1"`
}

type CreateOrderRequest struct {
	UserID	  string                `json:"user_id" binding:"required"`
	Items     []CreateOrderItemRequest `json:"items" binding:"required,dive,required"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=PENDING PREPARING READY DELIVERED CANCELLED"`
}
