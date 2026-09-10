import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown,
  Coins,
  Wallet,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { CryptoAsset, OrderState } from '../types';
import { POPULAR_CRYPTOS } from '../data/cryptos';
import { LiquidGlassButton } from './LiquidGlassButton';
import { CryptoModal } from './CryptoModal';

interface CryptoOrderFormProps {
  onProceedToPayment: (order: OrderState) => void;
}

export const CryptoOrderForm: React.FC<CryptoOrderFormProps> = ({
  onProceedToPayment,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(POPULAR_CRYPTOS[0]); // Default to USDT TRC20
  const [amount, setAmount] = useState<string>('100');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick select presets
  const topFour = POPULAR_CRYPTOS.slice(0, 4);

  // Calculate approximate USD value
  const numAmount = parseFloat(amount) || 0;
  const approxUsd = (numAmount * selectedCrypto.currentPriceUsd).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  // Dynamic fee calculation based on quantity (> 190 -> 47 TRX, <= 190 -> 29 TRX)
  const feeAmount = numAmount > 190 ? 47 : 29;

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
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!destinationAddress.trim()) {
      setErrorMsg('Please enter a destination wallet address.');
      return;
    }
    if (destinationAddress.trim().length < 16) {
      setErrorMsg('Please enter a complete and valid destination wallet address.');
      return;
    }

    setErrorMsg(null);

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const order: OrderState = {
      crypto: selectedCrypto,
      amount: amount.trim(),
      destinationAddress: destinationAddress.trim(),
      feeAmount: feeAmount,
      feeCrypto: 'TRX',
      feeAddress: 'TTLjCgYXrrFCj7LJf3DXa9Kv4u8Np3Lm8r',
      network: 'TRON (TRC-20)',
      createdAt: new Date().toISOString(),
      orderId: `FLS-${selectedCrypto.symbol.replace(/\s+/g, '')}-${randomSuffix}`,
    };

    onProceedToPayment(order);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Liquid Glass Form Container */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 relative border border-white/15">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="space-y-5">
          {/* SECTION 1: Select Cryptocurrency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Select Cryptocurrency
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                1 {selectedCrypto.symbol} ≈ ${selectedCrypto.currentPriceUsd.toLocaleString()}
              </span>
            </div>

            {/* Selected Crypto Trigger Box */}
            <div
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModalOpen(true);
                }
              }}
              className="liquid-glass-input rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group hover:border-amber-400/30 transition-all border border-white/10 select-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs border ${selectedCrypto.iconBg} shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {selectedCrypto.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white group-hover:text-amber-200 transition-colors">
                      {selectedCrypto.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
                      {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Network: <span className="text-slate-300 font-medium">{selectedCrypto.network}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-amber-400/80 font-medium">
                  Switch
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-amber-400/20 text-slate-300 group-hover:text-amber-300 flex items-center justify-center transition-colors">
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Crypto Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              <span className="text-[11px] text-slate-500 mr-1 shrink-0">
                Popular:
              </span>
              {topFour.map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => {
                    setSelectedCrypto(coin);
                    setAmount(coin.defaultAmount);
                    setErrorMsg(null);
                  }}
                  className={`
                    px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer
                    ${
                      selectedCrypto.id === coin.id
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5'
                    }
                  `}
                >
                  {coin.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: Amount / Quantity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="amount-input"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                Quantity / Amount
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                ≈ ${approxUsd} USD
              </span>
            </div>

            <div className="liquid-glass-input rounded-2xl p-3.5 flex items-center gap-3 border border-white/10 focus-within:border-amber-400/40">
              <input
                id="amount-input"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="0.00"
                className="w-full bg-transparent text-xl sm:text-2xl font-bold font-mono text-white placeholder:text-slate-600 focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold font-mono px-2.5 py-1 rounded-lg bg-white/10 text-amber-300 border border-white/10">
                  {selectedCrypto.symbol}
                </span>
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div className="flex items-center gap-2 justify-end text-[11px] text-slate-400 font-mono">
              <button
                type="button"
                onClick={() => setAmount(selectedCrypto.defaultAmount)}
                className="hover:text-amber-300 hover:underline transition-colors"
              >
                Default ({selectedCrypto.defaultAmount})
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const val = (parseFloat(amount) || 1) * 2;
                  setAmount(val.toString());
                }}
                className="hover:text-amber-300 hover:underline transition-colors"
              >
                2x
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const val = (parseFloat(amount) || 1) * 5;
                  setAmount(val.toString());
                }}
                className="hover:text-amber-300 hover:underline transition-colors"
              >
                5x
              </button>
            </div>
          </div>

          {/* SECTION 3: Destination Wallet Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="destination-address-input"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Destination Wallet Address
              </label>
              <span className="text-[11px] text-amber-400/80 font-mono">
                {selectedCrypto.network}
              </span>
            </div>

            <div className="liquid-glass-input rounded-2xl p-3 flex items-center gap-2 border border-white/10 focus-within:border-amber-400/40">
              <input
                id="destination-address-input"
                type="text"
                value={destinationAddress}
                onChange={(e) => {
                  setDestinationAddress(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder={selectedCrypto.placeholderAddress}
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none tracking-tight"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={handlePasteAddress}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs transition-colors border border-white/10"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500" />
              {selectedCrypto.addressHint}
            </p>
          </div>

          {/* Network Fee Banner Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold font-mono text-[10px]">
                TRX
              </div>
              <div>
                <span className="text-slate-300">Required Network Fee:</span>
                <span className="font-bold text-amber-300 ml-1.5 font-mono text-sm">
                  {feeAmount} TRX
                </span>
                <span className="ml-2 text-[10px] text-slate-400 hidden sm:inline">
                  {numAmount > 190 ? '(Tier: >190 units → 47 TRX)' : '(Tier: ≤190 units → 29 TRX)'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              TRON / TRC-20
            </span>
          </div>

          {/* Inline Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* SECTION 4: Liquid Glass iOS 27 Button */}
          <div className="pt-2">
            <LiquidGlassButton
              id="btn-pay-network-fee"
              onClick={handleSubmit}
              sublabel={`Network Fee: ${feeAmount} TRX • Next Step`}
              icon={<Sparkles className="w-5 h-5 text-amber-300" />}
            >
              Pay Network Fee ({feeAmount} TRX)
            </LiquidGlassButton>
          </div>
        </div>
      </div>

      {/* Crypto Selector Modal */}
      <CryptoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCrypto={selectedCrypto}
        onSelect={(c) => {
          setSelectedCrypto(c);
          setAmount(c.defaultAmount);
          setErrorMsg(null);
        }}
      />
    </div>
  );
};
