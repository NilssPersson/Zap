import { Participant } from "@/models/Quiz";
import { Check, X } from "lucide-react";

export default function ParticipantCorrect({
  participant,
}: {
  participant: Participant;
}) {
  // Calculate answer streak and reverse score
  let answerStreak = 0;
  const score = [...participant.score].reverse();

  for (const s of score) {
    if (s === 0) break;
    answerStreak += 1;
  }

  // Latest question was answered wrong.
  if (score[0] === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-500">
        <h1 className="text-3xl font-display text-center">Wrong!</h1>
        <X width={70} height={70} />
        <p className="text-lg mt-0 font-display">Lost Answer Streak</p>
        <div className="bg-[#F4F3F2] w-[60%] text-black font-display rounded p-2 text-center mt-4">
          <h2>Maybe think a little longer next time?</h2>
        </div>
      </div>
    );
  }

  // Latest question was answered correctly
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-500">
      <h1 className="text-3xl font-display text-center">Correct!</h1>
      <Check width={70} height={70} />
      <p className="text-lg mt-0 font-display">Answer Streak: {answerStreak}</p>
      <div className="bg-[#F4F3F2] w-[60%] text-black font-display rounded p-2 text-center mt-4">
        <h2>+ {score[0]}</h2>
      </div>
    </div>
  );
}
