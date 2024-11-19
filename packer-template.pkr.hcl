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


variable "instance_type" {
  description = "The type of EC2 instance to use for the build"
  type        = string
}

variable ami_users {
  description = "List of AWS user IDs to share AMIs with"
  type        = list(string)
  default     = ["920373022058", "120569613620"]
}
variable "aws_polling_delay_seconds" {
  description = "The delay in seconds between each polling attempt for AWS resources."
  type        = number
  default     = 120
}

variable "aws_polling_max_attempts" {
  description = "The maximum number of attempts to poll for AWS resources."
  type        = number
  default     = 30
}

variable "launch_device_name" {
  description = "The device name for the root volume."
  type        = string
  default     = "/dev/sda1"
}

variable "launch_volume_size" {
  description = "The size of the root volume in GB."
  type        = number
  default     = 25
}

variable "launch_volume_type" {
  description = "The type of the root volume."
  type        = string
  default     = "gp2"
}

variable "launch_delete_on_termination" {
  description = "Whether to delete the root volume on instance termination."
  type        = bool
  default     = true
}

source "amazon-ebs" "my-ami" {
  ami_name        = local.ami_name
  ami_description = "Custom AMI created on ${formatdate("YYYYMMDD-HHMMss", timestamp())}"
  ami_users       = var.ami_users
  instance_type   = var.instance_type
  source_ami      = var.source_ami
  region          = var.aws_region
  subnet_id       = var.subnet_id
  vpc_id          = var.vpc_id
  ssh_username    = var.ssh_username
  ssh_timeout     = var.ssh_timeout

  aws_polling {
    delay_seconds = var.aws_polling_delay_seconds
    max_attempts  = var.aws_polling_max_attempts
  }

  launch_block_device_mappings {
    device_name           = var.launch_device_name
    volume_size           = var.launch_volume_size
    volume_type           = var.launch_volume_type
    delete_on_termination = var.launch_delete_on_termination
  }
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


  provisioner "file" {
    source      = "${var.project_path}"
    destination = "/home/ubuntu/webapp.zip"
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

  provisioner "file" {
    source      = "cloudwatch-config.json"
    destination = "/tmp/cloudwatch-config.json"
  }

  provisioner "shell" {
    script = "./installCloudWatchAgent.sh"
  }

  provisioner "shell" {
    script = "./startWebApp.sh"
  }
  
  post-processor "manifest" {
    output = "manifest.json"
    strip_path = true
  }
}
