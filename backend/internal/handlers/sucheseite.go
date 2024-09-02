package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func SearchHandwerkerHandler(w http.ResponseWriter, r *http.Request) {
	kategorie := r.URL.Query().Get("kategorie")
	stadt := r.URL.Query().Get("stadt")

	var handwerker []models.User

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

func VerifyHandwerkerHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id := vars["id"]

	var handwerker models.User
	if err := db.DB.First(&handwerker, "id = ?", id).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Handwerker nicht gefunden"})
		return
	}
	handwerker.Verified = true
	db.DB.Save(&handwerker)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Handwerker erfolgreich verifiziert"})

}

func NotVerifyHandwerkerHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id := vars["id"]

	var handwerker models.User
	if err := db.DB.First(&handwerker, "id = ?", id).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Handwerker nicht gefunden"})
		return
	}
	handwerker.Verified = false
	db.DB.Save(&handwerker)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Handwerker erfolgreich de-verifiziert"})

}
