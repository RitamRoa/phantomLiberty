import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio imperatively — more reliable for browser gesture detection
    const audio = new Audio('/audio/song.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => { setHasError(true); setIsPlaying(false); };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setHasError(true));
    } else {
      audio.pause();
    }
  };

  return (
    <div className="flex items-center gap-4 pointer-events-auto">

      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-10 h-10 border rounded-full transition-all duration-300 ${hasError ? 'border-yellow-500' : 'border-[#FF2A55]'} hover:bg-[#FF2A55]/20`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <span className="text-[#FF2A55] text-xs font-mono">
          {hasError ? '!' : isPlaying ? '||' : '▶'}
        </span>
        <div className="absolute inset-0 rounded-full border border-[#FF2A55] opacity-0 group-hover:opacity-50 group-hover:animate-ping" />
      </button>

      <div className="flex flex-col">
        {hasError ? (
          <span className="text-yellow-500 text-xs font-mono tracking-widest opacity-80">Error loading audio</span>
        ) : (
          <>
            <span className="text-[#FF2A55] text-xs font-mono uppercase tracking-widest opacity-80">Listening to</span>
            <div className="flex items-center gap-2 overflow-hidden h-4">
              <span className="text-white text-sm font-bold tracking-tight whitespace-nowrap animate-marquee">
                Phantom Liberty � Cyberpunk 2077
              </span>
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 ml-2 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-[#FF2A55]"
                      style={{
                        animation: 'music-bar 0.8s ease-in-out infinite',
                        animationDelay: `${i * 0.15}s`,
                        height: '100%',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { transform: scaleY(0.2); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
