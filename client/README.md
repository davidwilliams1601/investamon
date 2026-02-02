# InvestiMon - React Frontend

This is the frontend application for InvestiMon, a gamified investment learning platform for children aged 7-13. The application is built with React and uses Material-UI for a child-friendly interface.

## Features

- User authentication (parent and child accounts)
- NFT-style character collection representing FTSE100 companies
- Daily and weekly challenges
- Market news with child-friendly explanations
- Progress tracking and rewards system
- Parent dashboard for monitoring child's progress

## Tech Stack

- React 18
- Material-UI
- React Router
- React Query
- Axios
- Styled Components
- Framer Motion

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README for setup)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/investimon.git
cd investimon/client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_NEWS_API_KEY=your_google_news_api_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── styles/            # Theme and global styles
├── utils/             # Utility functions
└── assets/            # Static assets (images, etc.)
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- React Query for data fetching and caching
- Framer Motion for animations
- The InvestiMon team for their contributions
