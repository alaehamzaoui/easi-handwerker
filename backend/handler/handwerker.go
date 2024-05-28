package handler

import (
	"fmt"
	"net/http"
)

type Handwerker struct {
	
}

// HandleCreateHandwerker behandelt den POST-Request zum Erstellen eines Handwerkers.
func (h *Handwerker) HandleCreateHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}
// HandleHandwerker behandelt den GET- und POST-Request für Handwerker.
func (h *Handwerker) HandleHandwerker(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return h.HandleGetHandwerker(w, r)
	} else if r.Method == "POST" {
		return h.HandleCreateHandwerker(w, r)
	}
	return fmt.Errorf("unsupported method")
}

// HandleGetHandwerker behandelt den GET-Request für Handwerker.
func (h *Handwerker) HandleGetHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// HandleDeleteHandwerker behandelt den DELETE-Request für Handwerker.
func (h *Handwerker) HandleDeleteHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// HandleGetHandwerkerByID behandelt den GET- und DELETE-Request für Handwerker anhand einer ID.
func (h *Handwerker) HandleGetHandwerkerByID(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return h.HandleGetHandwerker(w, r)
	} else if r.Method == "DELETE" {
		return h.HandleDeleteHandwerker(w, r)
	}
	return fmt.Errorf("unsupported method")
}

// PermissionDenied gibt eine Fehlermeldung aus, wenn die Berechtigung verweigert wurde.
func (h *Handwerker) PermissionDenied(w http.ResponseWriter) {
}
// WithJWTAuth ist ein Middleware-Handler, der die JWT-Authentifizierung durchführt.
func (h *Handwerker) WithJWTAuth(HandlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Aufruf der WithJWTAuth-Middleware")
		HandlerFunc(w, r)
	}
}
