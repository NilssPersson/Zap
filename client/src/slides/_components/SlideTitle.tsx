import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface SlideTitleProps {
  title: string;
  size?: 'large' | 'small';
  isEditable?: boolean;
  onTitleChange?: (newTitle: string) => void;
}

export function SlideTitle({
  title,
  size = 'large',
  isEditable = false,
  onTitleChange,
}: SlideTitleProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-adjust the height of the textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  }, [title]); // Recalculate on title change

  const className = cn(
    'font-display text-center leading-tight resize-none',
    size === 'large' ? 'md:text-8xl text-4xl' : 'md:text-4xl text-2xl',
    isEditable && 'bg-transparent border-dashed border-2 overflow-hidden'
  );

  if (isEditable) {
    return (
      <Textarea
        ref={textareaRef}
        className={className}
        value={title}
        onChange={(e) => onTitleChange?.(e.target.value)}
        rows={1} // Initial row count
      />
    );
  }

  return <h2 className={className}>{title}</h2>;
}
``;
