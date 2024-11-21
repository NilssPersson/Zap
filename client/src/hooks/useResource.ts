import { useEffect, useState } from "react";

import { FirebaseResponse } from "@/services/base";

export function useResource<T>(firebasePromise: Promise<FirebaseResponse<T[]>>) {
    const [resources, setResources] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        firebasePromise.then(({ data, error }) => {
            setResources(data || []);
            setError(error);
            setIsLoading(false);
        });
    }, [firebasePromise]);

    return { resources, isLoading, error };
}
