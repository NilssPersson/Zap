import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";

interface ScoreBoardProps {
  participants: string[];
  points: number[];
  newPoints: number[];
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
}

function ScoreBoard({
  participants,
  points,
  //newPoints,
  //setName,
  //setAvatar,
}: ScoreBoardProps) {
  const [avatars, setAvatars] = useState<object[]>([]);

  // Load avatars when participants change
  useEffect(() => {
    const initialAvatars = participants.map(() => genConfig());
    setAvatars(initialAvatars);
  }, [participants]);

  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-8">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-8">
        <h1 className="m-5 font-display text-4xl">Scoreboard</h1>
        {/* Slice the participants array to display only the first 5 */}
        {participants.slice(0, 5).map((participant, index) => (
          <div key={index} className="flex items-center space-x-4 m-3 w-full max-w-md justify-start">
            {/* Position number on the left */}
            <span className="text-white font-display text-3xl w-8">{index + 1}</span>

            {/* Avatar outside the background */}
            <Avatar style={{ width: "4rem", height: "3rem" }} {...avatars[index]} />

            {/* Participant info with background */}
            <div className="bg-[#fefefe] flex items-center justify-between font-display px-2 py-2 rounded-lg w-full">
              <span className="text-[#333333]">{participant}</span>
              <span className="text-[#333333]">{points[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScoreBoard;
