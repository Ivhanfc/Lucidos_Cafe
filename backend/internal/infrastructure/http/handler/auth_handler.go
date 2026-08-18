package handler

import (
	"net/http"
	"strings"

	"lucidos_cafe/internal/domain/user"
	"lucidos_cafe/internal/ports"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/markbates/goth/gothic"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo ports.UserRepository
}

func NewAuthHandler(userRepo ports.UserRepository) *AuthHandler {
	return &AuthHandler{
		userRepo: userRepo,
	}
}

func (h *AuthHandler) BeginAuth(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

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

	existingUser, err := h.userRepo.FindByEmail(ctx, gothUser.Email)
	if err != nil && err != user.ErrUserNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error de base de datos"})
		return
	}

	var appUser *user.User

	if existingUser == nil {
		userID := uuid.New().String()
		// Usamos NewOAuthUser en lugar de NewUser para no exigir contraseña
		newUser, err := user.NewOAuthUser(userID, gothUser.Name, gothUser.Email, gothUser.UserID)
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
		// Vincular Google ID si la cuenta existía pero no lo tenía guardado
		if existingUser.GetGoogleID() == "" {
			existingUser.LinkGoogleID(gothUser.UserID)
			_ = h.userRepo.Update(ctx, existingUser)
		}
		appUser = existingUser
	}

	// Silenciamos temporalmente el chequeo del compilador sobre appUser
	_ = appUser

	// TODO: Emitir Token / Cookie de Sesión
	// c.SetCookie("auth_session", token, 3600*24, "/", "", false, true)

	c.Redirect(http.StatusSeeOther, "http://localhost:5173/dashboard")
}

func (h *AuthHandler) Logout(c *gin.Context) {
	gothic.Logout(c.Writer, c.Request)
	c.JSON(http.StatusOK, gin.H{"message": "sesión cerrada"})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		Name     string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	name := strings.TrimSpace(req.Name)
	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)

	if name == "" || email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Usuario, email y password son obligatorios"})
		return
	}

	ctx := c.Request.Context()
	if _, err := h.userRepo.FindByEmail(ctx, email); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "el correo ya está registrado"})
		return
	} else if err != nil && err != user.ErrUserNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error de base de datos"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo proteger la contraseña"})
		return
	}

	newUser, err := user.NewUser(uuid.New().String(), name, email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userRepo.Save(ctx, newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo guardar el usuario"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "registro exitoso",
		"user":    serializeUser(newUser),
	})
}

func (h *AuthHandler) ManualLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)
	if email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email y password son obligatorios"})
		return
	}

	ctx := c.Request.Context()
	appUser, err := h.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if err == user.ErrUserNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciales inválidas"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error de base de datos"})
		}
		return
	}

	if !appUser.HasPassword() {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "esta cuenta fue creada con Google. Inicia sesión con el botón de Google"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(appUser.GetPasswordHash()), []byte(password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciales inválidas"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "inicio de sesión exitoso",
		"user":    serializeUser(appUser),
	})
}

func serializeUser(appUser *user.User) gin.H {
	return gin.H{
		"id":             appUser.GetID(),
		"name":           appUser.GetName(),
		"email":          appUser.GetEmail(),
		"streak_days":    appUser.GetStreakDays(),
		"loyalty_points": appUser.GetLoyaltyPoints(),
	}
}