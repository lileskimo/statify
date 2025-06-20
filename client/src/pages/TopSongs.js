import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function TopSongs() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('spotify_access_token')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const token = sessionStorage.getItem('spotify_access_token')
    if (!token) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    axios.get('http://localhost:8888/tracks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTracks(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch top tracks.')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{
      color: '#fff',
      textAlign: 'center',
      marginTop: '4rem',
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.03em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      <div className="loader" style={{
        border: '6px solid #222',
        borderTop: '6px solid #1DB954',
        borderRadius: '50%',
        width: 48,
        height: 48,
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <span>Loading your top Spotify tracks…</span>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  )
  if (error) return (
    <div style={{
      color: '#fff',
      background: 'linear-gradient(90deg, #e03d00 0%, #ff6b6b 100%)',
      textAlign: 'center',
      marginTop: '4rem',
      fontSize: '1.3rem',
      fontWeight: 600,
      borderRadius: 12,
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      maxWidth: 420,
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <span role="img" aria-label="error" style={{ fontSize: '2rem', marginRight: 10 }}>⚠️</span>
      {error}
    </div>
  )

  return (
    <div style={{
      maxWidth: 800,
      margin: '3rem auto',
      background: 'rgba(28,28,30,0.95)',
      borderRadius: 18,
      padding: '2.5rem 2rem',
      color: '#fff',
      boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
      height: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
        justifyContent: 'center'
    }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
        Your Top 50 Spotify Songs <span style={{ fontWeight: 400, fontSize: '1.2rem' }}>(Past Year)</span>
      </h2>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        paddingRight: 8
      }}>
        <ol style={{ padding: 0, margin: 0, listStyle: 'decimal inside' }}>
          {tracks.map((track, i) => (
            <li key={track.id || (track.name + i)} style={{
              marginBottom: '1.2rem',
              padding: '0.7rem 0.5rem',
              borderRadius: 10,
              background: i % 2 === 0 ? 'rgba(48,209,88,0.07)' : 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem'
            }}>
              {track.albumImage && (
                <img
                  src={track.albumImage}
                  alt={track.name}
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0004' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{track.name}</div>
                <div style={{ color: '#b3b3b3', fontSize: '1rem' }}>Genre: {track.genre}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Score: {track.listenScore}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default TopSongs