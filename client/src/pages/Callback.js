import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    // CHANGE: Read from query string, not hash
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')

    if (token) {
      sessionStorage.setItem('spotify_access_token', token)
      navigate('/visualizer')
    } else {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <h2 className="text-2xl">Logging you in…</h2>
    </div>
  )
}

export default Callback
