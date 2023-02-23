# AWS region to use
aws_region = "us-east-1"

# Source AMI ID to use for the new instance
source_ami = "ami-0dfcb1ef8550277af"

# SSH username to connect to the instance
ssh_username = "ec2-user"

# Subnet ID to launch the instance in
subnet_id = "subnet-02383155f68a85db3"

# AWS account IDs that can use the AMI
ami_users = ["583308812088"]

# Instance type to launch
instance_type = "t2.micro"

# Device name for the root volume
device_name = "/dev/xvda"

# Size of the root volume (in GiB)
volume_size = 8

# Type of the root volume (gp2, io1, st1, sc1 or standard)
volume_type = "gp2"

# List of AWS regions to use
aws_region_list = ["us-east-1", "us-west-1"]