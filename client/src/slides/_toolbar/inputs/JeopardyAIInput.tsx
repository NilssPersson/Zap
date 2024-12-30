import React, { useState } from 'react';
import { JeopardySlide, JeopardyCategory } from '@/models/Quiz';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { nanoid } from 'nanoid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

export const JeopardyAIInput: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const { t } = useTranslation('jeopardy');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedCategory, setParsedCategory] = useState<JeopardyCategory | null>(null);
  const [strictAnswerFormat, setStrictAnswerFormat] = useState(true);

  const validAnswerStarts = t('aiInput.validAnswerStarts').split(',');

  const getExamplePrompt = (strictFormat: boolean) => {
    const answerFormat = strictFormat ? t('aiInput.prompt.strictAnswerFormat') : t('aiInput.prompt.anyAnswerFormat');
    const formatNote = strictFormat ? t('aiInput.prompt.strictFormatNote') : t('aiInput.prompt.anyFormatNote');
    
    return t('aiInput.prompt.base', {
      answerFormat,
      formatNote
    });
  };

  const parseAIString = (input: string): JeopardyCategory | null => {
    try {
      // Split by newlines and filter out empty lines
      const lines = input.trim().split('\n').filter(line => line.trim() !== '');
      if (lines.length !== 6) {
        setError(t('errors.sixLines'));
        return null;
      }

      const categoryMatch = lines[0].match(/Category:\s*(.+)/);
      if (!categoryMatch) {
        setError(t('errors.categoryFormat'));
        return null;
      }

      const questions = lines.slice(1).map((line, index) => {
        const match = line.match(/Q\d+:\s*(.+?)\s*\|\s*A:\s*(.+)/);
        if (!match) {
          setError(t('errors.questionFormat', { number: index + 1 }));
          return null;
        }
        
        if (strictAnswerFormat) {
          const answerStart = match[2].trim().toLowerCase();
          if (!validAnswerStarts.some(start => answerStart.startsWith(start))) {
            setError(t('errors.answerFormat', { number: index + 1 }));
            return null;
          }
        }

        return {
          id: nanoid(),
          question: match[1].trim(),
          answer: match[2].trim()
        };
      });

      if (questions.some(q => q === null)) return null;

      setError(null);
      return {
        id: nanoid(),
        name: categoryMatch[1].trim(),
        questions: questions as { id: string; question: string; answer: string; }[]
      };
    } catch (error) {
      setError(t('errors.parseFailed'));
      return null;
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const category = parseAIString(value);
    setParsedCategory(category);
  };

  const handleAddCategory = () => {
    if (!parsedCategory) return;

    if (slide.categories.length >= 6) {
      // Replace the last category
      const newCategories = [...slide.categories.slice(0, -1), parsedCategory];
      onSlideUpdate({
        ...slide,
        categories: newCategories
      });
    } else {
      // Add new category
      onSlideUpdate({
        ...slide,
        categories: [...slide.categories, parsedCategory]
      });
    }

    // Clear the input and parsed category
    setInput('');
    setParsedCategory(null);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(getExamplePrompt(strictAnswerFormat));
  };

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="ai-generator">
          <AccordionTrigger>
            <Label className="hover:no-underline">{t('aiGenerator')}</Label>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={strictAnswerFormat}
                    onCheckedChange={setStrictAnswerFormat}
                  />
                  <Label>{t('strictAnswerFormat')}</Label>
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">{t('examplePrompt')}</Label>
                  <Button variant="ghost" size="sm" onClick={copyPrompt}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t('copy')}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {getExamplePrompt(strictAnswerFormat)}
                </div>
              </Card>

              <div className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                {t('format')}:<br />
                {t('aiInput.prompt.formatExample')}
              </div>

              <Textarea
                placeholder={t('pasteAiCategory')}
                className="font-mono text-sm"
                rows={8}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {parsedCategory && (
                <Card className="p-4 bg-muted/50">
                  <div className="font-bold mb-2">{parsedCategory.name}</div>
                  <div className="space-y-2">
                    {parsedCategory.questions.map((q, i) => (
                      <div key={q.id} className="text-sm">
                        <div className="font-semibold">${slide.minScore + i * ((slide.maxScore - slide.minScore) / 4)}</div>
                        <div>Q: {q.question}</div>
                        <div>A: {q.answer}</div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleAddCategory}
                    disabled={slide.categories.length >= 6}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {slide.categories.length >= 6 ? t('replaceLastCategory') : t('addCategory')}
                  </Button>
                </Card>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default JeopardyAIInput; 