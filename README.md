# Health Check API

## Overview
This project implements a Health Check API, followed by User creation API as part of a cloud-native web application assignment. The API checks the health of the application by verifying the connection to the PostgreSQL database and responds accordingly.The User API creates user, fetches and updates user

## Prerequisites
Before you begin, ensure you have the following installed:-

1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** (Node package manager, usually included with Node.js)
4. **Git VCS** (for version control)

## Getting Started

### Git Instructions


 **Fork the Repository**

   - Go to the [GitHub repository](https://github.com/CSYE-6225-Fall-2024-Nikitha/webapp) and click the "Fork" button at the top right.

**Clone Your Fork**
   - Once you have forked the repository, clone it to your local machine using the following command:
   ```bash
   git clone https://github.com/YOUR_USERNAME/webapp.git
``` 
### Setting Up Environment Variables
Navigate to the project directory:
```
cd webapp
```

### Create a .env file in the root directory of the project
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name

### Install Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### Build and Deploy
To start the application, use the following command:

```
npm start
```
The application will be running on http://localhost:8080.

### API Behavior
- Endpoint: /healthz

- Supported Method: Only GET requests are allowed.
- Responses:
  
  - 200 OK: If connected to the database.
  - 400 Bad Request: If the request includes a body or any query parameters.
  - 405 Method Not Allowed: If using any method other than GET.
  - 503 Service Unavailable: If the database connection fails.

- Endpoint: v1/user
- Supported Method: only POST requests are allowed
- Responses:
  - Success (201 Created)
    ```
    {
    "message": "User account created successfully.",
    "account_created": "2024-10-03T12:00:00Z"
    }
    ```
    - Error (400 Bad Request):
    ```
    {
    "error": "A user account with this email address already exists          
    }
    ```

- Endpoint: v1/user/self 
- Supported Method: PUT and GET are allowed for authenticated users
- Responses:
  - GET : Success (200 OK): (user retrieval succesful)
  ```
  {
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "account_created": "2016-08-29T09:12:33.001Z",
  "account_updated": "2016-08-29T09:12:33.001Z"
  }
  ```
  - 400 Bad Request
  - 401 Unauthorized Request
  - PUT: 
  ```
  {
  "first_name": "Jane",
  "last_name": "Doe",
  "password": "skdjfhskdfjhg",
  "email": "jane.doe@example.com"
  }
  ```
  - 204 No Content
  - 400 Bad Request
  

### Testing the Health Check API
You can test the Health Check API using Postman or curl.

### Successful Request:
```
curl -vvv http://localhost:8080/healthz
```

### Method Not Allowed Example:
```
curl -vvv -XPUT http://localhost:8080/healthz
```
### Stopping the Application
To stop the application, use Ctrl + C in the terminal where the application is running.

### Deploying Application on Cloud
This document outlines the steps to launch an Ubuntu 24.04 LTS VM on DigitalOcean, set up the necessary environment, and run the application for the demo.

## Prerequisites

- A DigitalOcean account
- Access to the code submission ZIP file from Canvas

## Steps

### 1. Launch Ubuntu 24.04 LTS VM on DigitalOcean

1. **Sign In to DigitalOcean**: Go to [DigitalOcean](https://www.digitalocean.com/) and sign in to your account.
2. **Create a Droplet**:
   - Click on the **"Create"** button and select **"Droplets"**.
   - Choose **Ubuntu 24.04 LTS** as the operating system.
   - Select a plan according to your resource needs.
   - Choose a data center region close to your location.
   - Set up SSH keys or password for authentication.
   - Click **"Create Droplet"**.

### 2. Download Code Submission and SCP to the VM

1. **Download Code**: Obtain the ZIP file containing the code submission from Canvas.
2. **Transfer ZIP to VM**:
   - Open a terminal on your local machine.
   - Use `scp` to copy the ZIP file to your VM:
     ```bash
     scp /path/to/your/code.zip root@your_droplet_ip:/path/on/vm
     ```

### 3. Install PostgreSQL RDBMS

1. **Connect to Your VM**:
   ```bash
   ssh root@your_droplet_ip
2. **Update Package List**:
  ```
   sudo apt update
   ```
3. **Install PostgreSQL**:
```
sudo apt install postgresql postgresql-contrib

```

4. **Install Dependencies**:
```
sudo apt install nodejs npm
```
5. **Build Application**:
```
unzip /path/on/vm/code.zip -d /path/on/vm/code
cd /path/on/vm/code
```
6. **Install Node.js Dependencies**:
```
npm install
```
7. **Update Application Configuration**:
- Manually update the application configuration in the external configuration file as needed.

- Ensure that you do not modify any source files.

8. **Launch the Application**:
```
npm start

```
9. **Validate Application Health**
```
curl http://localhost:your_port/healthz
```
10. **Test USER API Operations**
- Perform tests for all USER API operations (like create, read, update, delete) using tools like Postman or curl.
- Ensure that the database is set up automatically without executing any SQL scripts manually.

### Additional Notes
- Ensure your PostgreSQL server is running before starting the application.

- Any API requests that are not GET will return a 405 Method Not Allowed status.

- If there is any payload in the request body, a 400 Bad Request response will be sent.




### Instructions:
- Fill in the placeholders in the `.env` file template with actual values.

