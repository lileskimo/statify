import SpotifyWebApi from 'spotify-web-api-node'

export default async function handler(req, res) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })
  const scopes = ['user-top-read', 'user-read-recently-played']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'some-state', true)
  res.redirect(authorizeURL)
}