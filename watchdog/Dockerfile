# base project image
FROM rust:1.75-slim-buster AS base
RUN apt-get update && apt-get install -y git   pkg-config
WORKDIR /app

FROM base as dev
RUN rustup component add rustfmt

# release build
FROM base AS release
COPY . .
RUN make build-release

# binary output
FROM scratch AS bundle
COPY --from=release /app/target ./target