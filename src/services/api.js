// API service layer - will be connected to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Log API URL in development to help with debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

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
    const fullUrl = `${API_BASE_URL}${endpoint}`
    const response = await fetch(fullUrl, config)
    
    // Check if response is ok
    if (!response.ok) {
      // Check if response is HTML (usually means wrong URL or 404 page)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML instead of JSON. API URL might be incorrect:', fullUrl)
        throw new Error(`API endpoint returned HTML instead of JSON. Please check VITE_API_URL environment variable. Current URL: ${API_BASE_URL}`)
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
      }
      console.error('API Error Response:', { status: response.status, statusText: response.statusText, data: errorData, url: fullUrl })
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Re-throw with more context
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Network Error - API Base URL:', API_BASE_URL, 'Endpoint:', endpoint)
      throw new Error('Backend server is not available. Please ensure the API server is running and VITE_API_URL is set correctly.')
    }
    
    // Check for JSON parse errors (usually means HTML was returned)
    if (error.message && error.message.includes('JSON')) {
      console.error('JSON Parse Error - API Base URL:', API_BASE_URL, 'This usually means the URL is incorrect.')
      throw new Error(`API returned invalid JSON. Please check VITE_API_URL is set correctly. Current URL: ${API_BASE_URL}`)
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
  
  getLive: () => apiCall('/rooms/live/all'),
  
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
  getLive: () => apiCall('/streams/live/all'),
  
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

