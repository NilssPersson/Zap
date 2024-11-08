import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { useGames } from "@/hooks/useGames";
import { toast } from "sonner";
import CreateGamePopover from "@/components/games/CreateGamePopover";
import GameList from "@/components/games/GameList";

function Builder() {
    const { user } = useGetAuthenticatedUser();
    const { resources: games, optimisticCreate, optimisticDelete } = useGames();

    const handleCreateGame = async (name: string) => {
        if (!user) return;

        const { error } = await optimisticCreate({
            name,
            userId: user.id
        });

        if (error) {
            toast.error("Failed to create game");
            return;
        }

        toast.success("Game created successfully");
    };

    const handleDeleteGame = async (gameId: string) => {
        const { error } = await optimisticDelete(gameId);

        if (error) {
            toast.error("Failed to delete game");
            return;
        }

        toast.success("Game deleted successfully");
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Card className="w-full max-w-7xl">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>My Games</span>
                        <CreateGamePopover onCreateGame={handleCreateGame} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <GameList 
                        games={games}
                        onDeleteGame={handleDeleteGame}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default Builder;