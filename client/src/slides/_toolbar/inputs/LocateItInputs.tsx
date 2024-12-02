import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocateItSlide } from "@/models/Quiz";

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

  return (
    <div className="space-y-4">
      <Label className="block text-lg font-semibold">Location</Label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <Label className="pr-2 w-24 text-sm">Latitude</Label>
          <Input
            type="number"
            value={slide.location.lat}
            onChange={(e) => handleLocationChange("lat", e.target.value)}
            placeholder="Enter latitude (-90 to 90)"
          />
        </div>
        <div className="flex items-center">
          <Label className="pr-2 w-24 text-sm">Longitude</Label>
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
