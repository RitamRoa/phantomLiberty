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
            fontFamily: 'Cyberpunk, cursive',
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
                
                <div className={`space-y-4 transition-all duration-1000 delay-[500ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <p className="text-[#FF2A55]/70 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  </p>
                  <p className="text-[#FF2A55]/60 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>

                {/* Social Links */}
                <div className={`flex items-center space-x-6 pt-4 transition-all duration-1000 delay-[600ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {/* GitHub */}
                  <a href="https://github.com/RitamRoa" target="_blank" rel="noopener noreferrer" className="text-[#FF2A55] hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="https://www.linkedin.com/in/ritam-roa/" target="_blank" rel="noopener noreferrer" className="text-[#FF2A55] hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  {/* Gmail */}
                  <a href="mailto:ritamrao48@gmail.com" className="text-[#FF2A55] hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/ritam.roa/" target="_blank" rel="noopener noreferrer" className="text-[#FF2A55] hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>

                {/* Book a Call Button */}
                <div className={`pt-2 transition-all duration-1000 delay-[700ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <a href="https://cal.com/ritam-roa" target="_blank" rel="noopener noreferrer" 
                     className="inline-flex items-center justify-center border border-[#FF2A55] text-[#FF2A55] px-8 py-3 hover:bg-[#FF2A55] hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold group"
                     style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    <span>Book a Call</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
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
