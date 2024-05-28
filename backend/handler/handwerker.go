package handler

import (
	"fmt"
	"net/http"
)

type Handwerker struct {
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

// HandleCreateHandwerker behandelt den POST-Request zum Erstellen eines Handwerkers.
func (h *Handwerker) HandleCreateHandwerker(w http.ResponseWriter, r *http.Request) error {
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
