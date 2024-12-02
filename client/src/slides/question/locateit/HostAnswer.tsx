import { LocateItSlide, Participant } from "@/models/Quiz";
import {
  GoogleMap,
  Libraries,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function HostAnswer({
  slide,
  participants = [],
}: {
  slide: LocateItSlide;
  participants: Participant[];
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  /*const latestAnswers = participants.map((participant) => {
    const latestAnswer =
      participant.answers.length > 0
        ? participant.answers[participant.answers.length - 1].answer
        : "??";

    return {
      name: participant.name,
      avatar: participant.avatar,
      id: participant.participantId,
      lat: Number(latestAnswer[0]),
      lng: Number(latestAnswer[1]),
    };
  });*/

  const latestAnswers = [
    {
      name: "Participant",
      avatar: "HjefhA",
      id: "1",
      lat: 0,
      lng: 0,
    },
    {
      name: "P2",
      avatar: "LKFJJSD",
      id: "2",
      lat: 10,
      lng: 10,
    },
  ];

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-dvh w-dvw p-20">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={slide.location}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
        }}
        zoom={4}
      >
        <Marker position={slide.location} />
        {latestAnswers.map((participant, index) => (
          <div key={index}>
            <Marker position={{ lat: participant.lat, lng: participant.lng }} />
          </div>
        ))}
      </GoogleMap>
    </div>
  );
}
