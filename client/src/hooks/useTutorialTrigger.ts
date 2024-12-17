import { useCallback, useEffect } from 'react';
import { useTutorial } from '@/contexts/Tutorial/context';
import { allTutorials } from '@/data/tutorials';

export function useTutorialTrigger() {
  const { startTutorial, state } = useTutorial();

  const startTriggers = allTutorials.map(tutorial => tutorial.startTriggerId);

  const attachTutorialListener = useCallback((triggerId: string) => {
    const element = document.getElementById(triggerId);
    if (element) {
      startTutorial(allTutorials.find(tutorial => tutorial.startTriggerId === triggerId)!);
    }
  }, [startTutorial]);

  useEffect(() => {
    if (state.activeTutorial) return;
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      startTriggers.forEach(triggerId => {
        attachTutorialListener(triggerId);
      });
    });

    // Initial check for elements
    startTriggers.forEach(triggerId => {
      attachTutorialListener(triggerId);
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      // Remove event listeners if needed
      startTriggers.forEach(triggerId => {
        const element = document.getElementById(triggerId);
        if (element) {
          element.removeEventListener('click', () => 
            startTutorial(allTutorials.find(tutorial => tutorial.startTriggerId === triggerId)!)
          );
        }
      });
    };
  }, [startTriggers, attachTutorialListener]);
} 
