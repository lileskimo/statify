import React from 'react';

export default function Info() {
  return (
    <div style={{
      maxWidth: 700,
      margin: '3rem auto',
      background: 'rgba(28,28,30,0.97)',
      borderRadius: 18,
      padding: '2.5rem 2rem',
      color: '#fff',
      boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
      fontSize: '1.15rem',
      lineHeight: 1.7
    }}>
      <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#1DB954' }}>
        How Statify Works
      </h2>
      <div style={{ marginBottom: '2rem' }}>
        <p>
          <b>Visualizer Usage:</b> Each sphere represents a top song from your Spotify listening history. The <b>size</b> of the sphere is proportional to how consistently the song appears in your top tracks. The <b>color</b> and <b>location</b> are based on the song’s genre. Click on a sphere to see details about the song and listen to it on Spotify.
        </p>
        <p>
          <b>Obscurity Rating:</b> This percentage reflects how "non-mainstream" your top tracks are. It is calculated as <b>100 minus the average popularity</b> of your top songs (Spotify rates the popularity for a song out of 100, where 100 is most popular globally). A higher obscurity rating means your favorites are less mainstream.
        </p>
      </div>
      <div style={{ color: '#b3b3b3', fontSize: '1rem', marginTop: '2rem' }}>
        <b>Note:</b> No personal data is stored or shared. All calculations happen in your browser session.
      </div>
    </div>
  );
}