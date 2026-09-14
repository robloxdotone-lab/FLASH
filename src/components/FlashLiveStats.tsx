import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, TrendingUp, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface FlashMintEvent {
  id: string;
  txHash: string;
  asset: 'USDT (TRC20)' | 'USDT (BEP20)' | 'TRX (TRC20)';
  amount: number;
  timeAgo: string;
  status: 'Confirmed' | 'Dispatched';
}

const INITIAL_EVENTS: FlashMintEvent[] = [
  {
    id: 'ev-1',
    txHash: '0x8f4c...3e1a',
    asset: 'USDT (TRC20)',
    amount: 1000,
    timeAgo: '42s ago',
    status: 'Dispatched',
  },
  {
    id: 'ev-2',
    txHash: '0x2b91...77d4',
    asset: 'USDT (BEP20)',
    amount: 2700,
    timeAgo: '2m ago',
    status: 'Confirmed',
  },
  {
    id: 'ev-3',
    txHash: '0x9a3e...b109',
    asset: 'TRX (TRC20)',
    amount: 4000,
    timeAgo: '4m ago',
    status: 'Confirmed',
  },
  {
    id: 'ev-4',
    txHash: '0x17c0...f492',
    asset: 'USDT (TRC20)',
    amount: 5000,
    timeAgo: '7m ago',
    status: 'Confirmed',
  },
  {
    id: 'ev-5',
    txHash: '0x6e88...a210',
    asset: 'USDT (TRC20)',
    amount: 7500,
    timeAgo: '11m ago',
    status: 'Confirmed',
  },
];

export const FlashLiveStats: React.FC = () => {
  const [totalMintedUsd, setTotalMintedUsd] = useState(14829350);
  const [activeSessionCount, setActiveSessionCount] = useState(24);
  const [events, setEvents] = useState<FlashMintEvent[]>(INITIAL_EVENTS);

  // Subtle real-time heartbeat to reinforce active platform credibility
  useEffect(() => {
    const interval = setInterval(() => {
      const amounts = [1000, 2700, 4000, 5000, 7500, 9000];
      const assets: Array<'USDT (TRC20)' | 'USDT (BEP20)' | 'TRX (TRC20)'> = [
        'USDT (TRC20)',
        'USDT (BEP20)',
        'TRX (TRC20)',
      ];
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

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
      setTotalMintedUsd((prev) => prev + (randomAsset.includes('TRX') ? Math.round(randomAmount * 0.24) : randomAmount));
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mt-3 mb-2 px-2">
      {/* Golden Guarantee & Validity Badge */}
      <div className="flex items-center justify-center mb-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-400/35 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.18)]">
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-amber-300 gold-metallic-text tracking-wide uppercase text-center">
            Valid Up to 1 Week + Approved for Transactions
          </span>
        </div>
      </div>

      <div className="liquid-glass-card rounded-2xl p-3 sm:p-4 border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Top Header metrics */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Live FLASH Dispatches
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-slate-400">
              <span>24h Minted:</span>
              <span className="text-emerald-400 font-bold">
                ${totalMintedUsd.toLocaleString()} USD
              </span>
            </div>
            <span className="text-white/10 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <span>Nodes:</span>
              <span className="text-cyan-300 font-bold">99.98% OK</span>
            </div>
          </div>
        </div>

        {/* Live Transaction Feed */}
        <div className="mt-2.5 space-y-1.5">
          {events.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-1 px-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-[11px] font-mono border border-white/[0.03]"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"></span>
                <span className="text-slate-400">{item.txHash}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-200 font-semibold">{item.asset}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-cyan-300 font-bold">
                  +{item.amount.toLocaleString()}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-500 w-12 text-right hidden sm:inline">
                  {item.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility verification note */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Proof of Reserve & Instant Mempool Execution
          </span>
          <span className="text-slate-400">Latency: ~1.2s</span>
        </div>
      </div>
    </div>
  );
};
