package db

import (
	"backend/data"
)

// CreateVerification erstellt eine neue Verifizierung
func (s *postgresStore) CreateVerification(*data.verification) (error) {
	return nil, nil
}

func (s *postgresStore) GetVerifications() ([]*data.Verification, error) {
	return nil, nil
}
// GetVerifications gibt eine Liste aller Verifizierungen zurück.
func (s *postgresStore) getVerificationByID(id int) (*data.Verification, error) {
	return nil, nil
}

// UpdateVerification aktualisiert die Informationen einer Verifizierung.
func (s *postgresStore) UpdateVerification(email string) error {
	return nil
}
