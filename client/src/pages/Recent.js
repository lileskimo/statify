import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Recent() {
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

    axios.get(`/api/recent`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setTracks(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch recently played tracks.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading your recently played tracks…</div>
  if (error) return <div style={{ color: '#fff', background: '#e03d00', textAlign: 'center', marginTop: '4rem', padding: '1.5rem', borderRadius: 12 }}>{error}</div>

  return (
    <div style={{
      maxWidth: '90vw',
      width: '100%',
      margin: '3rem auto',
      background: 'rgba(28,28,30,0.95)',
      borderRadius: 18,
      padding: 'clamp(1.2rem, 5vw, 2.5rem) clamp(0.5rem, 4vw, 2rem)',
      color: '#fff',
      boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <h2 style={{ fontSize: 'clamp(1.3rem, 6vw, 2.2rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
        Your Recently Played Tracks
      </h2>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        paddingRight: 8,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <ol style={{ padding: 0, margin: 0, listStyle: 'decimal inside', width: '100%', boxSizing: 'border-box' }}>
          {tracks.map((track, i) => (
            <li
              key={track.id + track.playedAt}
              style={{
                marginBottom: '1.2rem',
                padding: '0.7rem 0.5rem',
                borderRadius: 10,
                background: i % 2 === 0 ? 'rgba(48,209,88,0.07)' : 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                justifyContent: 'space-between',
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
                flexWrap: 'wrap',
              }}
            >
              {track.albumImage && (
                <img
                  src={track.albumImage}
                  alt={track.name}
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0004' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.name}</div>
                <div style={{ color: '#b3b3b3', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Artist: {track.artistName}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Played at: {new Date(track.playedAt).toLocaleString()}</div>
                <span className="spotify-btn-mobile" style={{ display: 'none' }}>
                  {track.external_urls?.spotify && (
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: 8,
                        padding: '6px 16px',
                        background: '#1DB954',
                        color: '#fff',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px #0002',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Listen on Spotify
                    </a>
                  )}
                </span>
              </div>
              <span className="spotify-btn-desktop" style={{ display: 'inline-block' }}>
                {track.external_urls?.spotify && (
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginLeft: 16,
                      padding: '6px 16px',
                      background: '#1DB954',
                      color: '#fff',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: '1rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px #0002',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Listen on Spotify
                  </a>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .spotify-btn-desktop { display: none !important; }
          .spotify-btn-mobile { display: inline-block !important; width: 100%; }
        }
      `}</style>
    </div>
  )
}