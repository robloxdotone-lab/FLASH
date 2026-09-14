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
  Crown,
} from 'lucide-react';
import { CryptoAsset, OrderState } from '../types';
import { POPULAR_CRYPTOS } from '../data/cryptos';
import { LiquidGlassButton } from './LiquidGlassButton';
import { CryptoModal } from './CryptoModal';

interface CryptoOrderFormProps {
  onProceedToPayment: (order: OrderState) => void;
}

export const USDT_PRESET_AMOUNTS = [1000, 2700, 4000, 5000, 7500, 9000] as const;
export const TRX_PRESET_AMOUNTS = [5000, 10000, 20000, 30000, 40000, 50000] as const;

export const CryptoOrderForm: React.FC<CryptoOrderFormProps> = ({
  onProceedToPayment,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(POPULAR_CRYPTOS[0]); // Default to USDT TRC20
  const [amount, setAmount] = useState<string>('1000');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTrxAsset = selectedCrypto.id === 'trx-trc20' || selectedCrypto.symbol === 'TRX';
  const currentPresets = isTrxAsset ? TRX_PRESET_AMOUNTS : USDT_PRESET_AMOUNTS;

  // Calculate approximate USD value
  const numAmount = parseFloat(amount) || 0;
  const approxUsd = (numAmount * selectedCrypto.currentPriceUsd).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  // Dynamic fee calculation:
  // For TRX: Tier 1 (< 25,000 TRX) -> 79 TRX, Tier 2 (>= 25,000 TRX) -> 190 TRX
  // For USDT: Tier 1 (< 5,000 USDT) -> 119 TRX, Tier 2 (>= 5,000 USDT) -> 275 TRX (VIP)
  const feeAmount = isTrxAsset
    ? (numAmount >= 25000 ? 190 : 79)
    : (numAmount >= 5000 ? 275 : 119);

  const handleSelectCrypto = (c: CryptoAsset) => {
    setSelectedCrypto(c);
    const newIsTrx = c.id === 'trx-trc20' || c.symbol === 'TRX';
    const newPresets = newIsTrx ? TRX_PRESET_AMOUNTS : USDT_PRESET_AMOUNTS;
    if (!(newPresets as readonly number[]).includes(numAmount)) {
      setAmount(newPresets[0].toString());
    }
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
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please select a valid quantity.');
      return;
    }
    const validPresets = isTrxAsset ? (TRX_PRESET_AMOUNTS as readonly number[]) : (USDT_PRESET_AMOUNTS as readonly number[]);
    if (!validPresets.includes(numAmount)) {
      setErrorMsg(`Please choose one of the available amounts: ${validPresets.map((v) => v.toLocaleString()).join(', ')}.`);
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
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        <div className="space-y-5">
          {/* SECTION 1: Select Cryptocurrency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
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
              className="liquid-glass-input rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group hover:border-cyan-400/40 transition-all border border-white/10 select-none"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      {selectedCrypto.name}
                    </span>
                    <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 font-medium">
                      {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Network: <span className="text-slate-300 font-medium">{selectedCrypto.network}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-cyan-400/90 font-medium">
                  Switch
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-cyan-400/20 text-slate-300 group-hover:text-cyan-300 flex items-center justify-center transition-colors">
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Crypto Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              <span className="text-[11px] text-slate-500 mr-1 shrink-0">
                Available:
              </span>
              {POPULAR_CRYPTOS.map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => handleSelectCrypto(coin)}
                  className={`
                    px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer
                    ${
                      selectedCrypto.id === coin.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5'
                    }
                  `}
                >
                  {coin.symbol} <span className="opacity-75 text-[10px]">({coin.network})</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: Amount Selection (Currency-specific presets) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                Select Quantity / Amount
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                ≈ ${approxUsd} USD
              </span>
            </div>

            {/* 6 Preset Quantity Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {currentPresets.map((val) => {
                const isSelected = numAmount === val;
                const isVipGold = !isTrxAsset && val >= 5000;
                const tierFee = isTrxAsset
                  ? (val >= 25000 ? 190 : 79)
                  : (val >= 5000 ? 275 : 119);

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val.toString());
                      setErrorMsg(null);
                    }}
                    className={`
                      relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border text-center group
                      ${
                        isVipGold
                          ? isSelected
                            ? 'bg-gradient-to-b from-amber-500/30 via-yellow-600/20 to-amber-950/40 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                            : 'bg-gradient-to-b from-amber-500/10 via-amber-900/10 to-transparent border-amber-500/40 hover:border-amber-400/80 hover:bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                          : isSelected
                          ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/15 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    {/* VIP Badge Ribbon on Top */}
                    {isVipGold && (
                      <div className="absolute -top-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/30">
                        <Crown className="w-2.5 h-2.5 fill-current" />
                        <span>VIP</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className={`absolute top-1.5 right-1.5 ${isVipGold ? 'text-amber-400' : 'text-cyan-400'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span
                      className={`text-lg sm:text-xl font-bold font-mono ${
                        isVipGold
                          ? isSelected ? 'text-amber-200' : 'text-amber-100 group-hover:text-white'
                          : isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {val.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-mono ${isVipGold ? 'text-amber-300/70' : 'text-slate-400'}`}>
                      {selectedCrypto.symbol}
                    </span>

                    <div
                      className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
                        isVipGold
                          ? isSelected
                            ? 'bg-amber-400/25 border-amber-300/50 text-amber-200 font-bold'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : isSelected
                          ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-200'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      Fee: {tierFee} TRX
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Quantity Summary Bar */}
            <div className="liquid-glass-input rounded-2xl px-4 py-2.5 flex items-center justify-between border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Selected:</span>
                <span className="font-bold font-mono text-white">
                  {numAmount ? numAmount.toLocaleString() : '0'} {selectedCrypto.symbol}
                </span>
                <span className="text-slate-500 hidden sm:inline font-mono">
                  (≈ ${approxUsd} USD)
                </span>
              </div>
              <div className="font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Network Fee:</span>
                <span>{feeAmount} TRX</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Destination Wallet Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="destination-address-input"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                Destination Wallet Address
              </label>
            </div>

            <div className="liquid-glass-input rounded-2xl p-3 flex items-center gap-2 border border-white/10 focus-within:border-cyan-400/50">
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
          </div>

          {/* Network Fee Banner Notice */}
          <div
            className={`p-3.5 rounded-2xl flex items-center justify-between text-xs transition-colors duration-300 ${
              !isTrxAsset && numAmount >= 5000
                ? 'bg-amber-500/10 border border-amber-500/35 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                : 'bg-cyan-500/10 border border-cyan-500/25'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                  !isTrxAsset && numAmount >= 5000
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-cyan-400/20 text-cyan-300'
                }`}
              >
                {!isTrxAsset && numAmount >= 5000 ? <Crown className="w-3 h-3 text-amber-300" /> : 'TRX'}
              </div>
              <div>
                <span className="text-slate-300">Required Network Fee:</span>
                <span
                  className={`font-bold ml-1.5 font-mono text-sm ${
                    !isTrxAsset && numAmount >= 5000 ? 'text-amber-300' : 'text-cyan-300'
                  }`}
                >
                  {feeAmount} TRX
                </span>
                <span
                  className={`ml-2 text-[10px] hidden sm:inline ${
                    !isTrxAsset && numAmount >= 5000 ? 'text-amber-400/90 font-medium' : 'text-slate-400'
                  }`}
                >
                  {isTrxAsset
                    ? (numAmount >= 25000 ? '(Tier: ≥25,000 TRX → 190 TRX)' : '(Tier: <25,000 TRX → 79 TRX)')
                    : (numAmount >= 5000 ? '(★ VIP: ≥5,000 USDT → 275 TRX)' : '(Tier: <5,000 USDT → 119 TRX)')}
                </span>
              </div>
            </div>
            <span
              className={`text-[11px] font-mono ${
                !isTrxAsset && numAmount >= 5000 ? 'text-amber-300/80 font-semibold' : 'text-slate-400'
              }`}
            >
              {!isTrxAsset && numAmount >= 5000 ? 'VIP TRC-20' : 'TRON / TRC-20'}
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
              icon={<Sparkles className="w-5 h-5 text-cyan-300" />}
            >
              Pay Network Fee
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
          handleSelectCrypto(c);
        }}
      />
    </div>
  );
};
