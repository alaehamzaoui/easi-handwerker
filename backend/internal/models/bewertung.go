package models

import "time"
import "gorm.io/gorm"

type Bewertung struct {
	gorm.Model
    ID         uint      `json:"id" gorm:"primaryKey"`
    AuftragID  uint      `json:"auftrag_id"`
    Bewertung  int       `json:"bewertung"`
    Nachricht  string    `json:"nachricht"`
    ErstelltAm time.Time `json:"erstellt_am"`
}