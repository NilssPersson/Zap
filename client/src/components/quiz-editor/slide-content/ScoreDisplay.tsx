interface Score {
    playerName: string;
    score: number;
}

interface ScoreDisplayProps {
    scores?: Score[];
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
    if (!scores?.length) return null;

    return (
        <div className="space-y-6">
            {scores.map((score, index) => (
                <div key={index} className="flex justify-between items-center text-[40px]">
                    <span>{score.playerName}</span>
                    <span className="font-bold">{score.score}</span>
                </div>
            ))}
        </div>
    );
} 