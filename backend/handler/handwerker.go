package handler

import (
	"backend/data"
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *APIServer) handleCreateHandwerker(w http.ResponseWriter, r *http.Request) error {

	req := new(data.CreateHandwerkerRequest)
	if err := json.NewDecoder(r.Body).Decode(req); err != nil {
		return err
	}

	handwerker, err := data.NewHandwerker(req.Vorname, req.Nachname, req.Art, req.Geburtsdatum, req.Straße, req.Hausnummer, req.PLZ, req.Stadt, req.Telefon, req.Email, req.Password, "")
	if err != nil {
		return err
	}
	if err := s.store.CreateHandwerker(handwerker); err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, handwerker)
}

func (s *APIServer) handleHandwerker(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return s.handleGetHandwerker(w, r)
	} else if r.Method == "POST" {
		return s.handleCreateHandwerker(w, r)
	}
	return fmt.Errorf("unsupported method")
}

func (s *APIServer) handleGetHandwerker(w http.ResponseWriter, r *http.Request) error {
	handwerker, err := s.store.GetHandwerkers()
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, handwerker)
}

func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return fmt.Errorf(" nicht unterstützt")
	}

	var req data.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return err
	}

	handwerker, err := s.store.GetHandwerkerByEmail(req.Email)
	if err != nil {
		return err
	}

	if !handwerker.ValidPassword(req.Password) {
		return fmt.Errorf("not authenticated")
	}

	token, err := createJWT(handwerker)
	if err != nil {
		return err
	}

	resp := data.LoginResponse{
		Token: token,
		Email: handwerker.Email,
	}

	return WriteJSON(w, http.StatusOK, resp)
}
