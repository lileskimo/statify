import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import Callback from './pages/Callback'
//import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
      <footer style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
        <small>
          This app uses your Spotify data for visualization purposes only. No personal data is stored, saved, or shared.
        </small>
      </footer>
    </Router>
  )
}

export default App
