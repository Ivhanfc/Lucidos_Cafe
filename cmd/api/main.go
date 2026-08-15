package main

import (
	"log"
	appHTTP "lucidos_cafe/internal/infrastructure/http"
	"lucidos_cafe/internal/infrastructure/http/auth"
	"lucidos_cafe/internal/infrastructure/http/handler"
	"lucidos_cafe/internal/infrastructure/persistence/memory"
	"lucidos_cafe/internal/ports"
	"os"
)

func main() {
	auth.InitOAuth(auth.OAuthConfig{
		SessionSecret: os.Getenv("SESSION_SECRET"),
		GoogleKey: os.Getenv("CLIENT_ID"),
		GoogleSecret: os.Getenv("CLIENT_SECRET"),
		CallbackURL: os.Getenv("CALLBACK_URL"),
	})
	userRepo := memory.NewUserRepository()
	orderRepo := memory.NewOrderRepository()
	var notifier ports.RealtimeNotifier
	
	authHandler := handler.NewAuthHandler(userRepo)
	orderHandler := handler.NewOrderHandler(orderRepo, notifier)
	router := appHTTP.SetupRouter(authHandler, orderHandler)
	
	log.Println("Server is running in http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}