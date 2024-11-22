import { ScoreSlide } from "@/models/Quiz";
import { ToolbarProps } from "../";
import DefaultToolbar from "../toolbar/DefaultToolbar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";

interface MockScore {
    name: string;
    points: number;
    newPoints: number;
}

type ScoreToolbarProps = ToolbarProps & {
    slide: ScoreSlide;
}

export function Toolbar({ slide, onSlideUpdate }: ScoreToolbarProps) {
    const [mockScores, setMockScores] = useState<MockScore[]>(slide.mockScores || []);

    const addMockScore = () => {
        setMockScores([...mockScores, { name: '', points: 0, newPoints: 0 }]);
    };

    const updateMockScore = (index: number, updatedScore: Partial<MockScore>) => {
        const newScores = mockScores.map((score, i) => 
            i === index ? { ...score, ...updatedScore } : score
        );
        setMockScores(newScores);
        onSlideUpdate({ ...slide, mockScores: newScores });
    };

    const removeMockScore = (index: number) => {
        const newScores = mockScores.filter((_, i) => i !== index);
        setMockScores(newScores);
        onSlideUpdate({ ...slide, mockScores: newScores });
    };

    return (
        <>
            <DefaultToolbar slide={slide} onSlideUpdate={onSlideUpdate} />
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mock Scores (Preview Only)</Label>
                    <Button variant="outline" size="sm" onClick={addMockScore}>
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </div>
                <div className="space-y-2">
                    {mockScores?.map((score, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={score.name}
                                onChange={(e) => updateMockScore(index, { name: e.target.value })}
                                placeholder="Player name..."
                            />
                            <Input
                                type="number"
                                value={score.points}
                                onChange={(e) => updateMockScore(index, { points: parseInt(e.target.value) || 0 })}
                                className="w-24"
                            />
                            <Input
                                type="number"
                                value={score.newPoints}
                                onChange={(e) => updateMockScore(index, { newPoints: parseInt(e.target.value) || 0 })}
                                className="w-24"
                                placeholder="New points"
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
        </>
    );
} 