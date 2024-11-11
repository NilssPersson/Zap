import { userAPI } from "@/api/users";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import User from "@/models/User";

const useUsers = createOptimisticResourceHook<User>({
  api: userAPI,
  userScoped: false // Users aren't scoped to a specific user
});

export { useUsers }; 