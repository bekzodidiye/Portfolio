import test from 'node:test';
import assert from 'node:assert';
import { easeInOutCubic, interpolateKeyframes, Keyframe3D } from '../src/utils/keyframes3d.ts';

test('3D Keyframe Interpolation & Physics Engine', async (t) => {
  await t.test('easeInOutCubic produces smooth 0 -> 1 curve', () => {
    assert.strictEqual(easeInOutCubic(0), 0);
    assert.strictEqual(easeInOutCubic(0.5), 0.5);
    assert.strictEqual(easeInOutCubic(1), 1);
    // Easing starts slow, speeds up in middle, slows down at end
    assert.ok(easeInOutCubic(0.2) < 0.2);
    assert.ok(easeInOutCubic(0.8) > 0.8);
  });

  await t.test('interpolateKeyframes clamps to start and end bounds', () => {
    const keyframes: Keyframe3D[] = [
      { progress: 0.2, opacity: 0, transform: { x: 100, y: 0, z: -500, rx: 1, ry: 0, rz: 0, angle: 90, scale: 0.5 } },
      { progress: 0.8, opacity: 1, transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, angle: 0, scale: 1 } },
    ];

    const before = interpolateKeyframes(keyframes, 0.1);
    assert.strictEqual(before.opacity, 0);

    const after = interpolateKeyframes(keyframes, 0.95);
    assert.strictEqual(after.opacity, 1);
  });

  await t.test('interpolateKeyframes calculates midway transformations smoothly', () => {
    const keyframes: Keyframe3D[] = [
      { progress: 0.0, opacity: 0, transform: { x: 0, y: 100, z: -200, rx: 0, ry: 0, rz: 0, angle: 0, scale: 0.5 } },
      { progress: 1.0, opacity: 1, transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, angle: 0, scale: 1.0 } },
    ];

    const mid = interpolateKeyframes(keyframes, 0.5);
    assert.strictEqual(mid.opacity, 0.5);
    assert.ok(mid.transformString.includes('translate3d(0.00px, 50.00px, -100.00px)'));
    assert.ok(mid.transformString.includes('scale(0.750)'));
  });
});
