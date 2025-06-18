import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Visualizer() {
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token')

    if (token) {
      axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        console.log(res.data.items) // check data shape
        const processedTracks = res.data.items.map(track => ({
          name: track.name,
          popularity: track.popularity,
          listenScore: track.popularity, // temporarily using popularity until you compute your own scoring
          genre: track.album.genres ? track.album.genres[0] : 'default'
        }))
        setTracks(processedTracks)
      })
      .catch(err => console.error(err))
    }
  }, [])

  return (
    <div className="container">
      <h1>Your Spotify Orbit</h1>
      <OrbitVisualizer tracks={tracks} />
    </div>
  )
}

export default Visualizer
