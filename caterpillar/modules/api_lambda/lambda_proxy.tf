resource "aws_api_gateway_resource" "resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.rest_root_id
  path_part   = var.path_part
}

resource "aws_api_gateway_resource" "resource_proxy" {
  parent_id   = aws_api_gateway_resource.resource.id
  path_part   = "{proxy+}"
  rest_api_id = var.rest_api_id
}

resource "aws_api_gateway_method" "resource_proxy" {
  authorization = "NONE"
  http_method   = "ANY"
  resource_id   = aws_api_gateway_resource.resource_proxy.id
  rest_api_id   = var.rest_api_id
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "resource_lambda" {
  http_method = aws_api_gateway_method.resource_proxy.http_method
  resource_id = aws_api_gateway_method.resource_proxy.resource_id
  rest_api_id = var.rest_api_id

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

resource "aws_lambda_permission" "resource_lambda" {
  statement_id = "${var.rest_api_id}-${var.path_part}-94c40a24-e8c7-529c-a50b-a4e9ed4a9aeb"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/*"
}