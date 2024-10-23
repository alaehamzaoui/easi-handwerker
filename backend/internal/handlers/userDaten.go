package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"net/http"
)

func UpdateUserDataHandler(w http.ResponseWriter, r *http.Request) {
	var updatedUser models.User
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehlerhafte Eingabedaten"})
		return
	}

	//überprüft ob der User existiert
	var existingUser models.User
	result := db.DB.First(&existingUser, updatedUser.ID)
	if result.Error != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Benutzer nicht gefunden"})
		return
	}

	//Update von Daten
	existingUser.Vorname = updatedUser.Vorname
	existingUser.Nachname = updatedUser.Nachname
	existingUser.Geburtsdatum = updatedUser.Geburtsdatum
	existingUser.Kategorie = updatedUser.Kategorie
	existingUser.Straße = updatedUser.Straße
	existingUser.Stadt = updatedUser.Stadt
	existingUser.Telefon = updatedUser.Telefon
	existingUser.Email = updatedUser.Email
	existingUser.Stundenlohn = updatedUser.Stundenlohn
	existingUser.Bild = updatedUser.Bild
	existingUser.Verified = updatedUser.Verified

	result = db.DB.Save(&existingUser)
	if result.Error != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Aktualisieren der Benutzerdaten"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(existingUser)
}