package db

import (
	"backend/data"
)

func (s *postgresStore) CreateHandwerker(*data.Handwerker) error {
	panic("noch nicht implementiert")
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
	panic("noch nicht implementiert")
}

func (s *postgresStore) UpdateHandwerker(*data.Handwerker) error {
	panic("noch nicht implementiert")
}
