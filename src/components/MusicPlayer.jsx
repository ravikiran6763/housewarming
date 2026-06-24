import React from 'react';
import { Play, Pause } from 'lucide-react';

export function MusicPlayer({ isPlaying, togglePlay }) {
  return (
    <div className="music-control-wrapper">
      {isPlaying && (
        <div className="music-visualizer-container">
          <div className="music-icon-active">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      )}
      <button 
        onClick={togglePlay} 
        className={`music-btn ${isPlaying ? 'playing' : ''}`}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <span className="music-tooltip">
        {isPlaying ? "Pause Music" : "Play Music"}
      </span>
    </div>
  );
}

export default MusicPlayer;
