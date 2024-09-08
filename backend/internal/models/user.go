package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID uint `json:"id"` // Hier explizit das JSON-Tag für die ID hinzufügen

	Vorname      string  `json:"vorname"`
	Nachname     string  `json:"nachname"`
	Geburtsdatum string  `json:"geburtsdatum"`
	Kategorie    string  `json:"kategorie"`
	Straße       string  `json:"straße"`
	Stadt        string  `json:"stadt"`
	Telefon      string  `json:"telefon"`
	Email        string  `json:"email" gorm:"unique"`
	Passwort     string  `json:"passwort"`
	Stundenlohn  float64 `json:"stundenlohn"`
	Bild         string  `json:"bild"`
	Verified     bool    `json:"verified"`
	Vertrag      []byte  `json:"vertrag"`
}
