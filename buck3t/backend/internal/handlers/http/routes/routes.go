package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/realfabecker/buck3t/internal/common/validator"
	cordom "github.com/realfabecker/buck3t/internal/core/domain"
	corpts "github.com/realfabecker/buck3t/internal/core/ports"
)

type MediaController struct {
	service corpts.MediaService
}

func NewMediaController(
	walletService corpts.MediaService,
) *MediaController {
	return &MediaController{walletService}
}

// GetUploadUrl get a photo upload url
//
//	@Summary		Get upload url
//	@Description	Get upload url
//	@Tags			Bucket
//	@Security		ApiKeyAuth
//	@Produce		json
//	@Param			file		query		string	true	"FileName"
//	@Param			contentType	query		string	true	"ContentType"
//	@Param			keyPrefix	path		string	true	"Key prefix"
//	@Success		200			{object}	cordom.ResponseDTO[cordom.MidiaUpload]
//	@Failure		400
//	@Failure		500
//	@Router			/buck3t/{keyPrefix}/upload-url [get]
func (w *MediaController) GetUploadUrl(c *fiber.Ctx) error {
	q := struct {
		ContentType string `json:"contentType" query:"contentType" validate:"required"`
		File        string `json:"file" query:"file" validate:"required,imagex_name"`
	}{}
	if err := c.QueryParser(&q); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	p := struct {
		KeyPrefix string `json:"keyPrefix" query:"keyPrefix" validate:"required"`
	}{}
	if err := c.ParamsParser(&p); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	v, err := validator.NewValidator()
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := v.StructPartial(q, "File"); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	user, ok := c.Locals("user").(*jwt.RegisteredClaims)
	if !ok {
		return fiber.NewError(fiber.ErrUnauthorized.Code)
	}

	url, err := w.service.GetUploadUrl(user.Subject, p.KeyPrefix, q.File, q.ContentType)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	} else if url == "" && err == nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	return c.JSON(cordom.ResponseDTO[cordom.MidiaUpload]{
		Status: "success",
		Data:   &cordom.MidiaUpload{Url: url},
	})
}

// Healthcheck api Healthcheck
//
//	@Summary		healthcheck
//	@Description	healthcheck
//	@Tags			Bucket
//	@Produce		json
//	@Success		200	{object}	cordom.EmptyResponseDTO
//	@Router			/buck3t/status [get]
func (w *MediaController) Healthcheck(c *fiber.Ctx) error {
	return c.JSON(cordom.EmptyResponseDTO{
		Status:  "success",
		Code:    200,
		Message: "Up and Running!",
	})
}
