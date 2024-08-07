package handler

import (
	"backend/data"
	"fmt"
	"net/http"
	"os"

	jwt "github.com/golang-jwt/jwt/v4"
)

func createJWT(handwerker *data.Handwerker) (string, error) {
	claims := &jwt.MapClaims{
		"expiresAt": 15000,
		"Emai":      handwerker.Email,
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func WithJWTAuth(HandlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("c  alling WithJWTAuth middleware")
		HandlerFunc(w, r)
	}
}
