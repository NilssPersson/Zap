import { userService } from "@/services/users";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import User from "@/models/User";

const useUsers = createOptimisticResourceHook<User>({
  api: userService,
});

export { useUsers };