import { useState, useEffect, useRef } from 'react';

export const useAudio = (musicSrc) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Failed to play audio:", err);
        });
    }
  };

  // Auto-play attempt on first user interaction (standard web audio policy bypass)
  useEffect(() => {
    const startAudioOnInteraction = () => {
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('touchstart', startAudioOnInteraction);

      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay blocked or failed:", err);
          });
      }
    };

    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);

    return () => {
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('touchstart', startAudioOnInteraction);
    };
  }, []);

  // Handle audio source reload when source changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Audio autoplay failed on source change:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [musicSrc]);

  return {
    isPlaying,
    setIsPlaying,
    audioRef,
    togglePlay
  };
};

export default useAudio;
