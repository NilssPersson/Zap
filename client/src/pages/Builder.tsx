import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGames } from "@/hooks/useGames";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

function Builder() {
    const { user } = useGetAuthenticatedUser();
    const [gameName, setGameName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { resources: games, optimisticCreate, optimisticDelete } = useGames();

    const handleCreateGame = async () => {
        if (!gameName.trim() || !user) return;
        
        const { error } = await optimisticCreate({ 
            name: gameName, 
            userId: user.id 
        });

        if (error) {
            toast.error("Failed to create game");
            return;
        }

        setGameName("");
        setIsOpen(false);
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
                    <CardTitle>My Games</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button>Create Game</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        placeholder="Game name"
                                        value={gameName}
                                        onChange={(e) => setGameName(e.target.value)}
                                    />
                                    <Button onClick={handleCreateGame}>Create</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="mt-4 space-y-2">
                        {games.map((game) => (
                            <div key={game.id} className="flex items-center justify-between p-2 border rounded">
                                <span>{game.name}</span>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteGame(game.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Builder;