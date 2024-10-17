#!/bin/bash

sudo -i
cd ../
cd ../
cd ../
cd ../

echo "Updating package lists..."
sudo apt-get update
apt-get install dialog apt-utils

echo "Installing unzip..."
sudo apt-get install -y unzip

echo "Unzipping the webapp.zip file..."
sudo unzip -o /home/ubuntu/webapp.zip -d /home/ubuntu/

cd /home/ubuntu/webapp || { echo "Failed to change directory to /home/ubuntu/webapp"; exit 1; }
pwd
pwd
pwd

echo "Creating .env file..."

sudo tee /home/ubuntu/webapp/.env <<EOF
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_PORT=${DB_PORT}
DB_DIALECT=${DB_DIALECT}
EOF



ls /home/ubuntu/webapp/


echo "Setting permissions and ownership..."
sudo chown -R csye6225:csye6225 /home/ubuntu/webapp
sudo chmod 755 /home/ubuntu
sudo chmod -R 755 /home/ubuntu/webapp
ls -la /home/ubuntu/webapp/src
ls -la /home/ubuntu/webapp/

echo "Installing npm packages..."
sudo npm install 

if [ -f /tmp/webapp.service ]; then
    echo "Moving webapp service file to /etc/systemd/system..."
    sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
else
    echo "/tmp/webapp.service not found, skipping service move."
fi

echo "Setup complete."
