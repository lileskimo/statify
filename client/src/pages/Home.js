import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => sessionStorage.getItem('spotify_access_token'))

  useEffect(() => {
    // Save token from query string if present
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    if (accessToken) {
      sessionStorage.setItem('spotify_access_token', accessToken)
      setToken(accessToken)
      window.history.replaceState({}, document.title, '/')
    } else {
      // If no token in URL, check sessionStorage
      setToken(sessionStorage.getItem('spotify_access_token'))
    }
  }, [])

  const handleLogin = () => {
    window.location.href = '/api/login'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '94vw',
        background: 'transparent',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Announcement Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          textAlign: 'center',
          padding: '0.5rem 0',
          background: 'rgba(40,40,40,0.4)',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          fontSize: '0.95rem',
          fontFamily: 'monospace',
          zIndex: 10,
        }}
      >

        This app uses your Spotify data for visualization purposes only. No personal data is stored, saved, or shared.
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          zIndex: 10,
          marginTop: '5rem',
        }}
      >
        Travel across your Spotify Soundscape
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: '#6b7280',
          fontSize: '1.25rem',
          marginTop: '1rem',
          textAlign: 'center',
          maxWidth: '40rem',
          zIndex: 10,
        }}
      >
        Statify powers Spotify analytics and visual data experiences, right in your browser.
      </p>

      {/* Main Action Area */}
      <div style={{ marginTop: '2.5rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {!token ? (
          <>
            <button
              onClick={handleLogin}
              style={{
                background: '#1DB954',
                color: 'black',
                fontSize: '1.125rem',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#e03d00')}
              onMouseOut={e => (e.currentTarget.style.background = '#1DB954')}
            >
              Login with Spotify
            </button>
            <span style={{ color: '#b3b3b3', fontSize: '0.98rem', marginTop: '0.5rem', textAlign: 'center', maxWidth: 340 }}>
              Drop an email here (<a href="mailto:kaustubh.salodkar13@gmail.com" style={{ color: '#1DB954', textDecoration: 'underline' }}>kaustubh.salodkar13@gmail.com</a>) with your Spotify associated email ID if you are using Statify for the first time. We will notify you once access is enabled from our end.
            </span>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/visualizer')}
              style={{
                background: '#222',
                color: '#fff',
                fontSize: '1.125rem',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1DB954')}
              onMouseOut={e => (e.currentTarget.style.background = '#222')}
            >
              Visualizer
            </button>
            <button
              onClick={() => navigate('/topsongs')}
              style={{
                background: '#222',
                color: '#fff',
                fontSize: '1.125rem',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1DB954')}
              onMouseOut={e => (e.currentTarget.style.background = '#222')}
            >
              Top Songs
            </button>
            <button
              onClick={() => navigate('/recent')}
              style={{
                background: '#222',
                color: '#fff',
                fontSize: '1.125rem',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1DB954')}
              onMouseOut={e => (e.currentTarget.style.background = '#222')}
            >
              Recently Played
            </button>
            <span style={{ color: '#b3b3b3', fontSize: '1rem', marginTop: '1.2rem', textAlign: 'center', maxWidth: 340 }}>
              Check the <a href="/info" style={{ color: '#1DB954', textDecoration: 'underline' }}>Info</a> page to know more about how to use and understand Statify.
            </span>
          </>
        )}
      </div>
    </div>
  )
}
