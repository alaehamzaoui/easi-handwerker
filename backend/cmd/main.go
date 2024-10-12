package main

import (
	"log"
	"net/http"

	"backend/internal/db"
	"backend/internal/handlers"
	"backend/internal/models"

	gorillaHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	db.ConnectDB()

	db.DB.AutoMigrate(&models.User{}, &models.WorkTime{}, &models.Auftrag{})
	clearTables()

	r := mux.NewRouter()

	r.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/workTimes", handlers.GetWorkTimesHandler).Methods("GET")
	r.HandleFunc("/workTimes", handlers.UpdateWorkTimesHandler).Methods("POST")
	r.HandleFunc("/searchHandwerker", handlers.SearchHandwerkerHandler).Methods("GET")
	r.HandleFunc("/handwerker/verify/{id}", handlers.VerifyHandwerkerHandler).Methods("POST")
	r.HandleFunc("/handwerker/notverify/{id}", handlers.NotVerifyHandwerkerHandler).Methods("POST")
	r.HandleFunc("/gebucht/{id}/{tag}", handlers.HandleGebuchtWert).Methods("POST")
	r.HandleFunc("/api/auftrag", handlers.CreateAuftragHandler).Methods("POST")
	r.HandleFunc("/api/aufträge", handlers.GetAufträgeHandler).Methods("GET")

	r.HandleFunc("/handwerker/{id}", handlers.HandwerkerDetailsHandler).Methods("GET")
	r.HandleFunc("/updateUserData", handlers.UpdateUserDataHandler).Methods("POST")
	r.HandleFunc("/auftrag/{id}/stornieren", handlers.DeleteAuftragHandler).Methods("DELETE")
	r.HandleFunc("/auftrag/{id}/storniere", handlers.DeleteAuftragHandlerKunde).Methods("DELETE")

	corsOpts := gorillaHandlers.AllowedOrigins([]string{"http://localhost:3000"})
	corsMethods := gorillaHandlers.AllowedMethods([]string{"GET", "POST", "DELETE", "OPTIONS"})
	corsHeaders := gorillaHandlers.AllowedHeaders([]string{"Content-Type"})

	log.Println("server starten auf port 8080") //
	log.Fatal(http.ListenAndServe(":8080", gorillaHandlers.CORS(corsOpts, corsMethods, corsHeaders)(r)))
}
func clearTables() {
	/*db.DB.Exec("DELETE FROM users")
	db.DB.Exec("DELETE FROM work_times")
	db.DB.Exec("DELETE FROM auftrags")
	log.Println("Alle Tabellen wurden geleert.") */
}
