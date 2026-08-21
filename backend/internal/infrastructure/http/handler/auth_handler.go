package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"lucidos_cafe/internal/domain/user"
	"lucidos_cafe/internal/infrastructure/http/auth"
	"lucidos_cafe/internal/ports"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/markbates/goth/gothic"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo    ports.UserRepository
	redisClient *redis.Client
}

func NewAuthHandler(userRepo ports.UserRepository, redisClient *redis.Client) *AuthHandler {
	return &AuthHandler{
		userRepo:    userRepo,
		redisClient: redisClient,
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication failed: " + err.Error()})
		return
	}

	ctx := c.Request.Context()

	existingUser, err := h.userRepo.FindByEmail(ctx, gothUser.Email)
	if err != nil && !errors.Is(err, user.ErrUserNotFound) && !errors.Is(err, sql.ErrNoRows) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	var appUser *user.User

	if existingUser == nil {
		userID := uuid.New().String()
		newUser, err := user.NewOAuthUser(userID, gothUser.Name, gothUser.Email, gothUser.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.userRepo.Save(ctx, newUser); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save user"})
			return
		}
		appUser = newUser
	} else {
		if existingUser.GetGoogleID() == "" {
			existingUser.LinkGoogleID(gothUser.UserID)
			_ = h.userRepo.Update(ctx, existingUser)
		}
		appUser = existingUser
	}

	tokenString, err := auth.GenerateToken(appUser.GetID(), appUser.GetName())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate session"})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		MaxAge:   86400,
		Path:     "/",
		Domain:   "",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	c.Redirect(http.StatusSeeOther, "http://localhost:5173/shopping")
}

func (h *AuthHandler) Logout(c *gin.Context) {
	gothic.Logout(c.Writer, c.Request)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Domain:   "",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, gin.H{"message": "session closed"})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		Name     string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
		return
	}

	name := strings.TrimSpace(req.Name)
	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)

	if name == "" || email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username, email and password are required"})
		return
	}

	ctx := c.Request.Context()
	if _, err := h.userRepo.FindByEmail(ctx, email); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email is already registered"})
		return
	} else if err != nil && !errors.Is(err, user.ErrUserNotFound) && !errors.Is(err, sql.ErrNoRows) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
		return
	}

	newUser, err := user.NewUser(uuid.New().String(), name, email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userRepo.Save(ctx, newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "registration successful",
		"user":    serializeUser(newUser),
	})
}

func (h *AuthHandler) ManualLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)
	if email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email and password are required"})
		return
	}

	ctx := c.Request.Context()
	appUser, err := h.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, user.ErrUserNotFound) || errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	if appUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if !appUser.HasPassword() {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "this account was created with Google. Please log in using the Google button"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(appUser.GetPasswordHash()), []byte(password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	tokenString, err := auth.GenerateToken(appUser.GetID(), appUser.GetName())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate session"})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		MaxAge:   86400,
		Path:     "/",
		Domain:   "",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "login successful",
		"user":    serializeUser(appUser),
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	tokenStr, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: missing cookie"})
		return
	}

	claims, err := auth.ValidateToken(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid token"})
		return
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "malformed token"})
		return
	}

	ctx := c.Request.Context()
	redisKey := "user:" + userID

	// 1. CACHE HIT: read from Redis.
	cachedUser, err := h.redisClient.Get(ctx, redisKey).Result()
	if err == nil {
		var cachedMap gin.H
		if err := json.Unmarshal([]byte(cachedUser), &cachedMap); err == nil {
			c.JSON(http.StatusOK, gin.H{"user": cachedMap})
			return
		}
	}

	// 2. CACHE MISS: read from PostgreSQL.
	appUser, err := h.userRepo.FindByID(ctx, userID)
	if err != nil && !errors.Is(err, user.ErrUserNotFound) && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("[ERROR AuthHandler.Me] Database failure for user ID %v: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	if appUser == nil {
		log.Printf("[WARN AuthHandler.Me] User ID %v not found. Clearing cookie.", userID)
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "token",
			Value:    "",
			MaxAge:   -1,
			Path:     "/",
			Domain:   "",
			Secure:   false,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	userMap := serializeUser(appUser)
	if userMap == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not serialize user"})
		return
	}

	// 3. Save in Redis (TTL: 24 hours).
	if userBytes, err := json.Marshal(userMap); err == nil {
		h.redisClient.Set(ctx, redisKey, userBytes, 24*time.Hour)
	}

	c.JSON(http.StatusOK, gin.H{"user": userMap})
}

func serializeUser(appUser *user.User) gin.H {
	if appUser == nil {
		return nil
	}
	return gin.H{
		"id":             appUser.GetID(),
		"name":           appUser.GetName(),
		"email":          appUser.GetEmail(),
		"streak_days":    appUser.GetStreakDays(),
		"loyalty_points": appUser.GetLoyaltyPoints(),
	}
}