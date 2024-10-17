#!/bin/bash
export DEBIAN_FRONTEND="noninteractive"
sudo apt-get install dialog apt-utils
sudo apt-get install -y -q

#remove git
sudo apt-get remove git


sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo systemctl status webapp.service


