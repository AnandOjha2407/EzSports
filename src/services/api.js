// API service layer - will be connected to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'API request failed' }))
      throw new Error(errorData.message || 'API request failed')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Re-throw with more context
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Backend server is not available. Please ensure the API server is running.')
    }
    console.error('API Error:', error)
    throw error
  }
}

// Authentication
export const authService = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Rooms
export const roomService = {
  create: (roomData) => apiCall('/rooms/create', {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  
  getLive: () => apiCall('/rooms/live'),
  
  getByGame: (gameType) => apiCall(`/rooms/game/${gameType}`),
  
  getById: (roomId) => apiCall(`/rooms/${roomId}`),
  
  update: (roomId, roomData) => apiCall(`/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  }),
  
  delete: (roomId) => apiCall(`/rooms/${roomId}`, {
    method: 'DELETE',
  }),
  
  goLive: (roomId) => apiCall(`/rooms/${roomId}/go-live`, {
    method: 'POST',
  }),
  
  endRoom: (roomId) => apiCall(`/rooms/${roomId}/end`, {
    method: 'POST',
  }),
  
  getMyRooms: () => apiCall('/rooms/my-rooms/all'),
}

// Streams
export const streamService = {
  getLive: () => apiCall('/streams/live'),
  
  getByGame: (gameType) => apiCall(`/streams/game/${gameType}`),
  
  addStream: (streamData) => apiCall('/streams/add', {
    method: 'POST',
    body: JSON.stringify(streamData),
  }),
}

// Events
export const eventService = {
  getAll: () => apiCall('/events'),
  
  getByGame: (gameType) => apiCall(`/events/game/${gameType}`),
  
  create: (eventData) => apiCall('/events/create', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
}

// Creator
export const creatorService = {
  getStats: () => apiCall('/creator/stats'),
  
  getRooms: () => apiCall('/creator/rooms'),
  
  getSchedule: () => apiCall('/creator/schedule'),
}

