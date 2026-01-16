import { useState, useEffect } from 'react';

export const usePerformanceMode = () => {
    const [isLowPower, setIsLowPower] = useState(false);

    useEffect(() => {
        const checkPerformance = () => {
            // Logic for detecting low-end devices
            const isLowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            // Check for Save Data mode
            // @ts-ignore
            const saveData = navigator.connection?.saveData === true;

            const shouldBeLowPower = isLowConcurrency || isMobile || saveData;

            setIsLowPower(shouldBeLowPower);

            if (shouldBeLowPower) {
                document.body.classList.add('low-end');
            } else {
                document.body.classList.remove('low-end');
            }
        };

        checkPerformance();
    }, []);

    return { isLowPower };
};
