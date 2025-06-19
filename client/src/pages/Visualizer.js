import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

function Visualizer() {
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [topGenre, setTopGenre] = useState('')
  const [topSong, setTopSong] = useState('')
  const [userName, setUserName] = useState('Your')

  // Generate a random hue for the card background (stable per session)
  const cardHue = useMemo(() => Math.floor(Math.random() * 360), [])

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token')
    if (!token) return

    // Fetch user profile for display name
    axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUserName(res.data.display_name || 'Your')
    }).catch(() => setUserName('Your'))

    const fetchTopTracks = async (time_range) => {
      const res = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${time_range}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data.items
    }

    const fetchArtists = async (ids) => {
      const res = await axios.get(`https://api.spotify.com/v1/artists?ids=${ids.join(',')}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data.artists
    }

    const fetchData = async () => {
      try {
        const [shortTracks, mediumTracks, longTracks] = await Promise.all([
          fetchTopTracks('short_term'),
          fetchTopTracks('medium_term'),
          fetchTopTracks('long_term')
        ])

        const trackMap = {}
        const artistSet = new Set()

        const processTracks = (tracks, rankKey) => {
          tracks.forEach((track, index) => {
            if (!trackMap[track.id]) {
              trackMap[track.id] = {
                id: track.id,
                name: track.name,
                artistName: track.artists[0].name,
                external_urls: track.external_urls,
                artist_id: track.artists[0].id,
                short_rank: 75,
                medium_rank: 75,
                long_rank: 75
              }
              artistSet.add(track.artists[0].id)
            }
            trackMap[track.id][rankKey] = index + 1
          })
        }

        processTracks(shortTracks, 'short_rank')
        processTracks(mediumTracks, 'medium_rank')
        processTracks(longTracks, 'long_rank')

        const artistIds = Array.from(artistSet)
        const artistChunks = []
        for (let i = 0; i < artistIds.length; i += 50) {
          artistChunks.push(fetchArtists(artistIds.slice(i, i + 50)))
        }

        const artistResults = await Promise.all(artistChunks)
        const artistGenreMap = {}
        artistResults.flat().forEach(artist => {
          artistGenreMap[artist.id] = artist.genres.length ? artist.genres[0] : 'unknown'
        })

        const finalTracks = Object.values(trackMap).map(track => {
          const listenScore = Math.round(
            0.4 * (100 - track.short_rank) +
            0.32 * (100 - track.medium_rank) +
            0.28 * (100 - track.long_rank)
          )

          return {
            id: track.id,
            name: track.name,
            artistName: track.artistName,
            external_urls: track.external_urls,
            listenScore,
            genre: artistGenreMap[track.artist_id] || 'unknown'
          }
        })

        finalTracks.sort((a, b) => b.listenScore - a.listenScore)
        setTracks(finalTracks)

        // Build unique genres list from tracks, excluding 'unknown'
        const uniqueGenres = Array.from(new Set(finalTracks.map(t => t.genre).filter(g => g !== 'unknown')))
        setGenres(uniqueGenres)

        // Calculate top genre
        const genreCounts = {}
        finalTracks.forEach(track => {
          const genre = track.genre
          if (genre !== 'unknown') {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
          }
        })

        const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
        setTopGenre(sortedGenres.length ? sortedGenres[0][0] : 'No dominant genre')

        // Set top song (highest listenScore)
        setTopSong(finalTracks.length ? `${finalTracks[0].name} — ${finalTracks[0].artistName}` : '')

      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    fetchData()
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
      gap: '40px'
    }}>
      <div style={{
        flex: '0 1 900px',
        width: 'min(900px, 90vw)',
        height: 'min(80vh, 80vw)', // Increased height here
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          textAlign: 'left',
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
          background: `linear-gradient(135deg, hsl(${cardHue}, 80%, 88%) 0%, hsl(${(cardHue + 40) % 360}, 90%, 97%) 100%)`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          color: '#222',
          minWidth: '320px',
          maxWidth: '90vw',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '1.25rem',
          userSelect: 'text',
          border: '2.5px solid rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.2s'
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.7rem', color: '#222', opacity: 0.85 }}>
          {userName}&apos;s Spotify Highlights
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222', marginBottom: '0.5rem' }}>
          Top Genre
        </div>
        <div style={{ fontSize: '1.25rem', color: '#1DB954', fontWeight: 700, marginBottom: '1.2rem' }}>
          {topGenre}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginBottom: '0.5rem' }}>
          Top Song
        </div>
        <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 500 }}>
          {topSong}
        </div>
      </div>
    </div>
  )
}

export default Visualizer
