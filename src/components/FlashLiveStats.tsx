import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

interface FlashMintEvent {
  id: string;
  txHash: string;
  asset: 'USDT (TRC20)' | 'TRX (TRC20)';
  amount: number;
  timeAgo: string;
  status: 'Confirmed' | 'Dispatched';
}

const INITIAL_EVENTS: FlashMintEvent[] = [
  {
    id: 'ev-1',
    txHash: '0x8f4c...3e1a',
    asset: 'TRX (TRC20)',
    amount: 5000,
    timeAgo: '12s ago',
    status: 'Dispatched',
  },
  {
    id: 'ev-2',
    txHash: '0x2b91...77d4',
    asset: 'USDT (TRC20)',
    amount: 2700,
    timeAgo: '42s ago',
    status: 'Confirmed',
  },
  {
    id: 'ev-3',
    txHash: '0x9a3e...b109',
    asset: 'TRX (TRC20)',
    amount: 1700,
    timeAgo: '1m ago',
    status: 'Confirmed',
  },
  {
    id: 'ev-4',
    txHash: '0x5c72...9f88',
    asset: 'USDT (TRC20)',
    amount: 5000,
    timeAgo: '2m ago',
    status: 'Confirmed',
  },
];

export const FlashLiveStats: React.FC = () => {
  const [totalMintedUsd, setTotalMintedUsd] = useState(14829350);
  const [events, setEvents] = useState<FlashMintEvent[]>(INITIAL_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const amounts = [1700, 2700, 4000, 5000, 10000, 20000];
      const assets: Array<'USDT (TRC20)' | 'TRX (TRC20)'> = ['USDT (TRC20)', 'TRX (TRC20)'];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      const hex = Math.random().toString(16).substring(2, 6);
      const hexEnd = Math.random().toString(16).substring(2, 6);

      const newEvent: FlashMintEvent = {
        id: `ev-${Date.now()}`,
        txHash: `0x${hex}...${hexEnd}`,
        asset: randomAsset,
        amount: randomAmount,
        timeAgo: 'Just now',
        status: 'Dispatched',
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 3)]);
      setTotalMintedUsd((prev) => prev + (randomAsset.includes('TRX') ? Math.round(randomAmount * 0.24) : randomAmount));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mb-6 px-2">
      {/* 3 Metric cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="p-3 rounded-2xl bg-[#0c1219] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>24h Volume</span>
          </div>
          <div className="text-xs sm:text-sm font-extrabold font-mono text-white mt-1">
            ${(totalMintedUsd / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0c1219] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Node Speed</span>
          </div>
          <div className="text-xs sm:text-sm font-extrabold font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span>~1.2s</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0c1219] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Validity</span>
          </div>
          <div className="text-xs sm:text-sm font-extrabold font-mono text-cyan-400 mt-1">
            7 Days Proof
          </div>
        </div>
      </div>

      {/* Live Transaction Ticker */}
      <div className="p-2.5 px-3.5 rounded-2xl bg-[#0c1219] border border-slate-800/90 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider shrink-0 font-mono">
            Live Feed:
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={events[0].id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[11px] font-mono text-slate-300 truncate flex items-center gap-1.5"
            >
              <span className="text-slate-500">{events[0].txHash}</span>
              <span className="font-bold text-emerald-400">
                +{events[0].amount.toLocaleString()} {events[0].asset.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                ({events[0].timeAgo})
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0 font-mono">
          Auto-Dispatched
        </div>
      </div>
    </div>
  );
};
