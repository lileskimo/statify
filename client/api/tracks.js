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
      spotifyApi.getMyTopTracks({ time_range: 'short_term', limit: 50 }),
      spotifyApi.getMyTopTracks({ time_range: 'medium_term', limit: 50 }),
      spotifyApi.getMyTopTracks({ time_range: 'long_term', limit: 50 })
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
            albumImage: (track.album.images && track.album.images[1]?.url) || (track.album.images && track.album.images[0]?.url) || '',
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
      artistChunks.push(spotifyApi.getArtists(artistIds.slice(i, i + 50)))
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
        albumImage: track.albumImage
      }
    })

    // Sort by listenScore descending
    finalTracks.sort((a, b) => b.listenScore - a.listenScore)

    res.json(finalTracks)
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch tracks')
  }
}