import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)
  const searchBarRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSearchClick = (e) => {
    e.stopPropagation()
    if (!isOpen) {
      setIsOpen(true)
    } else {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <div className={`search-bar-container ${isOpen ? 'open' : ''}`} ref={searchBarRef}>
      {!isOpen ? (
        <button 
          className="search-icon-btn" 
          onClick={handleSearchClick}
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      ) : (
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search games, events, rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="search-submit-btn" 
            onClick={handleSearch}
            aria-label="Submit search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button 
            className="search-close-btn" 
            onClick={() => {
              setIsOpen(false)
              setSearchTerm('')
            }}
            aria-label="Close search"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar

