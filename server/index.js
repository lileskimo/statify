import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import SpotifyWebApi from 'spotify-web-api-node'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

const __dirname = dirname(fileURLToPath(import.meta.url))

// Login Route
app.get('/login', (req, res) => {
  const scopes = ['user-top-read', 'user-read-recently-played']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'some-state', true) // true = show_dialog
  res.redirect(authorizeURL)
})

app.get('/callback', async (req, res) => {
  const { code } = req.query
  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const access_token = data.body.access_token
    res.redirect(`${process.env.SITE_URL}/?access_token=${access_token}`)
  } catch (err) {
    res.status(400).send('Spotify authorization failed')
  }
})

app.get('/tracks', async (req, res) => {
  let token = req.headers.authorization
  if (!token) return res.status(401).send('Missing access token')
  if (token.startsWith('Bearer ')) token = token.slice(7)

  const spotifyApiInstance = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
  spotifyApiInstance.setAccessToken(token)

  try {
    // Fetch top tracks for all time ranges
    const [short, medium, long] = await Promise.all([
      spotifyApiInstance.getMyTopTracks({ time_range: 'short_term', limit: 50 }),
      spotifyApiInstance.getMyTopTracks({ time_range: 'medium_term', limit: 50 }),
      spotifyApiInstance.getMyTopTracks({ time_range: 'long_term', limit: 50 })
    ])

    // Build track map and artist set
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
            albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '', // <-- add this
            short_rank: 75,
            medium_rank: 75,
            long_rank: 75
          }
          artistSet.add(track.artists[0].id)
        }
        trackMap[track.id][rankKey] = index + 1
      })
    }

    processTracks(short.body.items, 'short_rank')
    processTracks(medium.body.items, 'medium_rank')
    processTracks(long.body.items, 'long_rank')

    // Fetch artist genres in batches of 50
    const artistIds = Array.from(artistSet)
    const artistChunks = []
    for (let i = 0; i < artistIds.length; i += 50) {
      artistChunks.push(spotifyApiInstance.getArtists(artistIds.slice(i, i + 50)))
    }
    const artistResults = await Promise.all(artistChunks)
    const artistGenreMap = {}
    artistResults.forEach(res => {
      res.body.artists.forEach(artist => {
        artistGenreMap[artist.id] = artist.genres.length ? artist.genres[0] : 'unknown'
      })
    })

    // Calculate listenScore and build final tracks array
    const finalTracks = Object.values(trackMap).map(track => {
      const listenScore = Math.round(
        0.3 * (100 - track.short_rank) +
        0.35 * (100 - track.medium_rank) +
        0.35 * (100 - track.long_rank)
      )
      return {
        id: track.id,
        name: track.name,
        artistName: track.artistName,
        external_urls: track.external_urls,
        listenScore,
        genre: artistGenreMap[track.artist_id] || 'unknown',
        albumImage: track.albumImage // <-- add this
      }
    })

    // Sort by listenScore descending
    finalTracks.sort((a, b) => b.listenScore - a.listenScore)

    res.json(finalTracks)
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch tracks')
  }
})

app.get('/me', async (req, res) => {
  let token = req.headers.authorization
  if (!token) return res.status(401).send('Missing access token')
  if (token.startsWith('Bearer ')) token = token.slice(7)

  const spotifyApiInstance = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
  spotifyApiInstance.setAccessToken(token)

  try {
    const me = await spotifyApiInstance.getMe()
    res.json(me.body)
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch user profile')
  }
})

// Serve React build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));