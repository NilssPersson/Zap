import { RankSlide } from "@/models/Quiz";
import { ToolbarProps } from "../..";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RankOptionsInput({ slide, onSlideUpdate }: ToolbarProps) {

  const [newRank, setNewRank] = useState<string>("");
  
  if (!("ranking" in slide)) return null;

  const updateSlide = (updatedRanking: string[]) => {
    onSlideUpdate({
      ...slide,
      ranking: updatedRanking,
    } as RankSlide);
  };

  return (
    <div className="space-y-4">
      <Label>Rank Answer</Label>
      {(slide as RankSlide).ranking.map((rankItem, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="p-2">{index + 1}</span>
          <Input
            value={rankItem}
            onChange={(e) => {
              const updatedRanking = [...(slide as RankSlide).ranking];
              updatedRanking[index] = e.target.value;
              updateSlide(updatedRanking);
            }}
            placeholder="New answer"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              const updatedRanking = (slide as RankSlide).ranking.filter(
                (_, i) => i !== index
              );
              updateSlide(updatedRanking);
            }}
          >
            Del
          </Button>
        </div>
      ))}
      <div className="flex space-x-2">
        <Input
          value={newRank}
          onChange={(e) => setNewRank(e.target.value)}
          placeholder="Answer"
        />
        <Button
          onClick={() => {
            if (newRank.trim() !== "") {
              const updatedRanking = [...(slide as RankSlide).ranking, newRank];
              updateSlide(updatedRanking);
              setNewRank("");
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
} 