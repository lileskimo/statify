import SpotifyWebApi from 'spotify-web-api-node'

export default async function handler(req, res) {
  let token = req.headers.authorization
  if (!token) return res.status(401).send('Missing access token')
  if (token.startsWith('Bearer ')) token = token.slice(7)

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
  spotifyApi.setAccessToken(token)

  try {
    // Fetch top tracks for all time ranges
    const [short, medium, long] = await Promise.all([
      spotifyApi.getMyTopTracks({ time_range: 'short_term', limit: 25 }),
      spotifyApi.getMyTopTracks({ time_range: 'medium_term', limit: 50 }),
      spotifyApi.getMyTopTracks({ time_range: 'long_term', limit: 25 })
    ])

    // Build track map and artist set
    const trackMap = {}
    const artistSet = new Set()

    const addTracks = (tracks, key) => {
      tracks.forEach(track => {
        if (!trackMap[track.id]) {
          trackMap[track.id] = {
            id: track.id,
            name: track.name,
            artistName: track.artists[0].name,
            external_urls: track.external_urls,
            artist_id: track.artists[0].id,
            albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '',
            genre: 'unknown',
            short: 0,
            medium: 0,
            long: 0
          }
          artistSet.add(track.artists[0].id)
        }
        trackMap[track.id][key] = 100 - (track.rank || 0)
      })
    }
    // Assign scores based on position (higher = better)
    short.body.items.forEach((track, i) => {
      if (!trackMap[track.id]) {
        trackMap[track.id] = {
          id: track.id,
          name: track.name,
          artistName: track.artists[0].name,
          external_urls: track.external_urls,
          artist_id: track.artists[0].id,
          albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '',
          genre: 'unknown',
          short: 0,
          medium: 0,
          long: 0
        }
        artistSet.add(track.artists[0].id)
      }
      trackMap[track.id].short = 100 - i
    })
    medium.body.items.forEach((track, i) => {
      if (!trackMap[track.id]) {
        trackMap[track.id] = {
          id: track.id,
          name: track.name,
          artistName: track.artists[0].name,
          external_urls: track.external_urls,
          artist_id: track.artists[0].id,
          albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '',
          genre: 'unknown',
          short: 0,
          medium: 0,
          long: 0
        }
        artistSet.add(track.artists[0].id)
      }
      trackMap[track.id].medium = 100 - i
    })
    long.body.items.forEach((track, i) => {
      if (!trackMap[track.id]) {
        trackMap[track.id] = {
          id: track.id,
          name: track.name,
          artistName: track.artists[0].name,
          external_urls: track.external_urls,
          artist_id: track.artists[0].id,
          albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '',
          genre: 'unknown',
          short: 0,
          medium: 0,
          long: 0
        }
        artistSet.add(track.artists[0].id)
      }
      trackMap[track.id].long = 100 - i
    })

    // Fetch artist genres in batches of 50
    const artistIds = Array.from(artistSet)
    const artistChunks = []
    for (let i = 0; i < artistIds.length; i += 50) {
      artistChunks.push(spotifyApi.getArtists(artistIds.slice(i, i + 50)))
    }
    const artistResults = await Promise.all(artistChunks)
    const artistGenreMap = {}
    artistResults.forEach(res => {
      res.body.artists.forEach(artist => {
        artistGenreMap[artist.id] = artist.genres.length ? artist.genres[0] : 'unknown'
      })
    })

    // Calculate predicted score and build final tracks array
    const finalTracks = Object.values(trackMap).map(track => {
      return {
        id: track.id,
        name: track.name,
        artistName: track.artistName,
        external_urls: track.external_urls,
        albumImage: track.albumImage,
        genre: artistGenreMap[track.artist_id] || 'unknown',
        short: track.short,
        medium: track.medium,
        long: track.long,
        predictedScore: +(0.7 * track.medium + 0.2 * track.long + 0.1 * track.short).toFixed(2)
      }
    })

    // Sort by predicted score descending
    finalTracks.sort((a, b) => b.predictedScore - a.predictedScore)

    res.json({ tracks: finalTracks })
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch wrapped prediction')
  }
} 