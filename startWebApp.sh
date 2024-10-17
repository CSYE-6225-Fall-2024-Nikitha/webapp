#!/bin/bash
#remove git
sudo apt-get remove git


sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo systemctl status webapp.service


