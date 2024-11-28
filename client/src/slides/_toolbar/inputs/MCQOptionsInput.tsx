import { MCQMASlide } from "@/models/Quiz";
import { ToolbarProps } from "../..";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { addOption, removeOption, updateOption } from "../../question/helpers/options";

export function MCQOptionsInput({ slide, onSlideUpdate }: ToolbarProps) {
  if (!("options" in slide)) return null;
  
  return (
    <div className="space-y-2">
      <Label>Options</Label>
      <div className="space-y-2">
        {slide.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Switch
              checked={option.isCorrect}
              onCheckedChange={(checked: boolean) =>
                updateOption(slide as MCQMASlide, option.id, { isCorrect: checked }, onSlideUpdate)
              }
            />
            <Input
              value={option.text}
              onChange={(e) =>
                updateOption(slide as MCQMASlide, option.id, { text: e.target.value }, onSlideUpdate)
              }
              placeholder="Option text..."
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeOption(slide as MCQMASlide, option.id, onSlideUpdate)}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => addOption(slide as MCQMASlide, onSlideUpdate)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Option
        </Button>
      </div>
    </div>
  );
} 