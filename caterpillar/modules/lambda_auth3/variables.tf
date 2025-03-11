variable "function_name" {
  type = string
}

variable "function_url" {
  type    = bool
  default = false
}

variable "entrypoint" {
  type = string
}

variable "zip_file_name" {
  type = string
}

variable "zip_source_file" {
  type = string
}

variable "zip_output_path" {
  type = string
}

variable "environment" {
  type    = map(string)
}