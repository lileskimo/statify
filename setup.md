# Quick Environment Setup Guide

## 🚀 Quick Start

### 1. Server Setup

```bash
cd server
cp env.example .env
```

Edit `server/.env` with your Spotify credentials:

```ini
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
SITE_URL=http://127.0.0.1:3000
PORT=8888
```

### 2. Client Setup

```bash
cd client
cp env.example .env
```

Edit `client/.env`:

```ini
REACT_APP_SITE_URL=http://127.0.0.1:8888
REACT_APP_BACKEND_URL=http://127.0.0.1:8888
```

### 3. Get Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://127.0.0.1:8888/callback` to Redirect URIs
4. Copy Client ID and Client Secret to your `server/.env`

### 4. Start the App

```bash
# Terminal 1 - Server
cd server
node index.js

# Terminal 2 - Client  
cd client
npm start
```

Visit `http://localhost:3000` to use the app!

## 🔧 Environment Variables Explained

### Server Variables
- `SPOTIFY_CLIENT_ID`: Your Spotify app ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify app secret  
- `SPOTIFY_REDIRECT_URI`: OAuth callback URL
- `SITE_URL`: Frontend URL for redirects
- `PORT`: Server port (default: 8888)

### Client Variables
- `REACT_APP_SITE_URL`: Backend server URL
- `REACT_APP_BACKEND_URL`: Alternative backend URL

## 🆘 Troubleshooting

- **"Missing access token"**: Make sure you're logged in via Spotify
- **"Failed to fetch tracks"**: Check your Spotify credentials in `server/.env`
- **CORS errors**: Ensure the server is running on the correct port
- **Build errors**: Make sure all environment variables are set in `client/.env` 