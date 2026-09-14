import React from 'react';
import { Send } from 'lucide-react';

export const TelegramFloatingButton: React.FC = () => {
  return (
    <aside
      aria-label="Telegram Channel"
      className="fixed bottom-5 right-5 z-40 select-none print:hidden"
    >
      <a
        id="floating-telegram-join-btn"
        href="https://t.me/flashcryptodev"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join Flash Crypto Telegram Channel"
        className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-[#0088cc] to-[#00b0ff] text-white shadow-[0_6px_25px_rgba(0,136,204,0.45)] hover:shadow-[0_8px_30px_rgba(0,176,255,0.7)] border border-sky-300/30 backdrop-blur-lg transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Subtle Pulse Ring */}
        <span
          className="absolute -inset-1 rounded-full bg-sky-400/30 animate-ping pointer-events-none opacity-60 duration-1000"
          aria-hidden="true"
        />

        {/* Telegram Paper Plane Icon */}
        <Send className="w-5 h-5 text-white -translate-x-[1px] translate-y-[0.5px] group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </aside>
  );
};
