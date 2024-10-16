#!/bin/bash

sudo -i

apt-get update
apt-get install -y unzip

sudo unzip /home/ubuntu/webapp.zip -d /home/ubuntu/webapp

cd /home/ubuntu/webapp && sudo npm install 

sudo chown -R csye6225:csye6225 /home/ubuntu/webapp
sudo chmod -R 755 /home/ubuntu
sudo chmod 755 /home/ubuntu
sudo chmod -R 755 /home/ubuntu/webapp

cat <<EOL > /home/ubuntu/webapp/.env
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_PORT=${DB_PORT}
DB_DIALECT=${DB_DIALECT}
EOL



sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service


