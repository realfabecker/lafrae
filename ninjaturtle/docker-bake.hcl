variable "REGISTRY" {
  type    = "string"
  default = "docker.io/rafaelbeecker"
}

variable "APP_RELEASE" {
  type    = "string"
  default = "develop"
}

groups "default" {
  targets = ["typescript"]
}

target "typescript" {
  name       = "typescript-${version}"
  context    = "."
  dockerfile = "./Dockerfile"
  tags = ["${REGISTRY}/bigfoot:typescript-${version}"]
  target     = "dev"
  matrix = {
    version = [APP_RELEASE]
  }
}