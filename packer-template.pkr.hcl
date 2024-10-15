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

variable "ami_name" {
  description = "The name of the custom AMI to create"
  type        = string
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

source "amazon-ebs" "my-ami" {
  ami_name        = var.ami_name
  ami_description = var.ami_description
  instance_type   = "t2.micro"
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
    script = "./installDependencies.sh"
  }

  provisioner "shell" {
    script = "./setDataBase.sh"
  }

  provisioner "file" {
    source      = "${var.project_path}"
    destination = "/home/packer/webapp.zip"
  }

  provisioner "file" {
    source      = "${var.credentials_file}"
    destination = "/tmp/credentials_file.json"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "file" {
    source      = "webapp.path"
    destination = "/tmp/webapp.path"
  }

  provisioner "shell" {
    script = "./setWebApp.sh"
  }

  provisioner "shell" {
    script = "./startWebApp.sh"
  }
}
