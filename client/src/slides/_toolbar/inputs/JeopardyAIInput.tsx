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

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

const getExamplePrompt = (strictFormat: boolean) => `Create a Jeopardy category about [TOPIC] with 5 questions of increasing difficulty. Format it exactly like this:

Category: [Category Name]
Q1: [Easiest Question] | A: ${strictFormat ? '[Answer in "What/Who/Where/When is/was" format]' : '[Answer]'}
Q2: [Easy Question] | A: ${strictFormat ? '[Answer in "What/Who/Where/When is/was" format]' : '[Answer]'}
Q3: [Medium Question] | A: ${strictFormat ? '[Answer in "What/Who/Where/When is/was" format]' : '[Answer]'}
Q4: [Hard Question] | A: ${strictFormat ? '[Answer in "What/Who/Where/When is/was" format]' : '[Answer]'}
Q5: [Hardest Question] | A: ${strictFormat ? '[Answer in "What/Who/Where/When is/was" format]' : '[Answer]'}

${strictFormat ? 'Make sure each answer is phrased as a question starting with "What/Who/Where/When is/was".' : 'Answers can be in any format.'}`;

export const JeopardyAIInput: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedCategory, setParsedCategory] = useState<JeopardyCategory | null>(null);
  const [strictAnswerFormat, setStrictAnswerFormat] = useState(true);

  const validAnswerStarts = [
    'what is',
    'who is',
    'where is',
    'when is',
    'where was',
    'who was',
    'what was'
  ];

  const parseAIString = (input: string): JeopardyCategory | null => {
    try {
      // Split by newlines and filter out empty lines
      const lines = input.trim().split('\n').filter(line => line.trim() !== '');
      if (lines.length !== 6) {
        setError('Input must have exactly 6 non-empty lines (1 category + 5 questions)');
        return null;
      }

      const categoryMatch = lines[0].match(/Category:\s*(.+)/);
      if (!categoryMatch) {
        setError('First line must start with "Category:"');
        return null;
      }

      const questions = lines.slice(1).map((line, index) => {
        const match = line.match(/Q\d+:\s*(.+?)\s*\|\s*A:\s*(.+)/);
        if (!match) {
          setError(`Invalid format on question ${index + 1}. Must be "Q${index + 1}: [Question] | A: [Answer]"`);
          return null;
        }

        console.log(strictAnswerFormat)
        
        if (strictAnswerFormat) {
          const answerStart = match[2].trim().toLowerCase();
          if (!validAnswerStarts.some(start => answerStart.startsWith(start))) {
            setError(`Answer ${index + 1} must start with "What is/was", "Who is/was", "Where is/was", or "When is"`);
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
      setError('Failed to parse input');
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
            <Label className="hover:no-underline">AI Generated Category</Label>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={strictAnswerFormat}
                    onCheckedChange={setStrictAnswerFormat}
                  />
                  <Label>Require "What/Who/Where/When is/was" format</Label>
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Example Prompt</Label>
                  <Button variant="ghost" size="sm" onClick={copyPrompt}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {getExamplePrompt(strictAnswerFormat)}
                </div>
              </Card>

              <div className="text-sm text-muted-foreground mb-2">
                Format:<br />
                Category: [Name]<br />
                Q1: [Question] | A: [Answer]<br />
                Q2: [Question] | A: [Answer]<br />
                Q3: [Question] | A: [Answer]<br />
                Q4: [Question] | A: [Answer]<br />
                Q5: [Question] | A: [Answer]
              </div>

              <Textarea
                placeholder="Paste AI generated category here..."
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
                    {slide.categories.length >= 6 ? 'Replace Last Category' : 'Add Category'}
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