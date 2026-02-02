import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserData,
  onAuthStateChange
} from '../firebase/authService';

// Create a context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          setError('Failed to load user data');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login with Firebase
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Login attempt with:', email);

      const firebaseUser = await loginUser(email, password);
      const userData = await getUserData(firebaseUser.uid);

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : 'Login failed. Please try again.';

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register with Firebase
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Register attempt with:', userData);

      const { email, password, ...restUserData } = userData;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const firebaseUser = await registerUser(email, password, restUserData);
      const newUserData = await getUserData(firebaseUser.uid);

      setUser(newUserData);
      return newUserData;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.message || 'Registration failed. Please try again.';

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout with Firebase
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const authValue = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading ? children : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <p>Loading...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 