import { FASlide, Participant } from "@/models/Quiz";
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";
import Avatar, { genConfig } from "react-nice-avatar";
import { X, Check } from "lucide-react";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: FASlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const participantsDev = [
    {
      name: "Alice Johnson",
      participantId: "P001",
      avatar: "EROHNv5Xbi",
      hasAnswered: true,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: [""],
          time: "2024-11-26T14:25:00Z",
        },
      ],
    },
    {
      name: "Bob Smith",
      participantId: "P002",
      avatar: "1DlEEWtlZB",
      hasAnswered: false,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: [""],
          time: "2024-11-26T14:28:00Z",
        },
      ],
    },
    {
      name: "Charlie Brown",
      participantId: "P003",
      avatar: "orXBJkBsVO",
      hasAnswered: true,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: ["Option B"],
          time: "2024-11-26T14:30:00Z",
        },
      ],
    },
    {
      name: "Dana White",
      participantId: "P004",
      avatar: "EROHNv5Xbi",
      hasAnswered: true,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: ["Option D"],
          time: "2024-11-26T14:33:00Z",
        },
      ],
    },
  ];
  return (
    <div>
      <Preview slide={slide} participants={participants} />
      <div className="flex flex-col items-center m-16 gap-10">
        <h1 className="text-6xl font-display">Next up to answer:</h1>
        {participantsDev.slice(0, 3).map((participant, index) => (
          <div
            key={index}
            className="flex flex-row justify-center items-center gap-16"
          >
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                >
                  <X />
                </Button>
                <h1 className="text-1xl font-display"> Wrong answer </h1>
              </div>
            )}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] ">
              <Avatar
                style={{
                  width:
                    index === 0 ? "10rem" : index === 1 ? "5rem" : "4.5rem",
                  height:
                    index === 0 ? "10rem" : index === 1 ? "5rem" : "4.5rem",
                }}
                {...genConfig(participant.avatar ? participant.avatar : "")}
              />
              <span
                className={`${
                  index === 0
                    ? "text-5xl font-bold"
                    : index === 1
                    ? "text-2xl font-medium"
                    : "text-xl font-normal"
                } font-display`}
              >
                {participant.name}
              </span>
            </div>
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                >
                  <Check />
                </Button>
                <h1 className="text-1xl font-display"> Right answer </h1>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="absolute bottom-5 right-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
