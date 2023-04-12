#!/bin/bash

image_id=$(aws ec2 describe-images --owners '390646828676' --filters 'Name=name,Values=thabes*' --query 'sort_by(Images, &CreationDate)[-1].[ImageId]' --output 'text') 
aws ec2 create-launch-template-version --launch-template-name 'asg_launch_config' --source-version '$Latest' --launch-template-data "{\"ImageId\":\"$image_id\"}"
aws autoscaling start-instance-refresh --auto-scaling-group-name 'csye6225-asg-thabes'

# image_id=$(aws ec2 describe-images --owners '390646828676' --filters 'Name=name,Values=thabes*' --query 'sort_by(Images, &CreationDate)[-1].[ImageId]' --output 'text' --profile prod) 
# aws ec2 create-launch-template-version --launch-template-name 'asg_launch_config' --source-version '$Latest' --launch-template-data "{\"ImageId\":\"$image_id\"}" --profile prod
# aws autoscaling start-instance-refresh --auto-scaling-group-name 'csye6225-asg-thabes' --profile prod