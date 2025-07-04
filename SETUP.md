
# 🚀 Statify — Local Setup & Deployment Guide

This document provides detailed instructions to run Statify locally and deploy it via Railway.

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

## 📦 Deploying to Railway

1. Push your project to GitHub
2. Sign up at [https://railway.app/](https://railway.app/)
3. Create a new project and connect your GitHub repository
4. Add environment variables for the server service:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI` (use your Railway backend URL + `/callback`)
5. Deploy both frontend and backend services
6. Update your frontend’s `REACT_APP_BACKEND_URL` if necessary in Railway settings or client `.env`

---

## 📓 Notes

- Requires **Node.js v18+**
- Works best on **Chrome** or Chromium-based browsers
- No personal data is stored or logged
- Spotify Developer Account needed to obtain API credentials

---

✅ You’re ready to run Statify!
