# Statify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-orange)](https://threejs.org/)

An interactive, dark-themed web app to visualize your Spotify listening habits using beautiful 3D orbits.  
Built with **React**, **Three.js**, **React Three Fiber**, **Node.js**, **Express**, and the **Spotify Web API**.

---

## 📸 Demo

- Check out the site [here](https://tender-spirit.up.railway.app)

---

## ✨ Features

- 🎵 **Spotify OAuth login** with secure token-based session
- 📊 Fetch your top tracks from **short**, **medium**, and **long-term** listening history
- 📈 Score tracks with a weighted formula for better visualization
- 🌌 Generate a 3D orbit visual:
  - 🎨 Color represents **genre** (unique color per genre, customizable palette)
  - 📏 Size represents **listening frequency** (sphere size scales with listen score)
  - 🌍 Position based on **popularity** (center = popular, outer = obscure)
  - 🖱️ **Hover labels** show song names, artist, genre, listen score, and album art in a tooltip
  - 🔗 **Clickable spheres** open tracks in Spotify
  - 🟢 **Larger invisible hover zone** for each sphere for easier interaction
- ⚫️ Clean, responsive, dark-themed UI
- 🖥️ **Sidebar** displays your Spotify display name, top genres, top songs, and top artist, with a vibrant, shareable card
- 🔐 No personal data is stored, saved, or shared — processed entirely in-session and via your backend

---

## Technical Details

### Frontend

- **Framework:** React
- **3D Visualization:** Three.js via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and [@react-three/drei](https://github.com/pmndrs/drei)
- **Routing:** react-router-dom
- **HTTP:** axios
- **Styling:** CSS (custom, responsive, dark theme)

### Backend

- **Framework:** Node.js + Express
- **Spotify API:** [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- **CORS:** Enabled for local development
- **OAuth Flow:** Handles login, callback, and token exchange

### Data Flow

- **OAuth:** User logs in via Spotify, backend exchanges code for access token, and redirects to frontend with token.
- **Session:** Access token is stored in sessionStorage for the browser session.
- **Data Fetching:** Frontend fetches user profile and top tracks (short, medium, long term) via backend, which aggregates and returns all necessary fields.
- **Visualization:** Tracks are grouped by genre, colored, and positioned in 3D space. Genres with more tracks are spread further out, and spheres are sized by listening score.
- **Highlights Card:** Shows top genre and top song, with a vibrant background and your Spotify display name.

---

## 📂 Project Structure

```
/statify
├── /client        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── OrbitVisualizer.jsx   # Main 3D visualization logic
│   │   └── pages/
│   ├── env.example                   # Client environment variables template
│   └── package.json
├── /server        # Node/Express backend
│   ├── index.js                      # Main server file
│   ├── env.example                   # Server environment variables template
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/lileskimo/statify.git
cd statify
```

---

### 2️⃣ Install dependencies

**Server**
```bash
cd server
npm install
```

**Client**
```bash
cd ../client
npm install
```

---

### 3️⃣ Set up Spotify API credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://127.0.0.1:8888/callback` to your Redirect URIs
4. Copy your **Client ID** and **Client Secret**

---

### 4️⃣ Configure environment variables

**Server Environment Variables**

Create a `.env` file in the `/server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your Spotify credentials:

```ini
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback

# Site URL (used for redirects)
SITE_URL=http://127.0.0.1:3000

# Server Configuration
PORT=8888
```

**Client Environment Variables**

Create a `.env` file in the `/client` directory:

```bash
cd client
cp env.example .env
```

Edit the `.env` file:

```ini
# Backend server URL (where your Express server is running)
REACT_APP_SITE_URL=http://127.0.0.1:8888
REACT_APP_BACKEND_URL=http://127.0.0.1:8888
```

---

### 5️⃣ Start the development servers

**Server**
```bash
cd server
node index.js
```

**Client**
In a new terminal tab:
```bash
cd client
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🔧 Environment Variables Reference

### Server Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPOTIFY_CLIENT_ID` | Your Spotify app Client ID | - | ✅ |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app Client Secret | - | ✅ |
| `SPOTIFY_REDIRECT_URI` | OAuth redirect URI | `http://127.0.0.1:8888/callback` | ✅ |
| `SITE_URL` | Frontend URL for redirects | `http://127.0.0.1:3000` | ✅ |
| `PORT` | Server port | `8888` | ❌ |

### Client Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_SITE_URL` | Backend server URL | `http://127.0.0.1:8888` | ✅ |
| `REACT_APP_BACKEND_URL` | Backend server URL (alternative) | `http://127.0.0.1:8888` | ✅ |

---

## 📊 Privacy & Data Usage

This app uses your Spotify data **only for visualization purposes**.  
No personal data is saved, stored, or shared. All data is processed in-memory during your session and discarded upon closing the app.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. 🍴 Fork this repository
2. 🔀 Create a new branch (`git checkout -b feature/my-feature`)
3. 💾 Commit your changes (`git commit -m 'Add my feature'`)
4. 📤 Push to the branch (`git push origin feature/my-feature`)
5. 📬 Open a Pull Request

---

## 📃 License

MIT License © 2025 [lileskimo](https://github.com/lileskimo)

---

**Statify is not affiliated with or endorsed by Spotify.**

## 🧑‍💻 How It Works

- **Spotify Login:**  
  Statify uses Spotify's OAuth authentication flow. When you log in, you grant the app permission to access your top tracks and recently played tracks. Your access token is stored only in your browser session and is never shared or stored on any server.

- **Data Fetching & Aggregation:**  
  After authentication, the backend fetches your top tracks from Spotify for three time ranges: short term, medium term, and long term. Each track is assigned a "listen score" based on its ranking and frequency across these periods, using a weighted formula to reflect your true listening habits.

- **Genre Assignment:**  
  Each track is assigned a genre based on the top genre of its primary artist. The backend fetches genre information for all unique artists in your top tracks, ensuring accurate genre mapping.

- **3D Visualization:**  
  Tracks are positioned in 3D space using spherical coordinates. Genres with more tracks are spread further out radially, and each sphere's size represents the track's listen score. The visualization uses Three.js for smooth 3D rendering and interaction.

- **Environment Configuration:**  
  The app uses environment variables for all configuration, making it easy to deploy to different environments. Server-side variables handle Spotify API credentials and server settings, while client-side variables configure API endpoints.


