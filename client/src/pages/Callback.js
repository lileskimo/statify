import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const token = hashParams.get('access_token')

    if (token) {
      navigate(`/visualizer?access_token=${token}`)
    } else {
      navigate('/')  // if no token found
    }
  }, [navigate])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <h2 className="text-2xl">Logging you in…</h2>
    </div>
  )
}

export default Callback
