package services

import (
	corpts "github.com/realfabecker/buck3t/internal/core/ports"
	"time"
)

type MidiaService struct {
	MediaBucket corpts.MediaBucket
}

func NewMidiaService(m corpts.MediaBucket) corpts.MediaService {
	return &MidiaService{MediaBucket: m}
}

func (s *MidiaService) GetUploadUrl(user string, keyPrefix string, name string, contentType string) (string, error) {
	f := user + "/" + time.Now().Format("2006/01/02") + "/" + name
	return s.MediaBucket.PutObjectUrl(keyPrefix, f, contentType, 1800)
}
