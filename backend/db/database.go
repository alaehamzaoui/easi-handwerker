package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type postgresStore struct {
	db *sql.DB
}

func NewPostgresStore() (*postgresStore, error) {
	connStr := "user=easidev dbname=postgres password=easinoteasi sslmode=disable"
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
	fmt.Println("Init() called")
	//alle Tabellen löschen
	s.deleteAllTables()
	//tabellen neu erstellen bei jedem Start
	return s.CreateTables()
	return nil
}
func (s *postgresStore) deleteAllTables() {
	fmt.Println("deleteAllTables() called")
	s.db.Exec("drop table handwerker;")
	s.db.Exec("drop table WorkTimes; ")
}
func (s *postgresStore) CreateTables() error {
	fmt.Print("CreateTables() called")
	query := `
		CREATE TABLE handwerker (
			id SERIAL unique,
			vorname VARCHAR(50),
			nachname VARCHAR(50),
			geburtsdatum DATE,
			art VARCHAR(50),
			straße VARCHAR(100),
			hausnummer VARCHAR(10),
			plz BIGINT,
			stadt VARCHAR(50),
			telefon BIGINT,
			nummer SERIAL,
			email VARCHAR(100) PRIMARY KEY,
			encryptedPassword VARCHAR(60),
			createdAt TIMESTAMP);
		
		CREATE TABLE WorkTimes (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255),
			tag VARCHAR(50),
			von TIME,
			bis TIME,
			FOREIGN KEY (email) REFERENCES handwerker(email)
);
`
	_, err := s.db.Exec(query)
	return err
}
