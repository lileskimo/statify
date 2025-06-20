import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')

    if (token) {
      sessionStorage.setItem('spotify_access_token', token)
      navigate('/') // Go to home page after login
    } else {
      sessionStorage.removeItem('spotify_access_token')
      setError(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }, [navigate])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      {error ? (
        <h2 className="text-2xl">Login failed. Redirecting…</h2>
      ) : (
        <h2 className="text-2xl">Logging you in…</h2>
      )}
    </div>
  )
}

export default Callback
