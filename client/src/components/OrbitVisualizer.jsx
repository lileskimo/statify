import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState, useEffect, useMemo, useRef } from 'react'
import { colorPalette, getGenreColor } from '../utils/genreColors'

function OrbitVisualizer({ tracks, genres, topGenre, isWide }) {
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth-16,
    height: window.innerHeight-16
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
    const base = Math.min(windowSize.width, windowSize.height) / 18;
    return [base * 8, base * 11, base * 15, base * 21];
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
    const minDist = 7.0;

    let phiAccumulator = 0;
    genreList.forEach((genre, genreIdx) => {
      const genreTracks = tracksByGenre[genre];
      const prop = genreTracks.length / (totalTracks || 1);
      const phiStart = phiAccumulator;
      const phiEnd = phiStart + prop * 2 * Math.PI;
      phiAccumulator = phiEnd;

      const minRadiusFactor = 3;
      const maxRadiusFactor = 10;

      const genrePositions = [];

      genreTracks.forEach((track) => {
        if (!positionsRef.current[track.id]) {
          let pos;
          let attempts = 0;
          do {
            const phi = phiStart + Math.random() * (phiEnd - phiStart);
            const theta = (Math.PI / 6) + Math.random() * (Math.PI * 2 / 3);
            const baseRadius = orbitRadii[genreIdx % orbitRadii.length];
            const radius = baseRadius * (minRadiusFactor + Math.random() * (maxRadiusFactor - minRadiusFactor) * Math.random());

            const x = Math.sin(theta) * Math.cos(phi) * radius;
            const y = Math.sin(theta) * Math.sin(phi) * radius;
            const z = Math.cos(theta) * radius;

            pos = [x, y, z];
            attempts++;
          } while (
            genrePositions.some(([gx, gy, gz]) =>
              Math.sqrt((gx - pos[0]) ** 2 + (gy - pos[1]) ** 2 + (gz - pos[2]) ** 2) < minDist
            ) && attempts < 100
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

  // Calculate a scale factor for sphere sizes based on window size
  const sphereScale = useMemo(() => {
    const base = 100;
    const minDim = Math.min(windowSize.width, windowSize.height);
    return Math.max(0.5, Math.min(1, minDim / base));
  }, [windowSize]);

  const orbitMaxWidth = isWide ? 'clamp(340px, 75vw, 1200px)' : 'clamp(340px, 95vw, 900px)';
  const cardMaxWidth = isWide ? 'clamp(320px, 20vw, 540px)' : 'clamp(240px, 90vw, 810px)';

  // Simple tooltip at top-right of the container
  function TrackTooltip({ track, onClose }) {
    const ref = useRef();
    useEffect(() => {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          onClose();
        }
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 9999,
          background: '#181818',
          color: '#fff',
          padding: '18px 32px',
          borderRadius: '16px',
          width: '280px',
          maxWidth: '75vw',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          border: '1px solid #1DB954',
          pointerEvents: 'auto',
          fontFamily: 'sans-serif',
          lineHeight: '1.5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            opacity: 0.7,
          }}
          aria-label="Close"
        >
          x
        </button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, width: '100%' }}>
          {track.albumImage && (
            <img
              src={track.albumImage}
              alt={track.name}
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 16 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', wordBreak: 'break-word' }}>{track.name}</div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px', wordBreak: 'break-word' }}>{track.artistName}</div>
          </div>
        </div>
        <div style={{ fontSize: '16px', marginBottom: '6px' }}>
          <span style={{ color: '#1DB954', fontWeight: '600' }}>Genre: </span>
          {track.genre.charAt(0).toUpperCase() + track.genre.slice(1)}
        </div>
        <div style={{ fontSize: '16px' }}>
          <span style={{ color: '#1DB954', fontWeight: '600' }}>Score: </span>
          {track.listenScore}
        </div>
        {track.external_urls?.spotify && (
          <div style={{ marginTop: 12 }}>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1DB954',
                fontWeight: 600,
                textDecoration: 'underline',
                fontSize: '16px',
              }}
            >
              Listen on Spotify
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: isWide ? '1 1 0' : 'unset',
        maxWidth: orbitMaxWidth,
        minWidth: cardMaxWidth,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        background: 'transparent',
        borderRadius: '18px',
        position: 'relative'
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        camera={{ position: [0, 0, 500], fov: 50, near: 0.1, far: 20000 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls autoRotate={false} enableZoom enablePan />

        {trackPositions.map((track) => (
          <group key={track.id} position={track.position}>
            <Sphere
              args={[
                Math.max(1.2, track.listenScore * 2 * sphereScale),
                32,
                32
              ]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTrack(track);
              }}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Sphere>
            <Sphere
              args={[
                Math.max(1.2, track.listenScore * 3 * sphereScale),
                32,
                32
              ]}
              pointerEvents={false}
            >
              <meshStandardMaterial color={getGenreColor(track.genre)} />
            </Sphere>
          </group>
        ))}
      </Canvas>
      {/* Render the simple tooltip at the top-right corner of the container */}
      {selectedTrack && (
        <TrackTooltip track={selectedTrack} onClose={() => setSelectedTrack(null)} />
      )}
    </div>
  )
}

export default OrbitVisualizer
