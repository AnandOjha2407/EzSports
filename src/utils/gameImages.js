// Utility to get game-specific images
// Returns { normal, hover } image paths based on game type

export const getGameImages = (gameType) => {
  const game = gameType?.toLowerCase() || ''
  
  // Map game types to their image files
  const imageMap = {
    'free_fire': {
      normal: '/images/free_fire.jpeg',
      hover: '/images/free_fire.gif',
      hasToggle: false, // Use gif on hover
    },
    'free fire': {
      normal: '/images/free_fire.jpeg',
      hover: '/images/free_fire.gif',
      hasToggle: false,
    },
    'freefire': {
      normal: '/images/free_fire.jpeg',
      hover: '/images/free_fire.gif',
      hasToggle: false,
    },
    'valorant': {
      normal: '/images/valorant.jpg',
      hover: '/images/valorant.gif',
      hasToggle: false,
    },
    'bgmi': {
      normal: '/images/bgmi.jpg',
      hover: '/images/bgmi.gif',
      hasToggle: false,
    },
    'fortnite': {
      normal: '/images/fortnite.jpg',
      hover: '/images/fortnite1.jpg',
      hasToggle: true, // Toggle between two jpg images
    },
    'minecraft': {
      normal: '/images/minecraft.jpg',
      hover: '/images/minecraft.png',
      hasToggle: true, // Toggle between jpg and png
    },
  }
  
  // Default fallback
  const defaultImages = {
    normal: '/images/bgmi.jpg',
    hover: '/images/bgmi.gif',
    hasToggle: false,
  }
  
  return imageMap[game] || defaultImages
}

