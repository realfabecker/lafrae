.PHONY: build-http
http: docs api

.PHONY: docs
docs:
	swag init \
		--parseDependency \
		--parseInternal \
		-g http.go -d "./internal/handlers/http" -o "./internal/handlers/http/docs"

.PHONY: api
api:
	GOOS=linux GOARCH=amd64 go build -o ./out/http ./cmd/http/main.go

.PHONY: lambda
lambda:
	GOOS=linux GOARCH=arm64 go build -o ./out/bootstrap ./cmd/lambda/main.go

.PHONY: auth4
auth4:
	GOOS=linux GOARCH=arm64 go build -o ./out/bootstrap ./cmd/auth4/main.go