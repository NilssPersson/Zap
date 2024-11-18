import Scoreboard from "../../../pages/host/Scoreboard"; // Make sure the path is correct

export function ScoreDisplay() {
  // Generate fake participants and points


  // Use the generated fake data


  // State for tracking participants and points
  

  return (
    <div>
      {/* Passing the data as props to ScoreBoard */}
      <Scoreboard
        scoreboard={[
          { name: "Alice", points: 100, newPoints: 110 },
          { name: "Bob", points: 80, newPoints: 140 },
          { name: "Charlie", points: 70, newPoints: 75 },
          { name: "Diana", points: 60, newPoints: 90 },
          { name: "Eve", points: 50, newPoints: 55 },
        ]}
      />
    </div>
  );
}
