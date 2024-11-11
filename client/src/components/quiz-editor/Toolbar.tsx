import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon, MinusIcon, ImageIcon } from "lucide-react";
import type { Slide } from "@/types/quiz";
import { Switch } from "@/components/ui/switch";

interface ToolbarProps {
    slide: Slide;
    onSlideUpdate: (slide: Slide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: ToolbarProps) {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onSlideUpdate({
                ...slide,
                imageUrl: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    };

    const addOption = () => {
        if (slide.type !== 'question' || !('options' in slide)) return;
        
        onSlideUpdate({
            ...slide,
            options: [
                ...slide.options,
                { id: crypto.randomUUID(), text: '', isCorrect: false }
            ]
        });
    };

    const removeOption = (optionId: string) => {
        if (slide.type !== 'question' || !('options' in slide)) return;
        
        onSlideUpdate({
            ...slide,
            options: slide.options.filter(opt => opt.id !== optionId)
        });
    };

    const updateOption = (optionId: string, updates: Partial<{ text: string; isCorrect: boolean }>) => {
        if (slide.type !== 'question' || !('options' in slide)) return;
        
        onSlideUpdate({
            ...slide,
            options: slide.options.map(opt => 
                opt.id === optionId ? { ...opt, ...updates } : 
                // For MCQSA, deselect other options when selecting a new correct answer
                slide.questionType === 'MCQSA' && 'isCorrect' in updates && updates.isCorrect ? 
                { ...opt, isCorrect: false } : opt
            )
        });
    };

    const addMockScore = () => {
        if (slide.type !== 'score') return;
        
        onSlideUpdate({
            ...slide,
            mockScores: [
                ...(slide.mockScores || []),
                { playerName: `Player ${(slide.mockScores?.length || 0) + 1}`, score: 0 }
            ]
        });
    };

    const removeMockScore = (index: number) => {
        if (slide.type !== 'score' || !slide.mockScores) return;
        
        onSlideUpdate({
            ...slide,
            mockScores: slide.mockScores.filter((_, i) => i !== index)
        });
    };

    const updateMockScore = (index: number, updates: Partial<{ playerName: string; score: number }>) => {
        if (slide.type !== 'score' || !slide.mockScores) return;
        
        onSlideUpdate({
            ...slide,
            mockScores: slide.mockScores.map((score, i) => 
                i === index ? { ...score, ...updates } : score
            )
        });
    };

    return (
        <div className="h-full bg-secondary/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={slide.title}
                    onChange={(e) => onSlideUpdate({ ...slide, title: e.target.value })}
                    className="text-xl font-bold"
                    placeholder="Slide Title"
                />
            </div>

            <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                    value={slide.content || ''} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        onSlideUpdate({ ...slide, content: e.target.value })
                    }
                    placeholder="Add slide content..."
                    className="min-h-[100px] text-black"
                />
            </div>

            <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {slide.imageUrl ? 'Change Image' : 'Add Image'}
                    </Button>
                    {slide.imageUrl && (
                        <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => onSlideUpdate({ ...slide, imageUrl: undefined })}
                        >
                            <MinusIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                />
            </div>

            {slide.type === 'question' && 'options' in slide && (
                <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                        {slide.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                                <Switch 
                                    checked={option.isCorrect}
                                    onCheckedChange={(checked: boolean) => 
                                        updateOption(option.id, { isCorrect: checked })
                                    }
                                />
                                <Input 
                                    value={option.text}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                        updateOption(option.id, { text: e.target.value })
                                    }
                                    placeholder="Option text..."
                                />
                                <Button 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => removeOption(option.id)}
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={addOption}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Option
                        </Button>
                    </div>
                </div>
            )}

            {slide.type === 'question' && slide.questionType === 'FA' && (
                <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Input 
                        value={slide.correctAnswer}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSlideUpdate({ 
                            ...slide, 
                            correctAnswer: e.target.value 
                        })}
                        placeholder="Enter correct answer..."
                    />
                </div>
            )}

            {slide.type === 'score' && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Mock Scores (Preview Only)</Label>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={addMockScore}
                        >
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {(slide.mockScores || []).map((score, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input 
                                    value={score.playerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                        updateMockScore(index, { playerName: e.target.value })
                                    }
                                    placeholder="Player name..."
                                />
                                <Input 
                                    type="number"
                                    value={score.score}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                        updateMockScore(index, { score: parseInt(e.target.value) || 0 })
                                    }
                                    className="w-24"
                                />
                                <Button 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => removeMockScore(index)}
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 