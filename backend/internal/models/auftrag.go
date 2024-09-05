package models

import "gorm.io/gorm"

type Auftrag struct {
	gorm.Model
	UserID           uint   `json:"user_id"`
	Name             string `json:"name"`
	StraßeHausnummer string `json:"straßehausnummer"`
	StadtPLZ         string `json:"stadt_plz"`
	Email            string `json:"email"`
	Telefon          string `json:"telefon"`
	Anliegen         string `json:"anliegen"`
	AusgewählterTag  string `json:"ausgewählter_tag"`
	StartZeit        string `json:"start_zeit"`
	EndZeit          string `json:"end_zeit"`
	Status           string `json:"status"`
}
