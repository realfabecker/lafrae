package auth

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	cordom "github.com/realfabecker/auth3/internal/core/domain"
	corpts "github.com/realfabecker/auth3/internal/core/ports"
)

type CognitoAuthService struct {
	cognitoClient   *cognitoidentityprovider.Client
	cognitoClientId string
}

func NewCognitoAuthService(
	cognitoClientId string,
	cognitoClient *cognitoidentityprovider.Client,
) corpts.AuthService {
	return &CognitoAuthService{cognitoClient, cognitoClientId}
}

func (u *CognitoAuthService) Respond(dto cordom.UserLoginDTO) (*cordom.UserLoginResponseDTO, error) {
	auth, err := u.cognitoClient.RespondToAuthChallenge(context.TODO(), &cognitoidentityprovider.RespondToAuthChallengeInput{
		ChallengeName:      types.ChallengeNameType(dto.Challenge),
		ClientId:           &u.cognitoClientId,
		Session:            &dto.Session,
		ChallengeResponses: dto.Parameters,
	})

	if err != nil {
		return nil, err
	}

	if auth.ChallengeName != "" {
		return &cordom.UserLoginResponseDTO{
			Session:       auth.Session,
			ChallengeName: (*string)(&auth.ChallengeName),
		}, nil
	}

	return &cordom.UserLoginResponseDTO{
		UserToken: &cordom.UserToken{
			IdToken:      auth.AuthenticationResult.IdToken,
			RefreshToken: auth.AuthenticationResult.RefreshToken,
			AccessToken:  auth.AuthenticationResult.AccessToken,
		},
	}, nil
}

func (u *CognitoAuthService) Login(dto cordom.UserLoginDTO) (*cordom.UserLoginResponseDTO, error) {
	auth, err := u.cognitoClient.InitiateAuth(context.TODO(), &cognitoidentityprovider.InitiateAuthInput{
		AuthFlow: "USER_PASSWORD_AUTH",
		ClientId: aws.String(u.cognitoClientId),
		AuthParameters: map[string]string{
			"USERNAME": dto.Email,
			"PASSWORD": dto.Password,
		},
	})

	if err != nil {
		return nil, err
	}

	if auth.ChallengeName != "" {
		return &cordom.UserLoginResponseDTO{
			Session:       auth.Session,
			ChallengeName: (*string)(&auth.ChallengeName),
		}, nil
	}

	return &cordom.UserLoginResponseDTO{
		UserToken: &cordom.UserToken{
			IdToken:      auth.AuthenticationResult.IdToken,
			RefreshToken: auth.AuthenticationResult.RefreshToken,
			AccessToken:  auth.AuthenticationResult.AccessToken,
		},
	}, nil
}

func (u *CognitoAuthService) Forgot(email string) (*cordom.CodeDeliveryDetails, error) {
	res, err := u.cognitoClient.ForgotPassword(context.TODO(), &cognitoidentityprovider.ForgotPasswordInput{
		ClientId: &u.cognitoClientId,
		Username: &email,
	})
	if err != nil {
		return nil, fmt.Errorf("unable to trigger forgot password flow: %w", err)
	}

	return &cordom.CodeDeliveryDetails{
		DeliveryMedium: string(res.CodeDeliveryDetails.DeliveryMedium),
	}, nil
}

func (u *CognitoAuthService) Change(email string, newPassword string, passwordResetCode string) error {
	_, err := u.cognitoClient.ConfirmForgotPassword(context.TODO(), &cognitoidentityprovider.ConfirmForgotPasswordInput{
		Username:         aws.String(email),
		ClientId:         aws.String(u.cognitoClientId),
		ConfirmationCode: aws.String(passwordResetCode),
		Password:         aws.String(newPassword),
	})
	return err
}
