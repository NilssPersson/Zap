import { SlideTypes, type Slide } from "@/models/Quiz";
import { SlidePreview } from "./SlidePreview";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EditorProps {
  slide: Slide | null;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
}

export function Editor({
  slide,
  backgroundColor,
  primaryColor,
  secondaryColor,
}: EditorProps) {
  const [whichPreview, setWhichPreview] = useState("Preview");

  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center text-muted font-medium">
        Select a slide to edit or create a new one
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-center space-x-4">
        <Tabs value={whichPreview} onValueChange={setWhichPreview} className="pb-2">
          <TabsList>
            <TabsTrigger value="Preview">Preview</TabsTrigger>
            <TabsTrigger value="Host">Host</TabsTrigger>
            {slide.type !== SlideTypes.info && (
              <>
                <TabsTrigger value="Participant">Participant</TabsTrigger>
                <TabsTrigger value="HostAnswer">HostAnswer</TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex items-center justify-center bg-card/30 rounded-lg p-4">
        <div className={cn(
          "w-full",
          whichPreview === "Participant" ? "max-w-md" : "max-w-4xl",
        )}>
          <SlidePreview
            slide={slide}
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            whichPreview={whichPreview}
          />
        </div>
      </div>
    </div>
  );
}
