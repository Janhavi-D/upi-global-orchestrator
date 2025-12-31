
import React, { useState, useEffect, useRef } from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        // Instruction: Only mount when (width/height >= 32px)
        if (offsetWidth >= 32 && offsetHeight >= 32) {
          setIsReady(true);
        } else {
          setIsReady(false);
        }
      }
    };

    // Initial check with a slight delay to allow layout to settle
    const timeoutId = setTimeout(checkDimensions, 50);

    const observer = new ResizeObserver(() => {
      checkDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '350px', minHeight: '350px', minWidth: 0, position: 'relative',  overflow: 'hidden', display: 'block' }}
      className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      data-chart-ready={isReady ? "true" : "false"}
    >
      {isReady ? children : null}
    </div>
  );
};
