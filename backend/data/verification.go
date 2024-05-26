package data

type Verfication struct {
	Email      string `json:"email"`       // E-Mail-Adresse des Benutzers
	IsVerified bool   `json:"isverified"`  // Gibt an, ob die E-Mail-Adresse verifiziert ist oder nicht
}

func NewVerification(Email string) (*Verfication, error) {
	return &Verfication{
		Email: Email,  // Erstellt eine neue Verifizierungsstruktur mit der angegebenen E-Mail-Adresse
	}, nil
}

type CreateISVerifiedRequest struct {
	Email string `json:"email"`  // E-Mail-Adresse des Benutzers, für den die Verifizierung erstellt werden soll
}
