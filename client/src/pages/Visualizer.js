import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { colorPalette, getGenreColor } from '../utils/genreColors'
import { useNavigate } from 'react-router-dom'

function Visualizer() {
  const navigate = useNavigate()
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [topGenres, setTopGenres] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [topArtist, setTopArtist] = useState('')
  const [userName, setUserName] = useState('Your')

  const cardHue = useMemo(() => Math.floor(Math.random() * 360), [])
  const cardColor = useMemo(() => colorPalette[Math.floor(Math.random() * colorPalette.length)], [])

  useEffect(() => {
    if (!sessionStorage.getItem('spotify_access_token')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const token = sessionStorage.getItem('spotify_access_token')
    if (!token) return

    // Fetch user profile for display name from backend
    axios.get('https://statify.up.railway.app/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserName(res.data.display_name || 'Your')
      }).catch(() => setUserName('Your'))

    // Fetch processed tracks from backend
    axios.get('https://statify.up.railway.app/tracks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const finalTracks = res.data
        setTracks(finalTracks)

        // Top genres (sorted by count)
        const genreCounts = {}
        finalTracks.forEach(track => {
          const genre = track.genre
          if (genre !== 'unknown') {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
          }
        })
        const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
        setGenres(Object.keys(genreCounts))
        setTopGenres(sortedGenres.slice(0, 3).map(([genre]) => genre))

        // Top songs (by listenScore)
        setTopSongs(finalTracks.slice(0, 3).map(t => `${t.name} by ${t.artistName}`))

        // Top artist (most frequent in top tracks)
        const artistCounts = {}
        finalTracks.forEach(track => {
          artistCounts[track.artistName] = (artistCounts[track.artistName] || 0) + 1
        })
        const sortedArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])
        setTopArtist(sortedArtists.length ? sortedArtists[0][0] : '')
      })
      .catch((err) => {
        console.error('Fetch error:', err)
      })
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
      borderTop: '2px solid rgba(255,255,255,0.12)',
      borderRight: '2px solid rgba(255,255,255,0.12)',
      borderBottom: '2px solid rgba(255,255,255,0.12)',
      background: 'transparent',
      padding: '48px 32px 48px 32px',
      boxSizing: 'border-box',
      gap: '80px'
    }}>
      <div style={{
        flex: '0 1 900px',
        width: 'min(900px, 90vw)',
        height: 'min(80vh, 80vw)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.02em',
          marginBottom: '18px'
        }}>
          Your Spotify Soundscape
        </div>
        <div style={{
          flex: '1 1 auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: '18px',
          boxShadow: '0 6px 28px rgba(0,0,0,0.25)'
        }}>
          <OrbitVisualizer tracks={tracks} genres={genres} />
        </div>
      </div>
      {/* Shareable Card on the right */}
      <div
        style={{
          alignSelf: 'center',
          marginTop: 0,
          marginBottom: 0,
          display: 'inline-block',
          padding: '2.2rem 2.5rem 2.2rem 2.5rem',
          borderRadius: '22px',
          //black at center, and color at edges
          background: `radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, ${cardColor} 100%)`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          minWidth: '320px',
          opacity: '0.95',
          maxWidth: '90vw',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '1.25rem',
          userSelect: 'text',
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.7rem', color: 'white', opacity: 1 }}>
          {userName}&apos;s Spotify Highlights
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
          Top Genres
        </div>
          {topGenres.map((g, i) => (
            <div
              key={g}
              style={{
                listStyle: 'none',
                color: getGenreColor(g),
                marginBottom: '0.2em',
                fontWeight: 500,
                fontSize: '1.1rem'
              }}>{g}</div>
          ))}
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem', marginTop: '1.2rem' }}>
          Top Songs
        </div>
        <div style={{ fontSize: '1.1rem' ,color: 'white', fontWeight: 500, marginBottom: '1.2rem' }}>
          {topSongs.map((s, i) => (
            <div key={s}>{s}</div>
          ))}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
          Top Artist
        </div>
        <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 500 }}>
          {topArtist}
        </div>
      </div>
    </div>
  )
}

export default Visualizer
