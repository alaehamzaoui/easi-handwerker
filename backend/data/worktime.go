package data

import (
	"database/sql"
	"fmt"
	"time"
)

type Worktimes struct {
	ID    int          `json:"id"`
	Email string       `json:"email"`
	Tag   string       `json:"tag"`
	Von   sql.NullTime `json:"von"`
	Bis   sql.NullTime `json:"bis"`
}

type CreateWorktimesRequest struct {
	Email string `json:"email"`
	Tag   string `json:"tag"`
	Von   string `json:"von"` // Changed to string
	Bis   string `json:"bis"` // Changed to string
}

func NewWorktimes(email string, tag string, von string, bis string) (*Worktimes, error) {
	var vontime time.Time
	var bistime time.Time
	var err error

	if von != "" {
		vontime, err = time.Parse("15:04", von) // Parsing the time as "HH:MM"
		if err != nil {
			return nil, fmt.Errorf("invalid 'von' time format: %v", err)
		}
	}

	if bis != "" {
		bistime, err = time.Parse("15:04", bis)
		if err != nil {
			return nil, fmt.Errorf("invalid 'bis' time format: %v", err)
		}
	}

	return &Worktimes{
		Email: email,
		Tag:   tag,
		Von:   sql.NullTime{Time: vontime, Valid: von != ""},
		Bis:   sql.NullTime{Time: bistime, Valid: bis != ""},
	}, nil
}
