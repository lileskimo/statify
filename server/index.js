import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import SpotifyWebApi from 'spotify-web-api-node'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

// Login Route
app.get('/login', (req, res) => {
  const scopes = ['user-top-read', 'user-read-recently-played']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'some-state')
  res.redirect(authorizeURL)
})

// Callback Route
app.get('/callback', async (req, res) => {
  const { code } = req.query
  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const access_token = data.body.access_token
    res.redirect(`http://localhost:3000/visualizer?access_token=${access_token}`)
  } catch (err) {
    res.status(400).send('Spotify authorization failed')
  }
})

app.get('/tracks', async (req, res) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).send('Missing access token')

  spotifyApi.setAccessToken(token)

  try {
    const [short, medium, long] = await Promise.all([
      spotifyApi.getMyTopTracks({ time_range: 'short_term', limit: 50 }),
      spotifyApi.getMyTopTracks({ time_range: 'medium_term', limit: 50 }),
      spotifyApi.getMyTopTracks({ time_range: 'long_term', limit: 50 })
    ])

    const trackMap = new Map()

    const addTracks = (tracks, weight) => {
      tracks.forEach(track => {
        const id = track.id
        if (!trackMap.has(id)) {
          trackMap.set(id, {
            name: track.name,
            popularity: track.popularity,
            artistId: track.artists[0].id,
            listenScore: 0
          })
        }
        const current = trackMap.get(id)
        current.listenScore += weight
      })
    }

    // Apply your formula weights
    addTracks(short.body.items, 0.375)
    addTracks(medium.body.items, 0.325)
    addTracks(long.body.items, 0.3)

    // Fetch artist genres in parallel
    const trackList = Array.from(trackMap.values())
    const artistIds = [...new Set(trackList.map(t => t.artistId))]

    const artistResponses = await Promise.all(
      artistIds.map(id => spotifyApi.getArtist(id))
    )

    const artistGenres = {}
    artistResponses.forEach(res => {
      artistGenres[res.body.id] = res.body.genres[0] || 'unknown'
    })

    const finalTracks = trackList.map(t => ({
      name: t.name,
      popularity: t.popularity,
      genre: artistGenres[t.artistId],
      listenScore: t.listenScore
    }))

    res.json(finalTracks)
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch tracks')
  }
})


app.listen(8888, () => console.log('Server running on port 8888'))
