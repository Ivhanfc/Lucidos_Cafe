package middlewares

import (
	"lucidos_cafe/internal/infrastructure/http/auth"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)


func AuthMiddleware() gin.HandlerFunc {
	return func (c *gin.Context)  {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		return 
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
		return
	}
	tokenString := parts[1]

	token, err := auth.ValidateToken(tokenString)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userID, okID := claims["user_id"].(string)
		username, okUser := claims["username"].(string)
		if !okID || !okUser {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
				"error": "Claims of token malformated"})
			return 
		}
		c.Set("user_id", userID)
		c.Set("username", username)
		c.Next()
		return 
	}
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
		"error": "Invalid token claims"}) 
	}
}