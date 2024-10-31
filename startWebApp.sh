#!/bin/bash


#remove git
sudo apt-get -y remove git


sudo systemctl daemon-reload
sudo systemctl enable webapp.path
sudo systemctl start webapp.path
sudo systemctl status webapp

sudo journalctl -u csye6225