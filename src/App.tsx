import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { FlashLiveStats } from './components/FlashLiveStats';
import { CryptoOrderForm } from './components/CryptoOrderForm';
import { FeePaymentView } from './components/FeePaymentView';
import { OrderState } from './types';
import { ShieldCheck, Cpu, Activity, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-[#07080E] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 2026 Ambient Lighting & Liquid Ray Mesh */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] pointer-events-none -z-10"
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-600/5 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 -right-48 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none -z-10"
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
      <footer className="w-full border-t border-white/[0.06] bg-black/40 backdrop-blur-xl py-4 px-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Non-Custodial Escrow
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Automated TRON Protocol
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <Activity className="w-3 h-3" />
              TRON Mainnet 4,200 TPS
            </span>
            <span>•</span>
            <span>© 2026 FLASH CRYPTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
