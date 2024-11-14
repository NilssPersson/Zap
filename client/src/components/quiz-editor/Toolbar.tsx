import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusIcon,
  MinusIcon,
  ImageIcon,
  InfoIcon,
  BarChart3Icon,
  CircleDotIcon,
  CheckSquareIcon,
  TypeIcon,
  TimerIcon,
  ListOrdered,
} from "lucide-react";
import type { Slide, SlideType, QuestionType } from "@/types/quiz";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BackgroundStyle } from "./QuizBackground";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const slideTypeInfo = {
  info: { icon: InfoIcon, label: "Information Slide" },
  score: { icon: BarChart3Icon, label: "Score Slide" },
  "question:MCQSA": { icon: CircleDotIcon, label: "Single Answer MCQ" },
  "question:MCQMA": { icon: CheckSquareIcon, label: "Multiple Answer MCQ" },
  "question:FA": { icon: TypeIcon, label: "Free Answer Question" },
  rank: { icon: ListOrdered, label: "Rank Answers" },
} as const;

interface ToolbarProps {
  slide: Slide & {
    titleWiggle?: boolean;
    contentWiggle?: boolean;
    backgroundStyle?: BackgroundStyle;
  };
  onSlideUpdate: (
    slide: Slide & {
      titleWiggle?: boolean;
      contentWiggle?: boolean;
      backgroundStyle?: BackgroundStyle;
    }
  ) => void;
}

export function Toolbar({ slide, onSlideUpdate }: ToolbarProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onSlideUpdate({
        ...slide,
        imageUrl: reader.result as string,
        imageScale: 1,
      });
    };
    reader.readAsDataURL(file);
  };

  const [newRank, setNewRank] = useState({ name: "", score: 0 });

  const addOption = () => {
    if (slide.type !== "question" || !("options" in slide)) return;

    onSlideUpdate({
      ...slide,
      options: [
        ...slide.options,
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
    });
  };

  const removeOption = (optionId: string) => {
    if (slide.type !== "question" || !("options" in slide)) return;

    onSlideUpdate({
      ...slide,
      options: slide.options.filter((opt) => opt.id !== optionId),
    });
  };

  const updateOption = (
    optionId: string,
    updates: Partial<{ text: string; isCorrect: boolean }>
  ) => {
    if (slide.type !== "question" || !("options" in slide)) return;

    onSlideUpdate({
      ...slide,
      options: slide.options.map((opt) =>
        opt.id === optionId
          ? { ...opt, ...updates }
          : // For MCQSA, deselect other options when selecting a new correct answer
          slide.questionType === "MCQSA" &&
            "isCorrect" in updates &&
            updates.isCorrect
          ? { ...opt, isCorrect: false }
          : opt
      ),
    });
  };

  const addMockScore = () => {
    if (slide.type !== "score") return;

    onSlideUpdate({
      ...slide,
      mockScores: [
        ...(slide.mockScores || []),
        {
          playerName: `Player ${(slide.mockScores?.length || 0) + 1}`,
          score: 0,
        },
      ],
    });
  };

  const removeMockScore = (index: number) => {
    if (slide.type !== "score" || !slide.mockScores) return;

    onSlideUpdate({
      ...slide,
      mockScores: slide.mockScores.filter((_, i) => i !== index),
    });
  };

  const updateMockScore = (
    index: number,
    updates: Partial<{ playerName: string; score: number }>
  ) => {
    if (slide.type !== "score" || !slide.mockScores) return;

    onSlideUpdate({
      ...slide,
      mockScores: slide.mockScores.map((score, i) =>
        i === index ? { ...score, ...updates } : score
      ),
    });
  };

  const getSlideTypeKey = (slide: Slide) => {
    if (slide.type === "question") {
      return `question:${slide.questionType}` as const;
    }
    return slide.type;
  };

  const handleSlideTypeChange = (value: string) => {
    const [type, questionType] = value.split(":") as [SlideType, QuestionType?];

    let updatedSlide: Slide;
    const baseSlide = {
      id: slide.id,
      title: slide.title,
      content: slide.content,
      imageUrl: slide.imageUrl,
    };

    switch (type) {
      case "info":
        updatedSlide = {
          ...baseSlide,
          type: "info",
        };
        break;
      case "score":
        updatedSlide = {
          ...baseSlide,
          type: "score",
          mockScores: [],
        };
        break;
      case "rank":
        updatedSlide = {
          ...baseSlide,
          type: "rank",
          ranking: [],
          timeLimit: 0,
          
        };
        break;

      case "question":
        if (!questionType) throw new Error("Question type is required");

        switch (questionType) {
          case "MCQSA":
            updatedSlide = {
              ...baseSlide,
              type: "question",
              questionType: "MCQSA",
              options: Array.from({ length: 4 }, (_, i) => ({
                id: crypto.randomUUID(),
                text: `Option ${i + 1}`,
                isCorrect: i === 0,
              })),
              timeLimit: 0,
            };
            break;
          case "MCQMA":
            updatedSlide = {
              ...baseSlide,
              type: "question",
              questionType: "MCQMA",
              options: Array.from({ length: 4 }, (_, i) => ({
                id: crypto.randomUUID(),
                text: `Option ${i + 1}`,
                isCorrect: i <= 1,
              })),
              timeLimit: 0,
            };
            break;
          case "FA":
            updatedSlide = {
              ...baseSlide,
              type: "question",
              questionType: "FA",
              correctAnswer: "",
              timeLimit: 0,
            };
            break;

          default:
            throw new Error("Invalid question type");
        }
        break;
      default:
        throw new Error("Invalid slide type");
    }

    onSlideUpdate(updatedSlide);
  };

  const slideTypeKey = getSlideTypeKey(slide);
  const SlideTypeIcon = slideTypeInfo[slideTypeKey].icon;

  const backgroundStyles: { value: BackgroundStyle; label: string }[] = [
    { value: "waves", label: "Waves" },
    { value: "blob", label: "Blob" },
    { value: "blobInverted", label: "Inverted Blob" },
    { value: "circle", label: "Circles" },
  ];

  return (
    <div className="h-full bg-secondary/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SlideTypeIcon className="h-4 w-4" />
        <span className="text-sm">{slideTypeInfo[slideTypeKey].label}</span>
      </div>

      <div className="space-y-2">
        <Label>Slide Type</Label>
        <Select value={slideTypeKey} onValueChange={handleSlideTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Information Slide</SelectItem>
            <SelectItem value="score">Score Slide</SelectItem>
            <SelectItem value="question:MCQSA">Single Answer MCQ</SelectItem>
            <SelectItem value="question:MCQMA">Multiple Answer MCQ</SelectItem>
            <SelectItem value="question:FA">Free Answer Question</SelectItem>
            <SelectItem value="rank">Rank Answers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Title</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Dancing Text</Label>
            <Switch
              checked={slide.titleWiggle}
              onCheckedChange={(checked) =>
                onSlideUpdate({ ...slide, titleWiggle: checked })
              }
            />
          </div>
        </div>
        <Input
          value={slide.title}
          onChange={(e) => onSlideUpdate({ ...slide, title: e.target.value })}
          className="text-xl font-bold"
          placeholder="Slide Title"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Content</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Dancing Text</Label>
            <Switch
              checked={slide.contentWiggle}
              onCheckedChange={(checked) =>
                onSlideUpdate({ ...slide, contentWiggle: checked })
              }
            />
          </div>
        </div>
        <Textarea
          value={slide.content || ""}
          onChange={(e) => onSlideUpdate({ ...slide, content: e.target.value })}
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
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {slide.imageUrl ? "Change Image" : "Add Image"}
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

      {slide.imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Image Scale</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round((slide.imageScale || 1) * 100)}%
            </span>
          </div>
          <Slider
            value={[(slide.imageScale || 1) * 100]}
            onValueChange={([value]) =>
              onSlideUpdate({
                ...slide,
                imageScale: value / 100,
              })
            }
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Background Style</Label>
        <Select
          value={slide.backgroundStyle || "waves"}
          onValueChange={(value: BackgroundStyle) =>
            onSlideUpdate({ ...slide, backgroundStyle: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {backgroundStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {slide.type === "question" && "options" in slide && (
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
            <Button variant="outline" className="w-full" onClick={addOption}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>
        </div>
      )}

      {slide.type === "question" && slide.questionType === "FA" && (
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <Input
            value={slide.correctAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSlideUpdate({
                ...slide,
                correctAnswer: e.target.value,
              })
            }
            placeholder="Enter correct answer..."
          />
        </div>
      )}

      {slide.type === "score" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Mock Scores (Preview Only)</Label>
            <Button variant="outline" size="sm" onClick={addMockScore}>
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
                    updateMockScore(index, {
                      score: parseInt(e.target.value) || 0,
                    })
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

      {slide.type === "rank" && (
        <div className="space-y-4">
          <Label>Rank Answer</Label>

          {/* Rendering the list of ranking items */}
          {slide.ranking.map((rankItem, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="p-2">{index + 1}</span>{" "}
              {/* Display rank number as index+1 */}
              <Input
                type="text"
                value={rankItem.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedRanking = [...slide.ranking];
                  updatedRanking[index] = {
                    ...updatedRanking[index],
                    name: e.target.value,
                  };
                  onSlideUpdate({
                    ...slide,
                    ranking: updatedRanking,
                  });
                }}
                placeholder="New answer "
                className="p-2 border border-gray-300 rounded"
              />
              {/* Up and Down buttons to reorder the ranking */}
              <Button
                onClick={() => {
                  if (index > 0) {
                    const updatedRanking = [...slide.ranking];
                    const [movedItem] = updatedRanking.splice(index, 1); // Remove the item
                    updatedRanking.splice(index - 1, 0, movedItem); // Insert the item at the new position
                    onSlideUpdate({
                      ...slide,
                      ranking: updatedRanking, // Update ranking state with new order
                    });
                  }
                }}
                className="p-2 bg-gray-300 text-black rounded"
              >
                ↑
              </Button>
              <Button
                onClick={() => {
                  if (index < slide.ranking.length - 1) {
                    const updatedRanking = [...slide.ranking];
                    const [movedItem] = updatedRanking.splice(index, 1); // Remove the item
                    updatedRanking.splice(index + 1, 0, movedItem); // Insert the item at the new position
                    onSlideUpdate({
                      ...slide,
                      ranking: updatedRanking, // Update ranking state with new order
                    });
                  }
                }}
                className="p-2 bg-gray-300 text-black rounded"
              >
                ↓
              </Button>
            </div>
          ))}

         {/* Input fields for adding new items */}
         <div className="flex space-x-2">
            <span className="p-2">{slide.ranking.length + 1}</span>{" "}
            {/* Display rank number as index+1 */}
            <Input
              type="text"
              value={newRank.name} // newRank should be in your component state
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                // Add new item to ranking
                const updatedRanking = [...slide.ranking, newRank];
                onSlideUpdate({
                  ...slide,
                  ranking: updatedRanking,
                });
                setNewRank({ name: "", score: 0 }); // Reset newRank after adding
              }}
              className="p-1 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {slide.type === "question" || slide.type === "rank" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Time Limit</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TimerIcon className="h-4 w-4" />
              {!slide.timeLimit ? "No limit" : `${slide.timeLimit} seconds`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="300"
              value={slide.timeLimit}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onSlideUpdate({
                  ...slide,
                  timeLimit: Math.max(0, Math.min(300, value)),
                });
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() =>
                onSlideUpdate({
                  ...slide,
                  timeLimit: 0,
                })
              }
            >
              No Limit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Set to 0 for no time limit. Maximum 300 seconds (5 minutes).
          </p>
        </div>
      )}
    </div>
  );
}
