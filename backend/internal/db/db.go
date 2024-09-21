package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	connStr := "user=postgres dbname=postgres password=easinoteasi host=localhost sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Fehler beim verbinden mit der datenbank:", err) //f
	}
	log.Println("Db Verbindung hergestellt") //
}
