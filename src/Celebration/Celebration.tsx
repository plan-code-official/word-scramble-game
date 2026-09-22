import React, { useRef, useEffect } from 'react';
// @ts-ignore
import { Celebration as CelebrationClass } from '../../Celebration/Celebration/Celebration.js';

export interface CelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
  muted?: boolean;
  soundUrl?: string;
  imageSrc?: string;
}

export const Celebration: React.FC<CelebrationProps> = ({
  isVisible,
  onComplete,
  muted = false,
  soundUrl,
  imageSrc,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const celebrationRef = useRef<any>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!containerRef.current) return;

    celebrationRef.current = new CelebrationClass(containerRef.current, {
      muted,
      soundUrl,
      imageSrc,
    });

    return () => {
      celebrationRef.current?.hide();
      celebrationRef.current = null;
    };
  }, [muted, soundUrl, imageSrc]);

  useEffect(() => {
    const instance = celebrationRef.current;
    if (!instance) return;

    if (isVisible) {
      instance.show(() => {
        onCompleteRef.current?.();
      });
    } else {
      instance.hide();
    }
  }, [isVisible]);

  return <div ref={containerRef} />;
};

export default Celebration;
