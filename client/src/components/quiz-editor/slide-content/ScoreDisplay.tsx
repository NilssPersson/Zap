import { useState } from "react";
import Scoreboard from "../../../pages/host/Scoreboard"; // Make sure the path is correct

export function ScoreDisplay() {
  // Generate fake participants and points
  const generateFakeData = () => {
    const fakeParticipants = [];
    const fakePoints = [];

    for (let i = 0; i < 5; i++) {
      fakeParticipants.push(`Player ${i + 1}`);
      fakePoints.push(Math.floor(Math.random() * 100) + 1); // Random score between 1 and 100
    }

    return {
      fakeParticipants,
      fakePoints,
    };
  };

  // Use the generated fake data
  const { fakeParticipants, fakePoints } = generateFakeData();

  // State for tracking participants and points
  const [participants] = useState(fakeParticipants);
  const [points] = useState(fakePoints);
  const [newPoints] = useState(fakePoints);

  return (
    <div>
      {/* Passing the data as props to ScoreBoard */}
      <Scoreboard
        participants={participants}
        points={points}
        newPoints={newPoints}
        setName={(name) => console.log(name)}
        setAvatar={(avatar) => console.log(avatar)}
      />
    </div>
  );
}
