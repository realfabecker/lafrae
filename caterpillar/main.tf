module "database_dynamodb" {
  source = "./modules/dynamodb"
}

module "api_gateway" {
  source = "./modules/api_gateway"
}

module "lambda_photos" {
  source = "./modules/lambda_photos"

  function_name = "photos"
  entrypoint    = "bootstrap"

  zip_source_file = "./projects/photos/backend/out/bootstrap"
  zip_output_path = "./projects/photos/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  dynamodb_table_arn = module.database_dynamodb.dynamodb_table_arn
  s3_bucket_name     = "sintese"

  function_url = false

  environment = {
    APP_NAME            = "photos"
    DYNAMODB_TABLE_NAME = "sintese"
    BUCKET_NAME         = "sintese"
  }
}

module "photos_proxy" {
  source = "./modules/api_lambda"

  path_part = "photos"

  lambda_function_name = module.lambda_photos.lambda_function_name
  lambda_invoke_arn    = module.lambda_photos.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}

module "lambda_auth3" {
  source = "./modules/lambda_auth3"

  function_name = "auth3"
  entrypoint    = "bootstrap"

  zip_source_file = "./projects/auth3/backend/out/bootstrap"
  zip_output_path = "./projects/auth3/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  environment = {
    APP_NAME          = "auth3"
    COGNITO_CLIENT_ID = "7n3n1umhe20ncdm3qco1qc19s3"
  }
}

module "auth3_proxy" {
  source = "./modules/api_lambda"

  path_part = "auth3"

  lambda_function_name = module.lambda_auth3.lambda_function_name
  lambda_invoke_arn    = module.lambda_auth3.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}

module "lambda_buck3t" {
  source = "./modules/lambda_buck3t"

  function_name = "buck3t"
  entrypoint    = "bootstrap"

  zip_source_file = "./projects/buck3t/backend/out/bootstrap"
  zip_output_path = "./projects/buck3t/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  s3_bucket_name = "sintese"

  environment = {
    BUCKET_NAME = "sintese"
  }
}

module "buck3t_proxy" {
  source = "./modules/api_lambda"

  path_part = "buck3t"

  lambda_function_name = module.lambda_buck3t.lambda_function_name
  lambda_invoke_arn    = module.lambda_buck3t.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}

module "lambda_auth4" {
  source = "./modules/lambda_auth4"

  function_name = "auth4"
  entrypoint    = "bootstrap"

  zip_source_file = "./projects/auth3/backend/out/bootstrap"
  zip_output_path = "./projects/auth3/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  environment = {
    COGNITO_JWK_URL = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_63mYbjp1e/.well-known/jwks.json"
  }
}
