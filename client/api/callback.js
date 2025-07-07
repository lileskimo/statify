import SpotifyWebApi from 'spotify-web-api-node'

export default async function handler(req, res) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
  const { code } = req.query
  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const access_token = data.body.access_token
    res.redirect(`${process.env.SITE_URL}/?access_token=${access_token}`)
  } catch (err) {
    res.status(400).send('Spotify authorization failed')
  }
}