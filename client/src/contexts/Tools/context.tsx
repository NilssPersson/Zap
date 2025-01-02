import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InputItem } from '@/components/ui/dynamic-input-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ToolsContextType {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  currentItems: InputItem[];
  setCurrentItems: (items: InputItem[]) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentItems, setCurrentItems] = useState<InputItem[]>([]);
  const [previousItems, setPreviousItems] = useState<InputItem[]>([]);
  const [showKeepItemsDialog, setShowKeepItemsDialog] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>('');
  const location = useLocation();

  // Monitor location changes to handle tool switching
  useEffect(() => {
    if (previousPath && previousPath !== location.pathname) {
      const hasValidItems = currentItems.length > 0 && currentItems.some(item => item.text !== '');
      if (hasValidItems) {
        setPreviousItems([...currentItems]);
        setShowKeepItemsDialog(true);
        // Clear current items to prevent them from showing up in the new tool immediately
        setCurrentItems([]);
      }
    }
    setPreviousPath(location.pathname);
  }, [location.pathname, currentItems, previousPath]);

  const handleKeepItems = () => {
    // Keep the items from the previous tool
    setCurrentItems([...previousItems]);
    setPreviousItems([]);
    setShowKeepItemsDialog(false);
  };

  const handleDiscardItems = () => {
    const emptyItem = { id: Date.now().toString(), text: '' };
    setCurrentItems([emptyItem]);
    setPreviousItems([]);
    setShowKeepItemsDialog(false);
  };

  return (
    <ToolsContext.Provider
      value={{
        showAdvanced,
        setShowAdvanced,
        currentItems,
        setCurrentItems,
      }}
    >
      {children}
      <Dialog 
        open={showKeepItemsDialog} 
        onOpenChange={(open) => {
          if (!open) {
            handleDiscardItems();
          }
          setShowKeepItemsDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('general:tools.keepItems')}</DialogTitle>
            <DialogDescription>
              {t('general:tools.keepItemsDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardItems}>
              {t('general:discard')}
            </Button>
            <Button onClick={handleKeepItems}>
              {t('general:keep')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 