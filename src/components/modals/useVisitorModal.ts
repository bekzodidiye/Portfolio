import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { collectVisitorTelemetry } from '../../services/visitorTelemetry';
import { sendVisitorNotification } from '../../services/telegramService';
import {
  triggerCelebration,
  saveVisitorAcknowledgement,
  getStoredVisitorInfo,
} from './visitorModalHelpers';

interface UseVisitorModalOptions {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export function useVisitorModal({
  isOpenOverride,
  onCloseOverride,
}: UseVisitorModalOptions = {}) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('recruiter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize: Check if user already acknowledged
  useEffect(() => {
    if (typeof isOpenOverride === 'boolean') {
      setIsOpen(isOpenOverride);
      return;
    }

    const { acknowledged, name: existingName } = getStoredVisitorInfo();
    if (existingName) setName(existingName);

    if (!acknowledged) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isOpenOverride]);

  const handleFinish = async (visitorName: string, roleKey: string, isAnon: boolean) => {
    setIsSubmitting(true);

    try {
      saveVisitorAcknowledgement(visitorName, roleKey, isAnon);
      const roleTitle = roleKey ? (t.visitorModal.roles as any)[roleKey] || roleKey : undefined;

      const telemetry = await collectVisitorTelemetry(
        isAnon ? 'Anonim' : visitorName,
        roleTitle,
        language
      );

      sendVisitorNotification(telemetry).catch((err) =>
        console.warn('Visitor background telemetry dispatch:', err)
      );

      if (!isAnon && visitorName) {
        triggerCelebration();
        setToastMessage(t.visitorModal.toastIntro.replace('{name}', visitorName));
      } else {
        setToastMessage(t.visitorModal.toastAnon);
      }

      setTimeout(() => setToastMessage(null), 4500);
    } catch (e) {
      console.error('Error during visitor modal submit:', e);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
      if (onCloseOverride) onCloseOverride();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      handleFinish(trimmed, selectedRole, false);
    } else {
      handleFinish('Anonim', selectedRole, true);
    }
  };

  const handleSkip = () => {
    handleFinish('Anonim', 'guest', true);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    isOpen,
    name,
    setName,
    selectedRole,
    setSelectedRole,
    isSubmitting,
    toastMessage,
    setToastMessage,
    handleSubmit,
    handleSkip,
    t,
  };
}
