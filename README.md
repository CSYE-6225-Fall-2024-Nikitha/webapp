# Health Check API

## Overview
This project implements a Health Check API as part of a cloud-native web application assignment. The API checks the health of the application by verifying the connection to the PostgreSQL database and responds accordingly.

## Prerequisites
Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** (Node package manager, usually included with Node.js)
4. **Git** (for version control)

## Getting Started

### Cloning the Repository
To clone the repository, use the following command:
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

### Additional Notes
- Ensure your PostgreSQL server is running before starting the application.

- Any API requests that are not GET will return a 405 Method Not Allowed status.

- If there is any payload in the request body, a 400 Bad Request response will be sent.
  
### Contribution
If you want to contribute, feel free to create a new branch and submit a pull request.


### Instructions:
- Replace `YOUR_USERNAME` with your actual GitHub username in the clone URL.
- Fill in the placeholders in the `.env` file template with actual values.

