module "lambda_wallet" {
  source = "./modules/lambda_wallet"

  function_name = "wallet"
  entrypoint    = "bootstrap"

  archive_version = "0.0.1"

  zip_source_file = "./resources/wallet/dist/bootstrap"
  zip_output_path = "./resources/wallet/dist"

  zip_file_name   = "lambda_backend_handler.zip"

  dynamodb_table_arn = module.database_dynamodb.dynamodb_table_arn
  APP_NAME           = "wallet"

  environment = {
    APP_NAME            = "wallet"
    DYNAMODB_TABLE_NAME = "sintese"
  }
}

module "wallet_proxy" {
  source = "./modules/api_lambda"

  path_part = "wallet"

  lambda_function_name = module.lambda_wallet.lambda_function_name
  lambda_invoke_arn    = module.lambda_wallet.lambda_invoke_arn

  rest_api_execution_arn = module.api_gateway.rest_api_execution_arn
  rest_api_id            = module.api_gateway.rest_api_id
  rest_root_id           = module.api_gateway.root_resource_id
}