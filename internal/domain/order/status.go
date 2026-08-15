package order


type Status string

const (
	StatusPending Status = "PENDING"
	StatusPreparing Status = "PREPARING"
	StatusReady Status = "READY"
	StatusDelivered Status = "DELIVERED"
	StatusCancelled Status = "CANCELLED"
)

