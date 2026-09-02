import React, { useState } from 'react';
import { useLanguage } from '@/shared';

interface LiveChatMessage {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      sender: 'agent',
      text: t.liveChatWelcome,
      time: '14:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Now' }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: t.liveChatResponse,
          time: 'Now'
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed bottom-0 inset-x-0 sm:bottom-6 sm:right-6 rtl:sm:right-auto rtl:sm:left-6 sm:inset-x-auto z-50 w-full sm:max-w-sm bg-surface-container-lowest dark:bg-zinc-950 border-t sm:border border-surface-container dark:border-zinc-800 shadow-2xl animate-fade-in flex flex-col h-[80vh] sm:h-[480px] rounded-t-2xl sm:rounded-none overflow-hidden">
        <div className="p-4 bg-primary text-white flex justify-between items-center">
          <div>
            <h4 className="font-editorial text-xl">{t.liveChatTitle}</h4>
            <span className="text-[10px] font-mono text-zinc-300">{t.liveChatStatus}</span>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-70 p-1">
            ✕
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end rtl:items-start' : 'items-start rtl:items-end'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white dark:bg-white dark:text-black'
                    : 'bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-primary dark:text-white'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{msg.time}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-container dark:border-zinc-800 flex gap-2 bg-surface-container-lowest dark:bg-zinc-950">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={t.typeMessagePlaceholder}
            className="flex-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3 py-2 text-xs font-mono text-primary dark:text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase shadow-sm"
          >
            {t.send}
          </button>
        </form>
      </div>
    </>
  );
};
