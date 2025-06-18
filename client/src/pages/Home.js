import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleLogin = () => {
    window.location.href = 'http://localhost:8888/login'
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Statify</h1>
      <p className="text-lg mb-10 text-gray-400 max-w-xl text-center">
        Discover your Spotify listening habits through a beautiful 3D data visualization. 
        See how your favorite tracks orbit around your tastes.
      </p>
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-full transition"
      >
        Login with Spotify
      </button>

      <footer className="absolute bottom-4 text-xs text-gray-600">
        We do not store any of your data. Everything runs in your browser.
      </footer>
    </div>
  )
}

export default Home
