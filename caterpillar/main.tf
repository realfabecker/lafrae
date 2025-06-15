module "database_dynamodb" {
  source = "./modules/dynamodb"
}

module "lambda_auth3" {
  source = "./modules/lambda_auth3"

  function_name = "auth3"
  entrypoint    = "bootstrap"

  zip_source_file = "../../auth3/auth3/backend/out/bootstrap"
  zip_output_path = "../../auth3/auth3/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  environment = {
    APP_NAME          = "auth3"
    COGNITO_CLIENT_ID = "7n3n1umhe20ncdm3qco1qc19s3"
  }
}

module "lambda_auth4" {
  source = "./modules/lambda_auth4"

  function_name = "auth4"
  entrypoint    = "bootstrap"

  zip_source_file = "../../auth3/auth3/backend/out/bootstrap"
  zip_output_path = "../../auth3/auth3/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  environment = {
    COGNITO_JWK_URL = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_63mYbjp1e/.well-known/jwks.json"
  }
}

module "lambda_buck3t" {
  source = "./modules/lambda_buck3t"

  function_name = "buck3t"
  entrypoint    = "bootstrap"

  zip_source_file = "../../buck3t/buck3t/backend/out/bootstrap"
  zip_output_path = "../../buck3t/buck3t/backend/out"
  zip_file_name   = "lambda_backend_handler.zip"

  s3_bucket_name = "sintese"

  environment = {
    BUCKET_NAME = "sintese"
  }
}

module "api_gateway" {
  source = "./modules/api_gateway"
}

module "api_auth3" {
  source = "./modules/api_lambda"

  path_part = "auth3"

  lambda_function_name = module.lambda_auth3.lambda_function_name
  lambda_invoke_arn    = module.lambda_auth3.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}

module "api_buck3t" {
  source = "./modules/api_lambda"

  path_part = "buck3t"

  lambda_function_name = module.lambda_buck3t.lambda_function_name
  lambda_invoke_arn    = module.lambda_buck3t.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}