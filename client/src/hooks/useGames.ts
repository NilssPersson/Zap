import { gameAPI } from "@/api/games";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import Game from "@/models/Game";

const useGames = createOptimisticResourceHook<Game>({
  api: gameAPI,
  userScoped: true
});

export { useGames };