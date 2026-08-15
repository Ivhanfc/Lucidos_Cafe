package product

import "errors"

var (
	ErrEmptyProductID = errors.New("product ID cannot be empty")
	ErrEmptyProductName = errors.New("product name cannot be empty")
	ErrInvalidProductPrice = errors.New("product price must be greater than zero")
	ErrProductInactive = errors.New("product is inactive")
	ErrProductNotFound = errors.New("product not found")
	ErrInvalidCategory = errors.New("invalid product category")
)