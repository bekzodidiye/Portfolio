import confetti from 'canvas-confetti';

export const VISITOR_NAME_KEY = 'portfolio_visitor_name';
export const VISITOR_ROLE_KEY = 'portfolio_visitor_role';
export const VISITOR_ACK_KEY = 'portfolio_visitor_acknowledged';

export function triggerCelebration() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
    });
  } catch {
    // ignore
  }
}

export function saveVisitorAcknowledgement(visitorName?: string, roleKey?: string, isAnon?: boolean) {
  try {
    localStorage.setItem(VISITOR_ACK_KEY, 'true');
    if (!isAnon && visitorName) {
      localStorage.setItem(VISITOR_NAME_KEY, visitorName);
      if (roleKey) localStorage.setItem(VISITOR_ROLE_KEY, roleKey);
    }
  } catch {
    // ignore
  }
}

export function getStoredVisitorInfo(): { acknowledged: boolean; name: string } {
  try {
    const acknowledged = localStorage.getItem(VISITOR_ACK_KEY) === 'true';
    const name = localStorage.getItem(VISITOR_NAME_KEY) || '';
    return { acknowledged, name };
  } catch {
    return { acknowledged: false, name: '' };
  }
}
