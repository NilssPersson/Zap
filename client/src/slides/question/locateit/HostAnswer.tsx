import { cn } from "@/lib/utils";
import { LocateItSlide, Participant } from "@/models/Quiz";
import {
  GoogleMap,
  Libraries,
  useJsApiLoader,
  Marker,
  OverlayView,
  Polyline,
  Circle,
} from "@react-google-maps/api";
import React from "react";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";

const libraries: Libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const circleStyle = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.5,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  zIndex: 1,
};

const mockData: Participant[] = [
  {
    participantId: "DsMCalNtbSK8vCnEpnT59",
    name: "Nisse",
    avatar: "EROHNv5Xbi",
    answers: [
      {
        answer: ["0", "0"],
        slideNumber: 0,
        time: "2024-12-02T17:28:30.902Z",
      },
    ],
    score: [0],
    hasAnswered: true,
  },
  {
    participantId: "LKFJJSD",
    name: "LångtNamnYaoo",
    avatar: "LKFJJSDEROHNv5Xbi",
    answers: [
      {
        answer: ["10", "10"],
        slideNumber: 2,
        time: "2024-12-02T17:30:00.000Z",
      },
    ],
    score: [2000],
    hasAnswered: false,
  },
];

export function HostAnswer({
  slide,
  participants = mockData,
}: {
  slide: LocateItSlide;
  participants: Participant[];
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const latestAnswers = participants.map((participant) => {
    const latestAnswer =
      participant.answers.length > 0
        ? participant.answers[participant.answers.length - 1].answer
        : "??";
    const latestScore =
      participant.score.length > 0
        ? participant.score[participant.score.length - 1]
        : 0;
    return {
      name: participant.name,
      avatar: participant.avatar,
      id: participant.participantId,
      lat: Number(latestAnswer[0]),
      lng: Number(latestAnswer[1]),
      score: latestScore,
    };
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-dvh w-full p-20">
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
        {slide.awardPointsLocation === "RADIUS" && (
          <Circle
            onUnmount={() => {
              console.log("unmount");
            }}
            center={{ lat: slide.location.lat, lng: slide.location.lng }}
            options={{ ...circleStyle, radius: slide.radius }}
          />
        )}
        {latestAnswers.map((participant) => {
          return (
            <React.Fragment key={participant.id}>
              <Marker
                position={{ lat: participant.lat, lng: participant.lng }}
              />
              <Polyline
                path={[
                  { lat: slide.location.lat, lng: slide.location.lng },
                  { lat: participant.lat, lng: participant.lng },
                ]}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
              />
              <OverlayView
                position={{ lat: participant.lat, lng: participant.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  className={cn(
                    "bg-white w-fit p-[5px] rounded flex items-center shadow-[0_2px_6px_rgba(0,0,0,0.3)] -mt-[38px] -translate-x-1/2 -translate-y-full",
                    participant.score !== 0 ? "bg-green-400" : "bg-red-400",
                  )}
                >
                  <ReactNiceAvatar
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    {...genConfig(participant.avatar)}
                  />
                  <div className="flex flex-row items-center">
                    <span className="font-display text-black text-xl">
                      {participant.name}
                    </span>
                    {slide.awardPointsLocation === "DISTANCE" && (
                      <>
                        <span className="font-display text-black text-xl">
                          :
                        </span>
                        <span className="font-display text-black text-xl ml-2">
                          {participant.score}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </OverlayView>
            </React.Fragment>
          );
        })}
      </GoogleMap>
    </div>
  );
}
