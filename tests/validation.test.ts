import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function validateContactPayload(payload: {
  name?: string;
  email?: string;
  message?: string;
  honeypot?: string;
}) {
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return { valid: false, isSpam: true, error: null };
  }

  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const message = (payload.message || '').trim();

  if (!name || !email || !message) {
    return { valid: false, isSpam: false, error: 'MISSING_REQUIRED_FIELDS' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, isSpam: false, error: 'INVALID_EMAIL_FORMAT' };
  }

  if (message.length < 5) {
    return { valid: false, isSpam: false, error: 'MESSAGE_TOO_SHORT' };
  }

  return { valid: true, isSpam: false, error: null, sanitized: { name, email, message } };
}

describe('Contact Form Validation & Honeypot Logic', () => {
  it('identifies and silently traps spam bots via honeypot field', () => {
    const res = validateContactPayload({
      name: 'Botty',
      email: 'bot@spam.com',
      message: 'Buy cheap watches',
      honeypot: 'filled-by-crawler',
    });
    assert.strictEqual(res.isSpam, true);
    assert.strictEqual(res.valid, false);
  });

  it('rejects empty fields', () => {
    const res = validateContactPayload({
      name: '',
      email: 'test@gmail.com',
      message: 'Hello world',
    });
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'MISSING_REQUIRED_FIELDS');
  });

  it('rejects invalid email formats', () => {
    const res = validateContactPayload({
      name: 'Bekzod',
      email: 'invalid-email-address',
      message: 'Hello world',
    });
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'INVALID_EMAIL_FORMAT');
  });

  it('approves well-formed contact lead submission', () => {
    const res = validateContactPayload({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Interested in working together on a high-scale backend project.',
    });
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.error, null);
    assert.strictEqual(res.sanitized?.name, 'John Doe');
  });
});
