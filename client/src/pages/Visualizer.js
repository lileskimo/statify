import OrbitVisualizer from '../components/OrbitVisualizer'
import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { colorPalette, getGenreColor } from '../utils/genreColors'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'


function ListenScoreInfo() {
  return (
    <div
      style={{
        color: '#b3b3b3',
        fontSize: '0.98rem',
        margin: '18px 0 0 0',
        textAlign: 'center',
        fontWeight: 400,
        lineHeight: 1.5,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
        pointerEvents: 'none',
        userSelect: 'text'
      }}
    >
      Score = 0.3 × (100 - short-term rank) + 0.35 × (100 - medium-term rank) + 0.35 × (100 - long-term rank)
    </div>
  );
}

function Visualizer() {
  const navigate = useNavigate()
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [topGenres, setTopGenres] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [topArtist, setTopArtist] = useState('')
  const [userName, setUserName] = useState('Your')
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [obscurity, setObscurity] = useState(null)
  const [mostPopular, setMostPopular] = useState(null)
  const [leastPopular, setLeastPopular] = useState(null)
  const cardRef = useRef(null);

  const cardHue = useMemo(() => Math.floor(Math.random() * 360), [])
  const cardColor = useMemo(() => colorPalette[Math.floor(Math.random() * colorPalette.length)], [])

  const NAVBAR_HEIGHT = 64;
  const FOOTER_HEIGHT = 48;
  const availableHeight = `calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`;

  useEffect(() => {
    if (!sessionStorage.getItem('spotify_access_token')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const token = sessionStorage.getItem('spotify_access_token')
    if (!token) return

    // Fetch user profile for display name from backend
    axios.get(`/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUserName(res.data.display_name || 'Your')
    }).catch(() => setUserName('Your'))

    // Fetch processed tracks from backend
    axios.get(`/api/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // If you return { tracks, obscurityRating }
        const { tracks: finalTracks, obscurityRating } = res.data
        setTracks(finalTracks)
        setObscurity(obscurityRating)

        // Find most and least popular among top tracks
        if (finalTracks.length > 0) {
          const most = finalTracks.reduce((a, b) => (a.popularity > b.popularity ? a : b))
          const least = finalTracks.reduce((a, b) => (a.popularity < b.popularity ? a : b))
          setMostPopular(most)
          setLeastPopular(least)
        }

        // Top genres (sorted by count)
        const genreCounts = {}
        finalTracks.forEach(track => {
          const genre = track.genre
          if (genre !== 'unknown') {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
          }
        })
        const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
        setGenres(Object.keys(genreCounts))
        setTopGenres(sortedGenres.slice(0, 3).map(([genre]) => genre))

        // Top songs (by listenScore)
        setTopSongs(finalTracks.slice(0, 3).map(t => `${t.name} by ${t.artistName}`))

        // Top artist (most frequent in top tracks)
        const artistCounts = {}
        finalTracks.forEach(track => {
          artistCounts[track.artistName] = (artistCounts[track.artistName] || 0) + 1
        })
        const sortedArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])
        setTopArtist(sortedArtists.length ? sortedArtists[0][0] : '')
      })
      .catch((err) => {
        console.error('Fetch error:', err)
      })
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Spacing variables
  const isWide = windowSize.width >= windowSize.height
  const sideSpace = isWide ? `${Math.max(0.05 * windowSize.width, 16)}px` : '10px'
  const betweenSpace = isWide ? `${Math.max(0.06 * windowSize.width, 32)}px` : '40px'
  const orbitMaxWidth = isWide ? 'clamp(320px, 70vw, 1200px)' : 'clamp(200px, 98vw, 750px)';
  // Set card max width to always maintain a 5:8 ratio with its height
  // We'll use 5/8 of the orbit height as the max width for the card
  const orbitHeight = isWide ? 0.8 * windowSize.height : Math.max(windowSize.height * 0.5, 340); // matches orbit div height
  const cardMaxWidth = `min(${Math.round((orbitHeight * 5) / 8)}px, 90vw, 540px)`;
  const sharedMinWidth = isWide ? '340px' : '100px';
  const cardMinWidth = isWide ? '240px' : '100px'

  // Download handler
  const [isDownloadMode, setIsDownloadMode] = useState(false);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloadMode(true);

    // Wait for the DOM to update to download mode
    await new Promise(r => setTimeout(r, 50));

    // Clone the card for download
    const cardClone = cardRef.current.cloneNode(true);
    cardClone.style.width = '480px';
    cardClone.style.maxWidth = '480px';
    cardClone.style.minWidth = '480px';
    cardClone.style.boxSizing = 'border-box';
    cardClone.style.position = 'static';
    cardClone.style.margin = '0 auto';

    // Remove the download button from the clone if present
    const btnClone = cardClone.querySelector('.statify-download-btn');
    if (btnClone) btnClone.remove();

    // Add the footer to the clone only
    const footer = document.createElement('div');
    footer.innerText = 'Generated with statifyforspotify.vercel.app';
    footer.style.cssText = `
      width: 100%;
      text-align: center;
      color: #b3b3b3;
      font-size: 1rem;
      font-weight: 500;
      margin-top: 2.2rem;
      padding-bottom: 0.5rem;
      font-family: inherit;
    `;
    cardClone.appendChild(footer);

    // Create a hidden container for rendering
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'fixed';
    hiddenDiv.style.left = '-9999px';
    hiddenDiv.style.top = '0';
    hiddenDiv.style.width = '480px';
    hiddenDiv.style.zIndex = '-1';
    hiddenDiv.appendChild(cardClone);
    document.body.appendChild(hiddenDiv);

    // Wait for DOM update
    await new Promise(r => setTimeout(r, 10));
    const canvas = await html2canvas(cardClone, { backgroundColor: null, useCORS: true, width: 480 });

    // Clean up
    document.body.removeChild(hiddenDiv);

    // Download
    const link = document.createElement('a');
    link.download = 'statify-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    setIsDownloadMode(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isWide ? 'row' : 'column',
        alignItems: isWide ? 'stretch' : 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        paddingLeft: sideSpace,
        paddingRight: sideSpace,
        paddingTop: isWide ? 16 : 0,
        paddingBottom: isWide ? 16 : 0,
        gap: betweenSpace,
        background: 'transparent',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          flex: isWide ? '1 1 0' : 'unset',
          maxWidth: orbitMaxWidth,
          minWidth: sharedMinWidth,
          width: '100%',
          height: isWide ? '80vh' : 'clamp(340px, 50vh, 800px)',
          paddingBottom : isWide ? '0' : '15vh',
          maxHeight: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.02em',
          marginBottom: '18px',
        }}>
          Your Spotify Soundscape
        </div>
        <div style={{
          flex: '1 1 auto',
          width: '100%',
          height: '100%',
          minWidth: '320px',
          minHeight: '320px',
          maxWidth: '900px',
          maxHeight: isWide ? '100%' : '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: '18px',
          boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
        }}>
          <OrbitVisualizer tracks={tracks} genres={genres} isWide={isWide} />
        </div>
        <ListenScoreInfo />
      </div>
      {/* Card */}
      <div
        ref={cardRef}
        style={{
          flex: isWide ? '1 1 0' : 'unset',
          maxWidth: cardMaxWidth,
          minWidth: cardMinWidth,
          width: '80%',
          alignSelf: 'center',
          marginTop: isWide ? 0 : betweenSpace,
          marginBottom: isWide ? 0 : '2vw',
          padding: '2.2rem 2.5rem',
          borderRadius: isDownloadMode ? '0px' : '22px',
          background: isDownloadMode
            ? 'linear-gradient(135deg,rgb(42, 57, 47) 0%, #23242a 55%,rgb(22, 93, 47) 100%)'
            : 'linear-gradient(135deg, rgba(40,40,48,0.96) 60%, rgba(30,60,60,0.98) 100%)',
          border: isDownloadMode
            ? '2px solid #23242a'
            : '1.5px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.28), 0 1.5px 8px 0 rgba(30,255,180,0.08)',
          ...(isDownloadMode
            ? { backdropFilter: 'none', WebkitBackdropFilter: 'none' }
            : { backdropFilter: 'blur(38px) saturate(220%)', WebkitBackdropFilter: 'blur(38px) saturate(220%)' }
          ),
          color: '#fff',
          position: 'relative'
        }}
      >
        {/* Download button */}
        <button
          className="statify-download-btn"
          onClick={handleDownloadCard}
          title="Download card as image"
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            background: 'rgba(24,24,24,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v9m0 0l4-4m-4 4l-4-4" />
            <path d="M5 21 Q12 17 19 21" />
          </svg>
        </button>

        {/*
          We'll use a variable to determine if we're rendering for download or for display.
          For display: classic vertical, center-aligned sections.
          For download: keep the new compact layout.
        */}

        {isDownloadMode ? (
          // --- Download Card Layout (compact, horizontal rows & opaque bg) ---
          <>
            {/* User's Spotify Highlights */}
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem', textAlign: 'center', letterSpacing: '0.01em' }}>
              {userName}&apos;s Spotify Highlights
            </div>
            {/* Top Songs */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '0.01em' }}>
                Top Songs
              </div>
              <div>
                {topSongs.map((s, i) => (
                  <div key={s} style={{
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    color: '#fff',
                    marginBottom: '0.25em',
                    textAlign: 'center',
                    letterSpacing: '0.01em'
                  }}>
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
            </div>
            {/* Top Genres & Top Artist Row */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1.2rem',
              flexWrap: 'nowrap',
              width: '100%',
              gap: 0,
            }}>
              {/* Top Genres */}
              <div style={{ width: '47%', minWidth: 0, wordBreak: 'break-word', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '1.13rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem', textAlign: 'center' }}>
                  Top Genres
                </div>
                {topGenres.map((g, i) => (
                  <div
                    key={g}
                    style={{
                      color: getGenreColor(g),
                      marginBottom: '0.18em',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                      textAlign: 'center',
                      wordBreak: 'break-word'
                    }}>{g}</div>
                ))}
              </div>
              {/* Vertical Separator */}
              <div style={{ width: 2, minWidth: 2, maxWidth: 2, height: '70%', alignSelf: 'center', background: '#b3b3b3', margin: '0 0.4rem', borderRadius: 1 }} />
              {/* Top Artist */}
              <div style={{ width: '47%', minWidth: 0, wordBreak: 'break-word', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '1.13rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem', textAlign: 'center' }}>
                  Top Artist
                </div>
                <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 500, textAlign: 'center', wordBreak: 'break-word' }}>
                  {topArtist}
                </div>
              </div>
            </div>
            {/* Obscurity Score (separate line) */}
            {obscurity !== null && (
              <div style={{ marginBottom: '0.8rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600, marginBottom: 2 }}>
                  Obscurity Rating: {obscurity}%
                </div>
                <div style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '1rem', fontStyle: 'italic' }}>
                  *higher = more obscure taste
                </div>
              </div>
            )}
            {/* Most/Least Popular Songs Row (now vertical, center-aligned, below obscurity) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.2rem',
              width: '100%',
            }}>
              {mostPopular && (
                <div style={{ color: '#FFD700', fontWeight: 600, fontSize: '1.08rem', textAlign: 'center', marginBottom: '0.7rem', wordBreak: 'break-word' }}>
                  Most Popular: <span style={{ color: '#fff', fontWeight: 500 }}>{mostPopular.name} by {mostPopular.artistName}</span>
                  <span style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '0.98rem', marginLeft: 8 }}>
                    (popularity {mostPopular.popularity})
                  </span>
                </div>
              )}
              {leastPopular && (
                <div style={{ color: '#FF6F61', fontWeight: 600, fontSize: '1.08rem', textAlign: 'center', marginBottom: '0.2rem', wordBreak: 'break-word' }}>
                  Least Popular: <span style={{ color: '#fff', fontWeight: 500 }}>{leastPopular.name} by {leastPopular.artistName}</span>
                  <span style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '0.98rem', marginLeft: 8 }}>
                    (popularity {leastPopular.popularity})
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          // --- Site Display Card Layout (classic, vertical, center-aligned) ---
          <>
            {/* User's Spotify Highlights */}
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem', textAlign: 'center', letterSpacing: '0.01em' }}>
              {userName}&apos;s Spotify Highlights
            </div>
            {/* Top Songs */}
            <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>
                Top Songs
              </div>
              <div>
                {topSongs.map((s, i) => (
                  <div key={s} style={{
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    color: '#fff',
                    marginBottom: '0.25em',
                    letterSpacing: '0.01em',
                    textAlign: 'center'
                  }}>
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
            </div>
            {/* Top Genres */}
            <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.13rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                Top Genres
              </div>
              {topGenres.map((g, i) => (
                <div
                  key={g}
                  style={{
                    color: getGenreColor(g),
                    marginBottom: '0.18em',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    textAlign: 'center'
                  }}>{g}</div>
              ))}
            </div>
            {/* Top Artist */}
            <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.13rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                Top Artist
              </div>
              <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 500, textAlign: 'center' }}>
                {topArtist}
              </div>
            </div>
            {/* Obscurity Score */}
            {obscurity !== null && (
              <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600, marginBottom: 2 }}>
                  Obscurity Rating: {obscurity}%
                </div>
                <div style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '1rem', fontStyle: 'italic' }}>
                  *higher = more obscure taste
                </div>
              </div>
            )}
            {/* Most/Least Popular Songs */}
            <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
              {mostPopular && (
                <div style={{ fontSize: '1.08rem', color: '#FFD700', fontWeight: 600 }}>
                  Most Popular: <span style={{ color: '#fff', fontWeight: 500 }}>{mostPopular.name} by {mostPopular.artistName}</span>
                  <span style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '0.98rem', marginLeft: 8 }}>
                    (popularity {mostPopular.popularity})
                  </span>
                </div>
              )}
              {leastPopular && (
                <div style={{ fontSize: '1.08rem', color: '#FF6F61', fontWeight: 600 }}>
                  Least Popular: <span style={{ color: '#fff', fontWeight: 500 }}>{leastPopular.name} by {leastPopular.artistName}</span>
                  <span style={{ color: '#b3b3b3', fontWeight: 400, fontSize: '0.98rem', marginLeft: 8 }}>
                    (popularity {leastPopular.popularity})
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Spacer for tall mode to add 10vw at the bottom if scrolling is enabled */}
      {!isWide && <div style={{ height: '10vw', width: '100%' }} />}
    </div>
  )
}

export default Visualizer
