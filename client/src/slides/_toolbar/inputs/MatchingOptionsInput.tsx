import { MatchingSlide } from "@/models/Quiz";
import { ToolbarProps } from "@/slides/toolbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { max_options } from "@/config/max";

export function MatchingOptionsInput({ slide, onSlideUpdate }: ToolbarProps<MatchingSlide>) {
  const [newLabel, setNewLabel] = useState<string>("");
  const [newOption, setNewOption] = useState<string>("");

  const canAddLabel = slide.labels.length < max_options.match.labels;

  const updateSlide = (updates: Partial<MatchingSlide>) => {
    onSlideUpdate({
      ...slide,
      ...updates,
    });
  };

  const addOption = (option: string) => {
    if (option.trim() === "") return;
    updateSlide({ 
      options: [...slide.options, option]
    });
  };

  const removeOption = (optionToRemove: string) => {
    updateSlide({
      options: slide.options.filter(opt => opt !== optionToRemove),
      labels: slide.labels.map(label => ({
        ...label,
        correctOptions: label.correctOptions.filter(opt => opt !== optionToRemove)
      }))
    });
  };

  const toggleOptionForLabel = (labelId: string, option: string) => {
    updateSlide({
      labels: slide.labels.map(label => {
        if (label.id === labelId) {
          const correctOptions = label.correctOptions.includes(option)
            ? label.correctOptions.filter(opt => opt !== option)
            : [...label.correctOptions, option];
          return { ...label, correctOptions };
        }
        return label;
      })
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Labels</Label>
        {slide.labels.map((label) => (
          <div key={label.id} className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={label.text}
                onChange={(e) => {
                  updateSlide({
                    labels: slide.labels.map(l => 
                      l.id === label.id ? { ...l, text: e.target.value } : l
                    )
                  });
                }}
                placeholder="Label"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  updateSlide({
                    labels: slide.labels.filter(l => l.id !== label.id)
                  });
                }}
              >
                Del
              </Button>
            </div>
            <div className="ml-4 space-y-1">
              <Label className="text-sm text-muted-foreground">Correct options for this label:</Label>
              {slide.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    checked={label.correctOptions.includes(option)}
                    onCheckedChange={() => toggleOptionForLabel(label.id, option)}
                  />
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex space-x-2 mt-4">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New Label"
          />
          <Button
            disabled={!canAddLabel}
            onClick={() => {
              if (newLabel.trim() !== "") {
                updateSlide({
                  labels: [...slide.labels, {
                    id: Date.now().toString(),
                    text: newLabel,
                    correctOptions: []
                  }]
                });
                setNewLabel("");
              }
            }}
          >
            Add Label
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Available Options</Label>
        {slide.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOption = e.target.value;
                updateSlide({
                  options: slide.options.map(opt => 
                    opt === option ? newOption : opt
                  ),
                  labels: slide.labels.map(label => ({
                    ...label,
                    correctOptions: label.correctOptions.map(opt =>
                      opt === option ? newOption : opt
                    )
                  }))
                });
              }}
              placeholder="Option"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeOption(option)}
            >
              Del
            </Button>
          </div>
        ))}
        <div className="flex space-x-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="New Option"
          />
          <Button
            onClick={() => {
              addOption(newOption);
              setNewOption("");
            }}
          >
            Add Option
          </Button>
        </div>
      </div>
    </div>
  );
} 