# Build the Go application from the cmd directory and output to the bin/ directory
build:
	@go build -o bin/backend ./cmd

# Run the built application
run: build
	@./bin/backend

# Run all tests with verbose output
test:
	@go test -v ./...

# Drop the database (assuming you have a drop command in cmd/drop)
drop:
	@go run cmd/drop/main.go

# Migrate the database (assuming you have a migrate command in cmd/migrate)
migrate:
	@go run cmd/migrate/main.go
