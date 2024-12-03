import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";

export default function Results({ participants }: { participants: Participant[] }) {
  const participantsWithTotal = participants.map(participant => ({
    ...participant,
    total: participant.score.reduce((acc, curr) => acc + curr, 0),
  })).sort((a, b) => b.total - a.total);

  const hasMoreThanThree = participantsWithTotal.length > 3;

  return (
    <div className="flex-1 flex flex-col">
        {/* Podium Section */}
        <div className="flex-1 flex items-end justify-center gap-4 w-full">
          {/* Second Place - Only show if there are at least 2 participants */}
          {participantsWithTotal.length >= 2 && (
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16" {...genConfig(participantsWithTotal[1].name)} />
              <span className="font-semibold">{participantsWithTotal[1].name}</span>
              <span className="text-sm text-gray-600">{participantsWithTotal[1].total} pts</span>
              <div className="w-24 bg-silver h-32 rounded-t-lg flex items-center justify-center text-2xl font-bold">
                2
              </div>
            </div>
          )}

          {/* First Place - Always show if there's at least one participant */}
          {participantsWithTotal.length >= 1 && (
            <div className="flex flex-col items-center">
              <Avatar className="w-20 h-20" {...genConfig(participantsWithTotal[0].name)} />
              <span className="font-bold text-lg">{participantsWithTotal[0].name}</span>
              <span className="text-sm text-gray-600">{participantsWithTotal[0].total} pts</span>
              <div className="w-24 bg-gold h-40 rounded-t-lg flex items-center justify-center text-3xl font-bold">
                1
              </div>
            </div>
          )}

          {/* Third Place - Only show if there are at least 3 participants */}
          {participantsWithTotal.length >= 3 && (
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16" {...genConfig(participantsWithTotal[2].name)} />
              <span className="font-semibold">{participantsWithTotal[2].name}</span>
              <span className="text-sm text-gray-600">{participantsWithTotal[2].total} pts</span>
              <div className="w-24 bg-bronze h-24 rounded-t-lg flex items-center justify-center text-2xl font-bold">
                3
              </div>
            </div>
          )}
        </div>

      {/* Rest of Participants List - Only show if more than 3 participants */}
      {hasMoreThanThree && (
        <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto max-h-80 border rounded-lg">
            {participantsWithTotal.slice(3).map((participant, index) => (
              <div
                key={participant.name}
                className="flex items-center gap-4 p-3 border-b last:border-b-0"
              >
                <span className="font-semibold w-8">{index + 4}.</span>
                <Avatar className="w-10 h-10" {...genConfig(participant.name)} />
                <span className="flex-grow">{participant.name}</span>
                <span className="font-semibold">{participant.total} pts</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
