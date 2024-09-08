package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("your_secret_key")

type Credentials struct {
	Email    string `json:"email"`
	Passwort string `json:"passwort"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}
	var user models.User
	user.Vorname = r.FormValue("vorname")
	user.Nachname = r.FormValue("nachname")
	user.Geburtsdatum = r.FormValue("geburtsdatum")
	user.Kategorie = r.FormValue("kategorie")
	user.Straße = r.FormValue("straße")
	user.Stadt = r.FormValue("stadt")
	user.Telefon = r.FormValue("telefon")
	user.Email = r.FormValue("email")
	user.Passwort = r.FormValue("passwort")
	user.Stundenlohn, _ = strconv.ParseFloat(r.FormValue("stundenlohn"), 64)

	file, handler, err := r.FormFile("vertrag")
	if err != nil {
		http.Error(w, "Unable to upload Vertrag PDF", http.StatusBadRequest)
		return
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(w, "Unable to read Vertrag file", http.StatusInternalServerError)
		return
	}
	user.Vertrag = fileBytes
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Passwort), bcrypt.DefaultCost)
	user.Passwort = string(hashedPassword)

	// URLs zu Bildern von einer externen Quelle
	switch user.Kategorie {
	case "Maler/-in":
		user.Bild = "https://i.imgur.com/z9qawA7.png"
	case "Elektriker/-in":
		user.Bild = "https://i.imgur.com/Wu4elSV.png"
	case "Friseur/-in":
		user.Bild = "https://i.imgur.com/74gGvZV.png"
	case "Maurer/-in":
		user.Bild = "https://i.imgur.com/AzIbo50.png"
	case "Dachdecker/-in":
		user.Bild = "https://i.imgur.com/zj47n44.png"
	}

	db.DB.Create(&user)

	defaultWorkTimes := []models.WorkTime{
		{UserID: user.ID, Tag: "Montag", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Dienstag", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Mittwoch", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Donnerstag", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Freitag", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Samstag", Von: "", Bis: ""},
		{UserID: user.ID, Tag: "Sonntag", Von: "", Bis: ""},
	}
	db.DB.Create(&defaultWorkTimes)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Benutzer erfolgreich registriert", "file_name": handler.Filename})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Ungültige Eingabedaten"})
		return
	}

	var user models.User
	db.DB.Where("email = ?", creds.Email).First(&user)

	if user.ID == 0 || bcrypt.CompareHashAndPassword([]byte(user.Passwort), []byte(creds.Passwort)) != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Falsche Anmeldeinformationen"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Interner Serverfehler"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenString,
		"benutzer": map[string]interface{}{
			"id":          user.ID,
			"vorname":     user.Vorname,
			"nachname":    user.Nachname,
			"email":       user.Email,
			"straße":      user.Straße,
			"stadt":       user.Stadt,
			"telefon":     user.Telefon,
			"kategorie":   user.Kategorie,
			"stundenlohn": user.Stundenlohn,
			"bild":        user.Bild,
			"verified":    user.Verified,
		},
	})
}
