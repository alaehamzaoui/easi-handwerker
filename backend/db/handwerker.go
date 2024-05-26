package db

import (
	"backend/data"
)

type postgresStore struct {
	
}

// GetHandwerkers gibt eine Liste aller Handwerker zurück.
func (s *postgresStore) GetHandwerkers() ([]*data.Handwerker, error) {
	return nil, nil
}

// CreateHandwerker erstellt einen neuen Handwerker.
func (s *postgresStore) CreateHandwerker(h *data.Handwerker) error {
	return nil
}

// GetHandwerkerByID gibt den Handwerker mit der angegebenen ID zurück.
func (s *postgresStore) GetHandwerkerByID(id int) (*data.Handwerker, error) {
	return nil, nil
}

// UpdateHandwerker aktualisiert die Informationen eines Handwerkers.
func (s *postgresStore) UpdateHandwerker(h *data.Handwerker) error {
	return nil
}

// DeleteHandwerker löscht den Handwerker mit der angegebenen ID.
func (s *postgresStore) DeleteHandwerker(id int) error {
	return nil
}

// GetHandwerkerByNumber gibt den Handwerker mit der angegebenen Nummer zurück.
func (s *postgresStore) GetHandwerkerByNumber(number int64) (*data.Handwerker, error) {
	return nil, nil
}
