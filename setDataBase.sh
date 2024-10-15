#!/bin/bash

# Update package lists
sudo apt update

# Install PostgreSQL and its additional components
sudo apt install -y postgresql postgresql-contrib

# Start the PostgreSQL service
sudo service postgresql start

# Change the PostgreSQL password for the default user (postgres)
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Drop the database if it exists
sudo -u postgres psql -c "DROP DATABASE IF EXISTS webapp;"

# Create the database named 'webapp'
sudo -u postgres psql -c "CREATE DATABASE webapp;"

# Optional: Grant all privileges on the 'webapp' database to the 'postgres' user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE webapp TO postgres;"
