// Utility to check and auto-go-live for scheduled rooms
// This should be called periodically or on page load

export const checkAndAutoGoLive = async () => {
  try {
    const { roomStorage, streamStorage } = await import('../services/storage')
    const rooms = await roomStorage.getAll()
    const now = new Date()
    
    // Find rooms that should go live
    const roomsToGoLive = rooms.filter(room => {
      if (room.status !== 'scheduled') return false
      if (!room.scheduledTime) return false
      
      const scheduledDate = new Date(room.scheduledTime)
      // Go live if scheduled time has passed (within last 24 hours to avoid old rooms)
      const timeDiff = now - scheduledDate
      return timeDiff >= 0 && timeDiff < 24 * 60 * 60 * 1000 // Within 24 hours
    })
    
    // Auto-go-live for each room
    for (const room of roomsToGoLive) {
      try {
        // Update room status
        await roomStorage.goLive(room.id || room._id)
        
        // Create stream if stream links exist
        if (room.streamLinks && (room.streamLinks.youtube || room.streamLinks.twitch)) {
          const platform = room.streamLinks.youtube ? 'youtube' : 'twitch'
          const streamUrl = room.streamLinks.youtube || room.streamLinks.twitch
          
          // Check if stream already exists
          const existingStreams = await streamStorage.getAll()
          const existingStream = existingStreams.find(s => 
            (s.creatorId === room.creatorId || s.creatorId?._id?.toString() === room.creatorId?.toString()) && 
            s.gameType === room.gameType &&
            s.streamUrl === streamUrl &&
            s.isLive
          )
          
          if (!existingStream) {
            await streamStorage.create({
              creatorId: room.creatorId,
              creatorUsername: room.creatorUsername,
              platform: platform,
              title: `${room.roomName} - Live Stream`,
              description: room.description || '',
              streamUrl: streamUrl,
              gameType: room.gameType,
              isLive: true,
            })
          }
        }
        
        console.log(`Auto-go-live: Room ${room.roomName} is now live`)
      } catch (error) {
        console.error(`Error auto-going-live for room ${room.id}:`, error)
      }
    }
    
    return roomsToGoLive.length
  } catch (error) {
    console.error('Error checking auto-go-live:', error)
    return 0
  }
}

// Run check on import (for initial load)
checkAndAutoGoLive()

// Set up interval to check every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    checkAndAutoGoLive()
  }, 60000) // Check every minute
}

