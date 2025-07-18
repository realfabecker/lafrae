package domain

type Config struct {
	AppPort    string `env:"APP_PORT"`
	AppName    string `env:"APP_NAME"`
	AppHost    string `env:"APP_HOST"`
	BucketName string `env:"BUCKET_NAME"`
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

type PagedDTO[T interface{}] struct {
	PageCount int32  `json:"page_count" example:"10"`
	Items     []T    `json:"items"`
	PageToken string `json:"page_token,omitempty"`
	HasMore   bool   `json:"has_more" example:"false"`
} //	@name	PagedDTO

type PagedDTOQuery struct {
	Limit     int32  `query:"limit" validate:"required,max=50"`
	PageToken string `query:"page_token"`
} //	@name	PagedDTOQuery

// MidiaUpload @description Midia information
type MidiaUpload struct {
	Url string `json:"url" example:"https://images.com.br/image.jpg"`
} // @name MidiaUpload

type GenerateUploadUrlDTO struct {
	ContentType string `json:"contentType,omitempty" validate:"required"`
	FileName    string `json:"fileName,omitempty" validate:"required"`
	KeyPrefix   string `json:"keyPrefix,omitempty" validate:"required"`
} // @name	GGenerateUploadUrlDTO
