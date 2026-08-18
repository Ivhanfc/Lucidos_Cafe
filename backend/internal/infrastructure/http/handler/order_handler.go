package handler

import (
	"lucidos_cafe/internal/infrastructure/http/dto"
	"lucidos_cafe/internal/ports"
	"net/http"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	orderRepo ports.OrderRepository
	notifier ports.RealtimeNotifier
}

func NewOrderHandler(orderRepo ports.OrderRepository, notifier ports.RealtimeNotifier) *OrderHandler {
	return &OrderHandler{
		orderRepo : orderRepo,
		notifier: notifier,
	}
}

func (h *OrderHandler) CreateOrder(c * gin.Context) {
	var req dto.CreateOrderRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//usecase
	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully"})
}

func (h *OrderHandler) GetActiveOrders(c *gin.Context) {
	orders, err := h.orderRepo.FindActiveOrders(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve active orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (h *OrderHandler) UpdateStatus(c *gin.Context) {
	orderID := c.Param("id")

	var req dto.UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//usecase
	c.JSON(http.StatusOK, gin.H{"message": "Status updated", "id": orderID, "status": req.Status})

}
