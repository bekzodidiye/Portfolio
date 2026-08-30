import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, MapPin, Users, Compass, RefreshCw, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { getRealGeoPoints, RealGeoPoint } from '../../services/realVisitorStorage';

// High-resolution Earth textures with procedural fallback
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg';
const EARTH_CLOUDS_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png';

/**
 * Creates an instant procedural Earth texture on canvas (0ms latency fallback)
 */
function createProceduralEarthCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a1931');
  oceanGrad.addColorStop(0.5, '#0b2545');
  oceanGrad.addColorStop(1, '#081426');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid / Coordinates subtle lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j < canvas.height; j += 32) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(canvas.width, j);
    ctx.stroke();
  }

  // Draw simplified continents (Eurasia, Africa, Americas, Australia)
  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#059669';
  ctx.shadowBlur = 10;

  // Europe & Asia & Central Asia (Uzbekistan focus)
  ctx.beginPath();
  ctx.ellipse(650, 180, 200, 90, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Africa
  ctx.beginPath();
  ctx.ellipse(540, 290, 75, 110, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // North America
  ctx.beginPath();
  ctx.ellipse(260, 160, 120, 80, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.ellipse(340, 340, 65, 110, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(820, 360, 60, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

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

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 230);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Sunlight + Ambient space light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    sunLight.position.set(150, 100, 150);
    scene.add(sunLight);

    const blueBackLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    blueBackLight.position.set(-150, -80, -100);
    scene.add(blueBackLight);

    // 3. Globe Main Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial Central Asia focus tilt
    globeGroup.rotation.y = -Math.PI / 2.2;
    globeGroup.rotation.x = 0.2;

    const sphereRadius = 78;

    // 4. Procedural / Realistic Earth Texture
    const fallbackCanvas = createProceduralEarthCanvas();
    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

    const earthGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.65,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Load High-Res Earth Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      EARTH_TEXTURE_URL,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        earthMaterial.map = loadedTex;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      (err) => console.warn('Using procedural Earth fallback:', err)
    );

    // 5. Realistic Clouds Sphere
    const cloudsGeometry = new THREE.SphereGeometry(sphereRadius + 1.2, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    globeGroup.add(cloudsMesh);

    textureLoader.load(
      EARTH_CLOUDS_URL,
      (cloudsTex) => {
        cloudsMaterial.map = cloudsTex;
        cloudsMaterial.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // 6. Atmosphere Glow Rim (Fresnel simulation)
    const atmosphereGeom = new THREE.SphereGeometry(sphereRadius + 6, 36, 36);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    scene.add(atmosphereMesh);

    // Coordinate Conversion
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 7. 3D Visitor Beacons & Laser Pillars
    const markersGroup = new THREE.Group();
    const pulseObjects: Array<{ mesh: THREE.Mesh; baseScale: number; speed: number }> = [];

    geoPoints.forEach((pt) => {
      const pos = latLngToVector3(pt.lat, pt.lng, sphereRadius);
      const isUzbekistan = pt.country.toLowerCase().includes('uzbek') || pt.country.toLowerCase().includes("o'zbek");
      const beaconColor = isUzbekistan ? 0x10b981 : 0x06b6d4;

      // Laser Pillar
      const beamHeight = 16 + Math.min(pt.visitors * 2, 24);
      const beamGeom = new THREE.CylinderGeometry(0.6, 0.9, beamHeight, 12);
      const beamMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        transparent: true,
        opacity: 0.85,
      });
      const beamMesh = new THREE.Mesh(beamGeom, beamMat);

      // Position & Align with normal
      const normal = pos.clone().normalize();
      beamMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      markersGroup.add(beamMesh);

      // Glowing Beacon Top Sphere
      const sphereGeom = new THREE.SphereGeometry(1.8, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const beaconTop = new THREE.Mesh(sphereGeom, sphereMat);
      beaconTop.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight)));
      markersGroup.add(beaconTop);

      // Ground Pulsing Ring
      const ringGeom = new THREE.RingGeometry(1.5, 3.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.4)));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      markersGroup.add(ringMesh);

      pulseObjects.push({ mesh: ringMesh, baseScale: 1, speed: 0.03 + Math.random() * 0.02 });
    });
    globeGroup.add(markersGroup);

    // Smooth focus helper
    focusCityRef.current = (lat: number, lng: number) => {
      const targetY = -(lng * (Math.PI / 180)) - Math.PI / 2;
      const targetX = lat * (Math.PI / 180) * 0.5;
      globeGroup.rotation.y = targetY;
      globeGroup.rotation.x = targetX;
    };

    // 8. User Interaction (Mouse Drag & Zoom)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroup.rotation.x + deltaY * 0.005));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(140, Math.min(380, camera.position.z + e.deltaY * 0.15));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroup.rotation.x + deltaY * 0.005));
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (touchStartDist - dist) * 0.2;
        camera.position.z = Math.max(140, Math.min(380, camera.position.z + factor));
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // 9. Animation Loop
    let animationFrameId: number;
    let pulseTime = 0;

    const animate = () => {
      pulseTime += 0.04;

      // Auto rotation
      if (!isDragging && isAutoRotating) {
        globeGroup.rotation.y += 0.0018;
      }

      // Clouds rotation (slightly faster for atmospheric realism)
      cloudsMesh.rotation.y += 0.0008;

      // Pulse Beacons
      pulseObjects.forEach((p, i) => {
        const s = 1 + Math.sin(pulseTime + i) * 0.35;
        p.mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 10. Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeom.dispose();
      atmosphereMat.dispose();
      renderer.dispose();
    };
  }, [geoPoints, isAutoRotating]);

  const handlePointClick = (pt: RealGeoPoint) => {
    setActivePoint(pt);
    if (focusCityRef.current) {
      focusCityRef.current(pt.lat, pt.lng);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 text-slate-100 space-y-4 backdrop-blur-xl shadow-2xl overflow-hidden relative">
      {/* Background Starry Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Haqiqiy 3D Yer Globusi</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● 100% Real Earth
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              NASA Blue Marble teksturasi, atmosferasi va real-vaqtdagi tashrif nuqtalari
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              isAutoRotating
                ? 'bg-blue-950/60 border-blue-800/60 text-blue-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Avtomatik aylanish"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isAutoRotating ? 'Aylanmoqda' : 'Pauza'}</span>
          </button>

          <button
            onClick={refreshPoints}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            title="Yangilash"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* 3D Canvas */}
        <div className="lg:col-span-7 relative h-[380px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/60 border border-slate-800/60 overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />

          {/* Interactive Hint */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sichqoncha bilan 360° aylantiring / Masshtab: Scroll</span>
          </div>

          {/* Active City Floating Badge */}
          {activePoint && (
            <div className="absolute top-3 right-3 text-xs font-mono bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-500/30 text-white shadow-xl flex items-center gap-2 animate-fadeIn">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="font-bold text-cyan-300">{activePoint.city}</div>
                <div className="text-[10px] text-slate-400">{activePoint.country} ({activePoint.visitors} tashrif)</div>
              </div>
            </div>
          )}
        </div>

        {/* Real Geo Distribution Panel */}
        <div className="lg:col-span-5 space-y-3 bg-slate-950/85 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Haqiqiy Tashrif Nuqtalari
            </h4>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {geoPoints.length} ta shahar
            </span>
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto no-scrollbar pt-1">
            {geoPoints.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center font-mono">
                Hozircha yangi tashriflar yo'q. Saytga kirilganda avtomatik qo'shiladi.
              </p>
            ) : (
              geoPoints.map((pt, idx) => {
                const isSelected = activePoint.city === pt.city;
                const isUz = pt.country.toLowerCase().includes('uzbek') || pt.country.toLowerCase().includes("o'zbek");
                return (
                  <div
                    key={idx}
                    onClick={() => handlePointClick(pt)}
                    className={`p-3 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/25 border border-blue-500 text-white shadow-lg shadow-blue-900/20'
                        : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border border-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isUz ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'}`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{pt.city}</span>
                          {isUz && <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">O'zb</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{pt.country}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-cyan-300">{pt.visitors} marta</div>
                      <div className="text-[10px] text-slate-500">Koordinata</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>🟢 Lazer nuri: Mehmon joylashuvi</span>
            <span>🌍 3D WebGL 60FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

