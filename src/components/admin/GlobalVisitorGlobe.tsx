import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, RefreshCw, RotateCw } from 'lucide-react';
import { getRealGeoPoints, RealGeoPoint } from '../../services/realVisitorStorage';
import {
  EARTH_TEXTURE_URL,
  EARTH_CLOUDS_URL,
  createProceduralEarthCanvas,
} from './threeGlobeHelpers';
import { createAtmosphereHalo, addVisitorBeacons } from './threeGlobeBeacons';
import { GlobeCityList } from './GlobeCityList';

export const GlobalVisitorGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [geoPoints, setGeoPoints] = useState<RealGeoPoint[]>(() => getRealGeoPoints());
  const [activePoint, setActivePoint] = useState<RealGeoPoint | null>(() => {
    const pts = getRealGeoPoints();
    return pts[0] || null;
  });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const focusCityRef = useRef<((lat: number, lng: number) => void) | null>(null);

  const refreshPoints = () => {
    const updated = getRealGeoPoints();
    setGeoPoints(updated);
    setActivePoint(updated[0] || null);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 440;
    const height = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 230);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    sunLight.position.set(150, 100, 150);
    scene.add(sunLight);

    const blueBackLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    blueBackLight.position.set(-150, -80, -100);
    scene.add(blueBackLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.rotation.y = -Math.PI / 2.2;
    globeGroup.rotation.x = 0.2;

    const sphereRadius = 78;
    const fallbackCanvas = createProceduralEarthCanvas();
    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

    const earthMaterial = new THREE.MeshStandardMaterial({ map: fallbackTexture, roughness: 0.65, metalness: 0.1 });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 64, 64), earthMaterial);
    globeGroup.add(earthMesh);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(EARTH_TEXTURE_URL, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMaterial.map = tex;
      earthMaterial.needsUpdate = true;
    });

    const cloudsMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      roughness: 1,
    });
    const cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius + 1.2, 48, 48), cloudsMaterial);
    globeGroup.add(cloudsMesh);

    textureLoader.load(EARTH_CLOUDS_URL, (cloudTex) => {
      cloudsMaterial.map = cloudTex;
      cloudsMaterial.needsUpdate = true;
    });

    // Atmosphere halo
    const glowMesh = createAtmosphereHalo(sphereRadius);
    scene.add(glowMesh);

    // Add Visitor Beacons
    const ringsToAnimate = addVisitorBeacons(globeGroup, geoPoints, sphereRadius);

    focusCityRef.current = (lat: number, lng: number) => {
      globeGroup.rotation.y = -((lng + 90) * Math.PI) / 180;
      globeGroup.rotation.x = (lat * Math.PI) / 180 * 0.5;
    };

    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotating) {
        globeGroup.rotation.y += 0.0025;
      }
      cloudsMesh.rotation.y += 0.0032;

      ringsToAnimate.forEach((ring, idx) => {
        const scale = 1 + ((elapsedTime * 1.5 + idx * 0.4) % 1.6);
        ring.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      
      // Dispose Earth
      earthMaterial.map?.dispose();
      earthMaterial.dispose();
      earthMesh.geometry.dispose();
      fallbackTexture.dispose();

      // Dispose Clouds
      cloudsMaterial.map?.dispose();
      cloudsMaterial.dispose();
      cloudsMesh.geometry.dispose();

      // Dispose Glow Halo
      if (glowMesh.material instanceof THREE.Material) glowMesh.material.dispose();
      glowMesh.geometry.dispose();

      // Dispose Rings
      ringsToAnimate.forEach((ring) => {
        if (ring.material instanceof THREE.Material) ring.material.dispose();
        ring.geometry.dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [geoPoints, isAutoRotating]);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">3D Yer Globusi — Jonli Geolocation</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAutoRotating ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            <span>{isAutoRotating ? 'Auto-Rotate ON' : 'Pause'}</span>
          </button>
          <button
            onClick={refreshPoints}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 flex justify-center items-center relative">
          <div ref={mountRef} className="w-full max-w-[460px] h-[400px] cursor-grab active:cursor-grabbing" />
        </div>

        <GlobeCityList
          geoPoints={geoPoints}
          activePoint={activePoint}
          onSelectCity={(pt) => {
            setActivePoint(pt);
            focusCityRef.current?.(pt.lat, pt.lng);
          }}
        />
      </div>
    </div>
  );
};
