package ports

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/lestrrat-go/jwx/v2/jwk"
	cordom "github.com/realfabecker/auth3/internal/core/domain"
)

type HttpHandler interface {
	Register() error
	Listen(port string) error
	GetApp() interface{}
}

type AuthService interface {
	Login(email string, password string) (*cordom.UserToken, error)
	Forgot(email string) (*cordom.CodeDeliveryDetails, error)
	Change(email string, newPassword string, passwordResetCode string) error
}

type JwkHandler interface {
	FetchJWK(url string) (jwk.Set, error)
	VerifyWithKeyURL(token string, keyUrl string) (*jwt.RegisteredClaims, error)
	VerifyWithKeySet(t string, keySet jwk.Set) (*jwt.RegisteredClaims, error)
}
