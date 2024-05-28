
# EASI-HANDWERKER

Dieses Go-Projekt dient zur Verwaltung einer Datenbank von Handwerkern und Verifizierungsinformationen. Die Projektstruktur umfasst Handler für HTTP-Anfragen, Datenbankinteraktionen und Datenmodelle.

## Projektstruktur

```plaintext
backend
├── bin
│   └── backend
├── data
│   ├── handwerker.go
│   └── verification.go
├── db
│   ├── handwerker.go
│   └── verification.go
├── handler
│   ├── database.go
│   ├── handwerker.go
│   └── verification.go
├── go.mod
├── go.sum
├── main.go
├── Makefile
└── README.md
```


## Erste Schritte

1. Klone das Repository:
    ```bash
    git clone https://github.com/dein-benutzername/easi-handwerker.git
    ```
2. Wechsel in das Projektverzeichnis:
    ```bash
    cd easi-handwerker
    ```
3. Installiere die Abhängigkeiten:
    ```bash
    go mod download
    ```
4. Starte das Projekt:
    ```bash
    go run main.go
    ```

## Beiträge

Beiträge sind willkommen! Bitte erstelle einen Pull-Request oder öffne ein Issue, um Änderungen vorzuschlagen.

