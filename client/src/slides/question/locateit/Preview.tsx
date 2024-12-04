import { LocateItSlide } from "@/models/Quiz";
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

const libraries: Libraries = ["places"];

const circleStyle = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.5,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  zIndex: 1,
  editable: false,
};

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: LocateItSlide;
  onSlideUpdate: (slide: LocateItSlide) => void;
}) {
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [zoom, setZoom] = useState(4);
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLngLiteral>();
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    slide.location,
  );
  const [circleRadius, setCircleRadius] = useState<number>(slide.radius);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKEY,
    libraries,
  });
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);

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

  useEffect(() => {
    if (currentSlideId !== slide.id) {
      setCurrentSlideId(slide.id);
    }
  }, [slide.id, currentSlideId]);

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

  const handleCircleRadiusChange = () => {
    const circle = circleRef.current;
    if (!circle || !onSlideUpdate || slide.id !== currentSlideId) return;
    const newRadius = Math.floor(circle.getRadius());

    if (newRadius === slide.radius) return;

    setCircleRadius(newRadius);
    const updatedSlide: LocateItSlide = {
      ...slide,
      radius: newRadius,
    };
    onSlideUpdate(updatedSlide);
  };

  const handleCircleCenterChange = () => {
    const newCenter = circleRef.current?.getCenter();
    if (!newCenter || !onSlideUpdate || !circleCenter) return;

    const newLat = newCenter.lat();
    const newLng = newCenter.lng();

    const newPosition = { lat: newLat, lng: newLng };

    if (
      newPosition.lat === circleCenter.lat &&
      newPosition.lng === circleCenter.lng
    )
      return;

    setCircleCenter(markerPosition);
    circleRef.current?.setCenter(markerPosition);
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
          onDrag={(event) => {
            if (event.latLng) {
              const newLat = event.latLng.lat();
              const newLng = event.latLng.lng();
              const newPosition = { lat: newLat, lng: newLng };
              setCircleCenter(newPosition);
            }
          }}
        />
        {slide.awardPointsLocation !== "CLOSEST" && (
          <Circle
            onCenterChanged={handleCircleCenterChange}
            onRadiusChanged={handleCircleRadiusChange}
            onLoad={(circle) => (circleRef.current = circle)}
            options={{ ...circleStyle, radius: circleRadius }}
            center={circleCenter}
          />
        )}
      </GoogleMap>
    </div>
  );
}
