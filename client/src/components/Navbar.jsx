import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const token = sessionStorage.getItem('spotify_access_token')
  const navigate = useNavigate()
  const getIsMobile = () => typeof window !== 'undefined' ? window.innerWidth < 600 : false
  const [isMobile, setIsMobile] = useState(getIsMobile())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('spotify_access_token')
    navigate('/')
    window.location.reload() 
  }

  return (
    <nav className="navbar" style={{ position: 'relative', zIndex: 200 }}>
      {isMobile ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Link to="/" style={{ color: '#1DB954', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.03em' }}>
              Statify
            </Link>
            <button
              onClick={() => setMenuOpen(m => !m)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '0 0.5rem',
                lineHeight: 1,
              }}
              aria-label="Toggle navigation menu"
            >
              &#9776;
            </button>
          </div>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(24,24,24,0.98)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '1rem 1.5rem',
              gap: '1rem',
            }}>
              <Link to="/" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/visualizer" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Visualizer
              </Link>
              <Link to="/topsongs" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Top Songs
              </Link>
              <Link to="/info" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Info
              </Link>
              {token && (
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#1DB954', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.03em' }}>
              Statify
            </Link>
            <Link to="/" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Home
            </Link>
            <Link to="/visualizer" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Visualizer
            </Link>
            <Link to="/topsongs" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Top Songs
            </Link>
            <Link to="/info" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Info
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
        </>
      )}
    </nav>
  )
}

export default Navbar