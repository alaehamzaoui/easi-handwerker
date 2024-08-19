package db

import (
	"backend/data"
	"database/sql"
	"fmt"
)

func (s *postgresStore) GetWorkTimesByEmail(email string) ([]*data.Worktimes, error) {
	rows, err := s.db.Query("SELECT * FROM worktimes WHERE email = $1", email)
	if err != nil {
		return nil, err
	}

	worktimes := []*data.Worktimes{}
	for rows.Next() {
		wt, err := scanIntoWorktimes(rows)
		if err != nil {
			return nil, err
		}
		worktimes = append(worktimes, wt)
	}

	if len(worktimes) == 0 {
		return nil, fmt.Errorf("Email %s not found", email)
	}

	return worktimes, nil
}
func scanIntoWorktimes(rows *sql.Rows) (*data.Worktimes, error) {
	var wt data.Worktimes
	err := rows.Scan(&wt.ID, &wt.Email, &wt.Tag, &wt.Von, &wt.Bis)
	if err != nil {
		return nil, err
	}
	return &wt, nil
}

func (s *postgresStore) CreateWorkTimes(worktimes *data.Worktimes) error {
	query := " insert into worktimes (email, tag, von,bis) values ($1, $2, $3, $4)"
	_, err := s.db.Query(query, worktimes.Email, worktimes.Tag, worktimes.Von, worktimes.Bis)
	if err != nil {
		return err
	}
	return nil
}

func (s *postgresStore) UpdateWorkTimes(worktimes *data.Worktimes) error {
	query := "update worktimes set von = $1, bis = $2 where email = $3 and tag = $4"
	_, err := s.db.Query(query, worktimes.Von, worktimes.Bis, worktimes.Email, worktimes.Tag)
	if err != nil {
		return err
	}
	return nil
}

func (s *postgresStore) GetWorkTimes() ([]*data.Worktimes, error) {
	return nil, nil
}
