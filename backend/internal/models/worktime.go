// worktime.go
package models

import "gorm.io/gorm"

type WorkTime struct {
	gorm.Model
	UserID  uint   `json:"user_id"`
	Tag     string `json:"tag"`
	Von     string `json:"von"`
	Bis     string `json:"bis"`
	Gebucht bool   `json:"gebucht"`
}
