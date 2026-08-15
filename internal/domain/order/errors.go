package order

import "errors"

var (
	//Errors related to order validation
	ErrEmptyCustomerName = errors.New("customer name cannot be empty")
	ErrEmptyItems = errors.New("order must contain at least one item")
	ErrInvalidQuantity = errors.New("item quantity must be greater than zero")
	ErrInvalidUnitPrice = errors.New("item unit price must be greater than zero")

	//Errors related to order status transitions
	ErrInvalidStatusTransition = errors.New("invalid status transition")
	ErrEmptyStatus = errors.New("status cannot be empty")
	ErrInvalidAmount = errors.New("amount must be greater than zero")
	ErrOrderAlreadyCancelled = errors.New("order is already cancelled")
	ErrOrderAlreadyDelivered = errors.New("order is already delivered")

	//Errors of search 
	ErrOrderNotFound = errors.New("order not found")
	ErrOrderAlreadyExists = errors.New("order already exists")


)