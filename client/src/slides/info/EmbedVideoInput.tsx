import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmbedVideoInputProps } from "./Toolbar";

function EmbedVideoInput({ slide, onSlideUpdate }: EmbedVideoInputProps) {
  const [embedVideoUrl, setEmbedVideoUrl] = React.useState<string>(
    slide.embedVideoUrl || ""
  );
  const [error, setError] = React.useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = React.useState<string>(
    embedVideoUrl || ""
  );

  const validateUrl = React.useCallback((url: string) => {
    if (!url) return false;
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[\w-]{11}$/;

    return youtubeRegex.test(url);
  }, []);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(embedVideoUrl);
      if (embedVideoUrl && !validateUrl(embedVideoUrl)) {
        setError("Invalid YouTube URL");
      } else {
        setError(null);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [embedVideoUrl, validateUrl]);

  React.useEffect(() => {
    setEmbedVideoUrl(slide.embedVideoUrl || "");
  }, [slide.embedVideoUrl]);

  const handleEmbedVideoUrl = () => {
    if (!debouncedValue || !validateUrl(debouncedValue)) return;
    if (debouncedValue === slide.embedVideoUrl) return;
    onSlideUpdate({ ...slide, embedVideoUrl: debouncedValue });
  };

  const getYoutubeIdFromUrl = useCallback((url: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([\w-]{11})$/;
    const match = url.match(youtubeRegex);
    return match ? match[5] : undefined;
  }, []);

  const handleEmbedVideoUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmbedVideoUrl(e.target.value);
  }, []);

  const handleRemoveEmbeddedVideo = useCallback(() => {
    onSlideUpdate({ ...slide, embedVideoUrl: "" }); // Remove embedded video
  }, [onSlideUpdate, slide]);

  return (
    <div className="space-y-1 w-full">
      <Label>Embed YouTube Video</Label>
      <div className="flex w-full max-w-sm items-center justify-between">
        {slide.embedVideoUrl && (
          <img
            src={`https://img.youtube.com/vi/${getYoutubeIdFromUrl(slide.embedVideoUrl)}/sddefault.jpg`}
            alt="Youtube Thumbnail"
            className="h-12 w-20"
          />
        )}
        {!slide.embedVideoUrl && (
          <Input
            value={embedVideoUrl || ""}
            onChange={handleEmbedVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`font-bold ${error ? "border-red-500" : ""}`}
          />
        )}
        <div className="flex items-center ml-2 gap-2 justify-end">
          {!slide.embedVideoUrl && (
            <Button
              variant="outline"
              className="w-auto h-auto"
              onClick={handleEmbedVideoUrl}
              disabled={!debouncedValue || !!error}
            >
              Embed
            </Button>
          )}
          {slide.embedVideoUrl && (
            <Button
              variant="destructive"
              className="w-auto h-auto"
              onClick={handleRemoveEmbeddedVideo}
            >
              <MinusIcon className="" />
              Remove
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default EmbedVideoInput;
