#!/bin/bash

sudo apt update

sudo apt install -y postgresql postgresql-contrib


sudo systemctl start postgresql

sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';"

sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"

sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
