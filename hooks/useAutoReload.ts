import { useEffect } from 'react';

interface AutoReloadOptions {
    enabled: boolean;
    intervalSeconds: number;
    onBeforeReload?: () => void;
}

/**
 * Automatically reloads the page after a specified interval
 * to prevent memory leaks in long-running TV applications
 */
export const useAutoReload = (options: AutoReloadOptions) => {
    const { enabled, intervalSeconds, onBeforeReload } = options;

    useEffect(() => {
        if (!enabled || intervalSeconds <= 0) {
            return;
        }

        const intervalMs = intervalSeconds * 1000;
        const reloadTime = new Date(Date.now() + intervalMs);

        console.log(
            `[Auto Reload] Scheduled reload in ${intervalSeconds}s (${Math.floor(intervalSeconds / 3600)}h ${Math.floor((intervalSeconds % 3600) / 60)}m)`,
            `at ${reloadTime.toLocaleTimeString()}`
        );

        const timer = setTimeout(() => {
            console.log('[Auto Reload] Executing preventive reload...');

            // Call cleanup callback if provided
            if (onBeforeReload) {
                try {
                    onBeforeReload();
                } catch (error) {
                    console.error('[Auto Reload] Error in onBeforeReload callback:', error);
                }
            }

            // Save reload timestamp to localStorage for debugging
            try {
                localStorage.setItem('lastAutoReload', new Date().toISOString());
            } catch (e) {
                // Ignore localStorage errors
            }

            // Perform reload
            window.location.reload();
        }, intervalMs);

        return () => {
            clearTimeout(timer);
        };
    }, [enabled, intervalSeconds, onBeforeReload]);
};
