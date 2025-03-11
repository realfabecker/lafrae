package container

import (
	"context"
	"github.com/realfabecker/buck3t/internal/adapters/jwt2"

	awsconf "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/realfabecker/buck3t/internal/common/dotenv"
	"log"

	medsrv "github.com/realfabecker/buck3t/internal/adapters/media/services"
	cordom "github.com/realfabecker/buck3t/internal/core/domain"
	corpts "github.com/realfabecker/buck3t/internal/core/ports"
	corsrv "github.com/realfabecker/buck3t/internal/core/services"

	"github.com/realfabecker/buck3t/internal/handlers/http"
	"github.com/realfabecker/buck3t/internal/handlers/http/routes"
	"go.uber.org/dig"
)

var Container dig.Container

func init() {
	Container = *dig.New()

	if err := reg3(); err != nil {
		log.Fatalf("unable to register services %v", err)
	}
}

func reg3() error {
	if err := Container.Provide(func() (*cordom.Config, error) {
		cnf := &cordom.Config{}
		if err := dotenv.Unmarshal(cnf); err != nil {
			return nil, err
		}
		return cnf, nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(cnf *cordom.Config) (*s3.Client, error) {
		env, err := awsconf.LoadDefaultConfig(context.TODO())
		if err != nil {
			return nil, err
		}
		return s3.NewFromConfig(env), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(cnf *cordom.Config, client *s3.Client) (corpts.MediaBucket, error) {
		return medsrv.NewS3MediaBucket(cnf.BucketName, client), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func() (corpts.JwtHandler, error) {
		return jwt2.NewHandler(), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(
		jwtHandler corpts.JwtHandler,
	) corpts.AuthJwkService {
		return corsrv.NewAuthJwkService(jwtHandler)
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(m corpts.MediaBucket) (corpts.MediaService, error) {
		return corsrv.NewMidiaService(m), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(s corpts.MediaService) (*routes.MediaController, error) {
		return routes.NewMediaController(s), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(
		config *cordom.Config,
		controller *routes.MediaController,
		service corpts.AuthJwkService,
	) (corpts.HttpHandler, error) {
		return http.NewFiberHandler(
			config,
			controller,
			service,
		), nil
	}); err != nil {
		return err
	}

	return nil
}
