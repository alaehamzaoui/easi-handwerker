package db

import (
	"backend/data"
	"database/sql"
	"fmt"
)

func (s *postgresStore) CreateHandwerker(handwerker *data.Handwerker) error {
	query := " insert into handwerker (vorname, nachname, art , geburtsdatum,straße, hausnummer, plz, stadt, telefon, email, encryptedpassword, createdat) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

	_, err := s.db.Query(query, handwerker.Vorname, handwerker.Nachname, handwerker.Art, handwerker.Geburtsdatum, handwerker.Straße, handwerker.Hausnummer, handwerker.PLZ, handwerker.Stadt, handwerker.Telefon, handwerker.Email, handwerker.EncryptedPassword, handwerker.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (s *postgresStore) DeleteHandwerker(int) error {
	panic("noch nicht implementiert")
}

func (s *postgresStore) GetHandwerkerByID(int) (*data.Handwerker, error) {
	panic("noch nicht implementiert")
}

func (s *postgresStore) GetHandwerkerByNumber(int64) (*data.Handwerker, error) {
	panic("noch nicht implementiert")
}

func (s *postgresStore) GetHandwerkers() ([]*data.Handwerker, error) {
	rows, err := s.db.Query("select * from handwerker")
	if err != nil {
		return nil, err
	}
	handwerkers := []*data.Handwerker{}
	for rows.Next() {
		handwerker, err := scanIntoHandwerker(rows)
		if err != nil {
			return nil, err
		}
		handwerkers = append(handwerkers, handwerker)
	}
	return handwerkers, nil
}

func (s *postgresStore) UpdateHandwerker(*data.Handwerker) error {
	panic("noch nicht implementiert")
}

func (s *postgresStore) GetHandwerkerByEmail(email string) (*data.Handwerker, error) {
	rows, err := s.db.Query("select * from handwerker where email = $1", email)

	if err != nil {
		return nil, err

	}
	for rows.Next() {
		return scanIntoHandwerker(rows)
	}
	return nil, fmt.Errorf("Email %s nicht gefunden", email)
}

func scanIntoHandwerker(rows *sql.Rows) (*data.Handwerker, error) {
	handwerker := &data.Handwerker{}
	err := rows.Scan(&handwerker.ID, &handwerker.Vorname, &handwerker.Art, &handwerker.Geburtsdatum, &handwerker.Nachname, &handwerker.Straße, &handwerker.Hausnummer, &handwerker.PLZ, &handwerker.Stadt, &handwerker.Telefon, &handwerker.Nummer, &handwerker.Email, &handwerker.EncryptedPassword, &handwerker.CreatedAt)
	if err != nil {
		return nil, err
	}
	return handwerker, nil
}
