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
      <ul style={{ paddingLeft: 20, marginBottom: '2rem' }}>
        <li>
          <b>Score Calculation:</b> Each song’s <b>score</b> is a weighted combination of your short-term, medium-term, and long-term Spotify top tracks. Higher scores mean the song is more consistently among your favorites.
          <ul style={{ marginTop: 8 }}>
            <li>
              <b>Formula:</b> <code>score = 0.3 × (100 - short-term rank) + 0.35 × (100 - medium-term rank) + 0.35 × (100 - long-term rank)</code>
            </li>
            <li>
              If a song is not present in a time range, it gets a low score for that range.
            </li>
          </ul>
        </li>
        <li style={{ marginTop: 18 }}>
          <b>Visualizer Usage:</b>
          <ul style={{ marginTop: 8 }}>
            <li>
              <b>Each sphere</b> represents a top song. The <b>size</b> of the sphere is proportional to its score.
            </li>
            <li>
              <b>Color</b> and <b>location</b> is based on the song’s genre.
            </li>
            <li>
              <b>Click on a sphere</b> to see details about the song, including name, artist, genre, score, and a link to listen on Spotify.
            </li>
          </ul>
        </li>
      </ul>
      <div style={{ color: '#b3b3b3', fontSize: '1rem', marginTop: '2rem' }}>
        <b>Note:</b> No personal data is stored or shared. All calculations happen in your browser session.
      </div>
    </div>
  );
}