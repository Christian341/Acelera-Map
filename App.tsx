
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import MapChart from './components/MapChart';
import CampaignCard from './components/CampaignCard';
import ImpactFooter from './components/ImpactFooter';
import AdminPanel from './components/AdminPanel';
import { CAMPAIGNS, BRAZIL_CENTER } from './constants';
import { MapPosition } from './types';
import { useCampaigns } from './hooks/useCampaigns';
import { usePerformanceMode } from './hooks/usePerformanceMode';

const App: React.FC = () => {
  usePerformanceMode(); // Enables global performance monitoring
  const { campaigns: allCampaigns, loading } = useCampaigns();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightingUp, setIsLightingUp] = useState(true);
  const [uiVisible, setUiVisible] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [position, setPosition] = useState<MapPosition>({
    coordinates: BRAZIL_CENTER,
    zoom: 1,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Dashboard filter: Only active campaigns
  const campaigns = allCampaigns.length > 0
    ? allCampaigns.filter(c => c.is_active !== false)
    : CAMPAIGNS;

  const runAnimationSequence = useCallback(() => {
    if (campaigns.length <= 1) return;

    const nextIdx = (activeIdx + 1) % campaigns.length;
    console.log(`[Dashboard] Transitioning from ${activeIdx} to ${nextIdx}`);

    // 1. START OUT (ZOOM OUT)
    setUiVisible(false);
    setPosition({ coordinates: BRAZIL_CENTER, zoom: 1 });

    // Turn off glow after zoom out finishes
    setTimeout(() => {
      setIsLightingUp(false);
    }, 1500);

    // 2. DATA EXCHANGE
    setTimeout(() => {
      setActiveIdx(nextIdx);
    }, 2500);

    // 3. START IN (ZOOM IN)
    setTimeout(() => {
      setIsLightingUp(true);
      setPosition({
        coordinates: campaigns[nextIdx].coordinates,
        zoom: campaigns[nextIdx].zoom
      });
    }, 4000);

    // 4. REVEAL UI
    setTimeout(() => {
      setUiVisible(true);
    }, 8000);
  }, [activeIdx, campaigns]);

  // Initial boot and cycle management
  useEffect(() => {
    if (campaigns.length === 0) return;

    // First time load: zoom into first campaign
    if (!hasInitialized) {
      console.log("[Dashboard] Initializing first view");
      const startTimer = setTimeout(() => {
        setPosition({
          coordinates: campaigns[0].coordinates,
          zoom: campaigns[0].zoom
        });
        setHasInitialized(true);
      }, 800);
      return () => clearTimeout(startTimer);
    }

    // Schedule the next transition
    const interval = setInterval(() => {
      runAnimationSequence();
    }, 14000);

    return () => clearInterval(interval);
  }, [runAnimationSequence, campaigns.length, hasInitialized]);

  const currentCampaign = campaigns[activeIdx] || campaigns[0];

  if (!currentCampaign && loading) {
    return <div className="w-full h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#FF2D55] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden flex relative selection:bg-[#FF2D55]/30">

      {/* Background Map Layer */}
      <div className="absolute inset-0 z-0">
        <MapChart
          activeState={isLightingUp ? currentCampaign.stateId : ""}
          position={position}
        />
      </div>

      {/* Campaign Info (Bottom Left) */}
      <div className="absolute bottom-12 left-16 z-20 w-[420px] pointer-events-none">
        <AnimatePresence mode="wait">
          {uiVisible && (
            <motion.div
              key={currentCampaign.id}
              initial={{ opacity: 0, x: -80, filter: "blur(15px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -80, filter: "blur(15px)" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full pointer-events-auto"
            >
              <CampaignCard
                client={currentCampaign.client}
                type={currentCampaign.type}
                description={currentCampaign.description}
                imageUrl={currentCampaign.imageUrl}
                duration={14000}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Impact Data (Bottom Right) */}
      <div className="absolute bottom-12 right-12 z-20">
        <AnimatePresence mode="wait">
          {uiVisible && (
            <motion.div
              key={currentCampaign.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
            >
              <ImpactFooter
                stateName={currentCampaign.stateName}
                impactValue={currentCampaign.impact}
                isVisible={isLightingUp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Brand Header */}
      <div className="absolute top-12 left-16 right-16 z-50 flex items-start justify-between pointer-events-none">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <div className="h-12 flex items-center mb-1 group">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain pointer-events-auto transition-opacity"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('span');
                    fallback.className = 'logo-fallback text-white font-black text-3xl tracking-tighter uppercase';
                    fallback.innerText = 'Aceleraí';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] text-white/60 font-black uppercase tracking-widest">Live Server</span>
              </div>
              <span className="text-white/20 text-[10px] uppercase tracking-[0.6em] font-bold">Geographic Impact Hub</span>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <button
            onClick={() => setAdminOpen(true)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 group"
          >
            <Settings className="text-white/40 group-hover:text-[#FF2D55] w-5 h-5 transition-colors" />
          </button>
          <div className="flex gap-2">
            {campaigns.map((_, i) => (
              <div
                key={i}
                className={`h-1 transition-all duration-[1000ms] rounded-full ${i === activeIdx ? 'w-16 bg-[#FF2D55]' : 'w-4 bg-white/10'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Depth Filters */}
      <div className="absolute inset-y-0 left-0 w-[550px] pointer-events-none bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-40" />

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            campaigns={allCampaigns}
            onClose={() => setAdminOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
