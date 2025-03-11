resource "null_resource" "create_directory" {
  triggers = {
    on_version_change = var.archive_version
  }
  provisioner "local-exec" {
    command = "mkdir -p ${var.zip_output_path}"
  }
}

resource "null_resource" "download_file" {
  triggers = {
    on_version_change = var.archive_version
  }
  provisioner "local-exec" {
    command = "wget -qO ${var.zip_output_path}/bootstrap $(https://api.github.com/repos/realfabecker/tracker/releases/latest | jq -r '.assets[] | select (.name == \"lambda\") | .browser_download_url)"
  }
  depends_on = [
    null_resource.create_directory
  ]
}

data "archive_file" "zip" {
  source_file = var.zip_source_file
  type        = "zip"
  output_path = "${var.zip_output_path}/${var.zip_file_name}"

  depends_on = [
    null_resource.download_file
  ]
}