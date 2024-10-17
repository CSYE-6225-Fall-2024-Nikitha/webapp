#!/bin/bash
export DEBIAN_FRONTEND="noninteractive"
sudo apt-get install dialog apt-utils
sudo apt-get install -y -q


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
