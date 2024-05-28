package handler

import (
	"backend/data"
	"database/sql"
)

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