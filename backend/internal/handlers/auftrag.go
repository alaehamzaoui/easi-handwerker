package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"log"
	"net/http"

	"bytes"

	"fmt"
	"io"

	"github.com/signintech/gopdf"
	gomail "gopkg.in/mail.v2"
)

func CreateAuftragHandler(w http.ResponseWriter, r *http.Request) {
	var auftrag models.Auftrag

	if err := json.NewDecoder(r.Body).Decode(&auftrag); err != nil {
		log.Println("Fehler beim Dekodieren der Anfrage:", err)
		http.Error(w, "Ungültige Daten", http.StatusBadRequest)
		return
	}

	// Speichere den Auftrag in der Datenbank
	if err := db.DB.Create(&auftrag).Error; err != nil {
		log.Println("Fehler beim Speichern des Auftrags:", err)
		http.Error(w, "Fehler beim Speichern des Auftrags", http.StatusInternalServerError)
		return
	}

	// Generiere die PDF-Rechnung
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

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Auftrag erfolgreich gespeichert und E-Mail gesendet"})
}

func sendeAuftragsbestaetigungMitAnhang(auftrag models.Auftrag, pdfData []byte) error {
	mailer := gomail.NewMessage()

	// Setze den Absender, Empfänger und den Betreff
	mailer.SetHeader("From", "info.minimeister@gmail.com")
	mailer.SetHeader("To", auftrag.Email)
	mailer.SetHeader("Subject", "Auftragsbestätigung und Rechnung")

	// Setze den E-Mail-Inhalt
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

	// Füge die PDF-Rechnung als Anhang hinzu
	mailer.Attach("Rechnung.pdf", gomail.SetCopyFunc(func(w io.Writer) error {
		_, err := w.Write(pdfData)
		return err
	}))

	// SMTP-Einstellungen
	dialer := gomail.NewDialer("smtp.gmail.com", 587, "info.minimeister@gmail.com", "jzafrboycrqjlifs")

	// Sende die E-Mail
	if err := dialer.DialAndSend(mailer); err != nil {
		return err
	}

	return nil
}

// Funktion zum Erstellen der PDF-Rechnung
func erstelleRechnungPDF(auftrag models.Auftrag) ([]byte, error) {
	pdf := gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
	pdf.AddPage()

	// Schriftart hinzufügen
	err := pdf.AddTTFFont("arial", "assets/fonts/arial.ttf")
	if err != nil {
		return nil, err
	}
	err = pdf.SetFont("arial", "", 14)
	if err != nil {
		return nil, err
	}

	// Fügen das Logo
	err = pdf.Image("assets/images/logo.png", 200, 10, nil) // Positioniere das Bild solen wir hier ändern
	if err != nil {
		return nil, err
	}
	pdf.Br(70) // Platz für das Bild

	// Beispielinhalt der PDF
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

	log.Println("Abgerufene Aufträge:", aufträge) // Pour vérifier ce qui est récupéré

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aufträge)
}
