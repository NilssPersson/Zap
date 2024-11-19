import { QuestionTypes, RankSlide, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { ListOrdered } from "lucide-react";
import { BaseQuestionToolbar } from "./master-question";
import { OptionProps, ToolbarProps } from ".";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlideTitle } from "../slide-content/SlideTitle";
import SlideRank from "../slide-content/SlideRank";

// OPTION: Renders the button to add a Rank slide
export function Option({ handleAddSlide }: OptionProps) {
  return (
    <SlideOption
      label="Rank Answers"
      icon={ListOrdered}
      onClick={() => {
        handleAddSlide(SlideTypes.question, QuestionTypes.RANK);
      }}
    />
  );
}
Option.displayName = "RANK";

// RENDER: Renders the Rank slide
export function Render({ slide }: { slide: RankSlide }) {
  return (
    <div className="space-y-12 w-full">
      <SlideTitle title={slide.title} wiggle={slide.titleWiggle} />
      <SlideRank ranking={slide.ranking} />
    </div>
  )
}

// TOOLBAR: Renders the Rank slide toolbar
type RankToolbarProps = ToolbarProps & {
  slide: RankSlide;
  onSlideUpdate: (slide: RankSlide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: RankToolbarProps) {
  const [rankSlide, setRankSlide] = useState<RankSlide>(slide); // Local state for ranking slide
  const [newRank, setNewRank] = useState<{ name: string; score: number }>({
    name: "",
    score: 0,
  });

  const updateSlide = (updatedRanking: { name: string; score: number }[]) => {
    const updatedSlide = {
      ...rankSlide,
      ranking: updatedRanking,
    };
    setRankSlide(updatedSlide); // Update local state
    onSlideUpdate(updatedSlide); // Notify parent
  };
  return (<BaseQuestionToolbar slide={rankSlide} onSlideUpdate={onSlideUpdate}>
    <div className="space-y-4">
      <Label>Rank Answer</Label>
      {rankSlide.ranking.map((rankItem, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="p-2">{index + 1}</span>
          <Input
            type="text"
            value={rankItem.name}
            onChange={(e) => {
              const updatedRanking = [...rankSlide.ranking];
              updatedRanking[index] = {
                ...updatedRanking[index],
                name: e.target.value,
              };
              updateSlide(updatedRanking);
            }}
            placeholder="New answer"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      ))}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newRank.name}
          onChange={(e) =>
            setNewRank({
              ...newRank,
              name: e.target.value,
            })
          }
          placeholder="Answer"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            const updatedRanking = [...rankSlide.ranking, newRank];
            updateSlide(updatedRanking);
            setNewRank({ name: "", score: 0 }); // Reset newRank
          }}
          className="p-1 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  </BaseQuestionToolbar>)
}

export const Info = {
  value: "question:RANK",
  icon: ListOrdered,
  label: "Rank Answers",
} as const;
