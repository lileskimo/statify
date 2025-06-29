import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState, useEffect, useMemo, useRef } from 'react'
import { colorPalette, getGenreColor } from '../utils/genreColors'

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

  // Group tracks by genre
  const tracksByGenre = useMemo(() => {
    const map = {};
    tracks.forEach(track => {
      const genre = track.genre || 'unknown';
      if (!map[genre]) map[genre] = [];
      map[genre].push(track);
    });
    return map;
  }, [tracks]);

  const genreList = useMemo(() => Object.keys(tracksByGenre), [tracksByGenre]);
  const totalTracks = useMemo(() => tracks.length, [tracks]);
  const genreCounts = useMemo(() => genreList.map(genre => tracksByGenre[genre].length), [genreList, tracksByGenre]);
  const genreProportions = useMemo(() => genreCounts.map(count => count / (totalTracks || 1)), [genreCounts, totalTracks]);

  // Adjust orbit radii to consider sidebar width (300px)
  const orbitRadii = useMemo(() => {
    const base = Math.min(windowSize.width - 300, windowSize.height) / 100
    return [base * 1.5, base * 2.2, base * 3, base * 4]
  }, [windowSize])

  const genreColorMap = useMemo(() => {
    const map = {}
    genres.forEach((genre, index) => {
      map[genre.toLowerCase().replace(/\s/g, '')] = colorPalette[index % colorPalette.length]
    })
    return map
  }, [genres])

  const fallbackColor = '#888888'

  // --- Stable, non-clustered, proportional volume positions ---
  const positionsRef = useRef({});

  useMemo(() => {
    let newPositions = {};
    const minDist = 2.5;

    let phiAccumulator = 0;
    genreList.forEach((genre, genreIdx) => {
      const genreTracks = tracksByGenre[genre];
      const prop = genreTracks.length / (totalTracks || 1);
      const phiStart = phiAccumulator;
      const phiEnd = phiStart + prop * 2 * Math.PI;
      phiAccumulator = phiEnd;

      // For radial spread: genres with more tracks have a much larger min/max radius
      const minRadiusFactor = 1.0 + 2.0 * prop; // 1.0 to 3.0 (increase as needed)
      const maxRadiusFactor = 2.0 + 4.0 * prop; // 2.0 to 6.0 (increase as needed)

      const genrePositions = [];

      genreTracks.forEach((track) => {
        if (!positionsRef.current[track.id]) {
          let pos;
          let attempts = 0;
          do {
            const phi = phiStart + Math.random() * (phiEnd - phiStart);
            const theta = (Math.PI / 4) + Math.random() * (Math.PI / 2);
            const baseRadius = orbitRadii[genreIdx % orbitRadii.length];
            const radius = baseRadius * (minRadiusFactor + Math.random() * (maxRadiusFactor - minRadiusFactor));

            const x = Math.sin(theta) * Math.cos(phi) * radius;
            const y = Math.sin(theta) * Math.sin(phi) * radius;
            const z = Math.cos(theta) * radius;

            pos = [x, y, z];
            attempts++;
          } while (
            genrePositions.some(([gx, gy, gz]) =>
              Math.sqrt((gx - pos[0]) ** 2 + (gy - pos[1]) ** 2 + (gz - pos[2]) ** 2) < minDist
            ) && attempts < 20
          );
          positionsRef.current[track.id] = pos;
          genrePositions.push(pos);
        } else {
          genrePositions.push(positionsRef.current[track.id]);
        }
        newPositions[track.id] = positionsRef.current[track.id];
      });
    });
    Object.keys(positionsRef.current).forEach(id => {
      if (!newPositions[id]) delete positionsRef.current[id];
    });
  }, [tracksByGenre, genreList, orbitRadii, totalTracks]);

  // Now build trackPositions with stable positions
  const trackPositions = useMemo(() => {
    let positions = [];
    genreList.forEach((genre) => {
      const genreTracks = tracksByGenre[genre];
      genreTracks.forEach((track) => {
        positions.push({ ...track, position: positionsRef.current[track.id] });
      });
    });
    return positions;
  }, [tracksByGenre, genreList])

  const tooltipHue = useMemo(() => Math.floor(Math.random() * 360), []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'visible',
      background: 'transparent',
      borderRadius: '18px'
    }}>
      <Canvas
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        camera={{ position: [0, 0, 50], fov: 50 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls autoRotate={false} enableZoom enablePan />

        {trackPositions.map((track) => (
          <group key={track.id} position={track.position}>
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
            <Sphere
              args={[
                Math.max(0.4, track.listenScore * 0.0425),
                32,
                32
              ]}
            >
              <meshStandardMaterial color={getGenreColor(track.genre)} />
            </Sphere>
          </group>
        ))}

        {hoveredTrack && (
          <Html position={hoveredTrack.position} distanceFactor={0} center>
            <div style={{
              background: '#181818',
              color: '#fff',
              padding: '18px 32px',
              borderRadius: '16px',
              minWidth: '200px',
              width: 'auto',
              height: 'auto',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textOverflow: 'ellipsis',
              textAlign: 'left',
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              lineHeight: '1.5',
              border: '1px solid #1DB954',
              pointerEvents: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                {hoveredTrack.albumImage && (
                  <img
                    src={hoveredTrack.albumImage}
                    alt={hoveredTrack.name}
                    style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 16 }}
                  />
                )}
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
                    {hoveredTrack.name}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>
                    {hoveredTrack.artistName}
                  </div>
                </div>
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
  )
}

export default OrbitVisualizer
