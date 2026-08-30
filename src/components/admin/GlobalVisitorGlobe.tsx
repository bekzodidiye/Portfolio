import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, MapPin, Users, Shield, Compass } from 'lucide-react';

interface GeoLocationPoint {
  city: string;
  country: string;
  lat: number;
  lng: number;
  visitors: number;
}

const SAMPLE_GEO_POINTS: GeoLocationPoint[] = [
  { city: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401, visitors: 142 },
  { city: 'Bukhara', country: 'Uzbekistan', lat: 39.7747, lng: 64.4286, visitors: 98 },
  { city: 'Samarkand', country: 'Uzbekistan', lat: 39.6542, lng: 66.9597, visitors: 45 },
  { city: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, visitors: 34 },
  { city: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, visitors: 19 },
  { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, visitors: 26 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, visitors: 22 },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, visitors: 31 },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, visitors: 18 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, visitors: 15 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, visitors: 12 },
];

export const GlobalVisitorGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState<GeoLocationPoint>(SAMPLE_GEO_POINTS[0]);

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
    SAMPLE_GEO_POINTS.forEach((pt) => {
      const pos = latLngToVector3(pt.lat, pt.lng, sphereRadius + 1.5);
      const markerGeom = new THREE.SphereGeometry(2, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: pt.country === 'Uzbekistan' ? 0x10b981 : 0x60a5fa,
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
  }, []);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-slate-100 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="font-mono text-sm font-bold text-white">3D Real-Time Global Visitor Earth</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          ● Live Tracking
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* 3D Canvas */}
        <div className="lg:col-span-7 relative h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-md">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Drag to rotate 3D Earth</span>
          </div>
        </div>

        {/* Geo Distribution Table */}
        <div className="lg:col-span-5 space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
          <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Top Visitor Locations
          </h4>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
            {SAMPLE_GEO_POINTS.map((pt, idx) => (
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
                      pt.country === 'Uzbekistan' ? 'text-emerald-400' : 'text-blue-400'
                    }`}
                  />
                  <span>
                    {pt.city}, {pt.country}
                  </span>
                </div>
                <span className="font-bold text-cyan-300">{pt.visitors} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
