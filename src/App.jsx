import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import BackgroundAnimation from './components/BackgroundAnimation'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import GamePage from './pages/GamePage'
import Events from './pages/Events'
import Rooms from './pages/Rooms'
import CreatorDashboard from './pages/CreatorDashboard'
import RoomDetails from './pages/RoomDetails'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <CustomCursor />
        <BackgroundAnimation />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameName" element={<GamePage />} />
            <Route path="/room/:roomId" element={<RoomDetails />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <Rooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/create"
              element={
                <ProtectedRoute>
                  <Rooms createMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/join"
              element={
                <ProtectedRoute>
                  <Rooms joinMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute requireCreator>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
