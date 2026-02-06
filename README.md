# EZSports - Esports Platform for Gamers

A full-stack esports platform built with React and Node.js, where gamers can discover tournaments, join gaming rooms, create content, and participate in competitive gaming events.

**Demo:** https://ezports-frontend.onrender.com/

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Bootstrap 5.3.3** - Responsive CSS framework
- **CSS3** - Custom styling and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting

## ✨ Features

### User Features
- **User Authentication** - Register, login, and secure JWT-based sessions
- **Browse Games** - Explore rooms and events for multiple games
- **Join Rooms** - Join live gaming rooms with credentials
- **View Events** - Browse tournaments and gaming events
- **Search** - Search for rooms, events, and content
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Creator Features
- **Creator Dashboard** - Manage rooms, streams, and analytics
- **Create Rooms** - Create and manage gaming rooms
- **Go Live** - Make rooms live with scheduled times
- **Stream Management** - Add and manage streams (YouTube, Twitch)
- **Room Analytics** - View stats and performance metrics
- **Delete/Edit** - Full CRUD operations on created content

### Platform Features
- **Multi-Game Support** - BGMI, CODM, VALORANT, FREE FIRE, Minecraft, Fortnite, PUBG
- **Live Rooms** - Real-time room status updates
- **Event Management** - Tournament and event listings
- **Static Fallbacks** - Graceful degradation when API is unavailable
- **Auto Go-Live** - Automatic room activation based on schedules
- **Rate Limiting** - API protection and abuse prevention
- **CORS Protection** - Secure cross-origin requests
- **Error Handling** - Comprehensive error handling and validation

## 🎮 Supported Games

- **BGMI** (Battlegrounds Mobile India)
- **CODM** (Call of Duty Mobile)
- **VALORANT**
- **FREE FIRE**
- **Minecraft**
- **Fortnite**
- **PUBG**

## 📦 Installation & Setup

### Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/AnandOjha2407/EZports.git
cd EZports
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Backend Environment

Create `backend/.env` file:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ezports
JWT_SECRET=your-secret-key-minimum-32-characters
NODE_ENV=development
```

**For MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP (use `0.0.0.0/0` for development)
5. Get connection string and add to `.env`

### 5. Configure Frontend (Optional)

Create `.env` file in root (if backend runs on different port):

```env
VITE_API_URL=http://localhost:3000/api
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 7. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

## 📁 Project Structure

```
EZports/
├── backend/                 # Backend API server
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models (User, Room, Stream, Event)
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (env validation)
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
│
├── src/                    # Frontend React application
│   ├── components/        # React components
│   │   ├── Navbar.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── EventCards.jsx
│   │   ├── RoomCards.jsx
│   │   ├── LiveStreams.jsx
│   │   ├── LoginModal.jsx
│   │   ├── CreateRoomForm.jsx
│   │   ├── StreamForm.jsx
│   │   ├── CreatorDashboard.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── GamePage.jsx
│   │   ├── Events.jsx
│   │   ├── Rooms.jsx
│   │   ├── CreatorDashboard.jsx
│   │   └── RoomDetails.jsx
│   ├── contexts/         # React contexts (Auth)
│   ├── services/         # API services
│   │   ├── api.js       # API client
│   │   └── storage.js   # Storage abstraction layer
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
│
├── public/               # Static assets
│   └── images/          # Image assets
│
├── DEPLOYMENT.md        # Deployment guide
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (authenticated)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/live/all` - Get all live rooms
- `GET /api/rooms/game/:gameType` - Get rooms by game type
- `GET /api/rooms/my-rooms/all` - Get creator's rooms (authenticated)
- `POST /api/rooms/create` - Create room (authenticated, creator only)
- `PUT /api/rooms/:id` - Update room (authenticated, creator only)
- `DELETE /api/rooms/:id` - Delete room (authenticated, creator only)
- `POST /api/rooms/:id/go-live` - Go live (authenticated, creator only)
- `POST /api/rooms/:id/end` - End room (authenticated, creator only)

### Streams
- `GET /api/streams` - Get all streams
- `GET /api/streams/live/all` - Get all live streams
- `GET /api/streams/game/:gameType` - Get streams by game type
- `GET /api/streams/my-streams/all` - Get creator's streams (authenticated)
- `POST /api/streams/add` - Add stream (authenticated, creator only)
- `PUT /api/streams/:id` - Update stream (authenticated, creator only)
- `DELETE /api/streams/:id` - Delete stream (authenticated, creator only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/game/:gameType` - Get events by game type
- `GET /api/events/upcoming/all` - Get upcoming events
- `POST /api/events/create` - Create event (authenticated)
- `PUT /api/events/:id` - Update event (authenticated)
- `DELETE /api/events/:id` - Delete event (authenticated)

### Health Check
- `GET /api/health` - API health status

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **Rate Limiting** - API abuse prevention (100-500 req/15min)
- **CORS Protection** - Configured for production domains
- **Environment Validation** - Required env variables validation
- **Error Handling** - Secure error messages (no sensitive data exposure)
- **Input Validation** - Request validation and sanitization

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm start            # Build and serve (for deployment)
```

**Backend:**
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
```

### Environment Variables

**Backend (.env):**
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars in production)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend domain for CORS (production)

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick Summary:**
- Deploy backend and frontend together using Railway or Render
- Configure environment variables
- MongoDB Atlas for database
- Automatic HTTPS and domains

## 📝 Notes

- All authenticated routes require JWT token: `Authorization: Bearer <token>`
- Creator-only routes require `role: 'creator'` in user profile
- MongoDB ObjectIds are used for all IDs
- Static event/room data used as fallback when API unavailable
- Auto go-live feature checks scheduled rooms every minute

## 🐛 Troubleshooting

**MongoDB Connection Failed:**
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials

**Backend Won't Start:**
- Check all environment variables are set
- Verify MongoDB connection
- Check port 3000 is available

**Frontend Can't Connect to Backend:**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Check CORS configuration

**CORS Errors:**
- Verify `FRONTEND_URL` matches frontend domain exactly
- Include `https://` protocol
- No trailing slashes

## 👤 Author

**Anand Ojha**
- GitHub: [@AnandOjha2407](https://github.com/AnandOjha2407)
- Email: anandojha901@gmail.com
- LinkedIn: [anand-ojha-398052247](https://www.linkedin.com/in/anand-ojha-398052247/)

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

[![LinkedIn](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anand-ojha-398052247/)

---

**Built with ❤️ using React, Node.js, and MongoDB**
