
import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { animate } from "framer-motion";
import { BR_TOPO_JSON } from '../constants';
import { MapPosition } from '../types';

interface MapChartProps {
  activeState: string;
  position: MapPosition;
}

// Cinematic easing: Smooth start, very long tail for a "video-like" feel
const EASE_ZOOM_IN: [number, number, number, number] = [0.19, 1, 0.22, 1]; // Equivalent to easeOutExpo but more controlled
const EASE_ZOOM_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1]; // Smooth ease-in-out for the pull back

const MapChart: React.FC<MapChartProps> = ({ activeState, position }) => {
  const [displayPosition, setDisplayPosition] = useState<MapPosition>(position);

  useEffect(() => {
    // Determina a duração baseada no objetivo (Zoom Out = 1.5s, Zoom In = 4.0s)
    const duration = position.zoom === 1 ? 1.5 : 4.0;
    const ease = position.zoom === 1 ? EASE_ZOOM_OUT : EASE_ZOOM_IN;

    // Animate zoom
    const zoomControls = animate(displayPosition.zoom, position.zoom, {
      duration: duration,
      ease: ease,
      onUpdate: (latest) => {
        setDisplayPosition(prev => ({ ...prev, zoom: latest }));
      }
    });

    // Animate coordinates
    const xControls = animate(displayPosition.coordinates[0], position.coordinates[0], {
      duration: duration,
      ease: ease,
      onUpdate: (latest) => {
        setDisplayPosition(prev => ({
          ...prev,
          coordinates: [latest, prev.coordinates[1]]
        }));
      }
    });

    const yControls = animate(displayPosition.coordinates[1], position.coordinates[1], {
      duration: duration,
      ease: ease,
      onUpdate: (latest) => {
        setDisplayPosition(prev => ({
          ...prev,
          coordinates: [prev.coordinates[0], latest]
        }));
      }
    });

    return () => {
      zoomControls.stop();
      xControls.stop();
      yControls.stop();
    };
  }, [position]);


  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,_rgba(255,45,85,0.03)_0%,_transparent_75%)] pointer-events-none z-0" />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup
          center={displayPosition.coordinates}
          zoom={displayPosition.zoom}
        >
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
                        strokeWidth: isHighlighted ? 1.4 : 0.4,
                        outline: "none",
                        filter: isHighlighted ? "drop-shadow(0 0 25px rgba(255, 45, 85, 0.8))" : "none",
                        transition: "fill 1.2s ease, stroke 1.2s ease, opacity 1.2s ease",
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
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full opacity-[0.01]"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
    </div>
  );
};

export default MapChart;

