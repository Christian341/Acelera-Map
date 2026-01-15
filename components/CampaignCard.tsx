
import React from 'react';
import { motion } from 'framer-motion';

interface CampaignCardProps {
  client: string;
  type: string;
  description: string;
  imageUrl: string;
  duration?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ client, type, description, imageUrl, duration = 14000 }) => {
  return (
    <div className="flex flex-col w-full max-w-[420px] gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5 bg-[#111]">
        <img
          src={imageUrl}
          alt={client}
          className="w-full h-full object-cover transition-transform duration-[6000ms] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Info Box */}
      <div className="glass p-8 rounded-[24px] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-6 bg-[#FF2D55] rounded-full" />
          <h3 className="text-white font-bold text-2xl tracking-tight leading-none uppercase">
            {client}
          </h3>
        </div>
        <p className="text-[#FF2D55] text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-80">
          {type}
        </p>
        <div className="h-[1px] w-full bg-white/10 mb-4" />
        <p className="text-white/50 text-sm leading-relaxed font-medium">
          {description}
        </p>

        {/* Minimalist Time Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <motion.div
            key={imageUrl}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="h-full bg-[#FF2D55]"
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;


