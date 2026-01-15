
import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Activity } from 'lucide-react';

interface ImpactFooterProps {
  stateName: string;
  impactValue: number;
  isVisible?: boolean;
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 2000; // Slightly faster for responsiveness
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smoother progress: easeInOutQuart
      const easeProgress = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      const current = Math.floor(start + (end - start) * easeProgress);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="tabular-nums">{displayValue.toLocaleString('pt-BR')}</span>;
};

const ImpactFooter: React.FC<ImpactFooterProps> = ({ stateName, impactValue, isVisible }) => {
  return (
    <div className={`transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8 blur-lg'}`}>
      <div className="glass p-8 rounded-[32px] border border-white/5 flex flex-col gap-6 min-w-[420px] shadow-2xl relative overflow-hidden">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FF2D55]/10 rounded-xl border border-[#FF2D55]/20">
              <MapPin className="text-[#FF2D55] w-5 h-5" />
            </div>
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-black leading-none mb-1">Impact Region</p>
              <h2 className="text-white text-3xl font-black uppercase tracking-tighter">{stateName}</h2>
            </div>
          </div>
          <Activity className="text-white/10 w-6 h-6" />
        </div>

        <div className="h-[1px] w-full bg-white/5" />

        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-[#FF2D55] w-3 h-3" />
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Alcance Estimado</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-6xl font-black tracking-tighter tabular-nums leading-none">
              <AnimatedCounter value={impactValue} />
            </span>
            <span className="text-[#FF2D55] font-bold text-xs uppercase tracking-widest">Pessoas</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/20 text-[8px] font-bold uppercase tracking-[0.3em] px-1">
          <div className="w-1 h-1 bg-green-500 rounded-full" />
          <span>Real-time Geographic Insights</span>
        </div>
      </div>
    </div>
  );
};

export default ImpactFooter;
