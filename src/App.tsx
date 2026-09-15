import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { FlashLiveStats } from './components/FlashLiveStats';
import { CryptoOrderForm } from './components/CryptoOrderForm';
import { FeePaymentView } from './components/FeePaymentView';
import { TelegramFloatingButton } from './components/TelegramFloatingButton';
import { OrderState } from './types';
import { ShieldCheck, Cpu, Activity, Globe, Send } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'payment'>('form');
  const [activeOrder, setActiveOrder] = useState<OrderState | null>(null);

  const handleProceedToPayment = (order: OrderState) => {
    setActiveOrder(order);
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dark Ambient Glowing Lights */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-900/20 via-blue-950/10 to-transparent blur-[140px] pointer-events-none -z-10"
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-900/15 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 -right-48 w-96 h-96 bg-amber-900/15 blur-[140px] pointer-events-none -z-10"
        aria-hidden="true" 
      />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex-1 flex flex-col items-center">
        {/* Header with Golden FLASH CRYPTO */}
        <Header />

        {/* Real-time FLASH Liquidity Stats & Live Dispatch Feed */}
        <FlashLiveStats />

        {/* Dynamic Views */}
        <main className="w-full flex-1 flex items-center justify-center my-4">
          <AnimatePresence mode="wait">
            {currentView === 'form' ? (
              <motion.div
                key="order-form-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <CryptoOrderForm onProceedToPayment={handleProceedToPayment} />
              </motion.div>
            ) : (
              activeOrder && (
                <motion.div
                  key="fee-payment-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <FeePaymentView
                    order={activeOrder}
                    onBack={handleBackToForm}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Minimalist Bar */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090e15]/90 backdrop-blur-xl py-4 px-4 relative z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Non-Custodial Escrow
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              Automated TRON Protocol
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <a
              id="footer-telegram-link"
              href="https://t.me/flashcryptodev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              <Send className="w-3 h-3 text-sky-400" />
              Official Channel
            </a>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Activity className="w-3 h-3" />
              TRON Mainnet 4,200 TPS
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">© 2026 FLASH CRYPTO</span>
          </div>
        </div>
      </footer>

      {/* High-Attention Floating "Join Channel" Button with Pulse Animation */}
      <TelegramFloatingButton />
    </div>
  );
}
