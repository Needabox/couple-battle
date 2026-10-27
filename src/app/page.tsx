'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CoupleBattleGame = dynamic(
  () => import('@/components/CoupleBattleGame'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center p-4">
        <div className="font-fun text-2xl text-pink-500 font-bold animate-pulse flex items-center gap-2">
          <span>Couple Battle!</span>
          <span>💖</span>
        </div>
        <p className="text-xs text-stone-500 mt-2 font-medium">
          Memuat papan monopoli cinta...
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center p-4">
          <div className="font-fun text-2xl text-pink-500 font-bold animate-pulse flex items-center gap-2">
            <span>Couple Battle!</span>
            <span>💖</span>
          </div>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Memuat papan monopoli cinta...
          </p>
        </div>
      }
    >
      <CoupleBattleGame />
    </Suspense>
  );
}
