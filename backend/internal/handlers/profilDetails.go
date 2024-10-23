package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func HandwerkerDetailsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	//log.Println("Angeforderte Handwerker-ID:", id)

	var handwerker models.User
	if err := db.DB.First(&handwerker, id).Error; err != nil {
		log.Println("Fehler beim Abrufen des Handwerkers:", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Handwerker nicht gefunden"})
		return
	}

	//log.Println("Handwerker gefunden:", handwerker)

	var workTimes []models.WorkTime
	if err := db.DB.Where("user_id = ?", handwerker.ID).Find(&workTimes).Error; err != nil {
		log.Println("Fehler beim Abrufen der Arbeitszeiten:", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Abrufen der Arbeitszeiten"})
		return
	}

	//log.Println("Arbeitszeiten gefunden:", workTimes)

	response := map[string]interface{}{
		"handwerker": handwerker,
		"workTimes":  workTimes,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
