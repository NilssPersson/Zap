import { useEffect, useState } from "react";

import { FirebaseResponse } from "@/services/base";

interface UseResourceOptions<T> {
  firebasePromise: Promise<FirebaseResponse<T[]>>;
}

export function createResourceHook<T>(options: UseResourceOptions<T>) {
  return function useResource() {
    const [resources, setResources] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setIsLoading(true);
      options.firebasePromise.then(({ data, error }) => {
        setResources(data || []);
        setError(error);
        setIsLoading(false);
      });
    }, []);

    return { resources, isLoading, error };
  };
}
