package handler

import (
	"backend/data"
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *APIServer) handleWorkTimes(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return s.handleGetWorkTimes(w, r)
	}
	if r.Method == "POST" {
		return s.handleCreateWorkTimes(w, r)
	}
	if r.Method == "PUT" {
		return s.handleUpdateWorktime(w, r)
	}
	return nil
}

func (s *APIServer) handleGetWorkTimes(w http.ResponseWriter, r *http.Request) error {

	email := r.URL.Query().Get("email")

	if email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return nil
	}
	fmt.Println("email: " + email)

	workTimes, err := s.store.GetWorkTimesByEmail(email)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, workTimes)
}

func (s *APIServer) handleCreateWorkTimes(w http.ResponseWriter, r *http.Request) error {

	req := new(data.CreateWorktimesRequest)
	if err := json.NewDecoder(r.Body).Decode(req); err != nil {
		return err
	}

	workTimes, err := data.NewWorktimes(req.Email, req.Tag, req.Von, req.Bis)
	if err != nil {
		return err
	}

	if err := s.store.CreateWorkTimes(workTimes); err != nil {
		return err
	}

	if err := WriteJSON(w, http.StatusOK, workTimes); err != nil {
		return err
	}

	return nil
}

func (s *APIServer) handleUpdateWorktime(w http.ResponseWriter, r *http.Request) error {

	req := new(data.CreateWorktimesRequest)
	if err := json.NewDecoder(r.Body).Decode(req); err != nil {
		return err
	}

	workTimes, err := data.NewWorktimes(req.Email, req.Tag, req.Von, req.Bis)
	if err != nil {
		return err
	}

	if err := s.store.UpdateWorkTimes(workTimes); err != nil {
		return err
	}

	if err := WriteJSON(w, http.StatusOK, workTimes); err != nil {
		return err
	}

	return nil
}
