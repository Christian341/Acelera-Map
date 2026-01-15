
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapChart from './components/MapChart';
import CampaignCard from './components/CampaignCard';
import ImpactFooter from './components/ImpactFooter';
import { CAMPAIGNS, BRAZIL_CENTER } from './constants';
import { MapPosition } from './types';

const App: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightingUp, setIsLightingUp] = useState(true);
  const [uiVisible, setUiVisible] = useState(true);
  const [position, setPosition] = useState<MapPosition>({
    coordinates: BRAZIL_CENTER,
    zoom: 1,
  });

  const runAnimationSequence = useCallback(() => {
    const nextIdx = (activeIdx + 1) % CAMPAIGNS.length;

    // 1. INÍCIO DO VAI (ZOOM OUT) - Agora dura 1.5s
    setUiVisible(false);
    setPosition({ coordinates: BRAZIL_CENTER, zoom: 1 });

    // Apaga o brilho quando o zoom out está completo
    setTimeout(() => {
      setIsLightingUp(false);
    }, 1500);

    // 2. TROCA DE DADOS - Agora em 2.5s
    setTimeout(() => {
      setActiveIdx(nextIdx);
    }, 2500);

    // 3. O VEM (PREPARAÇÃO E ZOOM IN) - Início do mergulho em 4s
    setTimeout(() => {
      setIsLightingUp(true);
      setPosition({
        coordinates: CAMPAIGNS[nextIdx].coordinates,
        zoom: CAMPAIGNS[nextIdx].zoom
      });
    }, 4000);

    // 4. REVELAÇÃO DA UI - Após o zoom in de 4s completar (total 8s)
    setTimeout(() => {
      setUiVisible(true);
    }, 8000);
  }, [activeIdx]);

  useEffect(() => {
    // Zoom inicial mais rápido no boot
    const startTimer = setTimeout(() => {
      setPosition({
        coordinates: CAMPAIGNS[0].coordinates,
        zoom: CAMPAIGNS[0].zoom
      });
    }, 800);

    // Intervalo de ciclo total (tempo que a info fica na tela + transição)
    // Aumentado para 14s para acomodar as animações mais longas
    const interval = setInterval(() => {
      runAnimationSequence();
    }, 14000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [runAnimationSequence]);


  const currentCampaign = CAMPAIGNS[activeIdx];

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
            <div className="h-12 flex items-center mb-1">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain pointer-events-auto"
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] animate-pulse" />
              <span className="text-white/20 text-[10px] uppercase tracking-[0.6em] font-bold">Geographic Impact Hub</span>
            </div>
          </motion.div>

        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="flex gap-2">
            {CAMPAIGNS.map((_, i) => (
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
    </div>
  );
};

export default App;
