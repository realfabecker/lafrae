package services

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"time"

	corpts "github.com/realfabecker/buck3t/internal/core/ports"
)

type AuthJwkService struct {
	jwtHandler corpts.JwtHandler
}

func NewAuthJwkService(
	jwtHandler corpts.JwtHandler,
) corpts.AuthJwkService {
	return &AuthJwkService{jwtHandler}
}

func (u *AuthJwkService) Verify(token string) (*jwt.RegisteredClaims, error) {
	c, err := u.jwtHandler.Decode(token)
	if err != nil {
		return nil, err
	}
	if time.Now().Unix() > c.ExpiresAt.Time.Unix() {
		return nil, errors.New("token expired")
	}
	return c, nil
}
