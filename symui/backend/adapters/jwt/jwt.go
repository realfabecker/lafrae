package jwt

import (
	"encoding/json"
	"github.com/golang-jwt/jwt"
)

func Encode(payload string, signKey string) (string, error) {
	var claims jwt.MapClaims
	if err := json.Unmarshal([]byte(payload), &claims); err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(signKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func Decode(tokenString string) (string, error) {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return "", nil
	}
	t, err := json.MarshalIndent(token.Claims, "", "  ")
	if err != nil {
		return "", err
	}
	return string(t), nil
}

func Parse(tokenString string, signKey string) (*jwt.Token, error) {
	return new(jwt.Parser).ParseWithClaims(
		tokenString,
		jwt.MapClaims{},
		func(t *jwt.Token) (interface{}, error) {
			return []byte(signKey), nil
		},
	)
}
