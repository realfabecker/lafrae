package domain

type Config struct {
	AppPort         string `env:"APP_PORT"`
	AppName         string `env:"APP_NAME"`
	AppHost         string `env:"APP_HOST"`
	CognitoClientId string `env:"COGNITO_CLIENT_ID"`
}

type EmptyResponseDTO struct {
	Status  string `json:"status" example:"success"`
	Message string `json:"message,omitempty" example:"Operação realizada com sucesso"`
	Code    int    `json:"code,omitempty" example:"200"`
} //	@name	EmptyResponseDTO

type ResponseDTO[T any] struct {
	Status  string `json:"status" example:"success"`
	Message string `json:"message,omitempty" example:"Operação realizada com sucesso"`
	Code    int    `json:"code,omitempty" example:"200"`
	Data    *T     `json:"data,omitempty"`
} //	@name	ResponseDTO

type UserToken struct {
	IdToken      *string `json:"IdToken,omitempty"`
	RefreshToken *string `json:"RefreshToken,omitempty"`
	AccessToken  *string `json:"AccessToken,omitempty"`
} // @name	UserToken

type UserLoginResponseDTO struct {
	UserToken     *UserToken `json:"UserToken,omitempty"`
	Session       *string    `json:"Session,omitempty"`
	ChallengeName *string    `json:"ChallengeName,omitempty"`
} // @name UserLoginResponseDTO

type UserLoginDTO struct {
	Email      string            `json:"email" validate:"required,email"`
	Password   string            `json:"password" validate:"required,min=6"`
	Challenge  string            `json:"challenge,omitempty"`
	Parameters map[string]string `json:"parameters,omitempty"`
	Session    string            `json:"session,omitempty"`
} // @name	UserLoginDTO

type UserLoginForgotDTO struct {
	Email string `json:"email" validate:"required,email"`
} // @name	UserLoginForgotDTO

type UserLoginChangeDTO struct {
	Email             string `json:"email" validate:"required,email"`
	NewPassword       string `json:"newPassword" validate:"required,min=6"`
	PasswordResetCode string `json:"passwordResetCode" validate:"required"`
} // @name	UserLoginChangeDTO

type CodeDeliveryDetails struct {
	DeliveryMedium string `json:"deliveryMedium"`
} // @name CodeDeliveryDetails

type UserLoginChallengeDTO struct {
	Challenge string `json:"challenge"`
	Session   string `json:"session"`
} // @name UserLoginChallangeDTO
