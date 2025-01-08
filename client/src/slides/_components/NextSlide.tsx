import { cn } from '@/lib/utils';
import {
  VolumeX,
  Volume2,
  Settings,
  StepBack,
  StepForward,
} from 'lucide-react';

import { useState } from 'react';

export default function NextSlide({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-6 border-2 border-primary bg-primary text-background text-xl rounded-md p-2">
      {/* Navigation Button */}
      <button
        onClick={onPrev}
        className={cn(  
          'flex items-center gap-3 ',

          'transition-all'
        )}
        aria-label="Next Slide"
      >
        <StepBack size={32} />
      </button>
      <button>
        <Settings size={32} />
      </button>
      <button onClick={onNext}>
        {' '}
        <StepForward size={32} />
      </button>

      {/* Volume Toggle */}
      <button
        onClick={toggleMute}
        className={cn('flex items-center justify-center ')}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
      </button>
    </div>
  );
}
