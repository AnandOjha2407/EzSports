import React, { useState, useEffect } from 'react'
import './AnalyticsDashboard.css'

const AnalyticsDashboard = ({ rooms = [] }) => {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  // Generate mock analytics data
  const generateMockAnalytics = (room) => {
    if (!room) return null

    // Generate viewer data over time (24 hours, hourly)
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const viewerData = hours.map((hour) => {
      // Simulate viewer pattern - peak during certain hours
      const baseViewers = Math.floor(Math.random() * 50) + 10
      const peakMultiplier = hour >= 18 && hour <= 22 ? 3 : hour >= 12 && hour <= 14 ? 2 : 1
      return {
        time: `${hour}:00`,
        viewers: Math.floor(baseViewers * peakMultiplier),
        timestamp: new Date(Date.now() - (24 - hour) * 60 * 60 * 1000).toISOString(),
      }
    })

    const peakViewers = Math.max(...viewerData.map(d => d.viewers))
    const averageViewers = Math.floor(viewerData.reduce((sum, d) => sum + d.viewers, 0) / viewerData.length)
    const totalViewers = viewerData.reduce((sum, d) => sum + d.viewers, 0)

    // Generate subs gain data
    const subsGain = Math.floor(Math.random() * 50) + 10
    const subsLost = Math.floor(Math.random() * 5)
    const netSubs = subsGain - subsLost

    return {
      roomId: room.id,
      roomName: room.roomName,
      viewerData,
      peakViewers,
      averageViewers,
      totalViewers,
      subsGain,
      subsLost,
      netSubs,
      watchTime: Math.floor(totalViewers * 0.5), // hours
      engagement: Math.floor(Math.random() * 30) + 70, // percentage
      retention: Math.floor(Math.random() * 20) + 60, // percentage
    }
  }

  useEffect(() => {
    if (selectedRoom) {
      const mockAnalytics = generateMockAnalytics(selectedRoom)
      setAnalytics(mockAnalytics)
    } else if (rooms.length > 0) {
      // Auto-select first room
      setSelectedRoom(rooms[0])
      const mockAnalytics = generateMockAnalytics(rooms[0])
      setAnalytics(mockAnalytics)
    }
  }, [selectedRoom, rooms])

  if (rooms.length === 0) {
    return (
      <div className="analytics-dashboard">
        <div className="empty-state">
          <p>No rooms available for analytics. Create a room first!</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="analytics-dashboard">Loading analytics...</div>
  }

  // Find max viewers for scaling the graph
  const maxViewers = Math.max(...analytics.viewerData.map(d => d.viewers))

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Room Analytics</h2>
        <select
          className="room-selector"
          value={selectedRoom?.id || ''}
          onChange={(e) => {
            const room = rooms.find(r => r.id === e.target.value)
            setSelectedRoom(room)
          }}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.roomName} ({room.gameType.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      <div className="analytics-stats-grid">
        <div className="stat-box">
          <div className="stat-label">Peak Viewers</div>
          <div className="stat-value">{analytics.peakViewers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Average Viewers</div>
          <div className="stat-value">{analytics.averageViewers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Viewers</div>
          <div className="stat-value">{analytics.totalViewers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Net Subs</div>
          <div className="stat-value positive">{analytics.netSubs > 0 ? '+' : ''}{analytics.netSubs}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Watch Time</div>
          <div className="stat-value">{analytics.watchTime}h</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Engagement</div>
          <div className="stat-value">{analytics.engagement}%</div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Viewers Over Time (24 Hours)</h3>
          <div className="viewer-chart">
            <div className="chart-bars">
              {analytics.viewerData.map((data, index) => {
                const height = (data.viewers / maxViewers) * 100
                return (
                  <div key={index} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${data.time}: ${data.viewers} viewers`}
                    >
                      <span className="bar-value">{data.viewers}</span>
                    </div>
                    <div className="bar-label">{data.time.split(':')[0]}</div>
                  </div>
                )
              })}
            </div>
            <div className="chart-axis-y">
              <span>{maxViewers}</span>
              <span>{Math.floor(maxViewers / 2)}</span>
              <span>0</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Subscriber Growth</h3>
          <div className="subs-chart">
            <div className="subs-metric">
              <div className="subs-gain">
                <span className="subs-label">Gained</span>
                <span className="subs-value positive">+{analytics.subsGain}</span>
              </div>
              <div className="subs-lost">
                <span className="subs-label">Lost</span>
                <span className="subs-value negative">-{analytics.subsLost}</span>
              </div>
              <div className="subs-net">
                <span className="subs-label">Net</span>
                <span className={`subs-value ${analytics.netSubs > 0 ? 'positive' : 'negative'}`}>
                  {analytics.netSubs > 0 ? '+' : ''}{analytics.netSubs}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-label">Retention Rate</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${analytics.retention}%` }}
                >
                  {analytics.retention}%
                </div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Engagement Rate</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${analytics.engagement}%` }}
                >
                  {analytics.engagement}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard

