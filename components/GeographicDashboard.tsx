
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapChart from './MapChart';
import CampaignCard from './CampaignCard';
import ImpactFooter from './ImpactFooter';
// Fix: Import CampaignData instead of non-existent Campaign
import { CampaignData, MapPosition } from '../types';

interface DashboardProps {
  // Fix: Use CampaignData interface
  campaign: CampaignData;
  position: MapPosition;
}

const GeographicDashboard: React.FC<DashboardProps> = ({ campaign, position }) => {
  return (
    <div className="w-full h-full grid grid-cols-12 relative overflow-hidden">
      {/* Map Background Layer */}
      <div className="absolute inset-0 z-0">
        <MapChart 
          // Fix: Use stateId instead of non-existent stateSlug
          activeState={campaign.stateId} 
          position={position} 
        />
      </div>

      {/* Content Layout */}
      <div className="col-span-12 lg:col-span-5 h-full p-8 lg:p-12 z-10 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full max-w-[480px]"
          >
            {/* Fix: Pass individual props as expected by CampaignCard */}
            <CampaignCard 
              client={campaign.client}
              type={campaign.type}
              description={campaign.description}
              imageUrl={campaign.imageUrl}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Footer Area */}
      <div className="absolute bottom-12 right-12 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Fix: Pass stateName and impactValue as expected by ImpactFooter */}
            <ImpactFooter 
              stateName={campaign.stateName}
              impactValue={campaign.impact}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeographicDashboard;
