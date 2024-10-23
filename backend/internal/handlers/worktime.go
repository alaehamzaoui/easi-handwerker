package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"gorm.io/gorm"
)

func GetWorkTimesHandler(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Email erforderlich"})
		return
	}

	var user models.User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		if err == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Benutzer nicht gefunden"})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Interner Serverfehler"})
		}
		return
	}

	var workTimes []models.WorkTime
	if err := db.DB.Where("user_id = ? AND deleted_at IS NULL", user.ID).Find(&workTimes).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Abrufen der Arbeitszeiten"})
		return
	}

	// Wenn keine Arbeitszeiten gefunden werden, Standard-Arbeitszeiten initialisieren
	if len(workTimes) == 0 {
		defaultWorkTimes := []models.WorkTime{
			{UserID: user.ID, Tag: "Montag", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Dienstag", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Mittwoch", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Donnerstag", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Freitag", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Samstag", Von: "", Bis: ""},
			{UserID: user.ID, Tag: "Sonntag", Von: "", Bis: ""},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(defaultWorkTimes)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(workTimes)
}

func UpdateWorkTimesHandler(w http.ResponseWriter, r *http.Request) {
	var reqData struct {
		Email     string            `json:"email"`
		WorkTimes []models.WorkTime `json:"workTimes"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
		http.Error(w, "Ungültige Eingabe", http.StatusBadRequest)
		return
	}

	if reqData.Email == "" || len(reqData.WorkTimes) == 0 {
		http.Error(w, "Email und Arbeitszeiten erforderlich", http.StatusBadRequest)
		return
	}

	var user models.User
	if err := db.DB.Where("email = ?", reqData.Email).First(&user).Error; err != nil {
		http.Error(w, "Benutzer nicht gefunden", http.StatusNotFound)
		return
	}

	// Alte Arbeitszeiten löschen
	//log.Println("Lösche alte Arbeitszeiten für Benutzer-ID:", user.ID)
	if err := db.DB.Where("user_id = ?", user.ID).Delete(&models.WorkTime{}).Error; err != nil {
		http.Error(w, "Fehler beim Löschen der alten Arbeitszeiten", http.StatusInternalServerError)
		return
	}

	// Neue Arbeitszeiten speichern
	for _, workTime := range reqData.WorkTimes {
		workTime.UserID = user.ID
		workTime.ID = 0
		//	log.Println("Erstelle Arbeitszeit für Tag:", workTime.Tag, "von", workTime.Von, "bis", workTime.Bis)
		if err := db.DB.Create(&workTime).Error; err != nil {
			http.Error(w, "Fehler beim Speichern der Arbeitszeiten", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Arbeitszeiten erfolgreich aktualisiert"})
}

func HandleGebuchtWert(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	//log.Println("wurde gerufen")
	tag := vars["tag"]

	log.Println(id)
	//tag = "Montag"
	log.Println(tag, "alo")

	//var arbeitzeit models.WorkTime
	/*
		if err := db.DB.Where("user_id = ? AND tag = ? ", id, tag).Error; err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Handwerler nicht gefunden"})
			return
		}
		arbeitzeit.Gebucht = true */
	//db.Model(&arbeitzeit{}).Where("id = ? AND age = ?", 5, 30).Updates(ar{Name: "new_name", Age: new_age})

	db.DB.Model(&models.WorkTime{}).Where("tag = ? AND user_id = ?", tag, id).Updates(models.WorkTime{Gebucht: true})
	//db.DB.Save(&arbeitzeit)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Gebucht variable updated "})

}
