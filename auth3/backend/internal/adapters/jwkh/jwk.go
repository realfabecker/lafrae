package jwkh

import (
	"errors"
	"fmt"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
	"io/ioutil"
	"net/http"

	"github.com/lestrrat-go/jwx/v2/jwk"

	corpts "github.com/realfabecker/auth3/internal/core/ports"
)

type claims struct {
	jwt.RegisteredClaims
}

type JwkHandler struct{}

func NewJwkHandler() corpts.JwkHandler {
	return &JwkHandler{}
}

func (j *JwkHandler) VerifyWithKeyURL(token string, keyUrl string) (*jwt.RegisteredClaims, error) {
	keySet, err := j.FetchJWK(keyUrl)
	if err != nil {
		return nil, err
	}
	return j.VerifyWithKeySet(token, keySet)
}

func (j *JwkHandler) VerifyWithKeySet(t string, keySet jwk.Set) (*jwt.RegisteredClaims, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid header not found")
		}
		key, _ := keySet.LookupKeyID(kid)
		if key == nil {
			return nil, fmt.Errorf("key %v not found", kid)
		}
		var raw interface{}
		return raw, key.Raw(&raw)
	}
	token, err := jwt.ParseWithClaims(t, &claims{}, keyFunc)
	if err != nil {
		return nil, err
	}
	cl, ok := token.Claims.(*claims)
	if !token.Valid || !ok {
		return nil, errors.New("invalid token")
	}
	return &cl.RegisteredClaims, nil
}

func (j *JwkHandler) FetchJWK(url string) (jwk.Set, error) {
	client := http.Client{}
	res, err := client.Get(url)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		return nil, errors.New("unable to obtain jwks from " + url)
	}

	defer func() {
		if err := res.Body.Close(); err != nil {
			log.Errorf("unable dto close jwk body: %v", err)
		}
	}()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return jwk.Parse(body)
}
