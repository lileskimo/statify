import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const token = sessionStorage.getItem('spotify_access_token')
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('spotify_access_token')
    navigate('/')
    window.location.reload() // Ensures all state is cleared
  }

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ color: '#1DB954', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.03em' }}>
          Statify
        </Link>
        <Link to="/visualizer" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
          Visualizer
        </Link>
      </div>
      <div style={{ fontSize: '1rem', color: '#b3b3b3', fontWeight: 400 }}>
        {token && (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '1.5rem'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
//helo

export default Navbar