import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import StatusPage from './pages/StatusPage';

// Constants for API URLs from environment
const API_URL = process.env.REACT_APP_API_URL || '/api';
const NEWS_API_URL = process.env.REACT_APP_NEWS_API_URL || '/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Simple component for testing
const HomePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Investing Platform</h1>
      <p>Welcome to the Investing Platform. This is a simplified version for debugging.</p>
      <p>
        <a href="/status">View System Status</a>
      </p>
    </div>
  );
};

const App = () => {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [newsStatus, setNewsStatus] = useState('Checking...');
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // Check main API status
    fetch(`${API_URL}/test`)
      .then(response => response.json())
      .then(data => setApiStatus('Connected: ' + data.message))
      .catch(error => setApiStatus('Error: ' + error.message));
    
    // Check news API status
    fetch(`${NEWS_API_URL}/news`)
      .then(response => response.json())
      .then(data => {
        setNewsStatus('Connected: ' + (data.length || 'data') + ' received');
        setNewsData(data);
      })
      .catch(error => setNewsStatus('Error: ' + error.message));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes only for debugging */}
            <Route path="/" element={<HomePage />} />
            <Route path="/status" element={<StatusPage apiStatus={apiStatus} newsStatus={newsStatus} newsData={newsData} />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
