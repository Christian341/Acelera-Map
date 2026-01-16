import { useState, useEffect } from 'react';

export interface TVConfig {
    useCanvas: boolean;
    disableBlur: boolean;
    disableGradients: boolean;
    reducedAnimations: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    autoReloadInterval: number; // in seconds
    maxCampaigns: number;
    preloadImages: boolean;
    enablePerformanceMonitor: boolean;
}

const DEFAULT_TV_CONFIG: TVConfig = {
    useCanvas: true,
    disableBlur: true,
    disableGradients: true,
    reducedAnimations: true,
    imageQuality: 'low',
    autoReloadInterval: 6 * 3600, // 6 hours
    maxCampaigns: 10,
    preloadImages: false,
    enablePerformanceMonitor: true,
};

const DEFAULT_DESKTOP_CONFIG: TVConfig = {
    useCanvas: false,
    disableBlur: false,
    disableGradients: false,
    reducedAnimations: false,
    imageQuality: 'high',
    autoReloadInterval: 0, // disabled
    maxCampaigns: 50,
    preloadImages: true,
    enablePerformanceMonitor: false,
};

/**
 * Detects if the app is running on a TV browser
 */
function isTVBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();

    // Check for TV-specific user agents
    const isTVUserAgent = /tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast|web0s|tizen/i.test(ua);

    // Check for large screen resolution (likely TV)
    const isLargeScreen = window.innerWidth >= 1920 && window.innerHeight >= 1080;

    // Check for low hardware concurrency (weak CPU)
    const isWeakCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    return isTVUserAgent || (isLargeScreen && isWeakCPU);
}

export const useTVMode = () => {
    const [isTVMode, setIsTVMode] = useState(false);
    const [config, setConfig] = useState<TVConfig>(DEFAULT_DESKTOP_CONFIG);

    useEffect(() => {
        const tvDetected = isTVBrowser();
        setIsTVMode(tvDetected);
        setConfig(tvDetected ? DEFAULT_TV_CONFIG : DEFAULT_DESKTOP_CONFIG);

        // Add CSS class for TV-specific styling
        if (tvDetected) {
            document.body.classList.add('tv-mode');
            console.log('[TV Mode] Detected TV browser, enabling optimizations');
        } else {
            document.body.classList.remove('tv-mode');
        }

        // Log device info for debugging
        console.log('[TV Mode] Device Info:', {
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            hardwareConcurrency: navigator.hardwareConcurrency,
            isTVMode: tvDetected,
        });
    }, []);

    return { isTVMode, config };
};
