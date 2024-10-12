package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"net/http"
	"strings"
)

func SearchHandwerkerHandler(w http.ResponseWriter, r *http.Request) {
	kategorie := r.URL.Query().Get("kategorie")
	stadt := r.URL.Query().Get("stadt")

	var handwerker []models.Benutzer

	query := db.DB

	if kategorie != "" {
		query = query.Where("LOWER(kategorie) LIKE ?", "%"+strings.ToLower(kategorie)+"%")
	}

	if stadt != "" {
		query = query.Where("LOWER(stadt) LIKE ?", "%"+strings.ToLower(stadt)+"%")
	}

	if err := query.Find(&handwerker).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Abrufen der Handwerker"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(handwerker)
}
