'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Copy, Check, Smartphone, Wifi, Play, 
  ArrowRight, ShieldCheck, MessageCircle, PartyPopper, User
} from 'lucide-react';
import { soundManager } from '@/lib/sounds';

interface LobbyModalProps {
  isOpen: boolean;
  roomCode: string;
  myRole: 'host' | 'guest';
  myPlayerName: string;
  myAvatar: string;
  isConnecting: boolean;
  isConnected: boolean;
  isSingleDevice: boolean;
  onClose: () => void;
  onCreateRoom: (customCode?: string) => void;
  onJoinRoom: (targetCode: string) => void;
  onStartSingleDevice: () => void;
  onUpdateProfile: (name: string, avatar: string) => void;
}

const AVATAR_OPTIONS = ['🐱', '🐰', '🐻', '🐼', '🦊', '👧', '👦', '💖', '🧸', '🐥'];

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  roomCode,
  myRole,
  myPlayerName,
  myAvatar,
  isConnecting,
  isConnected,
  isSingleDevice,
  onClose,
  onCreateRoom,
  onJoinRoom,
  onStartSingleDevice,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'single'>('create');
  const [inputCode, setInputCode] = useState('');
  const [name, setName] = useState(myPlayerName || 'Ayang 1');
  const [selectedAvatar, setSelectedAvatar] = useState(myAvatar || '🐱');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/?room=${roomCode}`);
    }
  }, [roomCode]);

  useEffect(() => {
    if (myPlayerName) setName(myPlayerName);
    if (myAvatar) setSelectedAvatar(myAvatar);
  }, [myPlayerName, myAvatar]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Sayang! Ayo main "Couple Battle" bareng aku sekarang 💕\nKlik link ini buat langsung masuk ke room:\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSaveProfile = (newName: string, newAvatar: string) => {
    setName(newName);
    setSelectedAvatar(newAvatar);
    onUpdateProfile(newName, newAvatar);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    soundManager.playClick();
    onJoinRoom(inputCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#FFFDF5] border-3 border-[#2D2A26] rounded-3xl toy-shadow-lg overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-[#FFE4E8] px-5 py-4 border-b-2 border-[#2D2A26] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-pink-400 text-white rounded-xl toy-shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </span>
            <div>
              <h2 className="font-fun text-xl text-[#3A2222] font-bold tracking-tight">
                Couple Battle! 💕
              </h2>
              <p className="text-xs text-stone-600 font-medium">
                Monopoli Virtual Pasangan LDR
              </p>
            </div>
          </div>
          {isConnected && (
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold px-2.5 py-1 bg-white/70 hover:bg-white rounded-full border border-stone-300"
            >
              Tutup ✕
            </button>
          )}
        </div>

        <div className="p-5 flex-1 overflow-y-auto max-h-[80vh] space-y-4">
          {/* Profile Customizer */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 toy-shadow-sm space-y-2.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-500" />
              Nama & Avatar Kamu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                maxLength={15}
                onChange={(e) => handleSaveProfile(e.target.value, selectedAvatar)}
                placeholder="Panggilan kamu (misal: Bubu)"
                className="flex-1 px-3 py-2 text-sm bg-stone-50 border-2 border-stone-300 rounded-xl focus:border-pink-500 focus:outline-none font-medium"
              />
              <div className="text-2xl p-1 bg-pink-50 border-2 border-pink-200 rounded-xl">
                {selectedAvatar}
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSaveProfile(name, emoji)}
                  className={`text-xl p-1.5 rounded-xl border-2 transition-all ${
                    selectedAvatar === emoji
                      ? 'border-pink-500 bg-pink-100 scale-110 shadow-sm'
                      : 'border-transparent hover:bg-stone-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl border-2 border-stone-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                soundManager.playClick();
              }}
              className={`py-2 text-xs font-fun font-bold rounded-xl transition-all ${
                activeTab === 'create'
                  ? 'bg-yellow-300 text-stone-900 toy-shadow-sm border border-stone-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Buat Room (Host)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('join');
                soundManager.playClick();
              }}
              className={`py-2 text-xs font-fun font-bold rounded-xl transition-all ${
                activeTab === 'join'
                  ? 'bg-pink-300 text-stone-900 toy-shadow-sm border border-stone-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Gabung Room
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('single');
                soundManager.playClick();
              }}
              className={`py-2 text-xs font-fun font-bold rounded-xl transition-all ${
                activeTab === 'single'
                  ? 'bg-teal-300 text-stone-900 toy-shadow-sm border border-stone-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Mode 1 HP
            </button>
          </div>

          {/* Tab 1: Buat Room (Host) */}
          {activeTab === 'create' && (
            <div className="space-y-3.5 bg-yellow-50/70 p-4 rounded-2xl border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider">
                    Kode Room Kamu:
                  </span>
                  <div className="font-fun text-3xl font-extrabold text-stone-800 tracking-widest mt-0.5">
                    {roomCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCreateRoom()}
                  title="Generate kode baru"
                  className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg border border-amber-400"
                >
                  Acak Baru
                </button>
              </div>

              {/* Status Banner */}
              {isConnected ? (
                <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-xl flex items-center gap-2.5 text-emerald-900">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div className="text-xs font-bold">
                    Yeay! Pasangan sudah terhubung. Siap main! 🎉
                  </div>
                </div>
              ) : isConnecting ? (
                <div className="p-3 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center gap-2.5 text-amber-900">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <div className="text-xs font-medium">
                    Menunggu pasangan membuka link / join...
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-white/80 border border-stone-200 rounded-xl text-xs text-stone-600">
                  Kirim link di bawah ini ke pasanganmu. Saat dia klik, kalian akan langsung terhubung secara realtime!
                </div>
              )}

              {/* Share & Copy Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs rounded-xl border-2 border-stone-800 toy-shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-700" />
                      <span>Salin Link Undangan Room</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border-2 border-stone-800 toy-shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim ke WhatsApp Pasangan</span>
                </button>

                {isConnected && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full mt-2 py-3 bg-pink-500 hover:bg-pink-600 text-white font-fun font-bold text-sm rounded-xl border-2 border-stone-800 toy-shadow-pressed transition-all"
                  >
                    Mulai Main Sekarang! 🎲
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Gabung Room */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinSubmit} className="space-y-3.5 bg-pink-50/70 p-4 rounded-2xl border-2 border-pink-200">
              <div>
                <label className="text-xs font-bold text-pink-900 block mb-1">
                  Masukkan Kode Room dari Pasangan:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: AB12CD"
                    maxLength={10}
                    className="flex-1 px-3 py-2.5 text-base font-fun tracking-wider bg-white border-2 border-stone-800 rounded-xl focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isConnecting || !inputCode.trim()}
                    className="px-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-fun font-bold text-xs rounded-xl border-2 border-stone-800 toy-shadow-sm transition-all"
                  >
                    {isConnecting ? 'Nyambung...' : 'Gabung'}
                  </button>
                </div>
              </div>

              {isConnected ? (
                <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-xl flex items-center gap-2.5 text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <div className="text-xs font-bold">
                    Berhasil terhubung ke Player 1!
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-600 leading-relaxed">
                  Mintalah kode room 6 huruf atau link share dari pasanganmu yang membuat room sebagai Player 1.
                </p>
              )}

              {isConnected && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-sm rounded-xl border-2 border-stone-800 toy-shadow-sm transition-all"
                >
                  Masuk ke Game! 🚀
                </button>
              )}
            </form>
          )}

          {/* Tab 3: Mode 1 HP (Offline / Pass & Play) */}
          {activeTab === 'single' && (
            <div className="space-y-3 bg-teal-50/70 p-4 rounded-2xl border-2 border-teal-200">
              <div className="flex items-center gap-2 text-teal-900">
                <Smartphone className="w-5 h-5 text-teal-600" />
                <h4 className="font-fun font-bold text-sm">Main Berdua di 1 Layar HP</h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Lagi jalan bareng atau video call sambil share screen? Kamu bisa mainkan Couple Battle secara bergantian di 1 perangkat tanpa perlu koneksi P2P.
              </p>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onStartSingleDevice();
                  onClose();
                }}
                className="w-full py-3 bg-teal-400 hover:bg-teal-500 text-stone-900 font-fun font-bold text-sm rounded-xl border-2 border-stone-800 toy-shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-stone-900" />
                <span>Mulai Mode 1 HP</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="bg-stone-50 px-4 py-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% P2P WebRTC Aman Langsung Antar HP
          </span>
          <span>v1.0 Romantis</span>
        </div>
      </div>
    </div>
  );
};
