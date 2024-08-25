package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

func CreateAuftragHandler(w http.ResponseWriter, r *http.Request) {
	var auftrag models.Auftrag

	if err := json.NewDecoder(r.Body).Decode(&auftrag); err != nil {
		log.Println("Fehler beim Dekodieren der Anfrage:", err)
		http.Error(w, "Ungültige Daten", http.StatusBadRequest)
		return
	}

	//log.Println("Erhaltene Daten:", auftrag)

	if err := db.DB.Create(&auftrag).Error; err != nil {
		log.Println("Fehler beim Speichern des Auftrags:", err)
		http.Error(w, "Fehler beim Speichern des Auftrags", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Auftrag erfolgreich gespeichert"})
}

func GetAufträgeHandler(w http.ResponseWriter, r *http.Request) {
	var aufträge []models.Auftrag

	if err := db.DB.Find(&aufträge).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Abrufen der Aufträge"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aufträge)
}
