#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update the package lists
echo "Updating package lists..."
sudo apt-get update

# Install unzip if not already installed
echo "Installing unzip..."
sudo apt-get install -y unzip

# Unzip the webapp.zip file to the specified directory
echo "Unzipping the webapp.zip file..."
sudo unzip -o /home/ubuntu/webapp.zip -d /home/ubuntu/webapp

# Change to the webapp directory
cd /home/ubuntu/webapp || { echo "Failed to change directory to /home/ubuntu/webapp"; exit 1; }

# Create the .env file with database configurations
echo "Creating .env file..."
cat <<EOL > .env
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_PORT=${DB_PORT}
DB_DIALECT=${DB_DIALECT}
EOL

# Change ownership and permissions for the webapp directory
echo "Setting permissions and ownership..."
sudo chown -R csye6225:csye6225 /home/ubuntu/webapp
sudo chmod -R 755 /home/ubuntu/webapp
# Install npm packages
echo "Installing npm packages..."
sudo npm install 

# Move the webapp service file to systemd directory if it exists
if [ -f /tmp/webapp.service ]; then
    echo "Moving webapp service file to /etc/systemd/system..."
    sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
else
    echo "/tmp/webapp.service not found, skipping service move."
fi

echo "Setup complete."
