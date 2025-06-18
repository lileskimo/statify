import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState, useEffect, useMemo } from 'react'

function OrbitVisualizer({ tracks, genres, topGenre }) {
  const [hoveredTrack, setHoveredTrack] = useState(null)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Adjust orbit radii to consider sidebar width (300px)
  const orbitRadii = useMemo(() => {
    const base = Math.min(windowSize.width - 300, windowSize.height) / 100
    return [base * 1.5, base * 2.2, base * 3, base * 4]
  }, [windowSize])

  const colorPalette = [
    '#1DB954', '#F44336', '#FFC107', '#9C27B0', '#00BCD4',
    '#FF9800', '#3F51B5', '#8BC34A', '#795548', '#E91E63',
    '#673AB7', '#CDDC39', '#FF5722', '#03A9F4', '#607D8B',
    '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2',
    '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38',
    '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19',
    '#5D4037', '#616161', '#455A64', '#00C853', '#AA00FF',
    '#D50000', '#00B8D4', '#C6FF00', '#FFD600', '#FFAB00',
    '#FF6D00', '#F50057', '#FF4081', '#64DD17', '#FF5252'
  ]

  const genreColorMap = useMemo(() => {
    const map = {}
    genres.forEach((genre, index) => {
      map[genre.toLowerCase().replace(/\s/g, '')] = colorPalette[index % colorPalette.length]
    })
    return map
  }, [genres])

  const fallbackColor = '#888888'

  const trackPositions = useMemo(() => {
    return tracks.map((track, index) => {
      const radius = orbitRadii[index % orbitRadii.length]
      const angle = (index / tracks.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      return { ...track, position: [x, y, 0] }
    })
  }, [tracks, orbitRadii])

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#121212',
    }}>
      <div style={{
        flexGrow: 1,
        flexBasis: 0,
        height: '100%',
        overflow: 'hidden',
      }}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 50], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} />
          <OrbitControls autoRotate={false} enableZoom enablePan />

          {trackPositions.map((track) => (
            <group key={track.id} position={track.position}>
              {/* Invisible hover sphere */}
              <Sphere
                args={[
                  Math.max(0.4, track.listenScore * 0.03) * 1.2,
                  32,
                  32
                ]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredTrack(track);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredTrack(null);
                }}
                onClick={() => {
                  if (track.external_urls?.spotify)
                    window.open(track.external_urls.spotify, '_blank');
                }}
              >
                <meshStandardMaterial transparent opacity={0} />
              </Sphere>
              {/* Visible sphere */}
              <Sphere
                args={[
                  Math.max(0.4, track.listenScore * 0.03),
                  32,
                  32
                ]}
              >
                <meshStandardMaterial color={genreColorMap[track.genre.toLowerCase().replace(/\s/g, '')] || fallbackColor} />
              </Sphere>
            </group>
          ))}

          {hoveredTrack && (
            <Html position={hoveredTrack.position} distanceFactor={0} center>
              <div style={{
                background: '#181818',
                color: '#FFFFFF',
                padding: '2px 24px',
                borderRadius: '16px',
                minWidth: '200px',
                width: 'auto',
                height: 'auto',
                paddingTop: '4px',
                paddingBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
                fontFamily: 'sans-serif',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                lineHeight: '1.5',
                border: '1px solid rgba(255,255,255,0.08)',
                pointerEvents: 'none' // Prevents tooltip from blocking pointer events
              }}>
                <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
                  {hoveredTrack.name}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#b3b3b3', marginBottom: '8px' }}>
                  {hoveredTrack.artistName}
                </div>
                <div style={{ fontSize: '16px', marginBottom: '6px' }}>
                  <span style={{ color: '#1DB954', fontWeight: '600' }}>Genre: </span>
                  {hoveredTrack.genre.charAt(0).toUpperCase() + hoveredTrack.genre.slice(1)}
                </div>
                <div style={{ fontSize: '16px' }}>
                  <span style={{ color: '#1DB954', fontWeight: '600' }}>Score: </span>
                  {hoveredTrack.listenScore}
                </div>
              </div>
            </Html>
          )}
        </Canvas>
      </div>

      <div style={{
        width: '20vw',
        height: '100%',
        padding: '30px',
        background: '#121212',
        color: 'white',
        fontSize: '22px',
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderLeft: '1px solid #1DB954',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '12px', fontSize: '28px' }}>Top Genre</div>
        <div style={{ fontSize: '24px', color: '#1DB954' }}>
          {topGenre}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default OrbitVisualizer
