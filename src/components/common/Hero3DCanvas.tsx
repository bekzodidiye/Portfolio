import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

export interface Hero3DCanvasRef {
  drawProgress: (progress: number) => void;
}

interface Hero3DCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Hero3DCanvas = forwardRef<Hero3DCanvasRef, Hero3DCanvasProps>(
  ({ className = '', style }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const isVisibleRef = useRef(true);

    useImperativeHandle(ref, () => ({
      drawProgress: (progress: number) => {
        progressRef.current = Math.min(1, Math.max(0, progress));
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Scene & Camera Setup
      const scene = new THREE.Scene();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 24;

      // 2. Renderer
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0); // Fully transparent background
      container.appendChild(renderer.domElement);

      // 3. 3D Cyber Sculpture & Neural Point Cloud
      const group = new THREE.Group();
      scene.add(group);

      // A. Parametric Core Wireframe Sphere
      const sphereGeo = new THREE.IcosahedronGeometry(6.2, 4);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, // Vibrant Electric Blue
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      const wireframeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
      group.add(wireframeMesh);

      // B. Neural Lattice Particles (3,500 nodes)
      const particleCount = 3200;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(0x2563eb); // Royal Blue
      const color2 = new THREE.Color(0x06b6d4); // Cyan
      const color3 = new THREE.Color(0x6366f1); // Indigo

      for (let i = 0; i < particleCount; i++) {
        // Distribute in a volumetric shell resembling a neural core
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const radius = 5.2 + Math.random() * 2.8;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        // Gradient blend across colors
        const mixedColor = color1.clone();
        if (i % 3 === 0) mixedColor.lerp(color2, Math.random());
        else if (i % 3 === 1) mixedColor.lerp(color3, Math.random());

        colorArray[i * 3] = mixedColor.r;
        colorArray[i * 3 + 1] = mixedColor.g;
        colorArray[i * 3 + 2] = mixedColor.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      // Circular particle texture via canvas
      const createParticleTexture = () => {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        if (ctx) {
          const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          grad.addColorStop(0, 'rgba(255,255,255,1)');
          grad.addColorStop(0.3, 'rgba(59,130,246,0.85)');
          grad.addColorStop(1, 'rgba(59,130,246,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 64, 64);
        }
        return new THREE.CanvasTexture(c);
      };

      const particleMat = new THREE.PointsMaterial({
        size: 0.32,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        map: createParticleTexture(),
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      group.add(particleSystem);

      // C. Orbital Gyroscopic Rings
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.04, 16, 120), ringMat);
      ring1.rotation.x = Math.PI / 3;
      group.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(9.8, 0.04, 16, 120), ringMat);
      ring2.rotation.y = Math.PI / 4;
      group.add(ring2);

      // 4. Mouse Interactive Tracking
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current.targetX = x * 0.7;
        mouseRef.current.targetY = y * 0.7;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 5. Visibility & Resize Observation
      let animationFrameId: number;

      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      const handleResize = () => {
        if (!container) return;
        const newW = container.clientWidth || window.innerWidth;
        const newH = container.clientHeight || window.innerHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // 6. Smooth 60 FPS Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isVisibleRef.current || document.hidden) return;

        const delta = clock.getDelta();
        const progress = progressRef.current;

        // Smooth Mouse Damping (Lerp)
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

        // Continuous Gentle Rotation
        group.rotation.y += delta * 0.35;
        group.rotation.x += delta * 0.15;
        ring1.rotation.z += delta * 0.5;
        ring2.rotation.z -= delta * 0.4;

        // Dynamic Scroll Transformation Scrubbing
        // Shift position: when progress is low, stays right; when cards appear, moves dynamically
        const targetX = 3.8 - progress * 4.5 + mouseRef.current.x * 2.2;
        const targetY = 0.5 + Math.sin(progress * Math.PI * 2) * 1.8 + mouseRef.current.y * 1.8;
        const targetZ = -2 - progress * 7.5;

        group.position.x += (targetX - group.position.x) * 0.08;
        group.position.y += (targetY - group.position.y) * 0.08;
        group.position.z += (targetZ - group.position.z) * 0.08;

        // 3D Rotation Scrubbing tied to scroll
        const scrollRotX = progress * Math.PI * 2.5;
        const scrollRotY = progress * Math.PI * 4;
        wireframeMesh.rotation.x += (scrollRotX - wireframeMesh.rotation.x) * 0.06;
        wireframeMesh.rotation.y += (scrollRotY - wireframeMesh.rotation.y) * 0.06;

        // Pulse scale based on scroll phase
        const scaleFactor = 1 + Math.sin(progress * Math.PI * 3) * 0.22;
        group.scale.set(scaleFactor, scaleFactor, scaleFactor);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();

        // Safe Resource Cleanup
        sphereGeo.dispose();
        wireframeMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        ringMat.dispose();
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        style={style}
      />
    );
  }
);

Hero3DCanvas.displayName = 'Hero3DCanvas';
