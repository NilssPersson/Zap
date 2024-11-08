import { gameAPI } from "@/api/games";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";
import { useEffect, useState, useCallback } from "react";
import Game from "@/models/Game";

function useGetGames() {
    const { user } = useGetAuthenticatedUser();
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGames = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error } = await gameAPI.getByUserId(user.id);
        if (!error && data) {
            setGames(data);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    const optimisticCreate = async (newGame: Partial<Game>) => {
        // Create temporary ID for optimistic update
        const tempId = `temp_${Date.now()}`;
        const optimisticGame = {
            id: tempId,
            ...newGame,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Game;

        // Add to local state immediately
        setGames(prev => [...prev, optimisticGame]);

        // Make API call
        const { data, error } = await gameAPI.create(newGame);

        if (error) {
            // Revert optimistic update on error
            setGames(prev => prev.filter(game => game.id !== tempId));
            return { data: null, error };
        }

        // Replace temporary game with real one
        setGames(prev => prev.map(game => 
            game.id === tempId ? data! : game
        ));

        return { data, error: null };
    };

    const optimisticUpdate = async (id: string, updates: Partial<Game>) => {
        // Update local state immediately
        setGames(prev => prev.map(game =>
            game.id === id ? { ...game, ...updates } : game
        ));

        // Make API call
        const { data, error } = await gameAPI.update(id, updates);

        if (error) {
            // Revert optimistic update on error
            await fetchGames(); // Refresh the list to get the correct state
            return { data: null, error };
        }

        return { data, error: null };
    };

    const optimisticDelete = async (id: string) => {
        // Remove from local state immediately
        const previousGames = [...games];
        setGames(prev => prev.filter(game => game.id !== id));

        // Make API call
        const { data, error } = await gameAPI.delete(id);

        if (error) {
            // Revert optimistic update on error
            setGames(previousGames);
            return { data: null, error };
        }

        return { data, error: null };
    };

    if (!user) return { games: [], isLoading, optimisticCreate, optimisticUpdate, optimisticDelete };

    return { games, isLoading, optimisticCreate, optimisticUpdate, optimisticDelete };
}

export { useGetGames };