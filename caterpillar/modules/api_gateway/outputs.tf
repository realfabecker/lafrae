output "output_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}

output "rest_api_execution_arn" {
  value = aws_api_gateway_rest_api.rest_api.execution_arn
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.rest_api.id
}

output "root_resource_id" {
  value = aws_api_gateway_rest_api.rest_api.root_resource_id
}