build:
	@go build -o bin/backend

run: build
	@./bin/backend

test:
	@go test -v ./...

drop:
	@go run cmd/drop/main.go

migrate:
	@go run cmd/migrate/main.go
