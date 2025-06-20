# 🎧 Statify — Spotify Listening Visualizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-orange)](https://threejs.org/)

An interactive, dark-themed web app to visualize your Spotify listening habits using beautiful 3D orbits.  
Built with **React**, **Three.js**, **React Three Fiber**, **Node.js**, **Express**, and the **Spotify Web API**.

---

## 📸 Demo

> _Coming Soon — animated preview GIF / Netlify/Vercel live link here_

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
│   └── src
│       └── components
│           └── OrbitVisualizer.jsx   # Main 3D visualization logic
├── /server        # Node/Express backend
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

### 3️⃣ Set up environment variables

Create a `.env` file in the `/server` directory:

```ini
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

Optionally, if needed in `/client/.env`:

```ini
REACT_APP_BACKEND_URL=http://127.0.0.1:8888
```

---

### 4️⃣ Start the development servers

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

- **3D Track Positioning:**  
  Tracks are grouped by genre and distributed in 3D space using a custom orbit algorithm. Each genre occupies a distinct sector of the orbit, and genres with more tracks are spread further outwards to reduce crowding. The position of each track within its genre's region is randomized but stable, creating a visually appealing and informative soundscape.

- **Dynamic Sphere Sizing:**  
  The size of each sphere is directly proportional to the track’s listen score, visually emphasizing your most-played tracks. Spheres are now 1.25x larger for improved visibility.

- **Enhanced Hover Detection:**  
  For a smooth user experience, each visible sphere is paired with a slightly larger, invisible sphere (1.2x the visible radius) to make hover detection easier and more forgiving.

- **Interactive Tooltips:**  
  Hovering over a sphere displays a tooltip at the sphere’s 3D position, rendered using Drei's `<Html>` component. The tooltip shows detailed information: track name, artist, genre, listen score, and album cover. Tooltips are styled to match Spotify’s theme and do not block pointer events.

- **Spotify Integration:**  
  Clicking on a sphere opens the corresponding track’s Spotify page in a new browser tab, allowing you to listen instantly.

- **Shareable Highlights Card:**  
  The right sidebar displays a vibrant, shareable card featuring your Spotify display name, top genres, top songs, and top artist. The card background uses a randomly generated, visually appealing gradient.

- **Responsive Sidebar:**  
  The sidebar is always visible on the right, summarizing your listening highlights and adapting to different screen sizes.

- **Session & Account Handling:**  
  Logging out clears your session and logs you out of Spotify, allowing you to safely switch accounts. All data is cleared from your browser session on logout or tab close.


