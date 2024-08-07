package data

import "golang.org/x/crypto/bcrypt"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (a *Handwerker) ValidPassword(pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(a.EncryptedPassword), []byte(pw)) == nil
}

type LoginResponse struct {
	Email string `json:"email"`
	Token string `json:"token"`
}
