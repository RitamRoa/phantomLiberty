import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';

type RitamPointCloudProps = {
  className?: string;
};

export const RitamPointCloud: React.FC<RitamPointCloudProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 1000);
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const dir = new THREE.DirectionalLight(0xff2a55, 1.2);
    dir.position.set(2, 3, 4);
    scene.add(ambient, dir);

    let cloud: THREE.Points | null = null;
    const root = new THREE.Group();
    scene.add(root);

    const fitCameraToRoot = () => {
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) {
        return;
      }

      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      root.position.x = 0.18;
      root.position.y = -0.08;

      const radius = Math.max(size.x, size.y, size.z, 0.001) * 0.5;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const distanceV = radius / Math.sin(vFov / 2);
      const distanceH = radius / Math.sin(hFov / 2);
      const distance = Math.max(distanceV, distanceH) * 1.22;

      camera.position.set(center.x, center.y, distance);
      camera.near = Math.max(distance / 200, 0.01);
      camera.far = Math.max(distance * 20, 50);
      camera.updateProjectionMatrix();
      camera.lookAt(center.x, center.y, center.z);
    };

    const loader = new PCDLoader();
    loader.load(
      '/ritam.pcd',
      (points) => {
        const pointMaterial = points.material as THREE.PointsMaterial;
        pointMaterial.color = new THREE.Color('#FF2A55');
        pointMaterial.size = 0.014;
        pointMaterial.sizeAttenuation = true;
        pointMaterial.depthWrite = false;

        points.geometry.center();

        const bbox = new THREE.Box3().setFromBufferAttribute(points.geometry.getAttribute('position') as THREE.BufferAttribute);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxSize = Math.max(size.x, size.y, size.z, 0.0001);
        const pointCount = points.geometry.getAttribute('position').count;
        const scaleTarget = pointCount < 15000 ? 1.95 : 1.75;
        const scale = scaleTarget / maxSize;
        points.scale.setScalar(scale);

        if (pointCount < 15000) {
          pointMaterial.size = 0.019;
        }

        points.position.y -= size.y * scale * 0.08;

        root.add(points);
        cloud = points;
        fitCameraToRoot();
      },
      undefined,
      (error) => {
        console.error('Failed to load ritam.pcd', error);
      }
    );

    const updateSize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) {
        return;
      }
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      fitCameraToRoot();
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      root.rotation.y += 0.0022;
      if (cloud) {
        cloud.rotation.x = -0.02;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (cloud) {
        cloud.geometry.dispose();
        const material = cloud.material as THREE.Material;
        material.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};
