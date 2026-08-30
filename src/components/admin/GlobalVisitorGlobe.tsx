import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, MapPin, Users, Compass, RefreshCw } from 'lucide-react';
import { getRealGeoPoints, RealGeoPoint } from '../../services/realVisitorStorage';

export const GlobalVisitorGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [geoPoints, setGeoPoints] = useState<RealGeoPoint[]>(() => getRealGeoPoints());
  const [activePoint, setActivePoint] = useState<RealGeoPoint>(() => {
    const pts = getRealGeoPoints();
    return pts[0] || { city: 'Toshkent', country: "O'zbekiston", lat: 41.2995, lng: 69.2401, visitors: 1 };
  });

  const refreshPoints = () => {
    const updated = getRealGeoPoints();
    setGeoPoints(updated);
    if (updated.length > 0) setActivePoint(updated[0]);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Outer Atmosphere Glow Sphere
    const sphereRadius = 80;
    const globeGeometry = new THREE.SphereGeometry(sphereRadius, 36, 36);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Inner Dots Sphere
    const dotsCount = 800;
    const dotsGeometry = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotsCount * 3);

    for (let i = 0; i < dotsCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotsCount);
      const theta = Math.sqrt(dotsCount * Math.PI) * phi;
      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;
    }

    dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotsMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
    });
    const dotsMesh = new THREE.Points(dotsGeometry, dotsMaterial);
    globeGroup.add(dotsMesh);

    // Convert Lat/Lng to Vector3
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Geo Markers Group
    const markersGroup = new THREE.Group();
    geoPoints.forEach((pt) => {
      const pos = latLngToVector3(pt.lat, pt.lng, sphereRadius + 1.5);
      const markerGeom = new THREE.SphereGeometry(2.2, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: pt.country.toLowerCase().includes('uzbek') || pt.country.toLowerCase().includes("o'zbek") ? 0x10b981 : 0x38bdf8,
      });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.copy(pos);
      markersGroup.add(markerMesh);
    });
    globeGroup.add(markersGroup);

    // Drag / Rotate interaction
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

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      if (!isDragging) {
        globeGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize Handler
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      globeGeometry.dispose();
      globeMaterial.dispose();
      dotsGeometry.dispose();
      dotsMaterial.dispose();
      renderer.dispose();
    };
  }, [geoPoints]);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-slate-100 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-mono text-sm font-bold text-white">3D Haqiqiy Mehmonlar Globusi</h3>
            <p className="text-[11px] text-slate-400">100% Real Live Visitor Geo Coordinates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPoints}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yangilash</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ● 100% Real
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* 3D Canvas */}
        <div className="lg:col-span-7 relative h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-md">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Sichqoncha bilan aylantiring</span>
          </div>
        </div>

        {/* Geo Distribution Table */}
        <div className="lg:col-span-5 space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Haqiqiy Tashrif Nuqtalari
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{geoPoints.length} ta manzil</span>
          </div>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
            {geoPoints.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Hali yangi tashriflar qayd etilmadi.</p>
            ) : (
              geoPoints.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePoint(pt)}
                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                    activePoint.city === pt.city
                      ? 'bg-blue-600/30 border border-blue-500 text-white'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-3.5 h-3.5 ${
                        pt.country.toLowerCase().includes('uzbek') || pt.country.toLowerCase().includes("o'zbek")
                          ? 'text-emerald-400'
                          : 'text-blue-400'
                      }`}
                    />
                    <span>
                      {pt.city}, {pt.country}
                    </span>
                  </div>
                  <span className="font-bold text-cyan-300">{pt.visitors} marta</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
