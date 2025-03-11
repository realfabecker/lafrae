package ports

import (
	"github.com/golang-jwt/jwt/v5"
)

type HttpHandler interface {
	Register() error
	Listen(port string) error
	GetApp() interface{}
}

type JwtHandler interface {
	Decode(token string) (*jwt.RegisteredClaims, error)
}

type AuthJwkService interface {
	Verify(token string) (*jwt.RegisteredClaims, error)
}

type MediaService interface {
	GetUploadUrl(user string, keyPrefix string, name string, contentType string) (string, error)
}

type MediaBucket interface {
	PutObjectUrl(keyPrefix string, name string, contentType string, lifetime int64) (string, error)
}
