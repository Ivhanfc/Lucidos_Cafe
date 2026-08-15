package http

import (
	"lucidos_cafe/internal/infrastructure/http/handler"

	"github.com/gin-gonic/gin"
)
func SetupRouter(
	authHandler *handler.AuthHandler,
	orderHandler *handler.OrderHandler,
)*gin.Engine { 
	r := gin.Default()
	authRoutes := r.Group("/auth")
	{
		authRoutes.GET("/:provider", authHandler.BeginAuth)
		authRoutes.GET("/:provider/callback", authHandler.Callback)
		authRoutes.GET("/logout", authHandler.Logout)
	}

	api := r.Group("/api/v1") 
	{
		orders := api.Group("/orders")
		orders.POST("", orderHandler.CreateOrder)
		orders.GET("/active", orderHandler.GetActiveOrders)
		orders.PATCH("/:id/status", orderHandler.UpdateStatus)
	}
	
	return r
}