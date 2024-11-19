
import {BaseSlide} from "@/types/quiz"
import { SlideOption } from "../SlideOption";
import { BarChart3Icon } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, MinusIcon } from  "lucide-react";
import { SlideType } from "@/types/quiz";



// Interface for question you created, find all interfaces in /types/quiz.ts
// Please add the new interface as an export on type at the bottom of quiz.ts
export interface ScoreSlideInterface extends BaseSlide {
  type: "score";
  mockScores?: { name: string; points: number; newPoints: number }[];
}

// Interface for adding score question in the slidecreationmenu Importtant to send handleAddSlide when calling this prop
interface MasterScoreOptionProps {
  handleAddSlide: (type: SlideType) => void; // Now accepts SlideType instead of string
}

// Define the MockScore type if it is not already defined elsewhere
interface MockScore {
  name: string;
  points: number;
  newPoints: number;
}

// Interface for props inside the toolbar
interface MasterToolbarScoreProps {
  mockScores: MockScore[];
  addMockScore: () => void
  updateMockScore: (index: number, updatedScore: Partial<MockScore>) => void;
  removeMockScore: (index: number) => void;
}

// Here we export the function to the slidecreationMenu to render
export function MasterScoreOption({ handleAddSlide }: MasterScoreOptionProps) {
  return (
    <SlideOption
      label="Score Slide"
      icon={BarChart3Icon}
      onClick={() => {
        console.log("Score Slide clicked!"); // Log when the button is clicked
        handleAddSlide("score"); // Call the passed function here
      }}
    />
  );
}

export const MasterToolbarScore: React.FC<MasterToolbarScoreProps> = ({
  mockScores,
  addMockScore,
  updateMockScore,
  removeMockScore,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Mock Scores (Preview Only)</Label>
        <Button variant="outline" size="sm" onClick={addMockScore}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {mockScores.map((score, index) => (
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
  );
};
