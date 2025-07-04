
# 🎧 Statify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-orange)](https://threejs.org/)

**Statify** is a dark-themed, interactive web application that visualizes your Spotify listening habits as a 3D soundscape of orbits.  
It’s built with **React**, **Three.js**, **React Three Fiber**, **Node.js**, **Express**, and the **Spotify Web API**.

---

### 🌐 Live Demo: [https://tender-spirit.up.railway.app/](https://tender-spirit.up.railway.app/)

---

## ✨ Features

- 🔒 Secure **Spotify OAuth login**
- 🎵 Fetch **top tracks** across short, medium, and long-term history
- 📝 Apply **weighted scoring** for tracks based on frequency and position
- 🌌 3D Orbit Visualizer:
  - 🎨 Color-coded by **genre**
  - 📏 Sphere size proportional to **listening score**
  - 🌍 Spatial position determined by **track popularity**
  - 🖱️ Hover tooltips with detailed metadata and album art
  - 🔗 Clickable spheres linking directly to Spotify tracks
- 📊 Sidebar summarizing **user highlights**: display name, top genres, top songs, top artist
- 📸 Shareable highlights card with dynamic gradient background
- 🌑 Clean, responsive, dark-themed UI
- 🔐 **Session-only, zero-persistence** data handling

---

## 📊 How It Works (Technical)

- **OAuth Authentication**:  
  Statify uses Spotify’s Authorization Code Flow to obtain an access token via a backend exchange, securely authenticating users and granting access to their top track data.

- **Backend Data Aggregation**:  
  The Node.js/Express backend retrieves top tracks across three time ranges (`short_term`, `medium_term`, `long_term`) using the [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) package. It computes a **weighted listen score** for each track based on occurrence frequency and position across time periods.

- **Artist Genre Mapping**:  
  Each unique track artist is queried via Spotify's API to retrieve genre information. Tracks are then assigned genres based on their primary artist’s top genre for visualization grouping.

- **3D Spatial Mapping Algorithm**:  
  Using **Three.js** and **React Three Fiber**, tracks are distributed within a 3D orbit. Each genre occupies a distinct sector of the orbital space. Track positions within a genre sector are randomized but stable for session consistency, with proximity to the center representing track popularity.

- **Dynamic Sphere Rendering**:  
  Spheres representing tracks scale dynamically based on their listen score. Each is paired with a slightly larger, invisible mesh to extend hover detection areas for improved UX.

- **Interactive Tooltips**:  
  Tooltips rendered using [@react-three/drei’s `<Html>`](https://github.com/pmndrs/drei) component display metadata (track title, artist, genre, listen score, album cover) at the precise 3D coordinate of the corresponding sphere.

- **Spotify Integration**:  
  Clicking a sphere opens the corresponding track’s Spotify page in a new tab.

- **Session Management**:  
  OAuth tokens are stored in `sessionStorage`. Data is fetched, processed, and visualized during the active session only, with no persistence or external storage.

---

## ⚙️ Tech Stack

**Frontend**
- React
- Three.js + React Three Fiber
- React Router DOM
- Axios
- Custom CSS (dark-themed)

**Backend**
- Node.js + Express
- spotify-web-api-node
- CORS (local development only)
- OAuth token exchange handler

---

## 📁 Project Structure

```
/statify
├── /client        # React frontend
│   └── src
│       └── components
│           └── OrbitVisualizer.jsx
├── /server        # Node/Express backend
├── README.md
└── SETUP.md
```

---

## 📦 Deployment

Hosted on [Railway](https://railway.app/).  
To deploy your own instance, follow [SETUP.md](./SETUP.md).

---

## 📊 Privacy & Data Usage

- No personal data is stored, logged, or shared.
- Spotify data is processed entirely in-session in the user’s browser.
- All session data is discarded on logout or tab close.

---

## 🤝 Contributing

Contributions are welcome!  

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📃 License

MIT License © 2025 [lileskimo](https://github.com/lileskimo)

> **Disclaimer:** This project is not affiliated with or endorsed by Spotify.
