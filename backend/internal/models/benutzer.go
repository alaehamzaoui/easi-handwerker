package models

import "gorm.io/gorm"

type Benutzer struct {
	gorm.Model
	ID uint `json:"id"` // unit steht für unsigned integer , ich habe die benutzt weil ich keine negativen id haben will

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
}
