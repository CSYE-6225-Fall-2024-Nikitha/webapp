#!/bin/bash

# Update package lists
sudo apt update

# Install PostgreSQL and its additional components
sudo apt install -y postgresql postgresql-contrib

# Start the PostgreSQL service
sudo service postgresql start

# Change the PostgreSQL password for the default user (based on DB_USER and DB_PASSWORD environment variables)
sudo -u postgres psql -c "ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';"

# Drop the database if it exists (using the DB_NAME variable)
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Create the database (using the DB_NAME variable)
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

# # Optional: Grant all privileges on the database to the user (DB_USER)
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
