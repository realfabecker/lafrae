# syntax=docker/dockerfile:1.3-labs
FROM golang:1.24 as base
# non root user configutraion
RUN groupadd --gid 1000 gopher \
  && useradd --uid 1000 --gid 1000 -m gopher \
  && chown -R 1000:1000 /home/gopher
# go path for new created user
USER gopher
ENV GOPATH="/home/gopher"
ENV PATH="${GOPATH}/bin:${PATH}"

FROM base as dev
RUN <<EOF
  go install "github.com/cosmtrek/air@latest"
  go install "golang.org/x/tools/gopls@latest"
  go install "github.com/tpng/gopkgs@latest"
  go install "github.com/ramya-rao-a/go-outline@latest"
  go install "honnef.co/go/tools/cmd/staticcheck@latest"
  go install "github.com/go-delve/delve/cmd/dlv@latest"
  go install "github.com/swaggo/swag/cmd/swag@latest"
  go install "golang.org/x/tools/cmd/goimports@latest"
  go install "github.com/air-verse/air@latest"
EOF
WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download