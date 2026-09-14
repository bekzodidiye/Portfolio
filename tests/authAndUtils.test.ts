import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../api/_bot/utils';
import { hashPin, verifyPin, createAdminSessionToken, verifyAdminSessionToken } from '../api/_db/authUtil';

describe('Sanitization & Security Utils', () => {
  it('correctly escapes all 5 special HTML characters', () => {
    const input = '<script>alert("XSS & danger\'s");</script>';
    const escaped = escapeHtml(input);
    assert.strictEqual(
      escaped,
      '&lt;script&gt;alert(&quot;XSS &amp; danger&#39;s&quot;);&lt;/script&gt;'
    );
  });

  it('handles empty or nullish strings safely', () => {
    assert.strictEqual(escapeHtml(''), '');
    assert.strictEqual(escapeHtml(null as any), '');
    assert.strictEqual(escapeHtml(undefined as any), '');
  });
});

describe('Admin Authentication & Crypto Utils', () => {
  it('hashes PIN with scrypt salt and verifies accurately', () => {
    const pin = '7890';
    const hashed = hashPin(pin);
    assert.ok(hashed.startsWith('scrypt:'), 'Hash must have scrypt prefix');
    assert.ok(verifyPin(pin, hashed), 'Valid PIN must match hash');
    assert.strictEqual(verifyPin('0000', hashed), false, 'Wrong PIN must be rejected');
  });

  it('supports backward compatibility with plaintext PINs', () => {
    const plainPin = '1234';
    assert.ok(verifyPin('1234', plainPin), 'Plaintext PIN must match correctly');
    assert.strictEqual(verifyPin('9999', plainPin), false, 'Incorrect PIN must fail');
  });

  it('generates and validates HMAC-SHA256 session token', () => {
    const token = createAdminSessionToken();
    assert.ok(typeof token === 'string' && token.length > 20, 'Token must be a non-empty string');
    assert.strictEqual(verifyAdminSessionToken(token), true, 'Generated token must be valid');
    assert.strictEqual(verifyAdminSessionToken('invalid.token.here'), false, 'Malformed token must fail');
    assert.strictEqual(verifyAdminSessionToken(''), false, 'Empty token must fail');
  });
});
