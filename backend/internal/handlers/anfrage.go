package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

func CreateRequestHandler(w http.ResponseWriter, r *http.Request) {
	var anfrage models.Anfrage

	if err := json.NewDecoder(r.Body).Decode(&anfrage); err != nil {
		log.Println("Fehler beim Dekodieren der Anfrage:", err)
		http.Error(w, "Ungültige Daten", http.StatusBadRequest)
		return
	}

	if err := db.DB.Create(&anfrage).Error; err != nil {
		log.Println("Fehler beim Speichern der Anfrage:", err)
		http.Error(w, "Fehler beim Speichern der Anfrage", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Anfrage erfolgreich gespeichert"})
}

func GetRequestsHandler(w http.ResponseWriter, r *http.Request) {
	var anfragen []models.Anfrage

	if err := db.DB.Order("geantwortet").Find(&anfragen).Error; err != nil {
		log.Println("Fehler beim Abrufen der Anfragen:", err)
		http.Error(w, "Fehler beim Abrufen der Anfragen", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(anfragen)
}
