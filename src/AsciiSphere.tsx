import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface AsciiSphereProps {
  color?: string;
}

export const AsciiSphere: React.FC<AsciiSphereProps> = ({ color = '#FF2A55' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content first
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const width = 500;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    // Stronger lights for more highlight
    const pointLight1 = new THREE.PointLight(0xffffff, 5, 0, 0);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 2, 0, 0);
    pointLight2.position.set(-500, -500, -500);
    scene.add(pointLight2);

    const sphereSize = 200;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(sphereSize, 20, 10),
      new THREE.MeshPhongMaterial({ flatShading: true })
    );
    scene.add(sphere);

    // Base/Floor plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );
    plane.position.y = -200;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(width, height);
    effect.domElement.style.color = color;
    effect.domElement.style.backgroundColor = 'transparent';
    effect.domElement.style.fontFamily = 'monospace';
    effect.domElement.style.fontSize = '12px';
    effect.domElement.style.textShadow = `0 0 15px ${color}, 0 0 5px white`; // Added highlight

    containerRef.current.appendChild(effect.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, effect.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    let animationId: number;
    const start = Date.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const timer = Date.now() - start;

      // Only bounce, don't auto-rotate mesh if using controls
      sphere.position.y = 50 + Math.abs(Math.sin(timer * 0.002)) * 150;
      // We removed the sphere.rotation lines so controls handle rotation of view
      // But we can keep subtle self-rotation if desired, but user asked for "rotate it"
      // usually implies the orbital rotation.
      // Let's keep the bounce.

      controls.update();

      // Subtle static flicker
      if (Math.random() > 0.98) {
        effect.domElement.style.opacity = '0.4';
        effect.domElement.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
      } else {
        effect.domElement.style.opacity = '1';
        effect.domElement.style.transform = 'none';
      }

      effect.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
      if (containerRef.current && effect.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(effect.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [color]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full opacity-80 cursor-grab active:cursor-grabbing"
      style={{ 
        mixBlendMode: 'screen',
        filter: 'drop-shadow(0 0 20px rgba(255, 42, 85, 0.3))'
      }}
    />
  );
};
