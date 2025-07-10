import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { colorPalette, getGenreColor } from '../utils/genreColors'
import { useNavigate } from 'react-router-dom'


function ListenScoreInfo() {
  return (
    <div
      style={{
        color: '#b3b3b3',
        fontSize: '0.98rem',
        margin: '18px 0 0 0',
        textAlign: 'center',
        fontWeight: 400,
        lineHeight: 1.5,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
        pointerEvents: 'none',
        userSelect: 'text'
      }}
    >
      Score = 0.3 × (100 - short-term rank) + 0.35 × (100 - medium-term rank) + 0.35 × (100 - long-term rank)
    </div>
  );
}

function Visualizer() {
  const navigate = useNavigate()
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [topGenres, setTopGenres] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [topArtist, setTopArtist] = useState('')
  const [userName, setUserName] = useState('Your')
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [obscurity, setObscurity] = useState(null)
  const isWide = windowSize.width >= windowSize.height

  const cardHue = useMemo(() => Math.floor(Math.random() * 360), [])
  const cardColor = useMemo(() => colorPalette[Math.floor(Math.random() * colorPalette.length)], [])

  const NAVBAR_HEIGHT = 64; // px
  const FOOTER_HEIGHT = 48; // px (approximate, adjust if needed)
  const availableHeight = `calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`;

  useEffect(() => {
    if (!sessionStorage.getItem('spotify_access_token')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const token = sessionStorage.getItem('spotify_access_token')
    if (!token) return

    // Fetch user profile for display name from backend
    axios.get(`/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUserName(res.data.display_name || 'Your')
    }).catch(() => setUserName('Your'))

    // Fetch processed tracks from backend
    axios.get(`/api/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // If you return { tracks, obscurityRating }
        const { tracks: finalTracks, obscurityRating } = res.data
        setTracks(finalTracks)
        setObscurity(obscurityRating)

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

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Spacing variables
  const sideSpace = isWide ? `${Math.max(0.05 * windowSize.width, 16)}px` : '10px'
  const betweenSpace = isWide ? `${Math.max(0.06 * windowSize.width, 32)}px` : '40px'
  const orbitMaxWidth = isWide ? 'clamp(320px, 70vw, 1200px)' : 'clamp(200px, 98vw, 750px)';
  const cardMaxWidth = isWide ? 'clamp(320px, 28vw, 540px)' : 'clamp(200px, 70vw, 500px)';
  const sharedMinWidth = isWide ? '340px' : '100px';
  const cardMinWidth = isWide ? '240px' : '100px'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isWide ? 'row' : 'column',
        alignItems: isWide ? 'stretch' : 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        paddingLeft: sideSpace,
        paddingRight: sideSpace,
        paddingTop: isWide ? 16 : 0, // small top padding for wide
        paddingBottom: isWide ? 16 : 0, // small bottom padding for wide
        gap: betweenSpace,
        background: 'transparent',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          flex: isWide ? '1 1 0' : 'unset',
          maxWidth: orbitMaxWidth,
          minWidth: sharedMinWidth,
          width: '100%',
          height: isWide ? '80vh' : 'clamp(340px, 50vh, 800px)',
          maxHeight: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.02em',
          marginBottom: '18px',
        }}>
          Your Spotify Soundscape
        </div>
        <div style={{
          flex: '1 1 auto',
          width: '100%',
          height: '100%',
          minWidth: '320px',
          minHeight: '320px',
          maxWidth: '900px',
          maxHeight: isWide ? '100%' : '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: '18px',
          boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
        }}>
          <OrbitVisualizer tracks={tracks} genres={genres} isWide={isWide} />
        </div>
        <ListenScoreInfo />
      </div>
      {/* Card */}
      <div
        style={{
          flex: isWide ? '1 1 0' : 'unset',
          maxWidth: cardMaxWidth,
          minWidth: cardMinWidth,
          width: '80%',
          alignSelf: 'center',
          marginTop: isWide ? 0 : betweenSpace,
          marginBottom: isWide ? 0 : '2vw', // Add gap below card in tall mode
          padding: '2.2rem 2.5rem',
          borderRadius: '22px',
          background: `radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, ${cardColor} 100%)`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '1.25rem',
          userSelect: 'text',
          opacity: '0.95',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
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
        {obscurity !== null && (
  <div style={{ fontSize: '1.1rem', color: '#1DB954', fontWeight: 600, marginTop: '1.2rem' }}>
    Obscurity Rating: {obscurity}%
    <span style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '1rem', marginLeft: 8 }}>
      (higher = more obscure taste)
    </span>
  </div>
)}
      </div>
      {/* Spacer for tall mode to add 10vw at the bottom if scrolling is enabled */}
      {!isWide && <div style={{ height: '10vw', width: '100%' }} />}
    </div>
  )
}

export default Visualizer
