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
    // Fetch top artists for all time ranges
    const [short, medium, long] = await Promise.all([
      spotifyApi.getMyTopArtists({ time_range: 'short_term', limit: 50 }),
      spotifyApi.getMyTopArtists({ time_range: 'medium_term', limit: 50 }),
      spotifyApi.getMyTopArtists({ time_range: 'long_term', limit: 50 })
    ])

    // Build artist map
    const artistMap = {}
    const addArtists = (artists, key) => {
      artists.forEach((artist, i) => {
        if (!artistMap[artist.id]) {
          artistMap[artist.id] = {
            id: artist.id,
            name: artist.name,
            genres: artist.genres,
            image: (artist.images && artist.images[1]?.url) || (artist.images && artist.images[0]?.url) || '',
            external_urls: artist.external_urls,
            short: 0,
            medium: 0,
            long: 0
          }
        }
        artistMap[artist.id][key] = 100 - i
      })
    }
    addArtists(short.body.items, 'short')
    addArtists(medium.body.items, 'medium')
    addArtists(long.body.items, 'long')

    // Calculate predicted score and build final artists array
    const finalArtists = Object.values(artistMap).map(artist => {
      return {
        ...artist,
        predictedScore: +(0.45 * artist.medium + 0.35 * artist.long + 0.2 * artist.short).toFixed(2)
      }
    })

    // Sort by predicted score descending
    finalArtists.sort((a, b) => b.predictedScore - a.predictedScore)

    res.json({ artists: finalArtists })
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch top artists')
  }
} 