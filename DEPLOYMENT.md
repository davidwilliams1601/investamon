# Investing Platform Deployment Guide

This document outlines how to deploy the Investing Platform for testing with users.

## Prerequisites

- Node.js 14.x or later
- Python 3.8 or later
- MongoDB (running locally or accessible)
- Python virtual environment (.venv)

## Production Deployment Steps

### 1. Build the React Application

The React application needs to be built for production:

```bash
cd client
npm run build
```

This creates optimized files in the `client/build` directory.

### 2. Configure Environment Variables

Edit the `.env.production` file to match your deployment environment:

```
NODE_ENV=production
PORT=5001
API_SERVER=http://127.0.0.1:58932
NEWS_SERVER=http://127.0.0.1:59902
MONGODB_URI=mongodb://localhost:27017/investimon
JWT_SECRET=your_secure_jwt_secret_key_for_production
```

### 3. Start the Production Deployment

Use the provided script to start all services:

```bash
./start_production.sh
```

This script:
- Stops any existing instances of the application
- Starts the Python API server
- Starts the Python News server
- Starts the Node.js production server
- Opens the application in your browser

### 4. Checking Deployment Status

To verify all services are running properly:

```bash
./check_status.sh
```

This will show:
- Status of all servers
- Connection test results
- Log file information
- Memory usage statistics

### 5. Stop the Production Deployment

To stop all services:

```bash
./stop_production.sh
```

## Monitoring and Logs

All server logs are captured in the following files:
- `api_server.log` - Python API server logs
- `news_server.log` - Python News server logs
- `production_server.log` - Node.js production server logs

To monitor logs in real-time:

```bash
tail -f production_server.log
```

## Test Users

For testing purposes, the following test accounts are available:

| Email               | Password | Role    |
|---------------------|----------|---------|
| parent@example.com  | test123  | Parent  |
| child@example.com   | test123  | Child   |

## Troubleshooting

### Service not starting

Check the corresponding log file for errors:

```bash
cat api_server.log
cat news_server.log
cat production_server.log
```

### Cannot connect to the application

Verify all services are running:

```bash
./check_status.sh
```

### MongoDB connection issues

Ensure MongoDB is running:

```bash
mongo --eval "db.version()"
```

### Browser can't connect to server

Try accessing directly with different addresses:
- http://localhost:5001
- http://127.0.0.1:5001
- http://[your-ip-address]:5001

## Deployment to External Servers

For deployment to external servers (AWS, DigitalOcean, etc.), additional steps are needed:

1. Set up a production MongoDB database
2. Configure firewall rules to allow necessary ports
3. Set up proper environment variables for the production environment
4. Consider using process managers like PM2 for Node.js and Supervisord for Python
5. Set up SSL certificates for secure HTTPS connections

Refer to the specific hosting provider's documentation for detailed deployment steps. 