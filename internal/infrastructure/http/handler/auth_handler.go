package handler

import (
	"net/http"

	"lucidos_cafe/internal/domain/user"
	"lucidos_cafe/internal/ports"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/markbates/goth/gothic"
)

type AuthHandler struct {
	userRepo ports.UserRepository
}

func NewAuthHandler(userRepo ports.UserRepository) *AuthHandler {
	return &AuthHandler{
		userRepo: userRepo,
	}
}

// BeginAuth inicia el flujo redirigiendo al proveedor OAuth (Google)
func (h *AuthHandler) BeginAuth(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

// Callback recibe la respuesta de Google tras iniciar sesión
func (h *AuthHandler) Callback(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()

	gothUser, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "falló la autenticación: " + err.Error()})
		return
	}

	ctx := c.Request.Context()

	// 1. Verificar si el usuario ya existe por correo
	existingUser, err := h.userRepo.FindByEmail(ctx, gothUser.Email)
	if err != nil && err != user.ErrUserNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error de base de datos"})
		return
	}

	var appUser *user.User

	if existingUser == nil {
		// 2. Si es nuevo, creamos el usuario en nuestro Dominio
		userID := uuid.New().String()
		newUser, err := user.NewUser(userID, gothUser.Name, gothUser.Email, "OAUTH_GOOGLE")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.userRepo.Save(ctx, newUser); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo guardar el usuario"})
			return
		}
		appUser = newUser
	} else {
		appUser = existingUser
	}

	// 3. Respuesta con datos del usuario
	c.JSON(http.StatusOK, gin.H{
		"message": "autenticación exitosa",
		"user": gin.H{
			"id":             appUser.GetID(),
			"name":           appUser.GetName(),
			"email":          appUser.GetEmail(),
			"streak_days":    appUser.GetStreakDays(),
			"loyalty_points": appUser.GetLoyalityPoints(),
		},
	})
}

// Logout cierra la sesión de la cookie de Gothic
func (h *AuthHandler) Logout(c *gin.Context) {
	gothic.Logout(c.Writer, c.Request)
	c.JSON(http.StatusOK, gin.H{"message": "sesión cerrada"})
}