import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-8 pb-4 px-4 relative z-10">
      {/* Glow ambient background behind header */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-28 bg-gradient-to-r from-cyan-400/20 via-sky-400/25 to-blue-500/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* Trust pill badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 shadow-xs mb-3 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-semibold text-cyan-300 tracking-wide uppercase flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Automated Flash Node • TRON TRC-20
        </span>
      </div>

      {/* Main Brand Title */}
      <div className="relative text-center select-none">
        <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.08em] uppercase transition-all duration-300">
          <span className="trust-gradient-text drop-shadow-[0_4px_24px_rgba(6,182,212,0.4)]">
            FLASH CRYPTO
          </span>
        </h1>

        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-400 tracking-wide flex items-center justify-center gap-2 max-w-md mx-auto">
          <span>High-Frequency Flash Mint Protocol</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Zero Slippage Instant Dispatch
          </span>
        </p>
      </div>
    </header>
  );
};
