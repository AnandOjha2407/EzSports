// Game-specific credential field configurations

export const gameCredentialFields = {
  bgmi: {
    fields: [
      { name: 'roomId', label: 'Room ID', type: 'text', required: true, placeholder: 'Enter Room ID' },
      { name: 'password', label: 'Password', type: 'text', required: true, placeholder: 'Enter Password' },
      { name: 'map', label: 'Map', type: 'select', required: false, options: ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik'] },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['Classic', 'TDM', 'Arcade', 'Arena'] },
    ],
    displayFormat: (creds) => `Room ID: ${creds.roomId} | Password: ${creds.password}`,
  },
  codm: {
    fields: [
      { name: 'roomCode', label: 'Room Code', type: 'text', required: true, placeholder: 'Enter 6-digit code', maxLength: 6 },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['TDM', 'Domination', 'Hardpoint', 'Search & Destroy', 'Battle Royale'] },
      { name: 'map', label: 'Map', type: 'text', required: false, placeholder: 'Map name' },
    ],
    displayFormat: (creds) => `Room Code: ${creds.roomCode}`,
  },
  valorant: {
    fields: [
      { name: 'roomCode', label: 'Room Code', type: 'text', required: true, placeholder: 'Enter Room Code' },
      { name: 'region', label: 'Region', type: 'select', required: false, options: ['Asia Pacific', 'Europe', 'North America', 'Latin America', 'Korea'] },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['Unrated', 'Competitive', 'Spike Rush', 'Deathmatch'] },
    ],
    displayFormat: (creds) => `Room Code: ${creds.roomCode}${creds.region ? ` | Region: ${creds.region}` : ''}`,
  },
  freefire: {
    fields: [
      { name: 'roomId', label: 'Room ID', type: 'text', required: true, placeholder: 'Enter Room ID' },
      { name: 'password', label: 'Password', type: 'text', required: false, placeholder: 'Enter Password (if any)' },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['Battle Royale', 'Clash Squad', 'Ranked'] },
    ],
    displayFormat: (creds) => `Room ID: ${creds.roomId}${creds.password ? ` | Password: ${creds.password}` : ''}`,
  },
  minecraft: {
    fields: [
      { name: 'serverIp', label: 'Server IP', type: 'text', required: true, placeholder: 'e.g., play.example.com' },
      { name: 'port', label: 'Port', type: 'number', required: false, placeholder: '25565 (default)' },
      { name: 'version', label: 'Version', type: 'text', required: false, placeholder: 'e.g., 1.20.1' },
    ],
    displayFormat: (creds) => `Server: ${creds.serverIp}${creds.port ? `:${creds.port}` : ''}`,
  },
  fortnite: {
    fields: [
      { name: 'roomCode', label: 'Room Code', type: 'text', required: true, placeholder: 'Enter Room Code' },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['Battle Royale', 'Creative', 'Save the World'] },
    ],
    displayFormat: (creds) => `Room Code: ${creds.roomCode}`,
  },
  pubg: {
    fields: [
      { name: 'roomId', label: 'Room ID', type: 'text', required: true, placeholder: 'Enter Room ID' },
      { name: 'password', label: 'Password', type: 'text', required: true, placeholder: 'Enter Password' },
      { name: 'map', label: 'Map', type: 'select', required: false, options: ['Erangel', 'Miramar', 'Sanhok', 'Vikendi'] },
      { name: 'mode', label: 'Mode', type: 'select', required: false, options: ['TPP', 'FPP'] },
    ],
    displayFormat: (creds) => `Room ID: ${creds.roomId} | Password: ${creds.password}`,
  },
}

export const getGameFields = (gameType) => {
  return gameCredentialFields[gameType] || gameCredentialFields.bgmi
}

export const formatCredentials = (gameType, credentials) => {
  const config = gameCredentialFields[gameType]
  if (config && config.displayFormat) {
    return config.displayFormat(credentials)
  }
  return JSON.stringify(credentials)
}

