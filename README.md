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
  - 🖱️ **Hover labels** show song names, artist, genre, and listen score in a tooltip
  - 🔗 **Clickable spheres** open tracks in Spotify
  - 🟢 **Larger invisible hover zone** for each sphere for easier interaction
- ⚫️ Clean, responsive, dark-themed UI
- 🖥️ **Sidebar** displays your top genre and summary information
- 🔐 No personal data is stored, saved, or shared — processed entirely in-session

---

## 🖥️ Tech Stack

**Frontend**
- React
- React Router
- React Three Fiber
- Three.js
- @react-three/drei (for 3D helpers and HTML overlays)
- Axios

**Backend**
- Node.js
- Express
- spotify-web-api-node
- dotenv

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

## 📌 To-Do / Future Plans

- 🎥 Add animated orbit demo GIF
- 🌐 Deploy to Netlify / Vercel with environment configs
- 📱 Add mobile layout optimization
- 🎨 Add genre color legend overlay

---

## 🧑‍💻 How It Works

- **Spotify Login:**  
  The app uses Spotify OAuth to access your top tracks and artists. No data is stored on the server.

- **Data Fetching:**  
  The client fetches your top tracks for three time ranges (short, medium, long term) and computes a "listen score" for each track.

- **Genre Assignment:**  
  Each track is assigned a genre based on its artist's top genre.

- **Track Positioning:**  
  Each track is mapped to a position in 3D space based on its index and genre, forming orbits around the center.

- **Sphere Sizing:**  
  The size of each sphere is proportional to the track’s listen score.

- **Hover Detection:**  
  An invisible, larger sphere (1.2x the visible radius) is used for easier hover detection.

- **Tooltip:**  
  When hovering, a tooltip appears at the sphere’s position, showing detailed track info (name, artist, genre, listen score). Tooltips are rendered in 3D space using `<Html>` from Drei and do not block pointer events.

- **Spotify Integration:**  
  Clicking a sphere opens the track’s Spotify page in a new tab.

- **Sidebar:**  
  The right sidebar displays your top genre and summary information.

---

## 🛠️ Customization

- **Tracks and Genres:**  
  Pass your own `tracks` and `genres` data as props to the `OrbitVisualizer` component.

- **Color Palette:**  
  Modify the `colorPalette` array in `OrbitVisualizer.jsx` to change genre colors.

- **Tooltip Styling:**  
  Update the inline styles in the `<Html>` tooltip for a custom look.

- **Orbit Logic:**  
  You can adjust how orbits are calculated in `OrbitVisualizer.jsx`.

---

*For more details, see the code in `src/components/OrbitVisualizer.jsx` and `src/pages/Visualizer.js`.*

---

*Built with ❤️ using React Three Fiber

