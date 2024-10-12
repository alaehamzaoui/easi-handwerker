package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"fmt"

	gomail "gopkg.in/mail.v2"

	"github.com/gorilla/mux"
)

func CreateAuftragHandler(w http.ResponseWriter, r *http.Request) {
	var auftrag models.Auftrag
	if err := json.NewDecoder(r.Body).Decode(&auftrag); err != nil {
		log.Println("Fehler beim Dekodieren der Anfrage:", err)
		http.Error(w, "Ungültige Daten", http.StatusBadRequest)
		return
	}
	auftrag.Status = "Neu"

	auftrag.Reservierungsdatum = time.Now()

	if err := db.DB.Create(&auftrag).Error; err != nil {
		log.Println("Fehler beim Speichern des Auftrags:", err)
		http.Error(w, "Fehler beim Speichern des Auftrags", http.StatusInternalServerError)
		return
	}

	var handwerker models.Benutzer
	if err := db.DB.Where("id = ?", auftrag.UserID).First(&handwerker).Error; err != nil {
		log.Println("Fehler beim Abrufen des Handwerkers:", err)
		http.Error(w, "Auftrag gespeichert, aber Fehler beim Abrufen des Handwerkers", http.StatusInternalServerError)
		return
	}

	if err := sendeAuftragsbestaetigungOhneAnhang(auftrag); err != nil {
		log.Println("Fehler beim Senden der Auftragsbestätigung:", err)
		http.Error(w, "Auftrag gespeichert, aber Fehler beim Senden der Bestätigungs-E-Mail", http.StatusInternalServerError)
		return
	}

	if err := sendeBestaetigungAnHandwerker(auftrag, handwerker); err != nil {
		log.Println("Fehler beim Senden der Auftragsbestätigung an den Handwerker:", err)
		http.Error(w, "Auftrag gespeichert, aber Fehler beim Senden der Bestätigungs-E-Mail", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Auftrag erfolgreich gespeichert und E-Mails gesendet"})
}

func DeleteAuftragHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var auftrag models.Auftrag
	if err := db.DB.Where("id = ?", id).First(&auftrag).Error; err != nil {
		log.Println("Fehler beim Abrufen des Auftrags:", err)
		http.Error(w, "Auftrag nicht gefunden", http.StatusNotFound)
		return
	}

	zeitseitreservierung := time.Since(auftrag.Reservierungsdatum).Hours()
	if zeitseitreservierung > 48 {
		http.Error(w, "Die Stornierungsfrist von 48 Stunden ist abgelaufen", http.StatusBadRequest)
		return
	}

	if err := db.DB.Delete(&auftrag).Error; err != nil {
		log.Println("Fehler beim Löschen des Auftrags:", err)
		http.Error(w, "Fehler beim Löschen des Auftrags", http.StatusInternalServerError)
		return
	}

	var handwerker models.Benutzer
	if err := db.DB.Where("id = ?", auftrag.UserID).First(&handwerker).Error; err != nil {
		log.Println("Fehler beim Abrufen des Handwerkers:", err)
		http.Error(w, "Fehler beim Abrufen des Handwerkers", http.StatusInternalServerError)
		return
	}

	if err := sendeStornierungsBestaetigungAnHandwerker(auftrag, handwerker); err != nil {
		log.Println("Fehler beim Senden der Stornierungsbestätigung an den Handwerker:", err)
		http.Error(w, "Fehler beim Senden der Stornierungsbestätigung an den Handwerker", http.StatusInternalServerError)
		return
	}

	if err := sendeStornierungsBestaetigungAnKunde(auftrag, handwerker); err != nil {
		log.Println("Fehler beim Senden der Stornierungsbestätigung an den Kunde:", err)
		http.Error(w, "Fehler beim Senden der Stornierungsbestätigung an den Kunde", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Auftrag erfolgreich gelöscht"})
}

func sendeStornierungsBestaetigungAnHandwerker(auftrag models.Auftrag, handwerker models.Benutzer) error {
	mailer := gomail.NewMessage()

	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", handwerker.Email)
	mailer.SetHeader("Subject", "Stornierung des Auftrags erfolgreich")

	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		Ihren Auftrag mit den Daten: 

		- Name des Kunde: %s 
		- Ort: %s 
		
		wurde erfolgreich storniert.

		Mit freundlichen Grüßen,
		Team EASI
	`, handwerker.Nachname, auftrag.Name, auftrag.StadtPLZ)

	mailer.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func sendeStornierungsBestaetigungAnKunde(auftrag models.Auftrag, handwerker models.Benutzer) error {
	mailer := gomail.NewMessage()

	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", auftrag.Email)
	mailer.SetHeader("Subject", "Ihre Buchung wurde storniert")

	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		leider müssen wir Sie darüber informieren, dass Herr/Frau %s den Termin storniert hat, den Sie gebucht hatten. Hier sind die Details der Stornierung:

		- Handwerker: %s %s
		- Kategorie: %s
		- Datum: %s 
		- Uhrzeit: %s - %s
		
		Gerne können Sie über unsere App nach einer alternativen Buchungsmöglichkeit suchen. Falls Sie Fragen haben oder Unterstützung benötigen, stehen wir Ihnen selbstverständlich jederzeit zur Verfügung.

		Mit freundlichen Grüßen,
		Team EASI
	`, auftrag.Name, handwerker.Nachname, handwerker.Vorname, handwerker.Nachname, handwerker.Kategorie, auftrag.AusgewählterTag, auftrag.StartZeit, auftrag.EndZeit)

	mailer.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func sendeBestaetigungAnHandwerker(auftrag models.Auftrag, handwerker models.Benutzer) error {
	mailer := gomail.NewMessage()

	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", handwerker.Email)
	mailer.SetHeader("Subject", "Neuen Auftrag erhalten")

	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		wir freuen uns, Ihnen mitzuteilen, dass Sie für einen neuen Auftrag reserviert wurden. Hier die wichtigsten Informationen:

		- Name des Kunde: %s 
		- Ort: %s 
		- Anliegen: %s
		
		Genauere Informationen zu dieser Buchung finden Sie in Ihrem Dashboard.

		Mit freundlichen Grüßen,
		Team EASI
	`, handwerker.Nachname, auftrag.Name, auftrag.StadtPLZ, auftrag.Anliegen)

	mailer.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func sendeAuftragsbestaetigungOhneAnhang(auftrag models.Auftrag) error {
	mailer := gomail.NewMessage()

	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", auftrag.Email)
	mailer.SetHeader("Subject", "Auftragsbestätigung")

	body := fmt.Sprintf(`
		Sehr geehrte/r %s,

		Vielen Dank für Ihre Buchung bei MiniMeister.

		Details Ihres Auftrags:

		- Anliegen: %s
		- Datum: %s
		- Zeit: %s - %s
		- Adresse: %s, %s

		Wir werden uns bald mit Ihnen in Verbindung setzen.

		Mit freundlichen Grüßen,
		MiniMeister
	`, auftrag.Name, auftrag.Anliegen, auftrag.AusgewählterTag, auftrag.StartZeit, auftrag.EndZeit, auftrag.StraßeHausnummer, auftrag.StadtPLZ)

	mailer.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func GetAufträgeHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID erforderlich", http.StatusBadRequest)
		return
	}

	var aufträge []models.Auftrag

	if err := db.DB.Where("user_id = ?", userID).Find(&aufträge).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Fehler beim Abrufen der Aufträge"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aufträge)
}
