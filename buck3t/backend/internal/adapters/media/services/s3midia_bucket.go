package services

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/realfabecker/buck3t/internal/core/ports"
	"regexp"
	"time"
)

type S3MediaBucket struct {
	presignCliente *s3.PresignClient
	s3Client       *s3.Client
	bucketName     string
}

func NewS3MediaBucket(bucketName string, client *s3.Client) ports.MediaBucket {
	return &S3MediaBucket{
		bucketName:     bucketName,
		s3Client:       client,
		presignCliente: s3.NewPresignClient(client),
	}
}

func (s S3MediaBucket) GetObjectUrl(url string, lifetime int64) (string, error) {
	re := regexp.MustCompile(`https://(?P<bucket>.*).s3.us-east-1.amazonaws.com/(?P<key>.*)`)
	ma := re.FindStringSubmatch(url)
	ur := make(map[string]string)

	for i, name := range re.SubexpNames() {
		ur[name] = ma[i]
	}
	if ur == nil || ur["bucket"] == "" {
		return "", fmt.Errorf("file url is not a valid bucket object")
	}

	request, err := s.presignCliente.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(ur["bucket"]),
		Key:    aws.String(ur["key"]),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(lifetime * int64(time.Second))
	})

	if err != nil {
		return "", err
	}
	return request.URL, nil
}

func (s S3MediaBucket) PutObjectUrl(keyPrefix string, name string, contentType string, lifetime int64) (string, error) {
	request, err := s.presignCliente.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(s.bucketName),
		Key:         aws.String(keyPrefix + "/" + name),
		ContentType: aws.String(contentType),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(lifetime * int64(time.Second))
	})
	if err != nil {
		return "", err
	}
	return request.URL, nil
}

func (s S3MediaBucket) DeleteObject(url string) error {
	re := regexp.MustCompile(`https://(?P<bucket>.*).s3.us-east-1.amazonaws.com/(?P<key>.*)`)
	ma := re.FindStringSubmatch(url)
	ur := make(map[string]string)
	for i, name := range re.SubexpNames() {
		ur[name] = ma[i]
	}
	if ur == nil || ur["bucket"] == "" {
		return fmt.Errorf("file url is not a valid bucket object")
	}
	if _, err := s.s3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(ur["bucket"]),
		Key:    aws.String(ur["key"]),
	}); err != nil {
		return err
	}
	return nil
}
