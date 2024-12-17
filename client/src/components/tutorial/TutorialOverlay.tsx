import { useEffect, useState } from 'react';
import { useTutorial } from '@/contexts/Tutorial/context';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TutorialOverlay() {
  const { state, nextStep, skipTutorial } = useTutorial();
  const { activeStep, activeTutorial } = state;
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (activeStep?.targetId) {
      const element = document.getElementById(activeStep.targetId);
      console.log(element)
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        setOverlayStyle({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, [activeStep]);

  if (!activeStep || !activeTutorial) return null;

  const handleNext = () => {
    if (activeStep.nextTrigger) {
      // If there's a next trigger, wait for it to be clicked
      const element = document.getElementById(activeStep.nextTrigger);
      if (element) {
        const originalClick = element.onclick;
        element.onclick = (e) => {
          if (originalClick) {
            originalClick.call(element, e);
          }
          nextStep();
        };
      }
    } else {
      // If no next trigger, proceed immediately
      nextStep();
    }
  };

  return (
    <>

      {/* Highlight cutout */}
      {targetElement && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            top: overlayStyle.top,
            left: overlayStyle.left,
            width: overlayStyle.width,
            height: overlayStyle.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
            borderRadius: '4px',
          }}
        />
      )}

      {/* Tutorial dialog */}
      <Dialog open={true} onOpenChange={() => {}} >
        <DialogContent
        overlay={false}
          className={cn(
            'absolute z-50',
            activeStep.placement === 'top' && 'bottom-3/4 left-1/2 -translate-x-1/2',
            activeStep.placement === 'bottom' && 'top-3/4 left-1/2 -translate-x-1/2',
            activeStep.placement === 'left' && 'right-3/4 top-1/2 -translate-y-1/2',
            activeStep.placement === 'right' && 'left-3/4 top-1/2 -translate-y-1/2'
          )}
        >
          <DialogHeader>
            <DialogTitle>{activeStep.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">{activeStep.content}</div>
          <DialogFooter>
            <Button variant="outline" onClick={skipTutorial}>
              Skip Tutorial
            </Button>
            <Button onClick={handleNext}>
              {activeStep.nextTrigger ? 'Got it' : 'Next'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 