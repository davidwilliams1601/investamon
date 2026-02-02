# Investimon Platform

A gamified investment learning platform that helps users learn about investing through collecting and managing characters tied to real stock market data.

## Components

The platform consists of two main components:

1. **News Server (Python)**: Provides investment news data
2. **Main Application (Flask)**: Handles authentication, characters, challenges, and the frontend interface

## Setup and Installation

### Prerequisites

- Python 3.7+
- MongoDB (running locally or accessible via URI)

### Installation Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd investimon-platform
   ```

2. Install Python dependencies:
   ```
   pip3 install -r requirements.txt
   ```

3. Set up environment variables (optional):
   Create a `.env` file in the root directory with the following variables:
   ```
   SECRET_KEY=your_secret_key
   MONGODB_URI=mongodb://localhost:27017/investimon
   PORT=3000
   ```

## Running the Application

1. Start the News Server:
   ```
   python3 news_server.py
   ```
   The news server will run on port 59901 or 59902.

2. Start the Main Application:
   ```
   python3 app.py
   ```
   The main application will run on port 3000 by default.

3. Access the application in your browser:
   - Main application: http://localhost:3000
   - System status page: http://localhost:3000/status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Characters
- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get a specific character

### News
- `GET /api/news` - Get latest investment news

## Development and Testing

- The `/status` endpoint provides a system health check showing MongoDB and News API connection status.
- You can use this page to verify all components are working correctly.

## License

[MIT License](LICENSE) 