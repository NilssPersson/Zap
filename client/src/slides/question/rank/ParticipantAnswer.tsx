import { Participant, RankSlide } from '@/models/Quiz';
import RenderCorrectIncorrect from '../base/RenderCorrectIncorrect';

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: RankSlide;
  participant: Participant;
}) {
  const correctAnswer = slide.ranking;
  const latestAnswer = participant.answers?.at(-1)?.answer;

  if (latestAnswer) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center m-10 gap-2">
          {latestAnswer.map((text, index) => {
            const bgColor =
              text == correctAnswer[index] ? 'bg-green-500' : 'bg-red-500';
            return (
              <div key={index} className="flex items-center w-full space-x-4">
                <div
                  className={`flex items-center w-full p-4 rounded-lg text-4xl font-display text-white ${bgColor}`}
                >
                  <span>{text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <RenderCorrectIncorrect participant={participant} />;
  }
}
