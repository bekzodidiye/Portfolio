import * as THREE from 'three';

export interface SubtleMeshes {
  icoMesh: THREE.Mesh;
  octMesh: THREE.Mesh;
  ringMesh1: THREE.Mesh;
  ringMesh2: THREE.Mesh;
  particles: THREE.Points;
  dispose: () => void;
}

export function createSubtleGeometries(scene: THREE.Scene, mainGroup: THREE.Group): SubtleMeshes {
  // 1. Subtle Geometry: Floating Wireframe Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  icoMesh.position.set(4.5, 2, -3);
  mainGroup.add(icoMesh);

  // 2. Subtle Geometry: Floating Octahedron
  const octGeo = new THREE.OctahedronGeometry(1.8, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const octMesh = new THREE.Mesh(octGeo, octMat);
  octMesh.position.set(-4.5, -3, -2);
  mainGroup.add(octMesh);

  // 3. Subtle Concentric Orbital Rings
  const ringGeo1 = new THREE.TorusGeometry(3.5, 0.02, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.16,
  });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  ringMesh1.rotation.x = Math.PI / 3;
  ringMesh1.position.set(0, -1, -4);
  mainGroup.add(ringMesh1);

  const ringGeo2 = new THREE.TorusGeometry(2.2, 0.018, 16, 80);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x2563eb,
    transparent: true,
    opacity: 0.14,
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.y = Math.PI / 4;
  ringMesh2.position.set(0, -1, -4);
  mainGroup.add(ringMesh2);

  // 4. Subtle Floating Depth Particle Dust
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 30;
    particlePositions[i + 1] = (Math.random() - 0.5) * 40;
    particlePositions[i + 2] = (Math.random() - 0.5) * 15 - 2;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.25,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  const dispose = () => {
    icoGeo.dispose();
    icoMat.dispose();
    octGeo.dispose();
    octMat.dispose();
    ringGeo1.dispose();
    ringMat1.dispose();
    ringGeo2.dispose();
    ringMat2.dispose();
    particleGeo.dispose();
    particleMat.dispose();
  };

  return {
    icoMesh,
    octMesh,
    ringMesh1,
    ringMesh2,
    particles,
    dispose,
  };
}
