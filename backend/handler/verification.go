package handler

import (
	"fmt"
	"net/http"
)


// Verification definiert die Handler-Funktionen für die Verifizierung eines Handwerkers.
func (h *Verification) Handleification(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return h.HandleGetVerification(w, r)
	} else if r.Method == "POST" {
		return h.HandleCreateVerification(w, r)
	}
	return fmt.Errorf("unsupported method")

}

// HandleVerification behandelt den POST-Request zur Verifizierung eines Handwerkers.
func (h *Verification) HandleGetVerification(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// HandleCreateVerification behandelt den POST-Request zur Verifizierung eines Handwerkers.
func (h *Verification) HandleCreateVerification(w http.ResponseWriter, r *http.Request) error {
	return nil
}
	