package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

func GetBewertungenForAuftrag(w http.ResponseWriter, r *http.Request) {
    auftragID := r.URL.Query().Get("auftrag_id")
    if auftragID == "" {
        http.Error(w, "Auftrag ID erforderlich", http.StatusBadRequest)
        return
    }

    var bewertungen []models.Bewertung

    if err := db.DB.Where("auftrag_id = ?", auftragID).Find(&bewertungen).Error; err != nil {
        http.Error(w, "Fehler beim Abrufen der Bewertungen", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(bewertungen)
}

func BewertungHandler(w http.ResponseWriter, r *http.Request) {
    var bewertung models.Bewertung

    if err := json.NewDecoder(r.Body).Decode(&bewertung); err != nil {
		log.Println("Ungültige Anfrage")
        http.Error(w, "Ungültige Anfrage", http.StatusBadRequest)
        return
    }

    if bewertung.Bewertung < 1 || bewertung.Bewertung > 5 {
		log.Println("Ungültige Bewertung")
        http.Error(w, "Ungültige Bewertung", http.StatusBadRequest)
        return
    }

    if err := db.DB.Create(&bewertung).Error; err != nil {
        log.Println("Fehler beim Speichern der Bewertung:", err)
        http.Error(w, "Fehler beim Speichern der Bewertung", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Bewertung erfolgreich gespeichert"})
}

