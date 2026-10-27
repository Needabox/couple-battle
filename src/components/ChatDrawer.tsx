'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '@/lib/sounds';

export interface ChatMessage {
  id: string;
  sender: string;
  senderId: 1 | 2;
  text: string;
  timestamp: number;
}

interface ChatDrawerProps {
  isOpen: boolean;
  messages: ChatMessage[];
  myPlayerId: 1 | 2;
  myPlayerName: string;
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

const QUICK_PHRASES = [
  'Sayang kamu! 💕',
  'Curang nih! 😜',
  'Cepetan lempar dadunya! ⏳',
  'Pap dulu dong sekarang 📸',
  'Kangen banget ih 🥺',
  'Peluk virtual 10 detik 🤗',
  'Salting brutal 🙈',
  'Muka kamu lucu banget wkwk 😂',
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  messages,
  myPlayerId,
  myPlayerName,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    soundManager.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSendQuick = (phrase: string) => {
    soundManager.playClick();
    onSendMessage(phrase);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="w-full max-w-sm h-full bg-[#FFFDF5] border-l-3 border-stone-800 flex flex-col shadow-2xl"
      >
        {/* Chat Header */}
        <div className="p-4 bg-[#FFE4E8] border-b-2 border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-pink-400 text-white rounded-xl toy-shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-fun text-base font-bold text-stone-900">
                Obrolan Pasangan 💕
              </h3>
              <p className="text-[11px] text-stone-600">P2P Realtime Chat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/80 rounded-full text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 text-xs px-4">
              <Heart className="w-8 h-8 text-pink-300 animate-pulse mb-2" />
              <p>Belum ada pesan. Kirim rayuan atau pesan manja ke pasangan!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === myPlayerId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-500 font-bold mb-0.5 px-1">
                    {msg.sender}
                  </span>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium border-2 border-stone-800 toy-shadow-sm ${
                      isMe
                        ? 'bg-pink-400 text-white rounded-br-none'
                        : 'bg-white text-stone-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Phrases */}
        <div className="p-2.5 bg-stone-100 border-t border-stone-200">
          <div className="text-[10px] font-bold text-stone-500 mb-1.5 px-1">
            Pesan Cepat Romantis:
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => handleSendQuick(phrase)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-pink-50 text-stone-700 hover:text-pink-700 rounded-full border border-stone-300 toy-shadow-sm transition-all"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t-2 border-stone-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik pesan cinta..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-stone-50 border-2 border-stone-300 rounded-xl focus:outline-none focus:border-pink-500 font-medium"
          />
          <button
            type="submit"
            className="p-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-stone-800 toy-shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
