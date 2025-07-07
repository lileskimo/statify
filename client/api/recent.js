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
    const recent = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 })
    const items = recent.body.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artistName: item.track.artists[0]?.name || '',
      albumImage: item.track.album?.images?.[0]?.url || '',
      playedAt: item.played_at,
      external_urls: item.track.external_urls,
      genre: 'unknown' // Spotify does not provide genre here
    }))
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(400).send('Failed to fetch recently played tracks')
  }
}