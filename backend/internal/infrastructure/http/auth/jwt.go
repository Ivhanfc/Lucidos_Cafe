package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)
var jwtSecretKey = []byte(os.Getenv("SECRET_JWT"))
func getSecretKey() []byte {
	secret := os.Getenv("secretjwt")
	if secret == "" {
		panic("JWT secret key is not set in environment variables")
	}
	return []byte(secret)
}

func GenerateToken(userID string, username string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
		"iat":      time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(getSecretKey())
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return getSecretKey(), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}
	return token, nil
}