import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-8 pb-5 px-4 relative z-10">
      {/* Top Trust & Security Status Badge */}
      <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/[0.06] border border-sky-400/20 backdrop-blur-md mb-4 shadow-sm shadow-sky-500/5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
        <span className="text-[11px] font-medium tracking-wider text-sky-200 uppercase flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Verified Secure Protocol
        </span>
        <span className="text-[10px] text-sky-500/60">|</span>
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-emerald-400" />
          Bank-Grade 256-bit
        </span>
      </div>

      {/* Modern Trust-Engineered "FLASH CRYPTO" Title */}
      <div className="relative group text-center select-none">
        {/* Ambient Psychological Trust Aura (Sapphire & Cyan) */}
        <div 
          className="absolute -inset-x-12 -inset-y-6 bg-gradient-to-r from-blue-600/0 via-cyan-500/15 to-blue-500/0 blur-3xl -z-10 pointer-events-none"
          aria-hidden="true"
        />

        <h1 className="font-brand text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.08em] sm:tracking-[0.10em] uppercase transition-all duration-300">
          <span className="trust-gradient-text drop-shadow-[0_4px_24px_rgba(56,189,248,0.4)]">
            FLASH CRYPTO
          </span>
        </h1>

        <div className="flex items-center justify-center gap-2.5 mt-2.5">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-cyan-400/40" />
          <p className="text-xs sm:text-sm font-normal text-slate-300 tracking-wider flex items-center gap-1.5">
            <span>Institutional-Grade Instant Liquidity Terminal</span>
          </p>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-cyan-400/40" />
        </div>
      </div>
    </header>
  );
};
