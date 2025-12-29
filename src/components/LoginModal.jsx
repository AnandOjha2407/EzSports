import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './LoginModal.css'

const LoginModal = ({ show, onClose }) => {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    role: 'player', // 'creator' or 'player'
  })

  if (!show) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields')
      return
    }
    
    if (!isLogin) {
      // Signup
      if (!formData.username) {
        alert('Please enter a username')
        return
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return
      }
      
      // Try API first, fallback to mock
      try {
        const { authService } = await import('../services/api')
        
        try {
          const response = await authService.register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          })
          
          // API success - combine user and token
          const userData = response.user || response
          if (response.token) {
            userData.token = response.token
          }
          login(userData)
          alert('Account created successfully!')
          onClose()
          // Reset form
          setFormData({
            email: '',
            password: '',
            username: '',
            confirmPassword: '',
            role: 'player',
          })
        } catch (apiError) {
          // If API fails, use mock data
          const isNetworkError = 
            apiError.message?.includes('Failed to fetch') || 
            apiError.message?.includes('Backend server is not available') ||
            apiError.name === 'TypeError'
          
          if (isNetworkError) {
            console.warn('Backend not available, using local storage:', apiError)
            
            // Use storage service
            const { userStorage } = await import('../services/storage')
            
            try {
              const response = await userStorage.create({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
              })
              const newUser = response.user || response
              
              // Remove password from user object
              const { password: _, ...userData } = newUser
              const userWithToken = {
                ...userData,
                token: 'mock-token-' + Date.now(),
              }
              
              login(userWithToken)
              alert('Account created successfully!\n\nNote: In incognito mode, your account is stored only in this session. To use it in normal browsing, please sign up in a regular browser window.')
              onClose()
              // Reset form
              setFormData({
                email: '',
                password: '',
                username: '',
                confirmPassword: '',
                role: 'player',
              })
            } catch (storageError) {
              alert(storageError.message || 'Failed to create account')
            }
          } else {
            throw apiError
          }
        }
      } catch (error) {
        console.error('Signup error:', error)
        alert(`Signup failed: ${error.message || 'Please try again.'}`)
      }
    } else {
      // Login
      try {
        const { authService } = await import('../services/api')
        
        try {
          const response = await authService.login(formData.email, formData.password)
          
          // API success - combine user and token
          const userData = response.user || response
          if (response.token) {
            userData.token = response.token
          }
          login(userData)
          alert('Logged in successfully!')
          onClose()
          // Reset form
          setFormData({
            email: '',
            password: '',
            username: '',
            confirmPassword: '',
            role: 'player',
          })
        } catch (apiError) {
          // If API fails, check mock users
          const isNetworkError = 
            apiError.message?.includes('Failed to fetch') || 
            apiError.message?.includes('Backend server is not available') ||
            apiError.name === 'TypeError'
          
          if (isNetworkError) {
            console.warn('Backend not available, checking local storage:', apiError)
            
            // Use storage service
            const { userStorage } = await import('../services/storage')
            const user = await userStorage.authenticate(formData.email, formData.password)
            
            if (user) {
              const userWithToken = {
                ...user,
                token: 'mock-token-' + Date.now(),
              }
              login(userWithToken)
              alert('Logged in successfully!')
              onClose()
              // Reset form
              setFormData({
                email: '',
                password: '',
                username: '',
                confirmPassword: '',
                role: 'player',
              })
            } else {
              alert('Invalid email or password!\n\nNote: In incognito mode, you can only log in with accounts created in the same incognito session. Each incognito window has its own separate storage.')
            }
          } else {
            // API returned an error (wrong credentials, etc.)
            alert(apiError.message || 'Login failed. Please check your credentials.')
          }
        }
      } catch (error) {
        console.error('Login error:', error)
        alert(`Login failed: ${error.message || 'Please try again.'}`)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ 
        display: 'flex', 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="modal-subtitle">
            {isLogin ? 'Log in to continue to EZSports' : 'Join the EZSports community'}
          </p>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setFormData({
                email: '',
                password: '',
                username: '',
                confirmPassword: '',
                role: 'player',
              })
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setFormData({
                email: '',
                password: '',
                username: '',
                confirmPassword: '',
                role: 'player',
              })
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="form-group">
                <label>I want to be a *</label>
                <div className="role-selection">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="player"
                      checked={formData.role === 'player'}
                      onChange={handleChange}
                      required
                    />
                    <span>Player</span>
                    <small>Join rooms and watch streams</small>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="creator"
                      checked={formData.role === 'creator'}
                      onChange={handleChange}
                      required
                    />
                    <span>Creator</span>
                    <small>Create rooms and share credentials</small>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={isLogin ? undefined : 6}
            />
            {!isLogin && (
              <small className="form-hint">Password must be at least 6 characters</small>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

          <div className="form-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.305-2.386 4.348-.198.138-.406.24-.612.314-.169.062-.343.11-.52.15-.18.04-.362.07-.544.09-.18.02-.362.03-.544.03-.18 0-.36-.01-.54-.03-.18-.02-.362-.05-.54-.09-.18-.04-.35-.088-.52-.15-.206-.074-.414-.176-.612-.314-1.49-1.043-2.217-2.49-2.386-4.348-.02-.18-.03-.36-.03-.54 0-.18.01-.36.03-.54.169-1.858.896-3.305 2.386-4.348.198-.138.406-.24.612-.314.169-.062.343-.11.52-.15.18-.04.362-.07.544-.09.18-.02.362-.03.544-.03.18 0 .36.01.54.03.18.02.362.05.54.09.18.04.35.088.52.15.206.074.414.176.612.314 1.49 1.043 2.217 2.49 2.386 4.348.02.18.03.36.03.54 0 .18-.01.36-.03.54z"/>
              </svg>
              Discord
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal

