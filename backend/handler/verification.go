package handler

import (
	"net/http"
)

type VerificationHandler struct {
}

func NewVerificationHandler() *VerificationHandler {
	return &VerificationHandler{}
}

func (h *VerificationHandler) GetVerificationByID(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *VerificationHandler) CreateVerification(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *VerificationHandler) UpdateVerification(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *VerificationHandler) DeleteVerification(w http.ResponseWriter, r *http.Request) error {
	return nil
}
