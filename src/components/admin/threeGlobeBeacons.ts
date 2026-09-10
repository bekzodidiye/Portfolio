import * as THREE from 'three';
import { RealGeoPoint } from '../../services/realVisitorStorage';
import { latLngToVector3 } from './threeGlobeHelpers';

export function createAtmosphereHalo(sphereRadius: number): THREE.Mesh {
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

  return new THREE.Mesh(new THREE.SphereGeometry(sphereRadius + 14, 48, 48), glowMaterial);
}

export function addVisitorBeacons(
  globeGroup: THREE.Group,
  geoPoints: RealGeoPoint[],
  sphereRadius: number
): THREE.Mesh[] {
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

  return ringsToAnimate;
}
