import { FASlide, Participant } from "@/models/Quiz";
import { Button } from "@/components/ui/button";

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
}: {
  slide: FASlide;
  onNextSlide: () => void;
  participants: Participant[];
}) {
  const latestAnswers =
    participants.length > 0
      ? participants.map((participant) => {
          return participant.answers[participant.answers.length - 1];
        })
      : [];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10">
        <h1 className="text-4xl text-black font-display">{slide.title}</h1>
      </div>

      <div className="flex flex-row space-x-2 ">
        {latestAnswers.map((answer) => {
          return (
            <div className="bg-white rounded p-2 flex flex-row">
              <h1 className="text-xl text-black font-display">
                {answer.answer}
              </h1>
            </div>
          );
        })}
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
