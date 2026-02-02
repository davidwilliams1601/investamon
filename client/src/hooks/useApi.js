import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:58932/api';

const useApi = () => {
  const { logout } = useAuth();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    throw error;
  };

  const get = async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const post = async (endpoint, data) => {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const put = async (endpoint, data) => {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const del = async (endpoint) => {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
};

export { useApi }; 