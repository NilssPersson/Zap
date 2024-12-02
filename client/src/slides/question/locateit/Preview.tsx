import { LocateItSlide, Participant } from "@/models/Quiz";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
  Libraries,
  Circle,
} from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  zoom: 2,
};

const options = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.5,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,

  zIndex: 1,
};

const libraries: Libraries = ["places"];

export function Preview({
  slide,
  participants,
  onSlideUpdate,
}: {
  slide: LocateItSlide;
  participants: Participant[];
  onSlideUpdate: (slide: LocateItSlide) => void;
}) {
  console.log("part", participants);
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [zoom, setZoom] = useState(4);
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLngLiteral>(
    slide.location,
  );
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    slide.location,
  );
  const [circleRadius, setCircleRadius] = useState<number>(slide.radius);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKEY,
    libraries,
  });

  // Initialize marker position from slide.location
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral>(slide.location);

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  // Update marker position if slide.location changes externally
  useEffect(() => {
    setMarkerPosition(slide.location);
    setCircleCenter(slide.location);
    setMapCenter(slide.location);
  }, [slide.location]);

  useEffect(() => {
    setCircleRadius(slide.radius);
  }, [slide.radius]);

  if (!isLoaded) return <div>Loading...</div>;

  const handleDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      const updatedPosition = { lat: newLat, lng: newLng };
      setMarkerPosition(updatedPosition);

      // Update the slide with the new location
      const updatedSlide: LocateItSlide = {
        ...slide,
        location: updatedPosition,
      };
      onSlideUpdate(updatedSlide);
    }
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const newPosition = { lat: newLat, lng: newLng };
        setMarkerPosition(newPosition);
        const updatedSlide: LocateItSlide = {
          ...slide,
          location: newPosition,
        };
        onSlideUpdate(updatedSlide);
        setMapCenter(newPosition);
        setZoom(14);
      }
    }
  };

  const circleRadiusChanged = () => {
    const circle = circleRef.current;
    if (!circle || !onSlideUpdate) return;

    const newRadius = circle.getRadius();
    setCircleRadius(newRadius);
    console.log("newRadius", newRadius);
    if (newRadius !== slide.radius) {
      const updatedSlide: LocateItSlide = {
        ...slide,
        radius: newRadius,
      };
      onSlideUpdate(updatedSlide);
    }
  };

  const circleCenterChanged = () => {
    const circle = circleRef.current;
    if (!circle || !onSlideUpdate) return;

    const newCenter = circle.getCenter();
    if (!newCenter) return;

    const newLat = newCenter.lat();
    const newLng = newCenter.lng();

    if (newLat !== slide.location.lat || newLng !== slide.location.lng) {
      const updatedSlide: LocateItSlide = {
        ...slide,
        location: { lat: newLat, lng: newLng },
      };
      onSlideUpdate(updatedSlide);
      setCircleCenter({ lat: newLat, lng: newLng });
    }
  };

  return (
    <div className="w-full h-full relative">
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          className="top-10 left-10 box-border border border-gray-100 w-100 h-20 pl-5 font-bold rounded-3xl shadow-md text-3xl outline-none text-black"
          type="text"
          placeholder="Search in Maps"
          style={{
            position: "absolute",
            zIndex: 10,
          }}
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
        }}
        onUnmount={() => {
          searchBoxRef.current = null;
          circleRef.current = null;
        }}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleDragEnd}
        />
        {slide.awardPointsLocation !== "CLOSEST" && (
          <Circle
            options={{ ...options, radius: circleRadius }}
            center={circleCenter}
          />
        )}
      </GoogleMap>
    </div>
  );
}
