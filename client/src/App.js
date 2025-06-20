import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import Callback from './pages/Callback'
import TopSongs from './pages/TopSongs'
import Navbar from './components/Navbar'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

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

  return (
    <Router>
      <header>
        <Navbar />
      </header>
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh - 96px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/topsongs" element={<TopSongs />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#8e8e93', fontWeight: '500', fontSize: '0.875rem', userSelect: 'none' }}>
      </footer>
      <SpaceBackground />
    </Router>
  )
}

export default App
