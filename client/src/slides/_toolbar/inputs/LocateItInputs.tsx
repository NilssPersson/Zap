import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocateItSlide, mapDetails, awardPointsLocation } from "@/models/Quiz";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function LocateItInputs({
  slide,
  onSlideUpdate,
}: {
  slide: LocateItSlide;
  onSlideUpdate: (slide: LocateItSlide) => void;
}) {
  const handleLocationChange = (type: "lat" | "lng", value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue)) return; // Ignore invalid number input
    if (type === "lat" && (numberValue < -90 || numberValue > 90)) return; // Latitude range
    if (type === "lng" && (numberValue < -180 || numberValue > 180)) return; // Longitude range

    const updatedSlide = {
      ...slide,
      location: { ...slide.location, [type]: numberValue },
    };
    onSlideUpdate(updatedSlide);
  };

  const handleSelectChange = (type: "map" | "points", value: string) => {
    if (type === "map") {
      const updatedSlide = {
        ...slide,
        mapDetails: value as mapDetails,
      };
      onSlideUpdate(updatedSlide);
    } else {
      const updatedSlide = {
        ...slide,
        awardPointsLocation: value as awardPointsLocation,
      };
      onSlideUpdate(updatedSlide);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block text-lg font-semibold">LocateIt Settings</Label>
      <div className="flex flex-col space-y-2">
        <div className="space-y-2">
          <Label>Map Details</Label>
          <Select
            value={slide.mapDetails}
            onValueChange={(value) => handleSelectChange("map", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">No details, empty map.</SelectItem>
              <SelectItem value="MEDIUM">Land borders exists</SelectItem>
              <SelectItem value="HIGH">High level of details</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Award Points</Label>
          <Select
            value={slide.awardPointsLocation}
            onValueChange={(value) => handleSelectChange("points", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLOSEST">
                Award points to the closest participant.
              </SelectItem>
              <SelectItem value="RADIUS">
                Award full points inside radius.
              </SelectItem>
              <SelectItem value="DISTANCE">
                Award 0-100% of points based on distance.
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {slide.awardPointsLocation !== "CLOSEST" && (
          <div className="flex items-center">
            <Label className="pr-2 ">Radius</Label>
            <Input
              value={slide.radius}
              onChange={(e) => {
                const numberValue = Number(e.target.value);
                const updatedSlide = {
                  ...slide,
                  radius: numberValue, // Update the correctAnswer
                };
                onSlideUpdate(updatedSlide); // Trigger the slide update
              }}
              placeholder="Enter the correct answer..."
            />
          </div>
        )}
        <div className="flex flex-row space-x-3 items-center">
          <Label className="text-sm">Latitude</Label>
          <Input
            type="number"
            value={slide.location.lat}
            onChange={(e) => handleLocationChange("lat", e.target.value)}
            placeholder="Enter latitude (-90 to 90)"
          />
          <Label className="text-sm">Longitude</Label>
          <Input
            type="number"
            value={slide.location.lng}
            onChange={(e) => handleLocationChange("lng", e.target.value)}
            placeholder="Enter longitude (-180 to 180)"
          />
        </div>
      </div>
    </div>
  );
}
