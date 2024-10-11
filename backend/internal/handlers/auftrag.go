package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"bytes"

	"fmt"
	"io"

	"github.com/signintech/gopdf"
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

	//reservierungdatum speichern
	auftrag.Reservierungsdatum = time.Now()
	// Auftrag in der Datenbank speichern hier
	if err := db.DB.Create(&auftrag).Error; err != nil {
		log.Println("Fehler beim Speichern des Auftrags:", err)
		http.Error(w, "Fehler beim Speichern des Auftrags", http.StatusInternalServerError)
		return
	}

	var handwerker models.User
	if err := db.DB.Where("id = ?", auftrag.UserID).First(&handwerker).Error; err != nil {
		log.Println("Fehler beim Abrufen des Handwerkers:", err)
		http.Error(w, "Auftrag gespeichert, aber Fehler beim Abrufen des Handwerkers", http.StatusInternalServerError)
		return
	}

	//  PDF-Rechnung wird hier erstellt
	pdf, err := erstelleRechnungPDF(auftrag)
	if err != nil {
		log.Println("Fehler beim Erstellen der PDF-Rechnung:", err)
		http.Error(w, "Auftrag gespeichert, aber Fehler beim Erstellen der Rechnung", http.StatusInternalServerError)
		return
	}

	// E-Mail senden
	if err := sendeAuftragsbestaetigungMitAnhang(auftrag, pdf); err != nil {
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

	//überprüft ob die 48 Stunden abgelaufen sind
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

	var handwerker models.User
	if err := db.DB.Where("id = ?", auftrag.UserID).First(&handwerker).Error; err != nil {
		log.Println("Fehler beim Abrufen des Handwerkers:", err)
		http.Error(w, "Fehler beim Abrufen des Handwerkers", http.StatusInternalServerError)
		return
	}

	// Senden Stornierungsbestätigung
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

func sendeStornierungsBestaetigungAnHandwerker(auftrag models.Auftrag, handwerker models.User) error {
	mailer := gomail.NewMessage()

	// Setze den Absender, Empfänger und den Betreff
	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", handwerker.Email)
	mailer.SetHeader("Subject", "Stornierung des Auftrags erfolgreich")

	// hier können wir den Inhalt der E-Mail bearbeiten
	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		Ihren Auftrag mit den Daten: 

		-Name des Kunde: %s 
		-Ort: %s 
		
		wurde erfolgreich storniert.

		Mit freundlichen Grüßen,
		Team EASI
	`, handwerker.Nachname, auftrag.Name, auftrag.StadtPLZ)

	mailer.SetBody("text/plain", body)

	// SMTP-Einstellungen für unseren E-Mail-Server
	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func sendeStornierungsBestaetigungAnKunde(auftrag models.Auftrag, handwerker models.User) error {
	mailer := gomail.NewMessage()

	// Setze den Absender, Empfänger und den Betreff
	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", auftrag.Email)
	mailer.SetHeader("Subject", "ihre Buchung wurde storniert")

	// hier können wir den Inhalt der E-Mail bearbeiten
	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		leider müssen wir Sie darüber informieren, dass Herr/Frau %s den Termin storniert hat, den Sie gebucht hatten. Hier sind die Details der Stornierung:

		-Handwerker: %s %s
		-Kategorie: %s
		-Datum: %s 
		-Uhrzeit: %s - %s
		
		Gerne können Sie über unsere App nach einer alternativen Buchungsmöglichkeit suchen. Falls Sie Fragen haben oder Unterstützung benötigen, stehen wir Ihnen selbstverständlich jederzeit zur Verfügung.

		Mit freundlichen Grüßen,
		Team EASI
	`, auftrag.Name, handwerker.Nachname, handwerker.Vorname, handwerker.Nachname, handwerker.Kategorie, auftrag.AusgewählterTag, auftrag.StartZeit, auftrag.EndZeit)
	mailer.SetBody("text/plain", body)

	// SMTP-Einstellungen für unseren E-Mail-Server
	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

// email zu Handwerker
func sendeBestaetigungAnHandwerker(auftrag models.Auftrag, handwerker models.User) error {
	mailer := gomail.NewMessage()

	// Setze den Absender, Empfänger und den Betreff
	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", handwerker.Email)
	mailer.SetHeader("Subject", "Neuen Auftrag erhalten")

	// hier können wir den Inhalt der E-Mail bearbeiten
	body := fmt.Sprintf(`
		Sehr geehrte/r Frau/Herr %s,

		wir freuen uns, Ihnen mitzuteilen, dass Sie für einen neuen Auftrag reserviert wurden. Hier die wichtigsten Informationen:

		-Name des Kunde: %s 
		-Ort: %s 
		-Anliegen: %s
		
		Genauere Informationen zu dieser Buchung finden Sie in Ihrem Dashboard.

		Mit freundlichen Grüßen,
		Team EASI
	`, handwerker.Nachname, auftrag.Name, auftrag.StadtPLZ, auftrag.Anliegen)

	mailer.SetBody("text/plain", body)

	// SMTP-Einstellungen für unseren E-Mail-Server
	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

func sendeAuftragsbestaetigungMitAnhang(auftrag models.Auftrag, pdfData []byte) error {
	mailer := gomail.NewMessage()

	// Setze den Absender, Empfänger und den Betreff
	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", auftrag.Email)
	mailer.SetHeader("Subject", "Auftragsbestätigung und Rechnung")

	// hier können wir den Inhalt der E-Mail bearbeiten
	body := fmt.Sprintf(`
		Sehr geehrte/r %s,

		Vielen Dank für Ihre Buchung bei MiniMeister. Im Anhang finden Sie die Rechnung für Ihren Auftrag.

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

	// PDF-Rechnung als Anhang hinzu
	mailer.Attach("Rechnung.pdf", gomail.SetCopyFunc(func(w io.Writer) error {
		_, err := w.Write(pdfData)
		return err
	}))

	// SMTP-Einstellungen für unseren E-Mail-Server
	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

// ich erstelle die pdf Rechnung hier
func erstelleRechnungPDF(auftrag models.Auftrag) ([]byte, error) {
	pdf := gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
	pdf.AddPage()

	// Schriftart wird hier bearbeitet und auch größe
	err := pdf.AddTTFFont("arial", "../assets/fonts/ARIAL.TTF")
	if err != nil {
		return nil, err
	}
	err = pdf.SetFont("arial", "", 14)
	if err != nil {
		return nil, err
	}

	//  Logo von assets/images/logo.png wird hier hinzugefügt
	err = pdf.Image("../assets/images/logo.png", 200, 10, nil) // Positioniere das Bild solen wir hier ändern
	if err != nil {
		return nil, err
	}
	pdf.Br(70) // Platz für das Bild

	// Beispielinhalt der PDF , soll aber noch bearbeitet werden
	pdf.Cell(nil, "Rechnung")
	pdf.Br(50)
	pdf.Cell(nil, fmt.Sprintf("Auftragnehmer: %s", auftrag.Name))
	pdf.Br(50)
	pdf.Cell(nil, fmt.Sprintf("Datum: %s", auftrag.AusgewählterTag))
	pdf.Br(50)
	pdf.Cell(nil, fmt.Sprintf("Anliegen: %s", auftrag.Anliegen))
	pdf.Br(50)
	pdf.Cell(nil, fmt.Sprintf("Zeitraum: %s - %s", auftrag.StartZeit, auftrag.EndZeit))
	pdf.Br(50)
	pdf.Cell(nil, fmt.Sprintf("Adresse: %s, %s", auftrag.StraßeHausnummer, auftrag.StadtPLZ))

	var buf bytes.Buffer
	err = pdf.Write(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
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

	//log.Println("Abgerufene Aufträge:", aufträge)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aufträge)
}
