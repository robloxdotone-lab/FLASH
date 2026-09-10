import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check, TrendingUp } from 'lucide-react';
import { CryptoAsset } from '../types';
import { POPULAR_CRYPTOS } from '../data/cryptos';

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrypto: CryptoAsset;
  onSelect: (crypto: CryptoAsset) => void;
}

export const CryptoModal: React.FC<CryptoModalProps> = ({
  isOpen,
  onClose,
  selectedCrypto,
  onSelect,
}) => {
  const [query, setQuery] = useState('');

  const filtered = POPULAR_CRYPTOS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase()) ||
      c.network.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-3xl liquid-glass-card p-6 overflow-hidden max-h-[85vh] flex flex-col z-10 border border-white/15"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  Select Cryptocurrency
                </h3>
                <p className="text-xs text-slate-400">
                  Choose from high-liquidity digital assets
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, symbol (e.g. USDT TRC20, BEP20, TRX)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl liquid-glass-input text-sm text-white placeholder:text-slate-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Crypto List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[50vh] scrollbar-thin scrollbar-thumb-white/10">
              {filtered.map((crypto) => {
                const isSelected = crypto.id === selectedCrypto.id;
                return (
                  <button
                    key={crypto.id}
                    type="button"
                    onClick={() => {
                      onSelect(crypto);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200
                      ${
                        isSelected
                          ? 'bg-amber-400/10 border border-amber-400/40 shadow-sm'
                          : 'bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${crypto.iconBg}`}
                      >
                        {crypto.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {crypto.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {crypto.symbol}
                          </span>
                          {crypto.badge && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                              {crypto.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Network: <span className="text-slate-300">{crypto.network}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-mono font-medium text-slate-200">
                          ${crypto.currentPriceUsd.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-0.5">
                          <TrendingUp className="w-2.5 h-2.5" /> +2.4%
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  No cryptocurrency found for "{query}".
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
