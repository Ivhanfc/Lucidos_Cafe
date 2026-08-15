package product

import (
	"time"
)

type Product struct {
	id string
	name string
	description string
	price float64
	Category Category
	isAvaible bool
	createdAt time.Time
	updatedAt time.Time
}

func NewProduct(id string, name string, description string, price float64, category Category) (*Product, error) {
	if id == "" {
		return nil, ErrEmptyProductID
	}
	if name == "" {
		return nil, ErrEmptyProductName
	}
	if price <= 0 {
		return nil, ErrInvalidProductPrice
	}
	if !category.IsValid() {
		return nil, ErrInvalidCategory
	}
	
	now := time.Now()
	return &Product{
		id: id,
		name: name,
		description: description,
		price: price,
		Category: category,
		isAvaible: true,
		createdAt: now,
		updatedAt: now,
	}, nil
}

func (p *Product) UpdatePrice(newPrice float64) error {
	if newPrice <= 0 {
		return ErrInvalidProductPrice
	}
	p.price = newPrice
	p.updatedAt = time.Now()
	return nil
}

func (p *Product) UpdateAvailability(isAvaible bool) {
	p.isAvaible = isAvaible
	p.updatedAt = time.Now()
}

//getters
func (p *Product) GetID() string { return p.id }
func (p *Product) GetName() string { return p.name }
func (p *Product) GetDescription() string {return p.description}

func (p *Product) GetPrice() float64 { return p.price }
func (p *Product) GetCategory() Category { return p.Category }
func (p *Product) IsAvailable() bool { return p.isAvaible }
func (p *Product) GetCreatedAt() time.Time { return p.createdAt }
func (p *Product) GetUpdatedAt() time.Time { return p.updatedAt }
