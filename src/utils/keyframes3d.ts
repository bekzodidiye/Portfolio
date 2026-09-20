export interface Transform3D {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  angle: number;
  scale: number;
}

export interface Keyframe3D {
  progress: number;
  opacity: number;
  transform: Transform3D;
}

export interface InterpolatedState {
  opacity: number;
  transformString: string;
}

export const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const formatTransform = (kf: Keyframe3D): InterpolatedState => ({
  opacity: kf.opacity,
  transformString: `translate3d(${kf.transform.x}px, ${kf.transform.y}px, ${kf.transform.z}px) rotate3d(${kf.transform.rx}, ${kf.transform.ry}, ${kf.transform.rz}, ${kf.transform.angle}deg) scale(${kf.transform.scale})`,
});

export function interpolateKeyframes(keyframes: Keyframe3D[], progress: number): InterpolatedState {
  if (keyframes.length === 0) {
    return { opacity: 0, transformString: 'translate3d(0,0,0) scale(1)' };
  }
  if (keyframes.length === 1 || progress <= keyframes[0].progress) {
    return formatTransform(keyframes[0]);
  }
  if (progress >= keyframes[keyframes.length - 1].progress) {
    return formatTransform(keyframes[keyframes.length - 1]);
  }

  let segmentIndex = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
      segmentIndex = i;
      break;
    }
  }

  const start = keyframes[segmentIndex];
  const end = keyframes[segmentIndex + 1];
  const factor = easeInOutCubic(
    Math.max(0, Math.min(1, (progress - start.progress) / (end.progress - start.progress)))
  );

  const opacity = start.opacity + (end.opacity - start.opacity) * factor;
  const x = start.transform.x + (end.transform.x - start.transform.x) * factor;
  const y = start.transform.y + (end.transform.y - start.transform.y) * factor;
  const z = start.transform.z + (end.transform.z - start.transform.z) * factor;
  const rx = start.transform.rx + (end.transform.rx - start.transform.rx) * factor;
  const ry = start.transform.ry + (end.transform.ry - start.transform.ry) * factor;
  const rz = start.transform.rz + (end.transform.rz - start.transform.rz) * factor;
  const angle = start.transform.angle + (end.transform.angle - start.transform.angle) * factor;
  const scale = start.transform.scale + (end.transform.scale - start.transform.scale) * factor;

  return {
    opacity,
    transformString: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotate3d(${rx.toFixed(3)}, ${ry.toFixed(3)}, ${rz.toFixed(3)}, ${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
  };
}
