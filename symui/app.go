package main

import (
	"context"
	"github.com/labstack/gommon/log"
	"github.com/realfabecker/symui/backend/adapters/aes"
	"github.com/realfabecker/symui/backend/adapters/base64"
	"github.com/realfabecker/symui/backend/adapters/gpg"
	"github.com/realfabecker/symui/backend/adapters/jwt"
	"github.com/realfabecker/symui/backend/adapters/md5"
	"github.com/realfabecker/symui/backend/core/domain"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved,
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// returns a points to an interface input value
func ref[T any](v T) *T {
	return &v
}

func (a *App) CreateMd5Hash(input string) domain.HashResult {
	h, err := md5.CreateMd5Hash(input)
	if err != nil {
		log.Error(err)
		return domain.HashResult{Error: err.Error()}
	}
	return domain.HashResult{Hashed: h}
}

func (a *App) AesEncrypt(key string, message string) domain.CryptoEncryptResult {
	h, err := aes.AesEncrypt([]byte(key), message)
	if err != nil {
		log.Error(err)
		return domain.CryptoEncryptResult{Error: err.Error()}
	}
	return domain.CryptoEncryptResult{Cipher: h}
}

func (a *App) AesDecrypt(key string, message string) domain.CryptoDecryptResult {
	h, err := aes.AesDecrypt([]byte(key), message)
	if err != nil {
		log.Error(err)
		return domain.CryptoDecryptResult{Error: err.Error()}
	}
	return domain.CryptoDecryptResult{PlainText: h}
}

func (a *App) JwtEncode(key string, message string) domain.JwtEncodedResult {
	h, err := jwt.Encode(message, key)
	if err != nil {
		log.Error(err)
		return domain.JwtEncodedResult{Error: err.Error()}
	}
	return domain.JwtEncodedResult{Encoded: h}
}

func (a *App) JwtDecode(message string) domain.JwtDecodedResult {
	h, err := jwt.Decode(message)
	if err != nil {
		log.Error(err)
		return domain.JwtDecodedResult{Error: err.Error()}
	}
	return domain.JwtDecodedResult{Decoded: h}
}

func (a *App) Base64Encode(message string) domain.EncodedResult {
	h, err := base64.Encode([]byte(message))
	if err != nil {
		log.Error(err)
		return domain.EncodedResult{Error: err.Error()}
	}
	return domain.EncodedResult{Encoded: h}
}

func (a *App) Base64Decode(message string) domain.DecodedResult {
	h, err := base64.Decode(message)
	if err != nil {
		log.Error(err)
		return domain.DecodedResult{Error: err.Error()}
	}
	return domain.DecodedResult{Decoded: string(h)}
}

func (a *App) GpgListKeys() domain.GpgListKeysResult {
	l, err := gpg.ListKeys()
	if err != nil {
		log.Error(err)
		return domain.GpgListKeysResult{Error: err.Error()}
	}
	return domain.GpgListKeysResult{Data: l}
}

func (a *App) GpgAddKey(email string, weeks int8) domain.EmptyResult {
	if err := gpg.NewGpgKey(email, weeks); err != nil {
		log.Error(err)
		return domain.EmptyResult{Error: err.Error()}
	}
	return domain.EmptyResult{}
}

func (a *App) GpgDeleteKey(email string) domain.EmptyResult {
	if err := gpg.DeleteSecretKeys(email); err != nil {
		log.Error(err)
		return domain.EmptyResult{Error: err.Error()}
	}
	if err := gpg.DeletePublicKeys(email); err != nil {
		log.Error(err)
		return domain.EmptyResult{Error: err.Error()}
	}
	return domain.EmptyResult{}
}
