package middlewares

import (
	"lucidos_cafe/internal/infrastructure/http/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString, err := c.Cookie("token")
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization cookie is missing"})
            return
        }

        claims, err := auth.ValidateToken(tokenString)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            return
        }

        userID, okID := claims["user_id"].(string)
        username, okUser := claims["username"].(string)
        
        if !okID || !okUser {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Claims of token malformed"})
            return
        }

        c.Set("user_id", userID)
        c.Set("username", username)
        
        c.Next()
    }
}