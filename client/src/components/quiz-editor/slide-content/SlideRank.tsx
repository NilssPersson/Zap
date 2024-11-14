import { useState, useEffect } from "react";

// Define a type for the ranking items
type RankItem = {
  name: string;
  score: number;
};

// Main SlideRank component
export function SlideRank({ ranking }: { ranking: RankItem[] }) {
  const [currentRanking, setCurrentRanking] = useState<RankItem[]>(ranking);

  // Randomize the ranking on the first render
  useEffect(() => {
    const randomizedRanking = [...ranking];
    setCurrentRanking(randomizedRanking); // Update state with randomized ranking
  }, [ranking]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-wrap justify-center w-full max-w-xl">
        {/* Display ranking names horizontally */}
        {currentRanking.map((rank, index) => (
          <div
            key={index}
            className="m-3 p-5 text-5xl font-bold text-center rounded-lg shadow-md"
            style={{
              width: "calc(25% - 12px)", // Adjust item width with some space for margin
            }}
          >
            {rank.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideRank;
