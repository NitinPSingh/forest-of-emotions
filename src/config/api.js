export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  EMOTIONS: {
    GET_ALL: `${API_BASE_URL}/api/emotions`,
    GET_PREDOMINANT: `${API_BASE_URL}/api/emotions/predominant`,
    GET_BY_DATE: (date) => `${API_BASE_URL}/api/emotions/date/${date}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/emotions/${id}`,
  }
};

export default API_ENDPOINTS; 