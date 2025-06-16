package http

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/utils"
	"github.com/gofiber/swagger"

	"github.com/realfabecker/buck3t/internal/handlers/http/docs"

	cordom "github.com/realfabecker/buck3t/internal/core/domain"
	corpts "github.com/realfabecker/buck3t/internal/core/ports"
	"github.com/realfabecker/buck3t/internal/handlers/http/routes"
)

type Handler struct {
	app             *fiber.App
	appConfig       *cordom.Config
	mediaController *routes.MediaController
	authJwkService  corpts.AuthJwkService
}

// @title						Buck3t Rest API
// @version					1.0
// @description				Buck3t Rest API
// @license.name				Apache 2.0
// @license.url				http://www.apache.org/licenses/LICENSE-2.0.html
// @securityDefinitions.apikey	ApiKeyAuth
// @in							header
// @name						Authorization
// @description				Type 'Bearer ' and than your API token
func NewFiberHandler(
	appConfig *cordom.Config,
	mediaController *routes.MediaController,
	authJwkService corpts.AuthJwkService,
) corpts.HttpHandler {

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
		mediaController,
		authJwkService,
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
	bucket := a.app.Group("/buck3t")
	bucket.Get("/status", a.mediaController.Healthcheck)

	bucket.Use(a.authHandler)
	bucket.Post("/upload-url", a.mediaController.GenerateUploadUrl)
	return nil
}

func (a *Handler) authHandler(c *fiber.Ctx) error {
	auth := c.Get("authorization")
	if len(auth) < (len("bearer") + 1) {
		return fiber.NewError(fiber.ErrUnauthorized.Code)
	}
	u, err := a.authJwkService.Verify(auth[len("bearer")+1:])
	if err != nil {
		return fiber.NewError(fiber.ErrUnauthorized.Code, err.Error())
	}
	c.Locals("user", u)
	return c.Next()
}
