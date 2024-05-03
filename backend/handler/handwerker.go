package handler

import (
	"fmt"
	"net/http"
)

type Handwerker struct {
}

func (h *Handwerker) HandleCreateHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *Handwerker) HandleHandwerker(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return h.HandleGetHandwerker(w, r)
	} else if r.Method == "POST" {
		return h.HandleCreateHandwerker(w, r)
	}
	return fmt.Errorf("unsupported method")
}

func (h *Handwerker) HandleGetHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *Handwerker) HandleDeleteHandwerker(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *Handwerker) HandleGetHandwerkerByID(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return h.HandleGetHandwerker(w, r)
	} else if r.Method == "DELETE" {
		return h.HandleDeleteHandwerker(w, r)
	}
	return fmt.Errorf("unsupported method")
}

func (h *Handwerker) PermissionDenied(w http.ResponseWriter) {
}

func (h *Handwerker) WithJWTAuth(HandlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("calling WithJWTAuth middleware")
		HandlerFunc(w, r)
	}
}
