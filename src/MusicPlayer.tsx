import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ideal path: /audio/song.mp3
  const songUrl = "/audio/song.mp3"; 

  const togglePlay = () => {
    if (audioRef.current) {
        // Try to unlock audio context if needed
        const audio = audioRef.current;
        
      if (isPlaying) {
        audio.pause();
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
             playPromise.catch(error => {
                console.error("Audio play failed", error);
                setHasError(true);
                
                // Fallback attempt: sometimes recreating the source or reloading helps
                if (error.name === 'NotAllowedError') {
                    // User interaction requirement usuallyMet by the click..
                } else if (error.name === "NotSupportedError") {
                    console.error("Audio format not supported or file missing");
                }
             });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-4 pointer-events-auto">
      <audio ref={audioRef} src={songUrl} loop onError={() => setHasError(true)} />
      
      <button 
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-10 h-10 border ${hasError ? 'border-yellow-500' : 'border-[#FF2A55]'} rounded-full hover:bg-[#FF2A55]/20 transition-all duration-300`}
        aria-label={isPlaying ? "Pause Phantom Liberty" : "Play Phantom Liberty"}
        title={hasError ? "Audio file missing or blocked" : "Play Phantom Liberty"}
      >
        <span className={`text-[#FF2A55] text-xs font-mono transition-transform duration-300 ${isPlaying ? 'scale-90' : 'scale-100'}`}>
          {hasError ? '!' : (isPlaying ? '||' : '▶')}
        </span>
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-full border border-[#FF2A55] opacity-0 group-hover:opacity-50 group-hover:animate-ping transition-opacity duration-700`} />
      </button>

      <div className="flex flex-col">
        {hasError ? (
           <span className="text-yellow-500 text-xs font-mono tracking-widest opacity-80">
            Audio Missing (Check public/audio)
          </span>
         ) : (
          <>
            <span className="text-[#FF2A55] text-xs font-mono uppercase tracking-widest opacity-80">
              Listening to
            </span>
            <div className="flex items-center gap-2 overflow-hidden h-4">
                <span className="text-white text-sm font-bold tracking-tight whitespace-nowrap animate-marquee">
                Phantom Liberty — Cyberpunk 2077
              </span>
              {/* Visualizer Bars */}
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-[2px] bg-[#FF2A55] animate-music-bar"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: '100%'
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
          0%, 100% { height: 20%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
