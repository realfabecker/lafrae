package main

import (
	"github.com/realfabecker/auth3/internal/adapters"
	"log"

	cordom "github.com/realfabecker/auth3/internal/core/domain"
	corpts "github.com/realfabecker/auth3/internal/core/ports"
)

func main() {
	if err := adapters.Container.Invoke(func(
		app corpts.HttpHandler,
		walletConfig *cordom.Config,
	) error {
		if err := app.Register(); err != nil {
			return err
		}
		return app.Listen(walletConfig.AppPort)
	}); err != nil {
		log.Fatalln(err)
	}
}
