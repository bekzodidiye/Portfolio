import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, MapPin, Users, RefreshCw, RotateCw } from 'lucide-react';
import { getRealGeoPoints, RealGeoPoint } from '../../services/realVisitorStorage';
import {
  EARTH_TEXTURE_URL,
  EARTH_CLOUDS_URL,
  createProceduralEarthCanvas,
  latLngToVector3,
} from './threeGlobeHelpers';

export const GlobalVisitorGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [geoPoints, setGeoPoints] = useState<RealGeoPoint[]>(() => getRealGeoPoints());
  const [activePoint, setActivePoint] = useState<RealGeoPoint>(() => {
    const pts = getRealGeoPoints();
    return pts[0] || { city: 'Toshkent', country: "O'zbekiston", lat: 41.2995, lng: 69.2401, visitors: 1 };
  });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const focusCityRef = useRef<((lat: number, lng: number) => void) | null>(null);

  const refreshPoints = () => {
    const updated = getRealGeoPoints();
    setGeoPoints(updated);
    if (updated.length > 0) setActivePoint(updated[0]);
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
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.6, 1.0, 1.0) * intensity * 0.9;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius + 14, 48, 48), glowMaterial);
    scene.add(glowMesh);

    // Add Visitor Beacons
    const ringsToAnimate: THREE.Mesh[] = [];
    geoPoints.forEach((pt) => {
      const pos = latLngToVector3(pt.lat, pt.lng, sphereRadius);
      const normal = pos.clone().normalize();

      const pinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      const pillarHeight = 18;
      const pillarMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.8, pillarHeight, 8),
        new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.85 })
      );
      pillarMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(pillarHeight / 2)));
      pillarMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      globeGroup.add(pillarMesh);

      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(1.5, 3.8, 24),
        new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
      );
      ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.4)));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      globeGroup.add(ringMesh);
      ringsToAnimate.push(ringMesh);
    });

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
      earthMaterial.dispose();
      fallbackTexture.dispose();
      glowMaterial.dispose();
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

        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase">Qayd Etilgan Shaharlar:</div>
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto no-scrollbar">
            {geoPoints.map((pt) => (
              <div
                key={pt.city}
                onClick={() => {
                  setActivePoint(pt);
                  focusCityRef.current?.(pt.lat, pt.lng);
                }}
                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                  activePoint.city === pt.city
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold truncate">{pt.city}, {pt.country}</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 shrink-0 font-semibold">{pt.visitors} tashrif</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
