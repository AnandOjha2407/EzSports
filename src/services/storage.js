// API-based Storage Service
// This service uses the backend API instead of localStorage
// All data operations are now performed through API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      // Check if response is HTML (usually means wrong URL or 404 page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML instead of JSON. API URL might be incorrect:', fullUrl);
        throw new Error(`API endpoint returned HTML instead of JSON. Please check VITE_API_URL environment variable. Current URL: ${API_BASE_URL}`);
      }
      
      const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(errorData.message || 'API request failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Check for JSON parse errors (usually means HTML was returned)
    if (error.message && error.message.includes('JSON')) {
      console.error('JSON Parse Error - API Base URL:', API_BASE_URL, 'This usually means the URL is incorrect.');
    }
    console.error('API Error:', error);
    throw error;
  }
};

// User Management
export const userStorage = {
  getAll: async () => {
    return apiCall('/users');
  },
  
  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },
  
  getByEmail: async (email) => {
    const users = await apiCall('/users');
    return users.find(u => u.email === email);
  },
  
  getByUsername: async (username) => {
    const users = await apiCall('/users');
    return users.find(u => u.username === username);
  },
  
  create: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  update: async (id, updates) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
  
  authenticate: async (email, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return response.user || response;
    } catch (error) {
      // If backend is not available, return null (frontend will handle fallback)
      return null;
    }
  },
};

// Room Management
export const roomStorage = {
  getAll: async () => {
    return apiCall('/rooms');
  },
  
  getById: async (id) => {
    return apiCall(`/rooms/${id}`);
  },
  
  getByCreator: async (creatorId) => {
    // Use the my-rooms endpoint if authenticated, otherwise filter
    try {
      return await apiCall('/rooms/my-rooms/all');
    } catch (error) {
      // Fallback: get all and filter
      const rooms = await apiCall('/rooms');
      return rooms.filter(r => {
        const creatorIdStr = typeof creatorId === 'string' ? creatorId : creatorId?.toString();
        const roomCreatorId = r.creatorId?._id?.toString() || r.creatorId?.toString() || r.creatorId;
        return roomCreatorId === creatorIdStr;
      });
    }
  },
  
  getLive: async () => {
    return apiCall('/rooms/live/all');
  },
  
  getByGame: async (gameType) => {
    return apiCall(`/rooms/game/${gameType}`);
  },
  
  create: async (roomData) => {
    return apiCall('/rooms/create', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },
  
  update: async (id, updates) => {
    return apiCall(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
  
  goLive: async (id) => {
    return apiCall(`/rooms/${id}/go-live`, {
      method: 'POST',
    });
  },
  
  endRoom: async (id) => {
    return apiCall(`/rooms/${id}/end`, {
      method: 'POST',
    });
  },
};

// Stream Management
export const streamStorage = {
  getAll: async () => {
    return apiCall('/streams');
  },
  
  getByCreator: async (creatorId) => {
    // Use the my-streams endpoint if authenticated, otherwise filter
    try {
      return await apiCall('/streams/my-streams/all');
    } catch (error) {
      // Fallback: get all and filter
      const streams = await apiCall('/streams');
      return streams.filter(s => {
        const creatorIdStr = typeof creatorId === 'string' ? creatorId : creatorId?.toString();
        const streamCreatorId = s.creatorId?._id?.toString() || s.creatorId?.toString() || s.creatorId;
        return streamCreatorId === creatorIdStr;
      });
    }
  },
  
  getLive: async () => {
    return apiCall('/streams/live/all');
  },
  
  getByGame: async (gameType) => {
    return apiCall(`/streams/game/${gameType}`);
  },
  
  create: async (streamData) => {
    return apiCall('/streams/add', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  },
  
  update: async (id, updates) => {
    return apiCall(`/streams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/streams/${id}`, {
      method: 'DELETE',
    });
  },
};

// Event Management
export const eventStorage = {
  getAll: async () => {
    return apiCall('/events');
  },
  
  getById: async (id) => {
    return apiCall(`/events/${id}`);
  },
  
  getByGame: async (gameType) => {
    return apiCall(`/events/game/${gameType}`);
  },
  
  getUpcoming: async () => {
    return apiCall('/events/upcoming/all');
  },
  
  create: async (eventData) => {
    return apiCall('/events/create', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
  
  update: async (id, updates) => {
    return apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export all storage functions
export default {
  userStorage,
  roomStorage,
  streamStorage,
  eventStorage,
};
