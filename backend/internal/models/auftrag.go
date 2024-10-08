package models

import (
	"time"

	"gorm.io/gorm"
)

type Auftrag struct {
	gorm.Model
	ID                 uint      `json:"id"`
	UserID             uint      `json:"user_id"`
	test               string    `json:"name"`
	Name               string    `json:"name"`
	StraßeHausnummer   string    `json:"straßehausnummer"`
	StadtPLZ           string    `json:"stadt_plz"`
	Email              string    `json:"email"`
	Telefon            string    `json:"telefon"`
	Anliegen           string    `json:"anliegen"`
	AusgewählterTag    string    `json:"ausgewählter_tag"`
	StartZeit          string    `json:"start_zeit"`
	EndZeit            string    `json:"end_zeit"`
	Status             string    `json:"status"`
	Reservierungsdatum time.Time `json:"reservierungsdatum"`
}
