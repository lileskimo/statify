
# Statify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-orange)](https://threejs.org/)

**Statify** is an interactive web application that visualizes your Spotify listening habits as a 3D soundscape.  
It’s built with **React**, **Three.js**, **React Three Fiber**, **Node.js**, **Express**, and the **Spotify Web API**.

---

### Live Demo: [https://tender-spirit.up.railway.app/](https://tender-spirit.up.railway.app/)
(Send over the e-mail ID associated with your Spotify account to use the live demo)

---

## Features

- Secure **Spotify OAuth login**
- Fetch **top tracks** across short, medium, and long-term history
- 3D Orbit Visualizer:
  - Sphere size proportional to **listening score**
  - Spatial position and color determined by **genre**
  - Tooltips with detailed metadata, album art and Spotify track link
- Card summarizing **user highlights**: display name, top genres, top songs, top artist
- Clean, responsive, dark-themed UI
- **Session-only, zero-persistence** data handling

---

## How It Works

- **OAuth Authentication**:  
  Uses Spotify’s Authorization Code Flow to securely exchange an auth code for an access token via the backend.

- **Data Aggregation**:  
  The backend fetches top tracks for `short_term`, `medium_term`, and `long_term` ranges, calculating a weighted listen score based on frequency and ranking.

- **Genre Mapping**:  
  Artist genres are fetched via the Spotify API, and tracks are categorized by their primary artist’s top genre.

- **3D Spatial Layout**:  
  Tracks are distributed in a 3D orbit using Three.js and React Three Fiber. Genres occupy distinct sectors.

- **Dynamic Sphere Scaling**:  
  Sphere sizes correspond to listen scores, with larger invisible hitboxes for better click detection.

- **Interactive Tooltips**:  
  Clicking a sphere displays metadata via Drei’s `<Html>` at the sphere’s 3D position.

- **Spotify Linking**:  
  Clicking a sphere opens the track tooltip with details and Spotify link for the associated song.

- **Session-Scoped Data**:  
  Access tokens and data are stored in `sessionStorage` and cleared on logout or tab close.


---

## Tech Stack

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

## 📦 Local Setup

To setup Statify on your device, follow [SETUP.md](./SETUP.md).

---

## Privacy & Data Usage

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
