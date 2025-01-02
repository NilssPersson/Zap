import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Shuffle } from 'lucide-react';
import { DynamicInputList, InputItem } from '@/components/ui/dynamic-input-list';
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { useTools } from '@/contexts/Tools/context';

interface TeamItem extends InputItem {
  team?: number;
}

export default function Team() {
  const { t } = useTranslation();
  const { currentItems, setCurrentItems } = useTools();
  const [items, setItems] = useState<TeamItem[]>(
    currentItems.length > 0 
      ? currentItems.map((item: InputItem) => ({ ...item, team: undefined }))
      : [{ id: '1', text: '', team: undefined }]
  );
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  // Add effect to watch for changes in currentItems
  useEffect(() => {
    const newItems = currentItems.map((item: InputItem) => ({ ...item, team: undefined }));
    setItems(newItems);
    
    // Reset teams if items are cleared
    if (currentItems.length === 1 && currentItems[0].text === '') {
      setTeams([]);
    }
  }, [currentItems]);

  const generateTeams = (players: string[], teamCount: number) => {
    if (players.length < teamCount) return [];

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const generatedTeams: string[][] = Array.from(
      { length: teamCount },
      () => []
    );

    shuffledPlayers.forEach((player, index) => {
      generatedTeams[index % teamCount].push(player);
    });

    return generatedTeams;
  };

  // Update teams whenever items or numberOfTeams changes
  useEffect(() => {
    const validPlayers = items
      .filter(item => item.text !== '')
      .map(item => item.text);

    if (validPlayers.length >= 2) {
      const newTeams = generateTeams(validPlayers, numberOfTeams);
      setTeams(newTeams);
    } else {
      setTeams([]);
    }
  }, [items, numberOfTeams]);

  // Update max number of teams based on number of players
  useEffect(() => {
    const validItems = items.filter(item => item.text !== '');
    if (validItems.length < numberOfTeams) {
      setNumberOfTeams(Math.max(2, validItems.length));
    }
  }, [items]);

  const handleInputChange = (id: string, value: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, text: value } : item
    );

    if (newItems[newItems.length - 1]?.text !== '') {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        team: undefined
      });
    }

    // Ensure all items have the team property properly set
    const finalItems = newItems.map(item => ({
      ...item,
      team: item.text !== '' ? item.team : undefined
    }));

    setItems(finalItems);
    setCurrentItems(finalItems);
  };

  const handleQuickAdd = (values: string[]) => {
    const newItems = values.map((text, index) => ({
      id: Date.now() + index.toString(),
      text,
      team: undefined
    }));

    newItems.push({
      id: Date.now() + values.length.toString(),
      text: '',
      team: undefined
    });

    setItems(newItems);
    setCurrentItems(newItems);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    
    const newItems = items.filter(item => item.id !== id);
    if (newItems.every(item => item.text !== '')) {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        team: undefined
      });
    }

    setItems(newItems);
    setCurrentItems(newItems);
  };

  const clearItems = () => {
    const newItems = [{ id: Date.now().toString(), text: '', team: undefined }];
    setItems(newItems);
    setCurrentItems(newItems);
    setTeams([]);
  };

  const randomizeTeams = () => {
    const validPlayers = items
      .filter(item => item.text !== '')
      .map(item => item.text);

    if (validPlayers.length >= 2) {
      const newTeams = generateTeams(validPlayers, numberOfTeams);
      setTeams(newTeams);
    }
  };

  const validItemsCount = items.filter(item => item.text !== '').length;
  const maxTeams = Math.max(2, validItemsCount);

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">{t('general:playerNames')}</Label>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearItems}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('general:clear')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('general:tools.clearTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {teams.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={randomizeTeams}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      {t('general:randomize')}
                    </Button>
                  )}
                </div>
              </div>

              <DynamicInputList
                items={items}
                showAdvanced={false}
                showColors={false}
                onItemChange={handleInputChange}
                onItemRemove={removeItem}
                inputPlaceholder={t('general:teamTitle')}
                quickAddPlaceholder="Player1, Player2, Player3..."
                onQuickAdd={handleQuickAdd}
                listLabel={t('general:playerNames')}
                quickAddLabel={t('general:spinWheel.quickAdd')}
              />

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Label>{t('general:numberOfTeams')}</Label>
                  <span className="font-bold">{numberOfTeams}</span>
                </div>
                <Slider
                  value={[numberOfTeams]}
                  onValueChange={(value) => setNumberOfTeams(value[0])}
                  min={2}
                  max={maxTeams}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {teams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid gap-4"
              >
                {teams.map((team, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-2">
                        {t('general:team')} {index + 1}
                      </h3>
                      <ul className="space-y-1">
                        {team.map((player, playerIndex) => (
                          <motion.li
                            key={playerIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: playerIndex * 0.1 }}
                            className="text-lg"
                          >
                            {player}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
