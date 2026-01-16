import { useEffect, useRef } from 'react';

interface PerformanceMonitorOptions {
    enabled: boolean;
    memoryThresholdMB?: number;
    fpsThreshold?: number;
    checkIntervalMs?: number;
    onMemoryWarning?: (usedMB: number) => void;
    onLowFPS?: (fps: number) => void;
}

interface PerformanceMemory {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}

declare global {
    interface Performance {
        memory?: PerformanceMemory;
    }
}

/**
 * Monitors performance metrics and triggers auto-reload if thresholds are exceeded
 */
export const usePerformanceMonitor = (options: PerformanceMonitorOptions) => {
    const {
        enabled,
        memoryThresholdMB = 100,
        fpsThreshold = 20,
        checkIntervalMs = 60000, // 1 minute
        onMemoryWarning,
        onLowFPS,
    } = options;

    const lowFPSCountRef = useRef(0);
    const lastFrameTimeRef = useRef(performance.now());
    const fpsCheckRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        console.log('[Performance Monitor] Started monitoring', {
            memoryThresholdMB,
            fpsThreshold,
            checkIntervalMs,
        });

        // Memory monitoring
        const memoryInterval = setInterval(() => {
            if (performance.memory) {
                const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
                const totalMB = performance.memory.totalJSHeapSize / (1024 * 1024);
                const limitMB = performance.memory.jsHeapSizeLimit / (1024 * 1024);

                console.log(
                    `[Performance Monitor] Memory: ${usedMB.toFixed(1)}MB / ${totalMB.toFixed(1)}MB (Limit: ${limitMB.toFixed(1)}MB)`
                );

                if (usedMB > memoryThresholdMB) {
                    console.warn(
                        `[Performance Monitor] High memory usage detected: ${usedMB.toFixed(1)}MB > ${memoryThresholdMB}MB`
                    );

                    if (onMemoryWarning) {
                        onMemoryWarning(usedMB);
                    }

                    // Auto-reload if memory is critically high
                    if (usedMB > memoryThresholdMB * 1.5) {
                        console.error('[Performance Monitor] Critical memory usage, reloading...');
                        window.location.reload();
                    }
                }
            } else {
                console.warn('[Performance Monitor] performance.memory API not available');
            }
        }, checkIntervalMs);

        // FPS monitoring
        const checkFPS = () => {
            const now = performance.now();
            const delta = now - lastFrameTimeRef.current;
            const fps = 1000 / delta;
            lastFrameTimeRef.current = now;

            if (fps < fpsThreshold) {
                lowFPSCountRef.current++;

                if (lowFPSCountRef.current % 30 === 0) {
                    console.warn(
                        `[Performance Monitor] Low FPS detected: ${fps.toFixed(1)}fps (${lowFPSCountRef.current} consecutive frames)`
                    );

                    if (onLowFPS) {
                        onLowFPS(fps);
                    }
                }

                // Auto-reload if FPS is persistently low
                if (lowFPSCountRef.current > 100) {
                    console.error('[Performance Monitor] Persistent low FPS, reloading...');
                    window.location.reload();
                }
            } else {
                lowFPSCountRef.current = 0;
            }

            fpsCheckRef.current = requestAnimationFrame(checkFPS);
        };

        fpsCheckRef.current = requestAnimationFrame(checkFPS);

        // Cleanup
        return () => {
            clearInterval(memoryInterval);
            if (fpsCheckRef.current !== null) {
                cancelAnimationFrame(fpsCheckRef.current);
            }
        };
    }, [enabled, memoryThresholdMB, fpsThreshold, checkIntervalMs, onMemoryWarning, onLowFPS]);
};
