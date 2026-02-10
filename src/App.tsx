import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { BaselineAnimation } from './BaselineAnimation';

const App: React.FC = () => {
  const [isVideoDone, setIsVideoDone] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Intro Animation Layer */}
      {!isVideoDone && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <Player
            component={BaselineAnimation}
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
            onEnded={() => {
              // Immediate transition as name zooms past the camera
              setIsVideoDone(true);
            }}
          />
          {/* Skip Button */}
          <button 
            onClick={() => setIsVideoDone(true)}
            className="absolute bottom-10 right-10 text-xs tracking-[0.2em] text-[#ff0033] hover:text-[#ff3366] transition-colors uppercase opacity-50"
          >
            Skip Intro
          </button>
        </div>
      )}

      {/* Portfolio Content */}
      <main className={`transition-opacity duration-1000 ${isVideoDone ? 'opacity-100' : 'opacity-0'}`}>
        {/* Global Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-20 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,0,0,0.02),rgba(255,0,0,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        <section className="h-screen flex flex-col items-center justify-center space-y-8 px-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff0033] rounded-full filter blur-[120px] opacity-10" />
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter glow-text uppercase relative z-10 text-[#ff0033]" style={{ fontFamily: '"Orbitron", sans-serif' }}>
            Ritam Roa
          </h1>
          <p className="text-sm md:text-xl tracking-[0.5em] text-[#ff0033]/60 uppercase relative z-10" style={{ fontFamily: '"Orbitron", sans-serif' }}>
            Full Stack Developer / Creative Technologist
          </p>
          <div className="h-px w-32 bg-[#ff0033]/30 relative z-10" />
          <div className="flex space-x-6 text-sm tracking-widest uppercase relative z-10">
            <a href="#" className="hover:text-[#ff3366] transition-colors border-b border-transparent hover:border-[#ff0033] text-[#ff0033]/80">Works</a>
            <a href="#" className="hover:text-[#ff3366] transition-colors border-b border-transparent hover:border-[#ff0033] text-[#ff0033]/80">About</a>
            <a href="#" className="hover:text-[#ff3366] transition-colors border-b border-transparent hover:border-[#ff0033] text-[#ff0033]/80">Contact</a>
          </div>
          
          <div className="absolute bottom-10 animate-bounce opacity-30">
            <div className="w-px h-16 bg-[#ff0033]" />
          </div>
        </section>
        
        {/* Placeholder sections */}
        <section className="h-screen bg-[#050005] flex items-center justify-center border-t border-[#ff0033]/10">
          <h2 className="text-4xl tracking-widest text-[#ff0033] opacity-20 uppercase">Featured Projects</h2>
        </section>
      </main>
    </div>
  );
};

export default App;
