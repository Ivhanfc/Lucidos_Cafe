package main

import (
	"lucidos_cafe/infrastructure/http/auth"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	auth.InitOAuth(auth.OAuthConfig{
		SessionSecret: os.Getenv("SESSION_SECRET"),
		GoogleKey: os.Getenv("CLIENT_ID"),
		GoogleSecret: os.Getenv("CLIENT_SECRET"),
		CallbackURL: os.Getenv("CALLBACK_URL"),
	})

	router := gin.Default()
	router.Run(":8080")
}