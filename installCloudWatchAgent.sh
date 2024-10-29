#!/bin/bash

# Update and install prerequisites
sudo apt-get update -y
sudo apt-get install -y unzip curl

cd ../
cd ../
sudo curl -o amazon-cloudwatch-agent.deb https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
# Download and install the Unified CloudWatch Agent
sudo dpkg -i amazon-cloudwatch-agent.deb
sudo apt-get install -f



sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc
sudo mv /tmp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json

sudo chown -R csye6225:csye6225 /home/ubuntu
sudo chown -R csye6225:csye6225 /home/ubuntu/webapp
sudo chmod 755 /home/ubuntu/webapp
sudo chmod -R 755 /home/ubuntu/webapp
mkdir -p /home/ubuntu/webapp/logs

# Enable and start the CloudWatch Agent service using the configuration
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json \
    -s
