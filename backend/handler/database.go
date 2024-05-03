package handler

import (
	"backend/data"
	"database/sql"
)

type Storage interface {
	CreateHandwerker(*data.Handwerker) error
	GetHandwerkers() ([]*data.Handwerker, error)
	GetHandwerkerByID(int) (*data.Handwerker, error)
	GetHandwerkerByNumber(int64) (*data.Handwerker, error)

	UpdateHandwerker(*data.Handwerker) error
	DeleteHandwerker(int) error

	CreateVerification(*data.Verfication) error
	GetVerification() ([]*data.Verfication, error)
	UpdateVerification(string) error
}

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
}
func (s *postgresStore) deleteAllTables() {
	s.db.Exec("drop table verification; drop table handwerker;")
}
func (s *postgresStore) CreateTables() error {
	query := `
			create table if not exists handwerker (
				id serial unique,
				first_name varchar(50),
				last_name varchar(50),
				number serial,
				encrypted_password varchar(100),
				email varchar(50) primary key,
				created_at timestamp
			);
		`
	_, err := s.db.Exec(query)
	return err
}
