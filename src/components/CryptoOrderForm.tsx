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

// Exactly matching the screenshot fees: 1,000, 2,700, 4,000 -> 119 TRX; 5,000, 7,500, 9,000 -> 275 TRX (VIP)
export const USDT_TIERS = [
  { amount: 1000, fee: 119, label: '1,000', isVip: false },
  { amount: 2700, fee: 119, label: '2,700', isVip: false },
  { amount: 4000, fee: 119, label: '4,000', isVip: false },
  { amount: 5000, fee: 275, label: '5,000', isVip: true },
  { amount: 7500, fee: 275, label: '7,500', isVip: true },
  { amount: 9000, fee: 275, label: '9,000', isVip: true },
];

export const TRX_TIERS = [
  { amount: 1700, fee: 37, label: '1,700', isVip: false },
  { amount: 5000, fee: 79, label: '5,000', isVip: false },
  { amount: 10000, fee: 79, label: '10,000', isVip: false },
  { amount: 20000, fee: 79, label: '20,000', isVip: true },
  { amount: 30000, fee: 190, label: '30,000', isVip: true },
  { amount: 50000, fee: 190, label: '50,000', isVip: true },
];

export const CryptoOrderForm: React.FC<CryptoOrderFormProps> = ({
  onProceedToPayment,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>(
    () => POPULAR_CRYPTOS.find((c) => c.id === 'usdt-trc20') || POPULAR_CRYPTOS[0]
  );
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTrxAsset = selectedCrypto.id === 'trx-trc20' || selectedCrypto.symbol === 'TRX';
  const availableTiers = isTrxAsset ? TRX_TIERS : USDT_TIERS;

  // Selected tier fee calculation
  const currentTier =
    availableTiers.find((t) => t.amount === selectedAmount) || availableTiers[0];
  const feeAmount = currentTier.fee;
  const isVipTier = currentTier.isVip;

  const approxUsd = (selectedAmount * selectedCrypto.currentPriceUsd).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  const handleSelectCrypto = (c: CryptoAsset) => {
    setSelectedCrypto(c);
    const newIsTrx = c.id === 'trx-trc20' || c.symbol === 'TRX';
    setSelectedAmount(newIsTrx ? 1700 : 1000);
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
      amount: selectedAmount.toString(),
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

        {/* QUANTITY HEADER */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs sm:text-sm tracking-wider uppercase">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span>SELECT QUANTITY / AMOUNT</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            ≈ ${approxUsd} USD
          </div>
        </div>

        {/* 6 TIERS (2 ROWS × 3 COLS) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {availableTiers.map((tier) => {
            const isSelected = selectedAmount === tier.amount;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(tier.amount);
                  setErrorMsg(null);
                }}
                className={`
                  relative rounded-2xl p-3 text-center transition-all cursor-pointer flex flex-col justify-between select-none
                  ${
                    isSelected
                      ? tier.isVip
                        ? 'border-2 border-amber-400 bg-gradient-to-b from-[#241a0b] to-[#120d06] shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'border-2 border-cyan-400 bg-gradient-to-b from-[#0b1c2b] to-[#08131e] shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                      : tier.isVip
                      ? 'border border-amber-500/35 bg-gradient-to-b from-[#18120a] to-[#0e0c08] hover:border-amber-500/60'
                      : 'border border-slate-800/90 bg-[#0c1219] hover:border-slate-700'
                  }
                `}
              >
                {/* Top Right Checkmark Badge when Selected */}
                {isSelected && (
                  <div
                    className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-black shadow-xs ${
                      tier.isVip ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                  </div>
                )}

                {/* VIP Badge Header for Row 2 */}
                {tier.isVip ? (
                  <div className="mx-auto w-fit mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-[9px] flex items-center gap-1 uppercase tracking-wider shadow-sm">
                    <Crown className="w-2.5 h-2.5 fill-current" /> VIP
                  </div>
                ) : (
                  <div className="h-4" />
                )}

                {/* Quantity */}
                <div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                    {tier.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">
                    {selectedCrypto.symbol}
                  </div>
                </div>

                {/* Fee Sub-box */}
                <div
                  className={`mt-2 py-1 px-1.5 rounded-xl text-center text-[11px] font-mono font-bold border transition-colors ${
                    isSelected
                      ? tier.isVip
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-[#0c1c28] text-cyan-300 border-cyan-800/60'
                      : tier.isVip
                      ? 'bg-[#201407] text-amber-400 border-amber-500/30'
                      : 'bg-[#121820] text-slate-400 border-slate-800'
                  }`}
                >
                  Fee: {tier.fee} TRX
                </div>
              </button>
            );
          })}
        </div>

        {/* SELECTED SUMMARY BAR */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0a0f16] border border-slate-800/90 text-center text-xs flex items-center justify-center gap-2 font-mono flex-wrap">
          <span className="text-slate-400">Selected:</span>
          <span className="text-white font-black">
            {selectedAmount.toLocaleString()} {selectedCrypto.symbol}
          </span>
          <span className="text-slate-500 ml-2">Network Fee:</span>
          <span className="text-cyan-400 font-black">{feeAmount} TRX</span>
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
        <div className="rounded-2xl p-3 px-4 bg-gradient-to-r from-[#091520] to-[#0b1219] border border-cyan-800/60 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-xs font-black text-cyan-400 font-mono">
              TRX
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Required Network Fee:</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black font-mono text-cyan-400">
                  {feeAmount}
                </span>
                <span className="text-xs font-bold text-cyan-400 font-mono">TRX</span>
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 font-mono">
            TRON / TRC-20
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
