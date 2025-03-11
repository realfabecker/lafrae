package base64

import "encoding/base64"

func Encode(data []byte) (string, error) {
	return base64.StdEncoding.EncodeToString(data), nil
}

func Decode(data string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(data)
}
