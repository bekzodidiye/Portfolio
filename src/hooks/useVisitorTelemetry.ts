import { useEffect } from 'react';
import { collectVisitorTelemetry } from '../services/visitorTelemetry';
import { sendVisitorNotification } from '../services/telegramService';
import { saveRealVisitorRecord } from '../services/realVisitorStorage';

export function useVisitorTelemetry() {
  useEffect(() => {
    const SILENT_LOG_KEY = 'portfolio_silent_visit_logged';
    
    // Only run once per session
    if (typeof window !== 'undefined' && !sessionStorage.getItem(SILENT_LOG_KEY)) {
      sessionStorage.setItem(SILENT_LOG_KEY, 'true');
      
      const timer = setTimeout(async () => {
        try {
          const telemetry = await collectVisitorTelemetry();
          // Automatically persist into real visitor telemetry store
          saveRealVisitorRecord(telemetry);
          
          sendVisitorNotification(telemetry).catch((err) => {
            console.error('[Telemetry] Failed to dispatch silent visitor telemetry notification:', err);
          });
        } catch (e) {
          console.error('[Telemetry] Critical error during telemetry collection:', e);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
}
