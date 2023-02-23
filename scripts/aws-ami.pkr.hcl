variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "subnet_id" {
  type    = string
  default = "subnet-02383155f68a85db3"
}

variable "ami_users" {
  type = list(string)
  default = ["583308812088"]
}

source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "thabes-ami-${formatdate("YYYY-MM-DD-hhmmss", timestamp())}"
  ami_description = "assignment ami"

  ami_regions = [
    "${var.aws_region}"
  ]
  ami_users = "${var.ami_users}"
  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "../../webapp.tar.gz"
    destination = "/home/ec2-user/webapp.tar.gz"
  }

  provisioner "shell" {
    script       = "../scripts/setup-script.sh"
    pause_before = "10s"
    timeout      = "10s"
  }

}