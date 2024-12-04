import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { LocateItSlide } from "@/models/Quiz";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import { NONE, MEDIUM, HIGH } from "./MapStyle";

const containerStyle = {
  width: "100%",
  height: "100%",
};

type location = {
  lat: number;
  lng: number;
};

interface LocateItProps {
  slide: LocateItSlide;
  answerQuestion: (answer: string[]) => void;
}

const libraries: Libraries = ["places"];

export function Participant({ slide, answerQuestion }: LocateItProps) {
  const [markerPosition, setMarkerPosition] = useState<location>({
    lat: 0,
    lng: 0,
  });
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKEY,
    libraries,
  });
  const [mapDetails, setMapDetails] = useState<google.maps.MapTypeStyle[]>();

  const handleDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      const updatedPosition = { lat: newLat, lng: newLng };
      setMarkerPosition(updatedPosition);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      clickTimeoutRef.current = setTimeout(() => {
        const newLat = event.latLng!.lat();
        const newLng = event.latLng!.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });
      }, 10);
    }
  };

  const handleDragStart = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (slide.mapDetails === "NONE") {
      setMapDetails(NONE);
    } else if (slide.mapDetails === "MEDIUM") {
      setMapDetails(MEDIUM);
    } else if (slide.mapDetails === "HIGH") {
      setMapDetails(HIGH);
    }
  }, [slide.mapDetails]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={3}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: mapDetails,
        }}
        onClick={handleMapClick}
        onDragStart={handleDragStart}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleDragEnd}
        />
        <div className="absolute flex bottom-20 w-full justify-center">
          <Button
            onClick={() =>
              answerQuestion([
                markerPosition.lat.toString(),
                markerPosition.lng.toString(),
              ])
            }
            className="w-fit text-xl"
          >
            Svara
          </Button>
        </div>
      </GoogleMap>
    </div>
  );
}
