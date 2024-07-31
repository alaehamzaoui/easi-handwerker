package main

import (
	"backend/db"
	"backend/handler"
	"flag"
	"log"
)

func main() {

	flag.Parse()
	store, err := db.NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}
	if err := store.Init(); err != nil {
		log.Fatal(err)
	}
	server := handler.NewAPIServer(":3005", store)
	server.Run()

}
