#!/bin/bash

sudo -i

# Install unzip if not already installed
apt-get update
apt-get install -y unzip

# Unzip the web application
sudo unzip /home/ubuntu/webapp.zip -d /home/ubuntu/webapp

# Navigate to the application directory and install npm dependencies
cd /home/ubuntu/webapp && sudo npm install 

# Clean up by removing the zip file

# Set permissions and ownership
sudo chown -R csye6225:csye6225 /home/ubuntu/webapp
sudo chmod 755 /home/ubuntu
sudo chmod -R 755 /home/ubuntu/webapp

# Move service files to systemd directory
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service


