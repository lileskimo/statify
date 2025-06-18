import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import Callback from './pages/Callback'
// import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      {/* Navbar placeholder */}
      {/* <header className="navbar">
        <Navbar />
      </header> */}

      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: 'calc(100vh - 96px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/visualizer" element={<Visualizer />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#8e8e93', fontWeight: '500', fontSize: '0.875rem', userSelect: 'none' }}>
        <small>
          This app uses your Spotify data for visualization purposes only. No personal data is stored, saved, or shared.
        </small>
      </footer>
    </Router>
  )
}

export default App
