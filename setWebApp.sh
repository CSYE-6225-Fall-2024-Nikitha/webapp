#!/bin/bash

sudo -i

# Install unzip if not already installed
apt-get update
apt-get install -y unzip

# Unzip the web application
cd /home/packer/ && sudo unzip webapp.zip

# Navigate to the application directory and install npm dependencies
cd /home/packer/webapp && sudo npm install

# Clean up by removing the zip file
sudo rm -f /home/packer/webapp.zip

# Set permissions and ownership
sudo chmod -R 755 /home/packer
sudo chown -R csye6225:csye6225 /home/packer

# Move service files to systemd directory
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo mv /tmp/webapp.path /etc/systemd/system/webapp.path

# Enable and start the service (optional)
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
