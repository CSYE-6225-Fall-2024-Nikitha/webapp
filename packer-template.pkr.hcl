packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  description = "The AWS region to use for the build"
  type        = string
}

variable "base_ami_name" {
  description = "The base name for the custom AMI"
  type        = string
}

locals {
  ami_name = "${var.base_ami_name}-${formatdate("YYYYMMDD-HHMMss", timestamp())}"
}

variable "source_ami" {
  description = "The source AMI to use for building the custom image"
  type        = string
}

variable "ssh_username" {
  description = "SSH username for the instance"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC to use for the instances"
  type        = string
}

variable "subnet_id" {
  description = "The ID of the subnet to use for the instances"
  type        = string
}

variable "ami_description" {
  description = "Description for the custom AMI"
  type        = string
}

variable "ssh_timeout" {
  description = "SSH timeout for connecting to the instance"
  type        = string
}

variable "project_path" {
  description = "The local path to the web application project"
  type        = string
}

variable "credentials_file" {
  description = "The local path to the credentials file"
  type        = string
}

variable "DB_HOST" {
  description = "Database Host"
  type        = string
}

variable "DB_USER" {
  description = "Database User"
  type        = string
}

variable "DB_PASSWORD" {
  description = "Database Password"
  type        = string
}

variable "DB_NAME" {
  description = "Database Name"
  type        = string
}

variable "DB_PORT" {
  description = "Database Port"
  type        = string
}

variable "DB_DIALECT" {
  description = "Database Dialect"
  type        = string
}

variable "instance_type" {
  description = "The type of EC2 instance to use for the build"
  type        = string
}

source "amazon-ebs" "my-ami" {
  ami_name        = local.ami_name
  ami_description = "Custom AMI created on ${formatdate("YYYYMMDD-HHMMss", timestamp())}"
  instance_type   = var.instance_type
  source_ami      = var.source_ami
  region          = var.aws_region
  subnet_id       = var.subnet_id
  vpc_id          = var.vpc_id
  ssh_username    = var.ssh_username
  ssh_timeout     = var.ssh_timeout
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "shell" {
    inline = [
      "sudo groupadd -r csye6225",
      "sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225"
    ]
  }


  provisioner "shell" {
    script = "./installDependencies.sh"
  }

  provisioner "shell" {
    environment_vars = [
      "DB_HOST=${var.DB_HOST}",
      "DB_USER=${var.DB_USER}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_NAME=${var.DB_NAME}",
      "DB_PORT=${var.DB_PORT}",
      "DB_DIALECT=${var.DB_DIALECT}"
    ]
    script = "./setDataBase.sh"
  }


  provisioner "file" {
    source      = "${var.project_path}"
    destination = "/home/ubuntu/webapp.zip"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    script = "./setWebApp.sh"
  }

  provisioner "shell" {
    script = "./startWebApp.sh"
  }
}
