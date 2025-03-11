package http

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"time"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/utils"
	"github.com/gofiber/swagger"

	"github.com/realfabecker/auth3/internal/handlers/http/docs"

	cordom "github.com/realfabecker/auth3/internal/core/domain"
	corpts "github.com/realfabecker/auth3/internal/core/ports"
	"github.com/realfabecker/auth3/internal/handlers/http/routes"
)

type Handler struct {
	app            *fiber.App
	photoConfig    *cordom.Config
	authController *routes.AuthController
}

//	@title			Auth3 Rest API
//	@version		1.0
//	@description	Auth3 Rest API
//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html
func NewFiberHandler(
	appConfig *cordom.Config,
	authController *routes.AuthController,
) corpts.HttpHandler {

	// open api base project configuration (2)
	docs.SwaggerInfo.Host = appConfig.AppHost
	docs.SwaggerInfo.Schemes = []string{"http"}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			msgs := utils.StatusMessage(code)

			var ferr *fiber.Error
			if errors.As(err, &ferr) {
				code = ferr.Code
				msgs = ferr.Message
			}

			c.Status(code)
			return c.JSON(cordom.ResponseDTO[interface{}]{
				Status:  "error",
				Message: msgs,
				Code:    code,
			})
		},
	})
	return &Handler{
		app,
		appConfig,
		authController,
	}
}

func (a *Handler) GetApp() interface{} {
	return a.app
}

func (a *Handler) Listen(port string) error {
	return a.app.Listen(":" + port)
}

func (a *Handler) Register() error {
	a.app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 30 * time.Second,
	}))

	a.app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
		AllowHeaders: "*",
	}))

	a.app.Get("/docs/*", swagger.HandlerDefault)
	auth3 := a.app.Group("/auth3")
	auth3.Post("/login", a.authController.Login)
	auth3.Post("/forgot", a.authController.Forgot)
	auth3.Post("/change", a.authController.Change)
	auth3.Get("/status", a.authController.Healthcheck)
	return nil
}
