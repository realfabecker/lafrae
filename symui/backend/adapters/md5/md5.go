package md5

import (
	"crypto/md5"
	"fmt"
)

func CreateMd5Hash(input string) (string, error) {
	return fmt.Sprintf("%x", md5.Sum([]byte(input))), nil
}
