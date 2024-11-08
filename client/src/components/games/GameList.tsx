import { Button } from "@/components/ui/button";
import Game from "@/models/Game"

interface GameListProps {
    games: Game[];
    onDeleteGame: (gameId: string) => Promise<void>;
}

function GameList({ games, onDeleteGame }: GameListProps) {
    return (
        <div className="mt-4 space-y-2">
            {games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{game.name}</span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteGame(game.id)}
                    >
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default GameList; 