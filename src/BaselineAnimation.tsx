import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';

const RED = '#ff0033'; // Back to Red
const DEEP_RED = '#440005';
const BRIGHT_RED = '#ff3366';
const BLACK = '#020002';

export const BaselineAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Transition: 0 to 1
  const transitionProgress = spring({
    frame: frame - 45,
    fps,
    config: {
      damping: 100,
      stiffness: 40,
    },
  });

  const cameraZoom = interpolate(frame, [0, 300], [1, 1.3], {
    extrapolateRight: 'clamp',
  });

  const perspective = interpolate(transitionProgress, [0, 1], [1200, 450]);
  const rotationX = interpolate(transitionProgress, [0, 1], [0, 88]);
  const mainScale = interpolate(transitionProgress, [0, 1], [1, 2.5]) * cameraZoom;

  // Severe shaking during crash (frames 50-65)
  const isCrashed = frame > 50 && frame < 65;
  const shakeX = isCrashed ? (Math.random() - 0.5) * 50 : 0;
  const shakeY = isCrashed ? (Math.random() - 0.5) * 50 : 0;

  // Subtle chromatic aberration peak during transition
  const chromaticIntensity = interpolate(transitionProgress, [0, 0.5, 1], [0, 15, 2]) + (isCrashed ? 20 : 0);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: BLACK, 
      overflow: 'hidden',
      transform: `translate(${shakeX}px, ${shakeY}px)`
    }}>
      {/* 1. Underlying Haze */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, ${DEEP_RED} 0%, transparent 80%)`,
        opacity: interpolate(transitionProgress, [0, 1], [0.4, 0.8]),
      }} />

      {/* Chromatic Layer for Transition */}
      <div style={{
        position: 'absolute',
        inset: 0,
        filter: `drop-shadow(${chromaticIntensity}px 0px 0px rgba(255,0,0,0.3)) drop-shadow(-${chromaticIntensity/2}px 0px 0px rgba(0,255,255,0.2))`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* 2. Main 3D Container */}
        <div
          style={{
            perspective: `${perspective}px`,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `rotateX(${rotationX}deg) scale(${mainScale})`,
              transformStyle: 'preserve-3d',
              position: 'relative',
            }}
          >
            {/* Vertical Phase (Baseline Test) */}
            <VerticalBaseline progress={transitionProgress} />
            
            {/* Horizontal Phase (Cyberpunk Grid) */}
            <HorizontalDetailedGrid progress={transitionProgress} />
            
            {/* Depth Particles */}
            <DepthParticles progress={transitionProgress} />
          </div>
        </div>
      </div>

      {/* 3. Final Name Reveal */}
      <NameReveal progress={transitionProgress} />

      {/* 4. Post-Processing Layers */}
      <StaticOverlay />
      <GlitchBurst />
      <Grain />
      <ScanlinesDetailed />
      <CrtBezel />
      
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, black 140%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

const VerticalBaseline: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(progress, [0, 0.6], [1, 0]);
  if (opacity <= 0) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Underlying data streams */}
      {new Array(10).fill(0).map((_, i) => {
        const x = (i / 9) * 100;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            width: '1px',
            height: '100%',
            background: `linear-gradient(to bottom, transparent, ${RED}22, transparent)`,
            transform: `translateY(${((frame * 5 + (i * 100)) % 200) - 50}%)`,
          }} />
        )
      })}

      {/* Thick blurred bands like in Pic 1 */}
      {[10, 25, 40, 55, 70, 85].map((x, i) => (
        <div
          key={`band-${i}`}
          style={{
            position: 'absolute',
            left: `${x}%`,
            width: '15%',
            height: '100%',
            backgroundColor: RED,
            filter: 'blur(60px)',
            opacity: interpolate(Math.sin(frame / 25 + i), [-1, 1], [0.1, 0.5]),
            transform: `translateX(-50%)`,
          }}
        />
      ))}

      {/* Point Clusters / Dust Clouds like in Pic 1 */}
      {new Array(15).fill(0).map((_, groupIndex) => {
        const groupX = (groupIndex / 14) * 100;
        return (
          <div key={groupIndex} style={{ position: 'absolute', left: `${groupX}%`, top: 0, bottom: 0, width: '40px' }}>
            {new Array(20).fill(0).map((__, dotIndex) => {
              const seed = groupIndex * 100 + dotIndex;
              const y = (seed * 13) % 100;
              const flicker = Math.random() > 0.8 ? 0.3 : 1;
              return (
                <div key={dotIndex} style={{
                  position: 'absolute',
                  top: `${y}%`,
                  left: `${Math.sin(y + frame/10) * 10}px`,
                  width: '2px',
                  height: '2px',
                  backgroundColor: BRIGHT_RED,
                  boxShadow: `0 0 5px ${RED}`,
                  opacity: flicker * 0.4,
                }} />
              );
            })}
          </div>
        )
      })}

      {/* Sharp scanlines */}
      {new Array(120).fill(0).map((_, i) => {
        const xPos = (i / 119) * 100;
        const seed = i * 14.5;
        const heightVar = interpolate(Math.sin(frame / 15 + seed), [-1, 1], [40, 100]);
        const flicker = Math.random() > 0.95 ? 0.1 : 1;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              top: `${(100 - heightVar) / 2}%`,
              height: `${heightVar}%`,
              width: i % 12 === 0 ? '2px' : '1px',
              backgroundColor: RED,
              boxShadow: i % 12 === 0 ? `0 0 20px ${RED}` : 'none',
              opacity: (i % 6 === 0 ? 0.6 : 0.05) * flicker,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const HorizontalDetailedGrid: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(progress, [0.2, 0.8], [0, 1]);
  if (opacity <= 0) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Floor and Ceiling Grids */}
      {['top', 'bottom'].map((side) => (
        <div key={side} style={{ 
          position: 'absolute', 
          [side]: '-25%', 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d',
          transform: side === 'top' ? 'rotateX(180deg)' : 'none'
        }}>
          {/* Main Grid Lines */}
          {new Array(100).fill(0).map((_, i) => (
            <div
              key={`h-${i}`}
              style={{
                position: 'absolute',
                top: `${(i / 99) * 100}%`,
                width: '100%',
                height: '1px',
                backgroundColor: i % 10 === 0 ? BRIGHT_RED : RED,
                boxShadow: i % 10 === 0 ? `0 0 15px ${RED}` : 'none',
                opacity: interpolate(i, [0, 100], [1, 0]),
              }}
            />
          ))}
          {/* Perspective Lines */}
          {new Array(60).fill(0).map((_, i) => (
            <div
              key={`v-${i}`}
              style={{
                position: 'absolute',
                left: `${(i / 59) * 100}%`,
                height: '100%',
                width: '1px',
                backgroundColor: RED,
                opacity: 0.15,
              }}
            />
          ))}
          
          {/* Glitchy horizontal blocks as seen in Pic 2 */}
          {new Array(10).fill(0).map((_, i) => {
            const seed = i * 22.3;
            const top = (seed % 90);
            const width = 10 + (seed % 30);
            if (frame % 30 < i * 2) return null;
            return (
              <div key={i} style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${(seed * 7) % 50}%`,
                width: `${width}%`,
                height: '2px',
                backgroundColor: BRIGHT_RED,
                boxShadow: `0 0 10px ${RED}`,
                opacity: 0.4
              }} />
            )
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const DepthParticles: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(progress, [0.3, 1], [0, 1]);
  
  return (
    <AbsoluteFill style={{ opacity }}>
      {/* High density cluster clouds as seen in the images */}
      {new Array(500).fill(0).map((_, i) => {
        const seed = i * 23.5;
        const x = (seed % 140) - 20;
        const z = -((seed * 47) % 3000);
        const yOffset = (seed * 11) % 100;
        const speed = 1.0 + (seed % 3.0);
        const yBase = interpolate((frame * speed + yOffset) % 250, [0, 250], [250, -150]);
        
        const flicker = Math.sin(frame/8 + seed) > 0.3 ? 1 : 0.2;
        const size = i % 25 === 0 ? 4 : 1;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              bottom: `${yBase}%`, // Move from bottom up for variety
              transform: `translateZ(${z}px)`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: i % 15 === 0 ? BRIGHT_RED : RED,
              boxShadow: i % 15 === 0 ? `0 0 12px ${BRIGHT_RED}` : `0 0 10px ${RED}`,
              opacity: interpolate(z, [-3000, 0], [0, 1.0]) * flicker,
              borderRadius: '50%',
            }}
          >
            {/* Long faint trails like in the image */}
            {i % 4 === 0 && (
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                width: '1px',
                height: '150px',
                background: `linear-gradient(to top, ${RED}, transparent)`,
                opacity: 0.15,
                transform: 'translateX(-50%)'
              }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const NameReveal: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  
  // Start revealing name late in the sequence (around 3 seconds in)
  const startFrame = 180;
  const revealProgress = spring({
    frame: frame - startFrame,
    fps: 60,
    config: {
      damping: 15,
      stiffness: 10,
    },
  });

  // Smooth Zoom Out (Exit) using Spring for inertia
  const endStartFrame = 230; // Start slightly earlier for smoother ramp-up
  const zoomSpring = spring({
    frame: frame - endStartFrame,
    fps: 60,
    config: {
      damping: 60, // Higher damping for silkier movement
      stiffness: 12,
      mass: 3,
    },
  });

  const spacing = interpolate(revealProgress, [0, 1], [-10, 15]); 
  const revealOpacity = interpolate(revealProgress, [0, 0.4, 1], [0, 0.9, 0.8]); 
  
  // Fade out logic: More exponential fade-out starting earlier
  const zoomOpacity = interpolate(zoomSpring, [0.4, 0.9], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth exponential fade
  });

  // Forward Movement & Scaling - Using extreme scale and Z for "passing through"
  const zScale = interpolate(zoomSpring, [0, 1], [1, 20], {
    easing: (t) => t * t * t, // Even faster acceleration at the very end
  });
  const zTranslate = interpolate(zoomSpring, [0, 1], [0, 3000], {
    easing: (t) => t * t * t,
  });
  const motionBlur = interpolate(zoomSpring, [0, 0.7, 1], [0, 1, 40]); // Heavy final blur
  const exitSpacing = interpolate(zoomSpring, [0, 1], [spacing, spacing * 12]);

  // Subtle static flicker logic
  const isFlickering = Math.random() > 0.96;
  const flickerOpacity = isFlickering ? 0.3 : 1;
  const flickerShift = isFlickering ? (Math.random() - 0.5) * 10 : 0;

  if (frame < startFrame) return null;

  return (
    <>
      {/* Motion trail / Ghosting effect to smooth out the zoom */}
      {zoomSpring > 0.1 && [0.15, 0.3].map((offset) => (
        <div
          key={offset}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateZ(${zTranslate - offset * 400}px) scale(${zScale - offset}) skewX(-15deg)`,
            textAlign: 'center',
            width: '100%',
            zIndex: 89,
            opacity: zoomOpacity * 0.15, // Very faint
            filter: `blur(${motionBlur + 5}px)`,
            perspective: '2000px',
          }}
        >
          <div style={{ color: '#ff0033', fontFamily: 'Ryzes, cursive', fontSize: 160, letterSpacing: `${exitSpacing}px` }}>
            Ritam Roa
          </div>
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateX(${flickerShift}px) translateZ(${zTranslate}px) scale(${zScale}) skewX(-15deg)`,
          textAlign: 'center',
          width: '100%',
          zIndex: 90,
          opacity: revealOpacity * zoomOpacity * flickerOpacity,
          filter: `blur(${motionBlur}px)`,
          perspective: '2000px',
          willChange: 'transform, opacity',
          transformStyle: 'preserve-3d',
        }}
      >
      <div
        style={{
          color: '#ff0033', 
          fontFamily: 'Ryzes, cursive',
          fontSize: 160,
          fontWeight: 400,
          letterSpacing: `${exitSpacing}px`,
          textTransform: 'uppercase',
          textShadow: `0 0 20px #ff0033, 0 0 40px rgba(255, 0, 51, 0.5), 8px 8px 0px #000`,
          mixBlendMode: 'screen',
          lineHeight: 1,
          backfaceVisibility: 'hidden',
        }}
      >
        Ritam Roa
      </div>
    </div>
    </>
  );
};


const StaticOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Create a "crash" window between frame 50 and 65 (transition point)
  const isCrashed = frame > 50 && frame < 65;
  const isRandomStutter = Math.random() > 0.95;
  
  if (!isCrashed && !isRandomStutter) return null;

  const opacity = isCrashed ? 0.3 : 0.08;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, mixBlendMode: 'screen', zIndex: 100 }}>
      {/* Full screen static noise */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        transform: `translate(${Math.random() * 50}px, ${Math.random() * 50}px)`,
        filter: 'contrast(150%) brightness(200%)',
      }} />
      
      {/* Heavy horizontal interference bands */}
      {isCrashed && new Array(10).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          width: '100%',
          height: `${Math.random() * 50}px`,
          backgroundColor: i % 2 === 0 ? BRIGHT_RED : RED,
          opacity: 0.4,
          transform: `translateX(${(Math.random() - 0.5) * 100}px)`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const GlitchBurst: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Intensive glitch during the "crash"
  const isCrashed = frame > 50 && frame < 65;
  const intensity = isCrashed || Math.random() > 0.98 ? 1 : 0;
  
  if (intensity === 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 101 }}>
      {/* Ghosting */}
      <AbsoluteFill style={{ 
        backgroundColor: `rgba(255, 0, 51, 0.3)`, 
        transform: `translate(${Math.random() * 20}px, 0)`,
        mixBlendMode: 'difference' 
      }} />
      
      {/* Random black bars (loss of signal) */}
      {isCrashed && new Array(5).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          width: '100%',
          height: `${Math.random() * 100}px`,
          backgroundColor: '#000',
        }} />
      ))}

      {/* Extreme horizontal displacement */}
      {new Array(5).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          width: '100%',
          height: `${Math.random() * 15}%`,
          backgroundColor: `rgba(255, 0, 51, 0.4)`,
          transform: `translateX(${(Math.random() - 0.5) * 200}px)`,
          mixBlendMode: 'overlay'
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.1 }}>
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            seed={frame} 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </AbsoluteFill>
  );
};

const ScanlinesDetailed: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0.4) 1px,
        rgba(0, 0, 0, 0) 2px
      )`,
      backgroundSize: '100% 3px',
    }}
  />
);

const CrtBezel: React.FC = () => (
  <AbsoluteFill style={{
    pointerEvents: 'none',
    boxShadow: 'inset 0 0 150px rgba(0,0,0,1), inset 0 0 50px rgba(255,0,50,0.1)',
  }} />
);


