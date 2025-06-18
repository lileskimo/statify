import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState } from 'react'

function OrbitVisualizer({ tracks }) {
  const orbitRadii = [5, 9, 14, 20]

  const genreColors = {
    pop: '#1DB954',
    rock: '#F44336',
    indie: '#FFC107',
    hiphop: '#9C27B0',
    edm: '#00BCD4',
    jazz: '#FF9800',
    blues: '#3F51B5',
    classical: '#8BC34A',
    metal: '#795548',
    folk: '#E91E63',
    punk: '#673AB7',
    country: '#CDDC39'
  }

  const fallbackColors = ['#03A9F4', '#009688', '#FFC107', '#E91E63', '#FF5722']

  const [hoveredTrack, setHoveredTrack] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />

        {tracks.map((track, index) => {
          const radius = orbitRadii[index % orbitRadii.length]
          const angle = (index / tracks.length) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          const genre = track.genre ? track.genre.toLowerCase() : 'unknown'
          const color = genreColors[genre] || fallbackColors[index % fallbackColors.length]

          const size = Math.max(0.2, track.listenScore * 0.03)

          return (
            <Sphere
              key={track.name}
              args={[size, 16, 16]}
              position={[x, y, 0]}
              onPointerOver={() => setHoveredTrack(track.name)}
              onPointerOut={() => setHoveredTrack(null)}
              onClick={() => window.open(track.url, '_blank')}
            >
              <meshStandardMaterial attach="material" color={color} />
              {hoveredTrack === track.name && (
                <Html distanceFactor={12}>
                  <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    transform: 'translateY(-10px)',
                    pointerEvents: 'none'
                  }}>
                    {track.name}
                  </div>
                </Html>
              )}
            </Sphere>
          )
        })}
      </Canvas>
    </div>
  )
}

export default OrbitVisualizer
