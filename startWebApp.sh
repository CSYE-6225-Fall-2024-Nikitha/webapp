#!/bin/bash

# Reload the systemd manager configuration
sudo systemctl daemon-reload

# # Enable and start the service using the specified path and service names
# sudo systemctl enable webapp.path
# sudo systemctl start webapp.path

# Check the status of the web application service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo systemctl status webapp.service

# View logs for the web application service
sudo journalctl -u webapp.service
