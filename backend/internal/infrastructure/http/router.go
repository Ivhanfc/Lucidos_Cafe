package http

import (
	"lucidos_cafe/internal/infrastructure/http/handler"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)
func SetupRouter(
	authHandler *handler.AuthHandler,
	orderHandler *handler.OrderHandler,
)*gin.Engine { 
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"}, // Puertos de Vite / CRA
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	authRoutes := r.Group("/auth")
	{
		authRoutes.POST("/register", authHandler.Register)
		authRoutes.POST("/login", authHandler.ManualLogin)
		authRoutes.GET("/logout", authHandler.Logout)
		authRoutes.GET("/me", authHandler.Me)
		
		
		authRoutes.GET("/:provider", authHandler.BeginAuth)
		authRoutes.GET("/:provider/callback", authHandler.Callback)
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