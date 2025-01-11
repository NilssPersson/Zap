import { MCQSASlide } from '@/models/Quiz';
import { CheckCircle2, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { max_options } from '@/config/max';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SlideContent } from '@/slides/_components/SlideContent';

const MAX_OPTIONS = max_options.mqsa.options;
const MAX_MCQ_TEXT_LENGTH = max_options.mqsa.option_text_length;

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: MCQSASlide;
  onSlideUpdate: (slide: MCQSASlide) => void;
}) {
  const canAdd = slide.options.length < MAX_OPTIONS;

  const handleTitleChange = (newTitle: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, content: newContent });
    }
  };

  const handleOptionChange = (id: string, newText: string) => {
    const updatedOptions = slide.options.map((option) =>
      option.id === id ? { ...option, text: newText } : option
    );
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleToggleCorrect = (id: string) => {
    const updatedOptions = slide.options.map((option) => ({
      ...option,
      isCorrect: option.id === id,
    }));
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleDeleteOption = (id: string) => {
    if (slide.options.length === 1) {
      // Prevent deletion of the last option
      return;
    }

    const isDeletingCorrect = slide.options.find(
      (option) => option.id === id
    )?.isCorrect;

    const updatedOptions = slide.options.filter((option) => option.id !== id);

    if (isDeletingCorrect) {
      updatedOptions[0].isCorrect = true;
    }
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'New Option',
      isCorrect: false,
    };
    onSlideUpdate({ ...slide, options: [...slide.options, newOption] });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 space-y-8 w-full">
      <div className="flex flex-col w-full">
        <SlideTitle
          title={slide.title}
          isEditable={true}
          onTitleChange={handleTitleChange}
        />
      </div>
      <div className="flex flex-col w-full">
        <SlideContent
          content={slide.content}
          isEditable={true}
          onContentChange={handleContentChange}
        />
      </div>
      <div
        className={cn(
          'grid grid-cols-2 gap-10',
          slide.options.length > 4 && 'grid grid-cols-3 gap-10'
        )}
      >
        {slide.options.map((option) => {
          return (
            <div
              key={option.id}
              className={cn(
                'relative flex items-center justify-between text-5xl text-white font-display h-56 w-[500px] rounded-lg box-border p-6 gap-6',
                {
                  'bg-white/10 backdrop-blur outline outline-white/50':
                    !option.isCorrect,
                  'ring-4 ring-white': option.isCorrect,
                  'bg-green-600': option.isCorrect,
                }
              )}
            >
              <Textarea
                className="bg-transparent text-white flex-grow outline-none text-4xl px-1 h-full overflow-hidden border-dashed border-2"
                value={option.text}
                maxLength={MAX_MCQ_TEXT_LENGTH}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
              />
              <div className="flex items-center">
                <Button
                  onClick={() => handleToggleCorrect(option.id)}
                  variant="ghost"
                  className="[&_svg]:size-12 hover:bg-transparent"
                >
                  <CheckCircle2
                    className={cn('w-12 h-12', {
                      'text-white': option.isCorrect,
                      'text-gray-400': !option.isCorrect,
                    })}
                  />
                </Button>
              </div>

              <div className="absolute top-2 right-0">
                <Button
                  onClick={() => handleDeleteOption(option.id)}
                  variant="ghost"
                  className="[&_svg]:size-8 hover:bg-transparent"
                >
                  <Trash2 className="w-8 h-8 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {canAdd && (
        <Button
          onClick={handleAddOption}
          className="flex items-center justify-center text-white rounded-lg p-10 [&_svg]:size-10 font-display"
        >
          <Plus size={16} strokeWidth={3} />
          <h1 className="text-3xl">Add Option</h1>
        </Button>
      )}
    </div>
  );
}
