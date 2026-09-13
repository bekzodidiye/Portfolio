import { useState, useEffect } from 'react';


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

  const loginAdmin = async (pin: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAdminAuthenticated(true);
          sessionStorage.setItem('bekzod_admin_auth_session', 'true');
          return true;
        }
      }
    } catch (e) {
      console.error('Authentication error:', e);
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('bekzod_admin_auth_session');
  };

  const changeAdminPin = async (
    oldPin: string,
    newPin: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin, newPin }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Server xatosi' };
      }
    } catch (e) {
      console.error('Change PIN error:', e);
      return { success: false, error: "Tarmoq xatosi yoki server ishlamayapti." };
    }
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
