import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Visualizer() {
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [topGenre, setTopGenre] = useState('')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token')
    if (!token) return

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

      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container">
      <h1>Your Spotify Orbit</h1>
      <OrbitVisualizer tracks={tracks} genres={genres} topGenre={topGenre} />
    </div>
  )
}

export default Visualizer
