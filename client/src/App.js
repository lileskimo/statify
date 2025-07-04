import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import Callback from './pages/Callback'
import TopSongs from './pages/TopSongs'
import Navbar from './components/Navbar'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import React from 'react'

function SpaceBackground() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <Stars
        radius={100} 
        depth={50}   
        count={5000} 
        factor={4}   
        saturation={0}
        fade
        speed={1}
      />
    </Canvas>
  )
}

function App() {
  window.addEventListener('unload', () => {
    sessionStorage.removeItem('spotify_access_token')
  })

  // Add global styles for overflow and box-sizing
  // (This can be moved to App.css if preferred)
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.body.style.boxSizing = 'border-box';
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.boxSizing = 'border-box';
    return () => {
      document.body.style.overflowX = '';
      document.body.style.boxSizing = '';
      document.documentElement.style.overflowX = '';
      document.documentElement.style.boxSizing = '';
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Router>
        <header>
          <Navbar />
        </header>
        <main
          className="container"
          style={{
            paddingLeft: 'max(2vw, 16px)',
            paddingRight: 'max(2vw, 16px)',
            minHeight: 'calc(100vh - 96px)',
            boxSizing: 'border-box',
            flex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/topsongs" element={<TopSongs />} />
          </Routes>
        </main>
        <footer
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#888',
          background: 'rgba(24,24,24,0.92)',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
          zIndex: 100,
          padding: '0.75rem 0',
        }}
      >
        Made by <a href="https://github.com/lileskimo" target="_blank" rel="noopener noreferrer">lileskimo</a>. No data is stored — everything runs locally/in session.
      </footer>
        <SpaceBackground />
      </Router>
    </div>
  )
}

export default App
