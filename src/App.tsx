import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { BaselineAnimation } from './BaselineAnimation';

const App: React.FC = () => {
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [isAboutPinned, setIsAboutPinned] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    // Automatically transition after intro duration (5s) as a fallback
    // and to ensure it "directly goes there"
    const videoTimer = setTimeout(() => {
      setIsVideoDone(true);
    }, 5200); // 5s duration + small buffer

    return () => clearTimeout(videoTimer);
  }, []);

  useEffect(() => {
    if (isVideoDone) {
      // Step 2: About Me moves to target position after delay
      const pinTimer = setTimeout(() => {
        setIsAboutPinned(true);
      }, 1000);

      // Step 3: Description starts to appear after move
      const descTimer = setTimeout(() => {
        setShowDescription(true);
      }, 2000);

      return () => {
        clearTimeout(pinTimer);
        clearTimeout(descTimer);
      };
    }
  }, [isVideoDone]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden font-mono">
      {/* Global Scanline Overlay - Permanent for theme consistency */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,0,0,0.02),rgba(255,0,0,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Phantom Liberty Side Bar */}
      <div className={`fixed left-0 top-0 bottom-0 w-1 bg-[#ff0033] z-[101] transition-transform duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${isVideoDone ? 'scale-y-100' : 'scale-y-0'} origin-top`} />

      {/* Intro Animation Layer */}
      <div className={`fixed inset-0 z-[60] bg-black flex items-center justify-center transition-opacity duration-1000 ${isVideoDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isVideoDone && (
          <Player
            component={BaselineAnimation as any}
            durationInFrames={300}
            fps={60}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100vw',
              height: '100vh',
            }}
            controls={false}
            autoPlay
            loop={false}
            onEnded={() => setIsVideoDone(true)}
          />
        )}
      </div>

      {/* Portfolio Content Layer - On top of video logic */}
      <main className={`relative w-full transition-opacity duration-1000 ${isVideoDone ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Animated "About Me" Heading - Starts centered, then moves */}
        <div 
          className={`fixed transition-all duration-[1200ms] ease-in-out z-[70] pointer-events-none -skew-x-[12deg]
            ${isVideoDone ? 'opacity-100' : 'opacity-0'}
            ${isAboutPinned 
              ? 'top-40 left-16 md:left-32 scale-75 md:scale-90 translate-x-0 translate-y-0' 
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150'
            }`}
          style={{ 
            fontFamily: 'Ryzes, cursive',
            color: '#ff0033',
            textShadow: '0 0 40px rgba(255, 0, 51, 0.4)'
          }}
        >
          <h2 className="text-7xl md:text-9xl whitespace-nowrap uppercase tracking-tighter">
            About Me
          </h2>
        </div>

        {/* Hero Section - Content appears after About Me is pinned */}
        <section className="min-h-screen relative flex flex-col justify-start pt-80 px-16 md:px-32">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[80vw] h-[80vh] bg-radial-gradient from-[#ff0033]/5 to-transparent opacity-30 pointer-events-none -translate-x-1/4" />
          
          <div className="max-w-4xl space-y-12">
            <div className="space-y-6">
              <p 
                className={`text-[#ff0033]/90 text-2xl md:text-4xl font-black tracking-tight leading-none uppercase transition-all duration-1000 delay-[200ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                style={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Architect of the Void.
              </p>
              
              <div className={`space-y-4 transition-all duration-1000 delay-[500ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-[#ff0033]/70 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                  I construct digital systems where cinematic fidelity meets absolute performance.
                </p>
                <p className="text-[#ff0033]/60 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                  A specialized intersection of immersive creative technology and full-stack engineering.
                </p>
              </div>

              <p 
                className={`text-[#ff0033]/40 text-sm md:text-base leading-relaxed uppercase tracking-[0.5em] pt-4 transition-all duration-1000 delay-[800ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                style={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                SYST_LOG // VR_COMPLIANT // ARCHV_00
              </p>
            </div>
            
            <div className={`flex space-x-10 pt-12 text-[10px] tracking-[0.6em] uppercase transition-all duration-1000 delay-[1100ms] ${showDescription ? 'opacity-100' : 'opacity-0'}`}>
              <a href="#" className="hover:text-white transition-all text-[#ff0033] border-b border-[#ff0033]/50 pb-2 hover:border-[#ff0033]">ACCESS_WORKS</a>
              <a href="#" className="hover:text-white transition-all text-[#ff0033]/60">INIT_COMMS</a>
            </div>
          </div>
        </section>

        {/* Scroll Indicator */}
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${showDescription ? 'opacity-40' : 'opacity-0'}`}>
          <div className="w-[1px] h-20 bg-gradient-to-bottom from-[#ff0033] to-transparent animate-pulse" />
        </div>
      </main>
    </div>
  );
};

export default App;
