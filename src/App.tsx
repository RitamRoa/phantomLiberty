import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from '@remotion/player';
import { BaselineAnimation } from './BaselineAnimation';
import { AsciiSphere } from './AsciiSphere';
import MusicPlayer from './MusicPlayer';

const GitHubContributionGrid = () => {
  const [contributionData, setContributionData] = useState<{ date: string; count: number; level: number }[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/RitamRoa?y=last')
      .then(res => res.json())
      .then(data => {
        const contributions = data.contributions || [];
        const total = data.total?.lastYear || contributions.reduce((acc: number, curr: any) => acc + curr.count, 0);
        setTotalContributions(total);
        setContributionData(contributions);

        // Calculate Streak
        let streak = 0;
        // Check from the end (most recent) backwards
        // Note: The API might return today as the last entry, or yesterday.
        // We iterate backwards until we find a 0.
        // If the last day is 0, we check if it's today (streak might still be active if yesterday was active)
        // For simplicity, just count consecutive non-zeros from the end.
        for (let i = contributions.length - 1; i >= 0; i--) {
            if (contributions[i].count > 0) {
                streak++;
            } else {
                // If the very last entry is 0, and it's today, we might skip it?
                // But generally, a streak breaks on 0.
                // Let's just break for now.
                if (i === contributions.length - 1) continue; 
                break;
            }
        }
        setCurrentStreak(streak);
      })
      .catch(err => {
        console.error("Failed to fetch GitHub data", err);
      });
  }, []);

  const colors = [
    'bg-[#1a1a1a]',   // Level 0
    'bg-[#440005]',   // Level 1
    'bg-[#880011]',   // Level 2
    'bg-[#ff0033]',   // Level 3
    'bg-[#ff0033]',   // Level 4
  ];

  return (
    <div className="bg-[#0a0a0a]/80 border border-[#ff0033]/20 rounded-2xl p-6 backdrop-blur-sm self-start group hover:border-[#ff0033]/40 transition-all duration-500 overflow-hidden relative w-full max-w-2xl">
      {/* Decorative Corner Glitch */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none">
        <div className="absolute top-2 right-2 w-4 h-[1px] bg-[#ff0033]" />
        <div className="absolute top-2 right-2 w-[1px] h-4 bg-[#ff0033]" />
      </div>

      <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-[#ff0033] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-[#ff0033] rounded-full animate-ping opacity-50" />
            </div>
            <h3 className="text-sm font-bold tracking-[0.3em] text-[#ff0033] uppercase" style={{ fontFamily: '"Orbitron", sans-serif' }}>Activity_Log</h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#ff0033] font-bold font-mono tracking-widest">{totalContributions}_COMMITS</div>
            <div className="text-[8px] text-[#ff0033]/40 font-mono tracking-tighter uppercase">Total_Contributions</div>
          </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-hide flex flex-row-reverse"> 
             {/* flex-row-reverse to start scrolled to the right (latest) mostly? No, standard scroll starts at left. 
                We want to see the LATEST. So we should scroll to end or use rtl direction? 
                Actually standard GitHub grids show left-to-right Jan-Dec.
                Let's stick to standard left-to-right.
             */}
             <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-max pr-4">
                {contributionData.map((day, i) => (
                    <div 
                    key={i} 
                    className={`w-3 h-3 md:w-[13px] md:h-[13px] rounded-[2px] transition-all duration-300 hover:scale-150 hover:z-10 hover:shadow-[0_0_15px_rgba(255,0,51,0.8)] cursor-pointer ${colors[day.level] || colors[0]}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    >
                    </div>
                ))}
            </div>
        </div>
        {/* Tooltip Overlay */}
        {hoveredDay && (
            <div className="absolute top-0 right-0 bg-[#0a0a0a] border border-[#ff0033]/40 px-3 py-1 rounded text-[10px] text-[#ff0033] font-mono z-20 pointer-events-none">
                {hoveredDay.count} contributions on {hoveredDay.date}
            </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#ff0033]/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#ff0033]/60 font-mono font-bold tracking-widest">{currentStreak}_DAY_STREAK</span>
            <span className="text-[8px] text-[#ff0033]/30 font-mono">NODE_STABILITY: MAX</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#ff0033]/5 px-3 py-1.5 rounded-md">
            <span className="text-[9px] text-[#ff0033]/40 mr-1 uppercase tracking-widest font-bold">LEGEND:</span>
            {colors.map((c, i) => <div key={`${c}-${i}`} className={`w-2 h-2 rounded-xs shadow-[0_0_2px_rgba(0,0,0,1)] ${c}`} />)}
          </div>
      </div>
    </div>
  );
};

const TechStack = () => {
  const tools = [
      { name: 'Python', icon: 'python', prof: 90 },
      { name: 'JavaScript', icon: 'javascript', prof: 95 },
      { name: 'C++', icon: 'cplusplus', prof: 85 },
      { name: 'HTML5', icon: 'html5', prof: 98 },
      { name: 'CSS3', icon: 'css3', prof: 95 },
      { name: 'React', icon: 'react', prof: 98 },
      { name: 'Next.js', icon: 'nextdotjs', prof: 92 },
      { name: 'Node.js', icon: 'nodedotjs', prof: 80 },
      { name: 'Git', icon: 'git', prof: 88 },
      { name: 'Vercel', icon: 'vercel', prof: 85 },
      { name: 'Supabase', icon: 'supabase', prof: 80 },
  ];
  
  // Create a doubled list for infinite marquee
  const marqueeTools = [...tools, ...tools, ...tools];

  return (
      <div className="bg-[#0a0a0a]/80 border border-[#ff0033]/20 rounded-2xl p-6 backdrop-blur-sm group hover:border-[#ff0033]/40 transition-all duration-500 overflow-hidden relative w-full h-full flex flex-col">
           <style>{`
             @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
             }
             .animate-marquee {
               animation: marquee 30s linear infinite;
             }
             /* Pause on hover for interaction */
             .group:hover .animate-marquee {
               animation-play-state: paused;
             }
           `}</style>

           {/* Decorative Lines */}
           <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff0033]/20 to-transparent" />

           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-[#ff0033] rounded-full animate-pulse" />
                  <h3 className="text-sm font-bold tracking-[0.3em] text-[#ff0033] uppercase" style={{ fontFamily: '"Orbitron", sans-serif' }}>Loadout_v4.2</h3>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#ff0033] font-bold font-mono tracking-[0.2em]">CORE_SYNCED</div>
                <div className="text-[8px] text-[#ff0033]/40 font-mono tracking-tighter uppercase">Memory_Mapped</div>
              </div>
          </div>

          <div className="relative flex-1 flex items-center overflow-hidden w-full">
               <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
               <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
               
               <div className="flex animate-marquee gap-6 min-w-max">
                  {marqueeTools.map((tool, idx) => (
                      <div key={`${tool.name}-${idx}`} 
                           className="group/icon relative flex flex-col items-center justify-center w-24 h-24 border border-[#ff0033]/5 transition-all duration-300 hover:border-[#ff0033]/40 hover:bg-[#ff0033]/10 rounded-xl cursor-crosshair overflow-visible shrink-0">
                          
                          <img 
                            src={`https://cdn.simpleicons.org/${tool.icon}/ff0033`} 
                            alt={tool.name}
                            className="w-10 h-10 opacity-60 group-hover/icon:opacity-100 transition-all duration-300 group-hover/icon:scale-110"
                          />
                          <span className="text-[9px] mt-3 text-[#ff0033]/40 uppercase tracking-[0.2em] transition-colors group-hover/icon:text-[#ff0033] font-bold">{tool.name}</span>
                      </div>
                  ))}
               </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border border-[#ff0033]/10 rounded-lg p-3 bg-white/1">
                <div className="text-[8px] text-[#ff0033]/40 uppercase tracking-widest mb-1">MOST_ACTIVE</div>
                <div className="text-xs font-bold text-[#ff0033] font-mono tracking-tight">FRONTEND_ENGINEERING</div>
              </div>
              <div className="border border-[#ff0033]/10 rounded-lg p-3 bg-white/1">
                <div className="text-[8px] text-[#ff0033]/40 uppercase tracking-widest mb-1">SYSTEM_OS</div>
                <div className="text-xs font-bold text-[#ff0033] font-mono tracking-tight">NEURAL_PROJECT_X</div>
              </div>
          </div>
      </div>
  );
};

const App: React.FC = () => {
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [isAboutPinned, setIsAboutPinned] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const staticAnimRef = useRef<number>(undefined);
  const staticTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastScrollY = useRef(0);

  const drawStatic = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = val;
      data[i + 1] = val * 0.1; // tint red-ish
      data[i + 2] = val * 0.1;
      data[i + 3] = Math.random() * 60; // very subtle
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas || !showStatic) {
      if (staticAnimRef.current) cancelAnimationFrame(staticAnimRef.current);
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const loop = () => {
      drawStatic(canvas);
      staticAnimRef.current = requestAnimationFrame(loop);
    };
    staticAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (staticAnimRef.current) cancelAnimationFrame(staticAnimRef.current);
    };
  }, [showStatic, drawStatic]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY.current) {
        setShowStatic(true);
        clearTimeout(staticTimeoutRef.current);
        staticTimeoutRef.current = setTimeout(() => setShowStatic(false), 350);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Scroll-up Static Overlay */}
      <canvas
        ref={staticCanvasRef}
        className="fixed inset-0 pointer-events-none z-[102]"
        style={{
          opacity: showStatic ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
          mixBlendMode: 'screen',
        }}
      />
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
        
        {/* Animated "About Me" Heading - Starts centered, then moves using transform for smoothness */}
        <div 
          className={`fixed z-0 pointer-events-none 
            ${isVideoDone ? 'opacity-100' : 'opacity-0'}
            ${isAboutPinned ? '' : 'z-[70]'}`}
          style={{ 
            willChange: 'transform, top, left',
            transition: 'top 1200ms cubic-bezier(0.16, 1, 0.3, 1), left 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
            top: isAboutPinned ? '4rem' : '50%', 
            left: isAboutPinned ? '8rem' : '50%',
            transform: isAboutPinned ? 'none' : 'translate(-50%, -50%) scale(1.5)'
          }} 
        >
           <div className="-skew-x-[15deg]">
              <h2 className="text-6xl md:text-8xl whitespace-nowrap uppercase tracking-tighter italic relative"
                  style={{ 
                    fontFamily: 'Cyberpunk, cursive',
                    color: '#FF2A55',
                    textShadow: '0 0 40px rgba(255, 42, 85, 0.6), 0 0 80px rgba(255, 42, 85, 0.2)'
                  }}>
                About Me
                <div className={`absolute -bottom-2 left-0 h-1 bg-[#FF2A55] transition-all duration-1000 delay-[1000ms] ${isAboutPinned ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
              </h2>
           </div>
        </div>
        
        {/* Hero Section - Content appears after About Me is pinned */}
        {/* We use 'fixed' for the hero content so it stays in place while 'Experience' scrolls over it */}
        <div className="relative z-[10] h-[150vh] pointer-events-none">
             {/* Fixed content container */}
             <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-start">

                 {/* ASCII Sphere - right side, part of About Me layer so it gets covered by Experiences */}
                 <div className={`absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 delay-[1200ms] ${isAboutPinned ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'}`}>
                     {isAboutPinned && (
                       <div className="w-[600px] h-[600px] pointer-events-auto hover:cursor-grab active:cursor-grabbing">
                           <AsciiSphere color="#FF2A55" size={600} />
                       </div>
                     )}
                 </div>

                 {/* Music Player */}
                 <div className={`absolute top-[12vh] right-[10%] transition-opacity duration-1000 delay-[1500ms] ${isAboutPinned ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <MusicPlayer />
                 </div>

                 {/* Only allow pointer events on the content itself */}
                 <section className="relative flex flex-col px-8 md:px-32 pointer-events-auto w-full overflow-y-auto" style={{ paddingTop: '11rem' }}>
              {/* Background Glow */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[80vw] h-[80vh] bg-radial-gradient from-[#FF2A55]/5 to-transparent opacity-30 pointer-events-none -translate-x-1/4" />
              
              <div className="relative max-w-7xl w-full">
                <div className="max-w-4xl space-y-8 md:space-y-12">
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
                    <div className={`pt-8 pb-8 transition-all duration-1000 delay-[700ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

                  {/* Bento Section - Widgets */}
                  <div className={`mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-[1300ms] ${showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                      <GitHubContributionGrid />
                      <TechStack />
                  </div>
                </div>
              </div>
            </section>
             </div>
        </div>

        {/* Experiences Section - overlaps previous section */}
        <section className="relative w-full min-h-screen z-20 pt-32 pb-64 bg-black">
             {/* Decorative Top Gradient to smooth the overlap */}
             <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-black -mt-64 pointer-events-none" />
             
             <div className="relative w-full" style={{ paddingLeft: '8rem', paddingRight: '4rem' }}>
                 {/* Section Header */}
                 <div className="mb-20">
                    <div className="-skew-x-[15deg] inline-block">
                    <h2 className="text-6xl md:text-8xl whitespace-nowrap uppercase tracking-tighter italic relative inline-block z-30"
                        style={{ 
                            fontFamily: 'Cyberpunk, cursive',
                            color: '#FF2A55',
                            textShadow: '0 0 40px rgba(255, 42, 85, 0.6), 0 0 80px rgba(255, 42, 85, 0.2)'
                        }}>
                        Experiences
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#FF2A55] opacity-50" />
                    </h2>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#FF2A55] animate-pulse" />
                        <span className="text-xs text-[#FF2A55]/60 font-mono tracking-[0.3em] uppercase">Career_Logs // Decryped</span>
                    </div>
                 </div>

                 {/* Experience Items Placeholder */}
                 <div className="space-y-12 border-l-2 border-[#FF2A55]/20 pl-8 ml-4 md:ml-10">
                     
                     {/* Experience Item 1 */}
                     <div className="relative group">
                         {/* Timeline Dot */}
                         <div className="absolute -left-[41px] top-2 w-5 h-5 bg-[#0a0a0a] border-2 border-[#FF2A55] rounded-full group-hover:bg-[#FF2A55] group-hover:shadow-[0_0_20px_rgba(255,42,85,0.6)] transition-all duration-300">
                            <div className="absolute inset-0 bg-[#FF2A55] rounded-full opacity-0 group-hover:animate-ping" />
                         </div>

                         <div className="space-y-2 mb-2">
                             <div className="text-xs text-[#FF2A55] font-mono tracking-widest uppercase">2023 - Present</div>
                             <h3 className="text-2xl md:text-3xl text-white font-bold uppercase tracking-wide" style={{ fontFamily: '"Orbitron", sans-serif' }}>Senior Netrunner</h3>
                             <div className="text-sm text-[#FF2A55]/80 font-mono uppercase tracking-wider">Arasaka Corp (Placeholder)</div>
                         </div>
                         <p className="text-[#FF2A55]/60 text-base md:text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Breaching firewalls and extracting secure data packages. Leading a team of phantom agents in cyberspace.
                         </p>
                     </div>

                      {/* Experience Item 2 */}
                      <div className="relative group">
                         <div className="absolute -left-[41px] top-2 w-5 h-5 bg-[#0a0a0a] border-2 border-[#FF2A55] rounded-full group-hover:bg-[#FF2A55] group-hover:shadow-[0_0_20px_rgba(255,42,85,0.6)] transition-all duration-300" />

                         <div className="space-y-2 mb-2">
                             <div className="text-xs text-[#FF2A55] font-mono tracking-widest uppercase">2021 - 2023</div>
                             <h3 className="text-2xl md:text-3xl text-white font-bold uppercase tracking-wide" style={{ fontFamily: '"Orbitron", sans-serif' }}>Cyber Security Analyst</h3>
                             <div className="text-sm text-[#FF2A55]/80 font-mono uppercase tracking-wider">Militech Systems</div>
                         </div>
                         <p className="text-[#FF2A55]/60 text-base md:text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                             Identifying vulnerabilities in neural networks. Protocol enforcement and ICE development for high-security data fortresses.
                         </p>
                     </div>

                 </div>
             </div>
        </section>


        {/* Scroll Indicator */}
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${showDescription ? 'opacity-40' : 'opacity-0'}`}>
          <div className="w-[1px] h-20 bg-gradient-to-bottom from-[#FF2A55] to-transparent animate-pulse" />
        </div>
      </main>
    </div>
  );
};

export default App;
