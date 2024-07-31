package db

import (
	"backend/data"
)

func (s *postgresStore) CreateVerification(*data.Verfication) error {
	return nil
}

func (s *postgresStore) GetVerification() ([]*data.Verfication, error) {
	return nil, nil
}

func (s *postgresStore) UpdateVerification(string) error {
	return nil
}
