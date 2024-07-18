package handler

import (
	"backend/data"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func (s *APIServer) Run() {
	router := mux.NewRouter()

	router.HandleFunc("/hello", makeHTTPHandleFunc(s.handleHello))
	//router.HandleFunc("/login", makeHTTPHandleFunc(s.handleLogin))
	//router.HandleFunc("/register", makeHTTPHandleFunc(s.handleRegister))

	log.Println("JSON API server running on port: ", s.listenAddr)
	http.ListenAndServe(s.listenAddr, router)
}

type Storage interface {
	CreateHandwerker(*data.Handwerker) error
	GetHandwerkers() ([]*data.Handwerker, error)
	GetHandwerkerByID(int) (*data.Handwerker, error)
	GetHandwerkerByNumber(int64) (*data.Handwerker, error)
	UpdateHandwerker(*data.Handwerker) error
	DeleteHandwerker(int) error

	CreateVerification(*data.Verfication) error
	GetVerification() ([]*data.Verfication, error)
	UpdateVerification(string) error
}

type APIServer struct {
	listenAddr string
	store      Storage
}

func NewAPIServer(listenAddr string, store Storage) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
	}
}

func (s *APIServer) handleHello(w http.ResponseWriter, r *http.Request) error {
	return WriteJSON(w, http.StatusOK, map[string]string{"mihna": "9wad"})
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

type apiFunc func(http.ResponseWriter, *http.Request) error

type ApiError struct {
	Error string `json:"error"`
}

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
}