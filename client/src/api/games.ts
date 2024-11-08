import { ApiResponse, BaseAPI } from "./base";
import Game from "@/models/Game";
class GameAPI extends BaseAPI<Game> {
  constructor() {
    super("Game");
  }

  // Add game-specific methods here
  async getByUserId(userId: string): Promise<ApiResponse<Game[]>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("userId", userId);

    return { data: data as Game[], error };
  }
}

export const gameAPI = new GameAPI(); 