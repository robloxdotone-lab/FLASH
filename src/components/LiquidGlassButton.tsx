import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LiquidGlassButtonProps {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  sublabel?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  id = 'liquid-glass-btn',
  onClick,
  disabled = false,
  loading = false,
  children,
  icon,
  sublabel,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.button
      id={id}
      ref={btnRef}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.975 }}
      className={`
        relative w-full group select-none rounded-2xl py-4 px-6
        flex items-center justify-between gap-4
        liquid-glass-ios27-btn cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale-[30%]' : ''}
      `}
    >
      {/* iOS 27 Liquid Specular Reflection Mesh */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl overflow-hidden"
        style={{
          background: isHovered
            ? `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 235, 170, 0.28), rgba(255, 255, 255, 0.08) 40%, transparent 80%)`
            : `radial-gradient(circle 160px at 50% 0%, rgba(255, 255, 255, 0.15), transparent 70%)`,
        }}
      />

      {/* Internal Liquid Prism Edge */}
      <div 
        className="absolute inset-[1px] rounded-[15px] pointer-events-none border border-white/20"
        style={{
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.3)',
        }}
      />

      {/* Button Content */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform duration-300">
          {icon || <Sparkles className="w-5 h-5 text-amber-300" />}
        </div>
        <div className="text-left">
          <div className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
            {children || 'Pay Network Fee'}
          </div>
          {sublabel && (
            <p className="text-xs text-amber-200/70 font-mono tracking-tight">
              {sublabel}
            </p>
          )}
        </div>
      </div>

      {/* Trailing arrow pill */}
      <div className="relative z-10 flex items-center">
        <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-black text-white flex items-center justify-center transition-all duration-300 border border-white/20 group-hover:border-amber-300 shadow-md">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          )}
        </div>
      </div>
    </motion.button>
  );
};
