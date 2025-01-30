import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface WinnerModalProps {
  winner: any;
  showModal: boolean;
  wheelItems: any[];
  setWheelItems: (items: any[]) => void;
  setCurrentItems: (items: any[]) => void;
  setShowModal: (value: boolean) => void;
  setIdleRotation: (value: number) => void;
  rotation: number;
  normalizePercentages: (items: any[]) => any[];
}

export default function WinnerModal({
  winner,
  showModal,
  wheelItems,
  setWheelItems,
  setCurrentItems,
  setShowModal,
  setIdleRotation,
  rotation,
  normalizePercentages,
}: WinnerModalProps) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
        <DialogContent className="w-[90%]">
          <p className="text-center font-display text-6xl text-foreground">
            {winner?.text}
          </p>

          {/* Buttons for closing and removing the winner */}
          <div className="mt-4 flex justify-center gap-4">
            <Button
              onClick={() => {
                setShowModal(false);
                // Do not reset idleRotation; it will continue from the adjusted value
              }}
            >
              {t('general:close')}
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (winner) {
                  const updatedItems = wheelItems.map((item) =>
                    item.text === winner.text ? { ...item, used: true } : item
                  );

                  // Recalculate percentages for remaining items
                  const validItems = updatedItems.filter(
                    (item) => item.text !== ''
                  );
                  const newPercentage = 100 / validItems.length;
                  const normalizedItems = updatedItems.map((item) =>
                    item.text !== ''
                      ? { ...item, percentage: newPercentage }
                      : item
                  );

                  setWheelItems(normalizePercentages(normalizedItems));
                  setCurrentItems(normalizedItems);
                  setShowModal(false);
                  setIdleRotation(rotation % 360);
                }
              }}
            >
              {t('general:spinWheel.removeWinner')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
