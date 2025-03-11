#!/bin/bash
PKGS=(
  "github.com/cosmtrek/air@latest"
  "golang.org/x/tools/gopls@latest"
  "github.com/tpng/gopkgs@latest"
  "github.com/ramya-rao-a/go-outline@latest"
  "honnef.co/go/tools/cmd/staticcheck@latest"
  "github.com/go-delve/delve/cmd/dlv@latest"
  "github.com/swaggo/swag/cmd/swag@latest"
)

for pkg in "${PKGS[@]}"; do
    echo "Installing $pkg"
    go install "$pkg"
done