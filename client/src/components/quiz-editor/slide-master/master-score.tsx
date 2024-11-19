
import { ScoreSlide, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { BarChart3Icon } from "lucide-react";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, MinusIcon } from "lucide-react";
import ScoreBoard from "@/pages/host/Scoreboard";
import { SlideTitle } from "../slide-content/SlideTitle";
import { OptionProps, ToolbarProps } from ".";
import DefaultToolbar from "./toolbar/DefaultToolbar";



// OPTION: Renders the button to add a score slide
export function Option({ handleAddSlide }: OptionProps) {
  return (
    <SlideOption
      label="Score Slide"
      icon={BarChart3Icon}
      onClick={() => {
        handleAddSlide(SlideTypes.score); // Call the passed function here
      }}
    />
  );
}
Option.displayName = "Score";

// RENDER: Renders the score slide
export function Render({ slide }: { slide: ScoreSlide }) {
  return (
    <div className="space-y-12 w-full">
      <SlideTitle title={slide.title} />
      <ScoreBoard scoreboard={slide.mockScores || []} />
    </div>
  )
}

// TOOLBAR: Renders the score slide toolbar
export const Info = {
  value: "score",
  icon: BarChart3Icon,
  label: "Score Slide",
} as const;

interface MockScore {
  name: string;
  points: number;
  newPoints: number;
}

type ScoreToolbarProps = ToolbarProps & {
  slide: ScoreSlide;
}

export function Toolbar({
  slide,
  onSlideUpdate,
}: ScoreToolbarProps) {
  const [mockScores, setMockScores] = useState<MockScore[]>(slide.mockScores || []);

  const addMockScore = () => {
    setMockScores([...mockScores, { name: '', points: 0, newPoints: 0 }]);
  };

  const updateMockScore = (index: number, updatedScore: Partial<MockScore>) => {
    setMockScores(mockScores.map((score, i) => i === index ? { ...score, ...updatedScore } : score));
  };

  const removeMockScore = (index: number) => {
    setMockScores(mockScores.filter((_, i) => i !== index));
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
              {/* Input for Player Name */}
              <Input
                value={score.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateMockScore(index, { name: e.target.value })
                }
                placeholder="Player name..."
              />

              {/* Input for Points */}
              <Input
                type="number"
                value={score.points}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateMockScore(index, {
                    points: parseInt(e.target.value) || 0,
                  })
                }
                className="w-24"
              />

              {/* Input for New Points */}
              <Input
                type="number"
                value={score.newPoints}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateMockScore(index, {
                    newPoints: parseInt(e.target.value) || 0,
                  })
                }
                className="w-24"
                placeholder="New points"
              />

              {/* Button to Remove Player */}
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