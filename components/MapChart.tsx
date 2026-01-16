import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  // ZoomableGroup is removed in favor of manual motion.g
} from "react-simple-maps";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { geoMercator } from "d3-geo";
import { BR_TOPO_JSON } from '../constants';
import { MapPosition } from '../types';

interface MapChartProps {
  activeState: string;
  position: MapPosition;
}

// Cinematic easing
const EASE_ZOOM_IN: [number, number, number, number] = [0.19, 1, 0.22, 1];
const EASE_ZOOM_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

// Fixed map dimensions for consistent projection
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// Create static projection once
const projection = geoMercator()
  .scale(1000)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

const BrazilMapContent = React.memo(({ activeState }: { activeState: string }) => {
  return (
    <Geographies geography={BR_TOPO_JSON}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const isHighlighted = geo.properties.name === activeState;

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: isHighlighted ? "#FF2D55" : "#0D0D0D",
                  stroke: isHighlighted ? "#FF2D55" : "#222",
                  strokeWidth: isHighlighted ? 1.5 : 0.5,
                  outline: "none",
                  filter: isHighlighted ? "var(--glow-filter)" : "none",
                  transition: "fill 1.2s ease, stroke 1.2s ease, opacity 1.2s ease, filter 1.2s ease",
                  opacity: isHighlighted ? 1 : 0.6
                },
                hover: {
                  fill: isHighlighted ? "#FF2D55" : "#1a1a1a",
                  stroke: isHighlighted ? "#FF2D55" : "#333",
                  outline: "none",
                },
                pressed: {
                  fill: "#FF2D55",
                  outline: "none",
                },
              }}
            />
          );
        })
      }
    </Geographies>
  );
}, (prev, next) => prev.activeState === next.activeState);

const MapChart: React.FC<MapChartProps> = ({ activeState, position }) => {
  // Motion values for GPU animation (no React renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const k = useMotionValue(1);

  // We track the previous position to determine direction
  const [prevZoom, setPrevZoom] = useState(position.zoom);

  useEffect(() => {
    // 1. Calculate target pixel coordinates
    // We project the [long, lat] to [x, y] using the same projection as the map
    const [px, py] = projection(position.coordinates) || [MAP_WIDTH / 2, MAP_HEIGHT / 2];

    // 2. Calculate transform to center that point
    // translate = center - point * scale
    const targetScale = position.zoom;
    const targetX = (MAP_WIDTH / 2) - (px * targetScale);
    const targetY = (MAP_HEIGHT / 2) - (py * targetScale);

    // 3. Determine animation params
    const isZoomingIn = targetScale > prevZoom;
    const duration = isZoomingIn ? 4.0 : 1.5;
    const ease = isZoomingIn ? EASE_ZOOM_IN : EASE_ZOOM_OUT;

    // 4. Animate directly (Zero React Render)
    const controlsX = animate(x, targetX, { duration, ease });
    const controlsY = animate(y, targetY, { duration, ease });
    const controlsK = animate(k, targetScale, { duration, ease });

    setPrevZoom(targetScale);

    return () => {
      controlsX.stop();
      controlsY.stop();
      controlsK.stop();
    };
  }, [position, x, y, k]); // No displayPosition state dependency!

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,_rgba(255,45,85,0.03)_0%,_transparent_75%)] pointer-events-none z-0" />

      {/* 
         We control the transform manually via motion.g.
         Note: We removed ZoomableGroup.
      */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          // We must match the d3-geo config exactly
          // React-simple-maps handles translate internally based on width/height
          // but we set fixed viewbox logic below if needed. 
          // Default center is [0,0] which might be off for Brazil if not configured?
          // Actually BR_TOPO_JSON + d3-geo projection usually needs centering.
          // Let's rely on standard config and check alignment.
        }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <motion.g
          style={{ x, y, scale: k, originX: 0, originY: 0 }}
        >
          <BrazilMapContent activeState={activeState} />
        </motion.g>
      </ComposableMap>

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full opacity-[0.01]"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
    </div>
  );
};

export default MapChart;

