import { useState, useEffect, FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { sendTelegramLead, getRemainingCooldown, generateDirectTelegramUrl, ContactPayload } from '../services/telegramService';
import { useLanguage } from '../context/LanguageContext';

export function useContactForm() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [directFallbackUrl, setDirectFallbackUrl] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // Timer countdown for rate limiting
  useEffect(() => {
    const current = getRemainingCooldown();
    setCooldown(current);

    if (current <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const resetForm = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    setDirectFallbackUrl(null);
    setName('');
    setEmail('');
    setMessage('');
    setHoneypot('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDirectFallbackUrl(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage(
        language === 'uz'
          ? 'Iltimos, barcha maydonlarni to\'liq to\'ldiring.'
          : language === 'ru'
          ? 'Пожалуйста, заполните все обязательные поля.'
          : 'Please fill in all required fields.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage(
        language === 'uz'
          ? 'Iltimos, to\'g\'ri elektron pochta manzilini kiriting.'
          : language === 'ru'
          ? 'Пожалуйста, введите корректный адрес электронной почты.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    const currentCooldown = getRemainingCooldown();
    if (currentCooldown > 0) {
      setCooldown(currentCooldown);
      setErrorMessage(
        language === 'uz'
          ? `Iltimos, yangi xabar yuborishdan oldin ${currentCooldown} soniya kuting.`
          : language === 'ru'
          ? `Подождите ${currentCooldown} сек. перед отправкой следующего сообщения.`
          : `Please wait ${currentCooldown}s before submitting another message.`
      );
      return;
    }

    setIsSubmitting(true);

    const payload: ContactPayload = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      honeypot: honeypot.trim(),
      language,
    };

    const result = await sendTelegramLead(payload);
    setIsSubmitting(false);

    if (result.success) {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#2563EB', '#4F46E5', '#D97706', '#10B981'],
      });
      setIsSubmitted(true);
      setCooldown(45);
    } else {
      setErrorMessage(result.error || 'Xatolik yuz berdi.');
      if (result.directTelegramUrl) {
        setDirectFallbackUrl(result.directTelegramUrl);
      } else {
        setDirectFallbackUrl(generateDirectTelegramUrl(payload));
      }
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    honeypot,
    setHoneypot,
    isSubmitting,
    isSubmitted,
    errorMessage,
    directFallbackUrl,
    cooldown,
    handleSubmit,
    resetForm,
  };
}
