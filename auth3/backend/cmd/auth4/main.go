package main

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/golang-jwt/jwt/v5"
	"github.com/realfabecker/auth3/internal/adapters/jwkh"
	"os"
	"time"
)

func deny() events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "unauthorized",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Deny",
					Resource: []string{"*"},
				},
			},
		},
	}
}

func allow(claims *jwt.RegisteredClaims) events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: claims.Subject,
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Allow",
					Resource: []string{"*"},
				},
			},
		},
	}
}

func Handler(ctx context.Context, request events.APIGatewayCustomAuthorizerRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	token := request.AuthorizationToken
	if len(token) < len("bearer")+1 {
		return deny(), nil
	}
	c, err := jwkh.NewJwkHandler().VerifyWithKeyURL(
		token[len("bearer")+1:],
		os.Getenv("COGNITO_JWK_URL"),
	)
	if c == nil || err != nil {
		return deny(), nil
	}
	if time.Now().Unix() > c.ExpiresAt.Time.Unix() {
		return deny(), nil
	}
	return allow(c), nil
}

func main() {
	lambda.Start(Handler)
}
