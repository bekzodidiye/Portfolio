import * as THREE from 'three';
import { createSubtleGeometries } from './subtleThreeGeometries';

export interface SubtleSceneController {
  destroy: () => void;
}

export function initSubtleThreeScene(container: HTMLElement): SubtleSceneController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  const { icoMesh, octMesh, ringMesh1, ringMesh2, particles, dispose: disposeGeometries } =
    createSubtleGeometries(scene, mainGroup);

  // Scroll & Cursor State with Smooth Physics Lerp
  let currentScroll = 0;
  let targetScroll = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight || 1;
    targetScroll = Math.max(0, Math.min(1, window.scrollY / max));
  };

  const onMouseMove = (e: MouseEvent) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('resize', onResize);
  onScroll();

  let animId: number;
  let isRunning = true;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animId);
    } else {
      if (!isRunning) {
        isRunning = true;
        animate();
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const animate = () => {
    if (!isRunning) return;
    animId = requestAnimationFrame(animate);

    // Smooth Lerp Interpolations
    currentScroll += (targetScroll - currentScroll) * 0.06;
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Dynamic rotation and scaling based on scroll position
    const scrollAngle = currentScroll * Math.PI * 2;
    const dynamicScale = 1 + Math.sin(currentScroll * Math.PI) * 0.25;

    // Group reactive rotation & position with mouse-follow tilt
    mainGroup.rotation.y = scrollAngle * 0.6 + mouseX * 0.35;
    mainGroup.rotation.x = currentScroll * 0.8 - mouseY * 0.35;
    mainGroup.position.y = (currentScroll - 0.5) * -6 + mouseY * 0.5;
    mainGroup.position.x = mouseX * 0.6;
    mainGroup.scale.set(dynamicScale, dynamicScale, dynamicScale);

    // Individual mesh mouse-follow tilt and autonomous rotation
    icoMesh.rotation.x += 0.003 + currentScroll * 0.005 - mouseY * 0.02;
    icoMesh.rotation.y += 0.005 + currentScroll * 0.005 + mouseX * 0.02;
    icoMesh.position.x = 4.5 + mouseX * 0.8;
    icoMesh.position.y = 2 + mouseY * 0.6;
    icoMesh.scale.setScalar(1 + Math.cos(scrollAngle) * 0.15);

    octMesh.rotation.x -= 0.004 + currentScroll * 0.004 + mouseY * 0.02;
    octMesh.rotation.z += 0.004 + mouseX * 0.015;
    octMesh.position.x = -4.5 + mouseX * 0.7;
    octMesh.position.y = -3 + mouseY * 0.5;
    octMesh.scale.setScalar(1 + Math.sin(scrollAngle) * 0.15);

    ringMesh1.rotation.z += 0.004 + mouseX * 0.01;
    ringMesh1.rotation.x = Math.PI / 3 + currentScroll * 1.2 - mouseY * 0.25;

    ringMesh2.rotation.y -= 0.005 - mouseX * 0.02;
    ringMesh2.rotation.z = Math.PI / 4 + currentScroll * 0.8 + mouseY * 0.15;

    particles.position.y = currentScroll * 4 + mouseY * 0.8;
    particles.position.x = mouseX * 0.8;
    particles.rotation.y = currentScroll * 0.5 + mouseX * 0.15;

    // Gentle camera parallax
    camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.7 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  animate();

  return {
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposeGeometries();
    },
  };
}
