resource "aws_lambda_function" "lambda" {

  function_name = var.function_name
  handler       = var.entrypoint
  runtime       = "provided.al2"

  architectures = ["arm64"]

  filename         = data.archive_file.zip.output_path
  source_code_hash = data.archive_file.zip.output_base64sha256
  role             = aws_iam_role.iam_for_lambda.arn

  environment {
    variables = var.environment
  }
}

resource "aws_lambda_function_url" "lambda_url" {
  count              = var.function_url ? 1 : 0
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"
}
