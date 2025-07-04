
# 🚀 Statify — Local Setup Guide

This document provides detailed instructions to run Statify locally.

---

## 🔄 Clone the repository

```bash
git clone https://github.com/lileskimo/statify.git
cd statify
```

---

## 📦 Install Dependencies

### 📌 Server

```bash
cd server
npm install
```

### 📌 Client

```bash
cd ../client
npm install
```

---

## 🔐 Configure Environment Variables

Create a `.env` file inside `/server`:

```ini
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

Optionally, create a `/client/.env` file if overriding the backend URL:

```ini
REACT_APP_BACKEND_URL=http://127.0.0.1:8888
```

---

## ▶️ Start Development Servers

### Start backend server:

```bash
cd server
node index.js
```

### Start frontend client:

In a new terminal:

```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📓 Notes

- Requires **Node.js v18+**
- Works best on **Chrome** or Chromium-based browsers
- No personal data is stored or logged
- Spotify Developer Account needed to obtain API credentials

---

✅ You’re ready to run Statify!
