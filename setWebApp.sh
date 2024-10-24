#!/bin/bash
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


ls /home/ubuntu/webapp/


echo "Setting permissions and ownership..."
sudo chown -R csye6225:csye6225 /home/ubuntu
sudo chmod 755 /home/ubuntu
sudo chmod -R 755 /home/ubuntu/webapp
ls -la /home/ubuntu/webapp/src
ls -la /home/ubuntu/webapp/

echo "Installing npm packages..."
sudo npm install 
sudo touch /opt/setDataBase.sh


if [ -f /tmp/webapp.service ]; then
    echo "Moving webapp service file to /etc/systemd/system..."
    sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
else
    echo "/tmp/webapp.service not found, skipping service move."
fi

if [ -f /tmp/webapp.path ]; then
    echo "Moving webapp path file to /etc/systemd/system..."
    sudo mv /tmp/webapp.path /etc/systemd/system/webapp.path
else
    echo "/tmp/webapp.path not found, skipping service move."
fi
echo "Setup complete."
