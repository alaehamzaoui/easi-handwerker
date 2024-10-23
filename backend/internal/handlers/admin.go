package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

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
