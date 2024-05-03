package data

type Verfication struct {
	Email      string `json:"email"`
	IsVerified bool   `json:"isverified"`
}

func NewVerification(Email string) (*Verfication, error) {
	return &Verfication{
		Email: Email,
	}, nil
}

type CreateISVerifiedRequest struct {
	Email string `json:"email"`
}
