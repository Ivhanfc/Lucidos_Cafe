package product

type Category string

const (
	categoryCoffee Category = "COFFEE"
	categoryBakery Category = "BAKERY"
	CategoryEXTRAS Category = "EXTRAS"
)

func (c Category) IsValid() bool {
	switch c {
	case categoryCoffee, categoryBakery, CategoryEXTRAS:
		return true
	default:
		return false
	}
}
