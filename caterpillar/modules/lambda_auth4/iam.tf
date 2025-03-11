resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.function_name}-lambda-role"
  path = "/service-role/"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_logging" {
  name = "${var.function_name}-lambda-logging"
  path        = "/"
  description = "IAM policy for function ${var.function_name}"

  policy = jsonencode(
    {
      Statement = [
        {
          Action = [
            "logs:PutLogEvents",
            "logs:CreateLogStream",
            "logs:CreateLogGroup",
          ]
          Effect   = "Allow"
          Resource = "arn:aws:logs:*:*:*"
          Sid      = "CloudWatch"
        }
      ]
      Version = "2012-10-17"
    }
  )
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}