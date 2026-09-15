import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  Clipboard,
  AlertCircle,
  ChevronDown,
  ArrowLeftRight,
  Crown,
  Check,
  Sparkles,
} from 'lucide-react';
import { CryptoAsset, OrderState } from '../types';
import { POPULAR_CRYPTOS } from '../data/cryptos';
import { LiquidGlassButton } from './LiquidGlassButton';
import { CryptoModal } from './CryptoModal';

interface CryptoOrderFormProps {
  onProceedToPayment: (order: OrderState) => void;
}

// Calculate dynamic network fee based on updated rates: Base Fee 39 TRX + tiered structure
export function calculateDynamicFee(
  crypto: CryptoAsset,
  amt: number
): { fee: number; isVip: boolean } {
  const isTrx = crypto.id === 'trx-trc20' || crypto.symbol === 'TRX';
  const isUsdt = crypto.id === 'usdt-trc20' || crypto.symbol === 'USDT';

  if (isTrx) {
    if (amt < 5000) {
      return { fee: 39, isVip: false }; // Base Fee 39 TRX
    } else if (amt <= 20000) {
      return { fee: 79, isVip: false }; // 5k, 10k, 20k -> 79 TRX
    } else {
      return { fee: 190, isVip: true }; // 30k, 40k, 50k+ -> 190 TRX
    }
  }

  if (isUsdt) {
    if (amt <= 1000) return { fee: 39, isVip: false };  // 1,000 USDT -> 39 TRX
    if (amt <= 2700) return { fee: 59, isVip: false };  // 2,700 USDT -> 59 TRX
    if (amt <= 4000) return { fee: 79, isVip: false };  // 4,000 USDT -> 79 TRX
    if (amt <= 5000) return { fee: 99, isVip: false };  // 5,000 USDT -> 99 TRX
    if (amt <= 7500) return { fee: 149, isVip: true };  // 7,500 USDT -> 149 TRX
    return { fee: 179, isVip: true };                   // 9,000+ USDT -> 179 TRX
  }

  // Generic crypto (BTC, ETH, etc.) based on equivalent USD value
  const usd = amt * (crypto.currentPriceUsd || 1);
  if (usd <= 1000) return { fee: 39, isVip: false };
  if (usd <= 2700) return { fee: 59, isVip: false };
  if (usd <= 4000) return { fee: 79, isVip: false };
  if (usd <= 5000) return { fee: 99, isVip: false };
  if (usd <= 7500) return { fee: 149, isVip: true };
  return { fee: 179, isVip: true };
}

export const CryptoOrderForm: React.FC<CryptoOrderFormProps> = ({
  onProceedToPayment,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(
    () => POPULAR_CRYPTOS.find((c) => c.id === 'trx-trc20') || POPULAR_CRYPTOS[0]
  );
  const [amountInput, setAmountInput] = useState<string>('1700');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTrxAsset = selectedCrypto.id === 'trx-trc20' || selectedCrypto.symbol === 'TRX';
  const numericAmount = parseFloat(amountInput) || 0;

  // Real-time fee calculation according to existing rates
  const { fee: feeAmount, isVip: isVipTier } = calculateDynamicFee(
    selectedCrypto,
    numericAmount
  );

  const approxUsd = (numericAmount * selectedCrypto.currentPriceUsd).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  const handleSelectCrypto = (c: CryptoAsset) => {
    setSelectedCrypto(c);
    const newIsTrx = c.id === 'trx-trc20' || c.symbol === 'TRX';
    setAmountInput(newIsTrx ? '1700' : '1000');
    setErrorMsg(null);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDestinationAddress(text.trim());
        setErrorMsg(null);
      }
    } catch {
      // Fallback
    }
  };

  const handleSubmit = () => {
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!destinationAddress.trim()) {
      setErrorMsg('Please enter a destination wallet address.');
      return;
    }
    if (destinationAddress.trim().length < 16) {
      setErrorMsg('Please enter a valid destination wallet address.');
      return;
    }

    setErrorMsg(null);

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const order: OrderState = {
      crypto: selectedCrypto,
      amount: numericAmount.toLocaleString(),
      destinationAddress: destinationAddress.trim(),
      feeAmount: feeAmount,
      feeCrypto: 'TRX',
      feeAddress: 'TTLjCgYXrrFCj7LJf3DXa9Kv4u8Np3Lm8r',
      network: `${selectedCrypto.network}`,
      createdAt: new Date().toISOString(),
      orderId: `FLS-${selectedCrypto.symbol.replace(/\s+/g, '')}-${randomSuffix}`,
    };

    onProceedToPayment(order);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Main Order Container */}
      <div className="rounded-3xl p-4 sm:p-6 relative bg-[#090e15]/95 border border-slate-800/90 shadow-2xl shadow-black/80 space-y-4">
        {/* TOP ASSET HEADER */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0c1219] border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">{selectedCrypto.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-mono uppercase">
                {selectedCrypto.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Network: <span className="text-slate-300 font-semibold">{selectedCrypto.network}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#141d27] border border-slate-700/60 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Switch Network / Token"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* AVAILABLE PILLS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs text-slate-500 font-medium shrink-0">Available:</span>
          <div className="flex items-center gap-2">
            {POPULAR_CRYPTOS.slice(0, 4).map((coin) => {
              const isActive = selectedCrypto.id === coin.id;
              return (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => handleSelectCrypto(coin)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-[#0e141c] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {coin.symbol} ({coin.network})
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOM QUANTITY / AMOUNT INPUT */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="custom-amount-input"
              className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wider"
            >
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <span>ENTER QUANTITY / AMOUNT</span>
            </label>
            <div className="text-xs font-mono text-slate-400">
              ≈ ${approxUsd} USD
            </div>
          </div>

          <div className="p-3 px-3.5 rounded-2xl bg-[#0a0f16] border border-slate-800/90 focus-within:border-cyan-500/80 flex items-center justify-between gap-3 shadow-inner">
            <input
              id="custom-amount-input"
              type="number"
              min="1"
              step="any"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                setErrorMsg(null);
              }}
              placeholder={isTrxAsset ? '1700' : '1000'}
              className="w-full bg-transparent text-xl sm:text-2xl font-black font-mono text-white placeholder:text-slate-600 focus:outline-none tracking-tight"
            />
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141d27] border border-slate-700/60 text-cyan-300 font-mono font-black text-xs sm:text-sm">
              {selectedCrypto.symbol}
            </div>
          </div>

          {/* Quick preset chips for rapid selection while keeping full freedom */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            <span className="text-[11px] text-slate-500 font-mono mr-1">Quick:</span>
            {(isTrxAsset
              ? [1700, 5000, 10000, 20000, 30000, 50000]
              : [1000, 2700, 4000, 5000, 7500, 9000]
            ).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmountInput(preset.toString());
                  setErrorMsg(null);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  numericAmount === preset
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/50'
                    : 'bg-[#0c1219] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* DESTINATION WALLET ADDRESS */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <span>DESTINATION WALLET ADDRESS</span>
          </div>

          <div className="p-3 px-3.5 rounded-2xl bg-[#0a0f16] border border-slate-800/90 focus-within:border-cyan-500/80 flex items-center justify-between gap-3 shadow-inner">
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => {
                setDestinationAddress(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="TXn8Y...9Kp4"
              className="w-full bg-transparent text-white font-mono text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none tracking-tight"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={handlePasteAddress}
              className="shrink-0 p-2 rounded-xl bg-[#141d27] hover:bg-[#1c2836] border border-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REQUIRED NETWORK FEE CARD */}
        <div
          className={`rounded-2xl p-3 px-4 border flex items-center justify-between shadow-md transition-all ${
            isVipTier
              ? 'bg-gradient-to-r from-[#1b140a] to-[#0c0905] border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.2)]'
              : 'bg-gradient-to-r from-[#091520] to-[#0b1219] border-cyan-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black font-mono ${
                isVipTier
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                  : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400 text-xs'
              }`}
            >
              {isVipTier ? <Crown className="w-5 h-5 fill-current" /> : 'TRX'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Required Network Fee:</span>
                {isVipTier && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-black uppercase tracking-wider">
                    VIP Tier
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-2xl font-black font-mono ${
                    isVipTier ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {feeAmount}
                </span>
                <span
                  className={`text-xs font-bold font-mono ${
                    isVipTier ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  TRX
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 font-mono">
            <div>TRON / TRC-20</div>
            <div className="text-[10px] text-slate-600 mt-0.5">Dynamic Fee</div>
          </div>
        </div>

        {/* INLINE ERROR */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* CTA SUBMIT BUTTON */}
        <div className="pt-2">
          <LiquidGlassButton
            id="btn-pay-network-fee"
            onClick={handleSubmit}
            icon={<Sparkles className="w-5 h-5 text-cyan-300" />}
          >
            Pay Network Fee
          </LiquidGlassButton>
        </div>
      </div>

      {/* Crypto Selector Modal */}
      <CryptoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCrypto={selectedCrypto}
        onSelect={(c) => {
          handleSelectCrypto(c);
        }}
      />
    </div>
  );
};
