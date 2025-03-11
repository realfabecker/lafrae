package validator

import (
	"math/rand"
	"regexp"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/oklog/ulid"
)

func NewValidator() (*validator.Validate, error) {
	v := validator.New(validator.WithRequiredStructEnabled())
	if err := v.RegisterValidation("ISO8601", iso8601); err != nil {
		return nil, err
	}
	if err := v.RegisterValidation("imagex_name", imagexName); err != nil {
		return nil, err
	}
	if err := v.RegisterValidation("imagex_url", imagexUrl); err != nil {
		return nil, err
	}
	return v, nil
}

func imagexUrl(fl validator.FieldLevel) bool {
	regString := `https?://.*(jpe?g|png)$`
	reg := regexp.MustCompile(regString)
	return reg.MatchString(fl.Field().String())
}

func imagexName(fl validator.FieldLevel) bool {
	regString := `(jpe?g|png)$`
	reg := regexp.MustCompile(regString)
	return reg.MatchString(fl.Field().String())
}

func iso8601(fl validator.FieldLevel) bool {
	regString := `^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2})(\.\d{0,3})?(Z|[+-](\d{2}):(\d{2})))?$`
	reg := regexp.MustCompile(regString)
	return reg.MatchString(fl.Field().String())
}

func NewULID(t time.Time) string {
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	return ulid.MustNew(ulid.Timestamp(t), entropy).String()
}
