package models

import "gorm.io/gorm"

type Anfrage struct {
	gorm.Model
	Email       string `json:"email"`
	Betreff     string `json:"betreff"`
	Anfrage     string `json:"anfrage"`
	Geantwortet bool   `json:"geantwortet"`
}
