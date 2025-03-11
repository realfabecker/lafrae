package adapters

import (
	"context"
	awsconf "github.com/aws/aws-sdk-go-v2/config"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	usrsrv "github.com/realfabecker/auth3/internal/adapters/auth"
	"github.com/realfabecker/auth3/internal/common/dotenv"
	cordom "github.com/realfabecker/auth3/internal/core/domain"
	corpts "github.com/realfabecker/auth3/internal/core/ports"
	"github.com/realfabecker/auth3/internal/handlers/http"
	"github.com/realfabecker/auth3/internal/handlers/http/routes"
	"go.uber.org/dig"
	"log"
)

var Container dig.Container

func init() {
	Container = *dig.New()
	if err := reg3(); err != nil {
		log.Fatalf("failed to register services: %v", err)
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

	if err := Container.Provide(func(cnf *cordom.Config) (*cognito.Client, error) {
		env, err := awsconf.LoadDefaultConfig(context.TODO())
		if err != nil {
			return nil, err
		}
		return cognito.NewFromConfig(env), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(
		appConfig *cordom.Config,
		cognitoClient *cognito.Client,
	) corpts.AuthService {
		return usrsrv.NewCognitoAuthService(appConfig.CognitoClientId, cognitoClient)
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(serv corpts.AuthService) (*routes.AuthController, error) {
		return routes.NewAuthController(serv), nil
	}); err != nil {
		return err
	}

	if err := Container.Provide(func(appConfig *cordom.Config, authController *routes.AuthController) (corpts.HttpHandler, error) {
		return http.NewFiberHandler(appConfig, authController), nil
	}); err != nil {
		return err
	}

	return nil
}
