import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { BaselineAnimation } from './BaselineAnimation';
import { AsciiSphere } from './AsciiSphere';

const App: React.FC = () => {
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [isAboutPinned, setIsAboutPinned] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    // Automatically transition after intro duration (5s) as a fallback
    // and to ensure it "directly goes there"
    const videoTimer = setTimeout(() => {
      setIsVideoDone(true);
    }, 6200); // Increased to 6s + buffer

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
      {/* Cyber Background Lines - Adding more depth like in the pic */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        {new Array(30).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF2A55] to-transparent"
            style={{ 
              left: `${(i / 29) * 100}%`,
              opacity: Math.random() * 0.5,
              transform: `scaleY(${0.5 + Math.random()})`,
            }}
          />
        ))}
      </div>
      {/* Phantom Liberty Side Bar */}
      <div className={`fixed left-0 top-0 bottom-0 w-1 bg-[#FF2A55] z-[101] transition-transform duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${isVideoDone ? 'scale-y-100' : 'scale-y-0'} origin-top`} />

      {/* Intro Animation Layer */}
      <div className={`fixed inset-0 z-[60] bg-black flex items-center justify-center transition-opacity duration-1000 ${isVideoDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isVideoDone && (
          <Player
            component={BaselineAnimation as any}
            durationInFrames={360}
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
          />
        )}
      </div>

      {/* Portfolio Content Layer - On top of video logic */}
      <main className={`relative w-full transition-opacity duration-1000 ${isVideoDone ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Animated "About Me" Heading - Starts centered, then moves */}
        <div 
          className={`fixed transition-all duration-[1200ms] ease-in-out z-[70] pointer-events-none -skew-x-[15deg]
            ${isVideoDone ? 'opacity-100' : 'opacity-0'}
            ${isAboutPinned 
              ? 'top-40 left-16 md:left-32 scale-75 md:scale-95 translate-x-0 translate-y-0' 
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150'
            }`}
          style={{ 
            fontFamily: 'Ryzes, cursive',
            color: '#FF2A55',
            textShadow: '0 0 40px rgba(255, 42, 85, 0.6), 0 0 80px rgba(255, 42, 85, 0.2)'
          }}
        >
          <h2 className="text-7xl md:text-9xl whitespace-nowrap uppercase tracking-tighter italic relative">
            About Me
            {/* Animated Highlight underline like in the pic */}
            <div className={`absolute -bottom-2 left-0 h-1 bg-[#FF2A55] transition-all duration-1000 delay-[1000ms] ${isAboutPinned ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
          </h2>
        </div>

        {/* Hero Section - Content appears after About Me is pinned */}
        <section className="min-h-screen relative flex flex-col justify-start pt-80 pb-32 px-16 md:px-32">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[80vw] h-[80vh] bg-radial-gradient from-[#FF2A55]/5 to-transparent opacity-30 pointer-events-none -translate-x-1/4" />
          
          <div className="relative max-w-7xl w-full">
            <div className="max-w-4xl space-y-12">
              <div className="space-y-6">
                <p 
                  className={`text-[#FF2A55]/90 text-2xl md:text-4xl font-black tracking-tight leading-none uppercase transition-all duration-1000 delay-[200ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                  style={{ fontFamily: '"Orbitron", sans-serif' }}
                >
                  Architect of the Void.
                </p>
                
                <div className={`space-y-4 transition-all duration-1000 delay-[500ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <p className="text-[#FF2A55]/70 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    I construct digital systems where cinematic fidelity meets absolute performance.
                  </p>
                  <p className="text-[#FF2A55]/60 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    A specialized intersection of immersive creative technology and full-stack engineering.
                  </p>
                </div>

                <p 
                  className={`text-[#FF2A55]/40 text-sm md:text-base leading-relaxed uppercase tracking-[0.5em] pt-4 transition-all duration-1000 delay-[800ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                  style={{ fontFamily: '"Orbitron", sans-serif' }}
                >
                  SYST_LOG // VR_COMPLIANT // ARCHV_00
                </p>
              </div>
              
              <div className={`flex space-x-10 pt-12 text-[10px] tracking-[0.6em] uppercase transition-all duration-1000 delay-[1100ms] ${showDescription ? 'opacity-100' : 'opacity-0'}`}>
                <a href="#" className="hover:text-white transition-all text-[#FF2A55] border-b border-[#FF2A55]/50 pb-2 hover:border-[#FF2A55]">ACCESS_WORKS</a>
                <a href="#" className="hover:text-white transition-all text-[#FF2A55]/60">INIT_COMMS</a>
              </div>
            </div>
          </div>
        </section>

        {/* ASCII Sphere Decoration - Fixed position on right side, stays during scroll */}
        <div className={`fixed right-24 top-[40%] -translate-y-1/2 w-[500px] h-[500px] z-[50] transition-all duration-1000 delay-[1500ms] ${showDescription ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          {isAboutPinned && <AsciiSphere color="#FF2A55" />}
        </div>

        {/* Scroll Indicator */}
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${showDescription ? 'opacity-40' : 'opacity-0'}`}>
          <div className="w-[1px] h-20 bg-gradient-to-bottom from-[#FF2A55] to-transparent animate-pulse" />
        </div>
      </main>
    </div>
  );
};

export default App;
