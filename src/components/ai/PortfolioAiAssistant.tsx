import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Minimize2, Trash2, ArrowUpRight, Check, CornerDownLeft } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ChatMessage,
  getInitialAiGreeting,
  getQuickSuggestionChips,
  generateAiResponse,
} from '../../services/aiKnowledgeService';
import { sendTelegramLead } from '../../services/telegramService';

export const PortfolioAiAssistant: React.FC = () => {
  const { language } = useLanguage();
  const { candidateProfile, featuredProjects, skillCategories, workExperience, educationList } = usePortfolioData();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [leadSent, setLeadSent] = useState(false);

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

      // Stream / simulated typing delay
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

  const handleQuickLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const contactInput = (form.elements.namedItem('leadContact') as HTMLInputElement)?.value;
    const noteInput = (form.elements.namedItem('leadNote') as HTMLInputElement)?.value;

    if (!contactInput) return;

    try {
      await sendTelegramLead({
        name: 'AI Chat Widget Visitor',
        email: contactInput,
        message: `[AI Lead Capture] Contact: ${contactInput} | Note: ${noteInput || 'N/A'}`,
      });
      setLeadSent(true);
      setTimeout(() => setLeadSent(false), 5000);
      form.reset();
    } catch {
      // ignore
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

  // Helper to format simple markdown (bold, links, code)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // replace **bold**
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // replace `code`
      formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-mono">$1</code>');
      // replace [text](url)
      formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800">$1</a>');

      return (
        <span
          key={idx}
          className="block min-h-[1.15rem]"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
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
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-mono text-xs font-bold text-white tracking-wide">
                    {candidateProfile.name} AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    24/7 Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  {language === 'uz' ? 'Shaxsiy muhandislik maslahatchisi' : language === 'ru' ? 'Персональный ИИ-ассистент' : 'Personal Engineering Rep'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Chatni tozalash"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Kichraytirish"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm shadow-blue-500/20'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <span
                    className={`block text-[9px] mt-1 font-mono ${
                      msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggestion Chips */}
                {msg.sender === 'ai' && msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit rounded-bl-none shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500">AI o'ylamoqda...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Lead Capture Form Modal (Inside AI widget) */}
          <div className="px-3.5 py-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {language === 'uz' ? 'Loyihangiz bormi?' : language === 'ru' ? 'Есть проект?' : 'Got a project?'}
            </span>
            <a
              href={candidateProfile.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold font-mono flex items-center gap-1"
            >
              <span>Telegramda yozish</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'uz'
                  ? 'Savolingizni yozing...'
                  : language === 'ru'
                  ? 'Напишите ваш вопрос...'
                  : 'Type your question...'
              }
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/30 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
