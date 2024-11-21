import { userService } from "@/services/users";
import User from "@/models/User";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useCallback, useEffect, useState } from "react";

function useGetAuthenticatedUser() {
  const { user } = useKindeAuth();
  const [dbUser, setDbUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user || dbUser) return;

    const { id } = user;

    if (!id) return;

    const fetchUser = async (id: string) => {
      const { data, error } = await userService.findOrCreate(id, user.email ?? "");

      if (error) {
        console.error("Error fetching/creating user:", error);
        return;
      }

      if (data) {
        setDbUser(data);
      }
    };

    fetchUser(id);
  }, [user, dbUser]);

  const updateUser = useCallback(async (user: Partial<User>) => {
    if (!dbUser) return;
    const { data, error } = await userService.update(dbUser.id, user);
    if (error) {
      console.error("Error updating user:", error);
    }
    if (data) {
      setDbUser(data);
    }
  }, [dbUser]);

  return { user: dbUser, updateUser };
}

export default useGetAuthenticatedUser;