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
    const topTracks = await spotifyApi.getMyTopTracks({ limit: 50 })
    res.json(topTracks.body.items)
  } catch (err) {
    res.status(400).send('Failed to fetch tracks')
  }
}