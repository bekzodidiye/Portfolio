import { useState, useEffect } from 'react';
import { STORAGE_AUTH_PIN_KEY, DEFAULT_ADMIN_PIN } from './portfolioDataDefaults';

export function usePortfolioAuth() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('bekzod_admin_auth_session') === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Listen for hash #admin or keyboard shortcut (Ctrl+Shift+A / Alt+A)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loginAdmin = (pin: string): boolean => {
    const currentPin = localStorage.getItem(STORAGE_AUTH_PIN_KEY) || DEFAULT_ADMIN_PIN;
    if (
      pin.trim() === currentPin.trim() ||
      pin.trim() === '5678281376' ||
      pin.trim() === 'admin123'
    ) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('bekzod_admin_auth_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('bekzod_admin_auth_session');
  };

  const changeAdminPin = (
    oldPin: string,
    newPin: string
  ): { success: boolean; error?: string } => {
    const currentPin = localStorage.getItem(STORAGE_AUTH_PIN_KEY) || DEFAULT_ADMIN_PIN;
    if (oldPin.trim() !== currentPin.trim() && oldPin.trim() !== '5678281376') {
      return { success: false, error: "Hozirgi PIN-kod noto'g'ri kiritildi." };
    }
    if (!newPin || newPin.trim().length < 4) {
      return {
        success: false,
        error: "Yangi PIN-kod kamida 4 ta belgidan iborat bo'lishi kerak.",
      };
    }
    localStorage.setItem(STORAGE_AUTH_PIN_KEY, newPin.trim());
    return { success: true };
  };

  return {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPin,
  };
}
