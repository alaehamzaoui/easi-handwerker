package data

import "time"

type Handwerker struct {
	ID                int       `json:"id"`
	FirstName         string    `json:"firstName"`
	LastName          string    `json:"lastName"`
	Number            int64     `json:"number"`
	Email             string    `json:"email"`
	EncryptedPassword string    `json:"-"`
	CreatedAt         time.Time `json:"created_at"`
}

type CreateHandwerkerRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func NewHandwerker(firstName, lastName, email, password string) (*Handwerker, error) {
	return &Handwerker{
		FirstName:         firstName,
		LastName:          lastName,
		Number:            0,
		EncryptedPassword: "",
		Email:             email,
		CreatedAt:         time.Time{},
	}, nil
}
