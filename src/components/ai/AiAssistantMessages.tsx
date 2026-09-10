import React from 'react';
import { ChatMessage } from '../../services/aiKnowledgeService';

interface AiAssistantMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendChip: (chipText: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const AiAssistantMessages: React.FC<AiAssistantMessagesProps> = ({
  messages,
  isTyping,
  onSendChip,
  messagesEndRef,
}) => {
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(
        /`(.*?)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-mono">$1</code>'
      );
      formatted = formatted.replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800">$1</a>'
      );

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

          {msg.sender === 'ai' && msg.chips && msg.chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
              {msg.chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onSendChip(chip)}
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
  );
};
