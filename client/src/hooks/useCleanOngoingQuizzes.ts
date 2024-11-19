import { ongoingQuizzesService } from "@/services/ongoingQuizzes";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";
import { toast } from "sonner";
import { useEffect } from "react";

function useCleanOngoingQuizzes() {
    const { user } = useGetAuthenticatedUser();

    

    useEffect(() => {
        if (!user) return;
        const clean = async () => {
            if (!user) return;
            const toBeCleaned = await ongoingQuizzesService.clean(user.id);
    
            console.log(toBeCleaned);
            toast.success("Ongoing quizzes cleaned successfully");
        }
        clean();
    }, [user]);
}

export default useCleanOngoingQuizzes;