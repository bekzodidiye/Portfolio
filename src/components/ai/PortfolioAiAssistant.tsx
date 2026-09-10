import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ChatMessage,
  getInitialAiGreeting,
  getQuickSuggestionChips,
  generateAiResponse,
} from '../../services/aiKnowledgeService';
import { AiAssistantHeader } from './AiAssistantHeader';
import { AiAssistantMessages } from './AiAssistantMessages';
import { AiAssistantInput } from './AiAssistantInput';

export const PortfolioAiAssistant: React.FC = () => {
  const { language } = useLanguage();
  const { candidateProfile, featuredProjects, skillCategories, workExperience, educationList } =
    usePortfolioData();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Greeting
  useEffect(() => {
    const greetingText = getInitialAiGreeting(language, candidateProfile.name);
    const initialChips = getQuickSuggestionChips(language);
    setMessages([
      {
        id: 'msg-greeting',
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: initialChips,
      },
    ]);
  }, [language, candidateProfile.name]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isTyping) return;

    const userMsgId = 'user-' + Date.now();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const fullResponse = await generateAiResponse(query, {
        candidateProfile,
        projects: featuredProjects,
        skills: skillCategories,
        workExperience,
        education: educationList,
        language,
      });

      setTimeout(() => {
        const aiMsgId = 'ai-' + Date.now();
        const aiMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          text: fullResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: getQuickSuggestionChips(language),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 550);
    } catch {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const greetingText = getInitialAiGreeting(language, candidateProfile.name);
    setMessages([
      {
        id: 'msg-greeting-reset',
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: getQuickSuggestionChips(language),
      },
    ]);
  };

  return (
    <>
      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            id="ai-assistant-toggle-btn"
            aria-label="Open AI Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5 animate-pulse" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold tracking-wider leading-none">
                AI ASSISTANT
              </span>
              <span className="text-[10px] text-blue-100 font-sans leading-tight">
                {language === 'uz' ? 'Savol bering' : language === 'ru' ? 'Задайте вопрос' : 'Ask anything'}
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          id="ai-assistant-window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh] rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/20 flex flex-col overflow-hidden animate-fadeIn"
        >
          <AiAssistantHeader
            candidateName={candidateProfile.name}
            language={language}
            onClear={clearChat}
            onClose={() => setIsOpen(false)}
          />

          <AiAssistantMessages
            messages={messages}
            isTyping={isTyping}
            onSendChip={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />

          <AiAssistantInput
            candidateTelegram={candidateProfile.telegram}
            language={language}
            inputVal={inputVal}
            setInputVal={setInputVal}
            isTyping={isTyping}
            onSubmit={handleSendMessage}
            inputRef={inputRef}
          />
        </div>
      )}
    </>
  );
};
