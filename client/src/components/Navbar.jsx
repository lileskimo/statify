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
    <nav
      className="navbar"
      style={{
        position: 'relative',
        zIndex: 200,
        background: 'linear-gradient(120deg, rgba(34, 40, 49, 0.32) 0%, rgba(24, 24, 24, 0.48) 100%)',
        borderRadius: '22px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(30,255,180,0.08)',
        margin: '18px auto 0 auto',
        maxWidth: '1200px',
        width: 'calc(100vw - 32px)',
        paddingLeft: '3vw',
        paddingRight: '3vw',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '2px solid rgba(255,255,255,0.22)',
        boxSizing: 'border-box',
        transition: 'background 0.3s, box-shadow 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
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
              top: 'calc(100% + 2vh)', // increased gap below navbar
              left: 0,
              right: 0,
              background: 'linear-gradient(120deg, rgba(34, 40, 49, 0.88) 0%, rgba(24, 24, 24, 0.96) 100%)',
              border: '2px solid rgba(255,255,255,0.22)',
              borderRadius: '22px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(30,255,180,0.08)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '1rem 1.5rem',
              gap: '1rem',
              zIndex: 300,
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
              <Link to="/recent" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Recently Played
              </Link>
              <Link to="/wrapped-predictor" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>
                Wrapped Predictor
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
            <Link to="/recent" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Recently Played
            </Link>
            <Link to="/wrapped-predictor" style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
              Wrapped Predictor
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