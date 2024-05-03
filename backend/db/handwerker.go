package db

import (
	"backend/data"
)

type postgresStore struct {
	// Add necessary fields here
}

func (s *postgresStore) GetHandwerkers() ([]*data.Handwerker, error) {
	return nil, nil
}

func (s *postgresStore) CreateHandwerker(h *data.Handwerker) error {
	return nil
}

func (s *postgresStore) GetHandwerkerByID(id int) (*data.Handwerker, error) {
	return nil, nil
}

func (s *postgresStore) UpdateHandwerker(h *data.Handwerker) error {
	return nil
}

func (s *postgresStore) DeleteHandwerker(id int) error {
	return nil
}

func (s *postgresStore) GetHandwerkerByNumber(number int64) (*data.Handwerker, error) {
	return nil, nil
}
