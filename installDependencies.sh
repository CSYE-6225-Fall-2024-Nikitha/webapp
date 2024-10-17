#!/bin/bash

sudo apt update -y
sudo apt upgrade -y

# Node and npm 
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

sudo apt install -y build-essential

sudo apt install -y python3 python3-pip

sudo apt install -y unzip

# Install Java
sudo apt install -y default-jdk
