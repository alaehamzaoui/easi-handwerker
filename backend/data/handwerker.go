package data

import (
	"math/rand"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Handwerker struct {
	ID                int       `json:"id"`
	Vorname           string    `json:"vorname"`
	Nachname          string    `json:"nachname"`
	Geburtsdatum      time.Time `json:"geburtsdatum"`
	Art               string    `json:"art"`
	Straße            string    `json:"straße"`
	Hausnummer        string    `json:"hausnummer"`
	PLZ               int64     `json:"plz"`
	Stadt             string    `json:"Stadt"`
	Telefon           int64     `json:"telefon"`
	Nummer            int64     `json:"nummer"`
	Email             string    `json:"email"`
	EncryptedPassword string    `json:"-"`
	CreatedAt         time.Time `json:"created_at"`
}

type CreateHandwerkerRequest struct {
	Vorname      string `json:"vorname"`
	Nachname     string `json:"nachname"`
	Geburtsdatum string `json:"geburtsdatum"`
	Art          string `json:"art"`
	Straße       string `json:"straße"`
	Hausnummer   string `json:"hausnummer"`
	PLZ          int64  `json:"plz"`
	Stadt        string `json:"Stadt"`
	Telefon      int64  `json:"telefon"`
	Email        string `json:"email"`
	Password     string `json:"password"`
}

func NewHandwerker(vorname string, nachname string, Art string, geburtsdatum string, straße string, hausnummer string, plz int64, stadt string, telefon int64, email string, password string, encryptedPassword string) (*Handwerker, error) {

	geburtsdatumTime, err := time.Parse(time.RFC3339, geburtsdatum)
	if err != nil {

		geburtsdatumTime, err = time.Parse("2006-01-02", geburtsdatum)
		if err != nil {
			return nil, err
		}
	}

	encpw, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return &Handwerker{
		Vorname:           vorname,
		Nachname:          nachname,
		Geburtsdatum:      geburtsdatumTime,
		Art:               Art,
		Straße:            straße,
		Hausnummer:        hausnummer,
		PLZ:               plz,
		Stadt:             stadt,
		Telefon:           telefon,
		Nummer:            int64(rand.Intn(100000)),
		Email:             email,
		EncryptedPassword: string(encpw),
		CreatedAt:         time.Time{},
	}, nil
}
