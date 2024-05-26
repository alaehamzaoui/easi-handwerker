package data

import "time"

type Handwerker struct {
	ID                int       `json:"id"` // ID des Handwerkers
	FirstName         string    `json:"firstName"` // Vorname des Handwerkers
	LastName          string    `json:"lastName"` // Nachname des Handwerkers
	Number            int64     `json:"number"` // Nummer des Handwerkers
	Email             string    `json:"email"` // E-Mail-Adresse des Handwerkers
	EncryptedPassword string    `json:"-"` // Verschlüsseltes Passwort des Handwerkers (nicht sichtbar in JSON)
	CreatedAt         time.Time `json:"created_at"` // Erstellungszeitpunkt des Handwerkers
}

type CreateHandwerkerRequest struct {
	FirstName string `json:"firstName"` // Vorname des Handwerkers
	LastName  string `json:"lastName"` // Nachname des Handwerkers
	Email     string `json:"email"` // E-Mail-Adresse des Handwerkers
	Password  string `json:"password"` // Passwort des Handwerkers
}

func NewHandwerker(firstName, lastName, email, password string) (*Handwerker, error) {
	return &Handwerker{
		FirstName:         firstName, // Vorname setzen
		LastName:          lastName, // Nachname setzen
		Number:            0, // Nummer auf 0 setzen
		EncryptedPassword: "", // Verschlüsseltes Passwort auf leeren String setzen
		Email:             email, // E-Mail-Adresse setzen
		CreatedAt:         time.Time{}, // Erstellungszeitpunkt auf den Nullwert setzen
	}, nil
}
