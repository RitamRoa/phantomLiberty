import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';

const RED = '#FF2A55'; 
const DEEP_RED = '#330011';
const BRIGHT_RED = '#FF5E7E';
const BLACK = '#020002';

export const BaselineAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionProgress = spring({
    frame: frame - 45,
    fps,
    config: {
      damping: 100,
      stiffness: 40,
    },
  });

  const cameraZoom = interpolate(frame, [0, 360], [1, 1.3], {
    extrapolateRight: 'clamp',
  });

  const perspective = interpolate(transitionProgress, [0, 1], [1200, 450]);
  const rotationX = interpolate(transitionProgress, [0, 1], [0, 88]);
  const mainScale = interpolate(transitionProgress, [0, 1], [1, 2.5]) * cameraZoom;

  const isCrashed = frame > 50 && frame < 65;
  const shakeX = isCrashed ? Math.sin(frame * 2.5) * 50 : 0;
  const shakeY = isCrashed ? Math.cos(frame * 3.5) * 50 : 0;

  const chromaticIntensity = interpolate(transitionProgress, [0, 0.5, 1], [0, 15, 2]) + (isCrashed ? 20 : 0);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: BLACK, 
      overflow: 'hidden',
      transform: `translate(${shakeX}px, ${shakeY}px)`
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, ${DEEP_RED} 0%, transparent 80%)`,
        opacity: interpolate(transitionProgress, [0, 1], [0.4, 0.8]),
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        filter: `drop-shadow(${chromaticIntensity}px 0px 0px rgba(255,0,0,0.3)) drop-shadow(-${chromaticIntensity/2}px 0px 0px rgba(0,255,255,0.2))`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
            <VerticalBaseline progress={transitionProgress} />
            <HorizontalDetailedGrid progress={transitionProgress} />
            <DepthParticles progress={transitionProgress} />
          </div>
        </div>
      </div>

      <NameReveal progress={transitionProgress} />

      <StaticOverlay />
      <GlitchBurst />
      <Grain />
      <ScanlinesDetailed />
      <CrtBezel />
      
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
      {new Array(6).fill(0).map((_, i) => { // Reduced from 10
        const x = (i / 5) * 100;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            width: '1px',
            height: '100%',
            background: `linear-gradient(to bottom, transparent, ${RED}22, transparent)`,
            transform: `translateY(${((frame * 5 + (i * 100)) % 200) - 50}%)`,
            willChange: 'transform' // Added hint
          }} />
        )
      })}

      {[15, 50, 85].map((x, i) => ( // Reduced from 6 items to 3
        <div
          key={`band-${i}`}
          style={{
            position: 'absolute',
            left: `${x}%`,
            width: '10%', // Reduced width
            height: '100%',
            backgroundColor: RED,
            opacity: interpolate(Math.sin(frame / 25 + i), [-1, 1], [0.05, 0.15]), // Very low opacity instead of blur
            transform: `translateX(-50%)`,
          }}
        />
      ))}

      {new Array(5).fill(0).map((_, groupIndex) => { // Reduced from 8 to 5
        const groupX = (groupIndex / 4) * 100;
        return (
          <div key={groupIndex} style={{ position: 'absolute', left: `${groupX}%`, top: 0, bottom: 0, width: '40px' }}>
            {new Array(5).fill(0).map((__, dotIndex) => { // Reduced from 10 to 5
              const seed = groupIndex * 100 + dotIndex;
              const y = (seed * 13) % 100;
              const flicker = Math.sin(frame / 10 + seed) > 0.8 ? 0.3 : 1;
              return (
                <div key={dotIndex} style={{
                  position: 'absolute',
                  top: `${y}%`,
                  left: `${Math.sin(y + frame/10) * 10}px`,
                  width: '2px',
                  height: '2px',
                  backgroundColor: BRIGHT_RED,
                  opacity: flicker * 0.4,
                  // Removed box-shadow
                }} />
              );
            })}
          </div>
        )
      })}

      {new Array(20).fill(0).map((_, i) => { // Reduced from 40 to 20
        const xPos = (i / 19) * 100;
        const seed = i * 14.5;
        const heightVar = interpolate(Math.sin(frame / 15 + seed), [-1, 1], [40, 100]);
        const flicker = Math.sin(frame + i) > 0.95 ? 0.1 : 1;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              top: `${(100 - heightVar) / 2}%`,
              height: `${heightVar}%`,
              width: '1px',
              backgroundColor: RED,
              opacity: (i % 2 === 0 ? 0.6 : 0.05) * flicker,
              // Removed box-shadow
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
      {['top', 'bottom'].map((side) => (
        <div key={side} style={{ 
          position: 'absolute', 
          [side]: '-25%', 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d',
          transform: side === 'top' ? 'rotateX(180deg)' : 'none'
        }}>
          {new Array(20).fill(0).map((_, i) => ( // Reduced from 40 to 20
            <div
              key={`h-${i}`}
              style={{
                position: 'absolute',
                top: `${(i / 19) * 100}%`,
                width: '100%',
                height: '1px',
                backgroundColor: i % 4 === 0 ? BRIGHT_RED : RED,
                opacity: interpolate(i, [0, 20], [0.8, 0]),
                // Removed box-shadow
              }}
            />
          ))}
          {new Array(15).fill(0).map((_, i) => ( // Reduced from 30 to 15
            <div
              key={`v-${i}`}
              style={{
                position: 'absolute',
                left: `${(i / 14) * 100}%`,
                height: '100%',
                width: i % 3 === 0 ? '2px' : '1px',
                backgroundColor: i % 3 === 0 ? BRIGHT_RED : RED,
                opacity: i % 3 === 0 ? 0.4 : 0.1,
                // Removed box-shadow
              }}
            />
          ))}
          
          {new Array(8).fill(0).map((_, i) => { // Reduced from 15 to 8
            const seed = i * 31.7;
            const top = (seed % 80);
            const left = (seed * 13) % 100;
            const height = 15 + (seed % 40);
            const isBright = i % 4 === 0;
            const flicker = Math.sin(frame / 10 + i) > 0 ? 1 : 0.3;
            
            return (
              <div key={`pillar-${i}`} style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                width: isBright ? '3px' : '1px',
                height: `${height}%`,
                backgroundColor: isBright ? BRIGHT_RED : RED,
                opacity: (isBright ? 0.7 : 0.3) * flicker,
                transform: 'translateZ(-100px)',
                // Removed box-shadow
              }} />
            );
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
      {new Array(80).fill(0).map((_, i) => { // Reduced from 200 to 80
        const seed = i * 23.5;
        const x = (seed % 180) - 40;
        const z = -((seed * 71) % 5000);
        const yOffset = (seed * 11) % 100;
        
        const speed = 0.5 + (seed % 2.0);
        const yPos = (yOffset + frame * speed) % 100;
        
        const flicker = Math.sin(frame / 10 + seed) > 0.4 ? 1 : 0.2;
        const size = i % 40 === 0 ? 3 : 1;
        const isBright = i % 20 === 0;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${yPos}%`,
              transform: `translateZ(${z}px)`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: isBright ? BRIGHT_RED : RED,
              opacity: (isBright ? 0.9 : 0.3) * flicker,
              borderRadius: '50%',
              // Removed box-shadow
            }}
          >
            {i % 80 === 0 && ( // Drastically reduced frequency of long trails
              <div style={{
                position: 'absolute',
                top: '-200px',
                left: '50%',
                width: '1px',
                height: '400px',
                background: `linear-gradient(to bottom, transparent, ${RED}, transparent)`,
                opacity: 0.1,
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
  
  const startFrame = 180;
  const revealProgress = spring({
    frame: frame - startFrame,
    fps: 60,
    config: {
      damping: 15,
      stiffness: 10,
    },
  });

  const endStartFrame = 290; // Delayed by 60 frames (1s)
  const zoomSpring = spring({
    frame: frame - endStartFrame,
    fps: 60,
    config: {
      damping: 60,
      stiffness: 12,
      mass: 3,
    },
  });

  const spacing = interpolate(revealProgress, [0, 1], [-10, 15]); 
  const revealOpacity = interpolate(revealProgress, [0, 0.4, 1], [0, 0.9, 0.8]); 
  
  const zoomOpacity = interpolate(zoomSpring, [0.4, 0.9], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const zScale = interpolate(zoomSpring, [0, 1], [1, 20], {
    easing: (t) => t * t * t,
  });
  const zTranslate = interpolate(zoomSpring, [0, 1], [0, 3000], {
    easing: (t) => t * t * t,
  });
  const motionBlur = interpolate(zoomSpring, [0, 0.7, 1], [0, 1, 40]);
  const exitSpacing = interpolate(zoomSpring, [0, 1], [spacing, spacing * 12]);

  const flickerSeed = Math.sin(frame * 0.5);
  const isFlickering = flickerSeed > 0.9;
  const flickerOpacity = isFlickering ? 0.3 : 1;
  const flickerShift = isFlickering ? Math.sin(frame * 10) * 5 : 0;

  if (frame < startFrame) return null;

  return (
    <>
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
            opacity: zoomOpacity * 0.15,
            filter: `blur(${motionBlur + 5}px)`,
            perspective: '2000px',
          }}
        >
          <div style={{ color: '#FF2A55', fontFamily: 'Cyberpunk, cursive', fontSize: 160, letterSpacing: `${exitSpacing}px` }}>
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
            color: '#FF2A55', 
            fontFamily: 'Cyberpunk, cursive',
            fontSize: 160,
            fontWeight: 400,
            letterSpacing: `${exitSpacing}px`,
            textTransform: 'uppercase',
            textShadow: `0 0 20px #FF2A55, 0 0 40px rgba(255, 42, 85, 0.5), 8px 8px 0px #000`,
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
  const isCrashed = frame > 50 && frame < 65;
  const isRandomStutter = (frame % 37) === 0;
  if (!isCrashed && !isRandomStutter) return null;
  const opacity = isCrashed ? 0.3 : 0.08;
  const shiftX = Math.sin(frame * 2.3) * 50;
  const shiftY = Math.cos(frame * 1.7) * 50;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, mixBlendMode: 'screen', zIndex: 100 }}>
      <div style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        transform: `translate(${shiftX}px, ${shiftY}px)`,
        filter: 'contrast(150%) brightness(200%)',
      }} />
      {isCrashed && new Array(10).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${(i * 17) % 100}%`,
          width: '100%',
          height: `${10 + (i * 5)}px`,
          backgroundColor: i % 2 === 0 ? BRIGHT_RED : RED,
          opacity: 0.4,
          transform: `translateX(${Math.sin(frame + i) * 50}px)`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const GlitchBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const isCrashed = frame > 50 && frame < 65;
  const intensity = isCrashed || (frame % 100) > 98 ? 1 : 0;
  if (intensity === 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 101 }}>
      <AbsoluteFill style={{ 
        backgroundColor: `rgba(255, 0, 51, 0.3)`, 
        transform: `translate(${Math.sin(frame) * 20}px, 0)`,
        mixBlendMode: 'difference' 
      }} />
      {isCrashed && new Array(5).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${(i * 20 + frame * 10) % 100}%`,
          width: '100%',
          height: `20%`,
          backgroundColor: '#000',
        }} />
      ))}
      {new Array(5).fill(0).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${(i * 15 + frame * 5) % 100}%`,
          width: '100%',
          height: `${15}%`,
          backgroundColor: `rgba(255, 0, 51, 0.4)`,
          transform: `translateX(${Math.cos(frame + i) * 200}px)`,
          mixBlendMode: 'overlay'
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  // Simplified Grain: High frequency noise for finer look
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.08, overflow: 'hidden' }}>
      <div style={{
          position: 'absolute',
          top: '-100%',
          left: '-100%',
          width: '300%',
          height: '300%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          transform: `translate(${Math.sin(frame) * 50}px, ${Math.cos(frame * 0.8) * 50}px)`,
      }} />
    </AbsoluteFill>
  );
};

const ScanlinesDetailed: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0.4) 1px, rgba(0, 0, 0, 0) 2px)`,
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
