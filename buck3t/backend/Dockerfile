FROM golang:1.20 as base
# non root user configutraion
RUN groupadd --gid 1000 gopher \
    && useradd --uid 1000 --gid 1000 -m gopher \
    && chown -R 1000:1000 /home/gopher
# go path for new created user
USER gopher
ENV GOPATH="/home/gopher"
ENV PATH="${GOPATH}/bin:${PATH}"

FROM base as dev
# go air for hot reload in local development
COPY dev.bash .
RUN bash dev.bash
# download project dependencies
WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download