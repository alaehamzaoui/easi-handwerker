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
	//return nil ist für den Test
}
func (s *postgresStore) deleteAllTables() {
	fmt.Println("deleteAllTables() called")
	s.db.Exec("drop table handwerker;")

}
func (s *postgresStore) CreateTables() error {
	fmt.Print("CreateTables() called")
	query := `CREATE TABLE handwerker (
			id SERIAL PRIMARY KEY,
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
			email VARCHAR(100) UNIQUE,
			encryptedPassword VARCHAR(60),
			createdAt TIMESTAMP
		);`
	_, err := s.db.Exec(query)
	return err
}
