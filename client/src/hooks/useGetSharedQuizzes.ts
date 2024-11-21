import { quizService } from "@/services/quizzes";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";
import { useResource } from "./useResource";

export function useGetSharedQuizzes() {
    const { user } = useGetAuthenticatedUser();
    return useResource(quizService.listShared(user?.id || ""));
}
