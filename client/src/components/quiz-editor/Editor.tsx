import type { Slide } from "@/models/Quiz";
import { SlidePreview } from "./SlidePreview";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [whichPreview, setWhichPreview] = useState("Host");

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
        <Tabs defaultValue="preview" className="pb-2">
          <TabsList className="grid w-full grid-cols-3 text-2xl">
            <TabsTrigger
              value="preview"
              onClick={() => setWhichPreview("Preview")}
            >
              Preview
            </TabsTrigger>
            <TabsTrigger value="host" onClick={() => setWhichPreview("Host")}>
              Host
            </TabsTrigger>
            <TabsTrigger
              value="participant"
              onClick={() => setWhichPreview("Participant")}
            >
              Participant
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg p-4">
        <div className="w-full max-w-4xl">
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
