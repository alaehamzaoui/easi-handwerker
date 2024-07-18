package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type postgresStore struct {
	db *sql.DB
}

func NewPostgresStore() (*postgresStore, error) {
	connStr := "user=eadidev dbname=postgres password=easinoteasi sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &postgresStore{db: db}, nil
}

func (s *postgresStore) Init() error {
	//drop the tables
	s.deleteAllTables()
	//-------create all Tables-------
	return s.CreateTables()
	//return nil
}
func (s *postgresStore) deleteAllTables() {
	s.db.Exec("drop table handwerker;")
}
func (s *postgresStore) CreateTables() error {
	query := `CREATE TABLE handwerker (
				id SERIAL PRIMARY KEY,
				firstName VARCHAR(20),
				lastName VARCHAR(20),
				number BIGINT,
				email VARCHAR(40),
				encryptedPassword VARCHAR(60),
				createdAt TIMESTAMP
			);
		`
	_, err := s.db.Exec(query)
	return err
}
