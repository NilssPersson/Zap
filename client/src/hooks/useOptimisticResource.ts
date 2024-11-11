import { useState, useCallback, useEffect } from "react";
import { BaseAPI, ApiResponse } from "@/api/base";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";

interface BaseModel {
  id: string;
  created_at: string;
  user_id?: string;
}

interface UseOptimisticResourceOptions<T> {
  api: BaseAPI<T>;
  userScoped?: boolean; // Whether the resource is scoped to the user
}

export function createOptimisticResourceHook<T extends BaseModel>(options: UseOptimisticResourceOptions<T>) {
  return function useOptimisticResource() {
    const { user } = useGetAuthenticatedUser();
    const [resources, setResources] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchResources = useCallback(async () => {
      if (options.userScoped && !user) return;
      
      setIsLoading(true);
      let response: ApiResponse<T[]>;
      
      if (options.userScoped && user) {
        response = await (options.api as any).getByUserId(user.id);
      } else {
        response = await options.api.list();
      }

      const { data, error } = response;
      if (!error && data) {
        setResources(data);
      }
      setIsLoading(false);
    }, [user]);

    useEffect(() => {
      fetchResources();
    }, [fetchResources]);

    const optimisticCreate = async (newResource: Partial<T>) => {
      const tempId = `temp_${Date.now()}`;
      const optimisticResource = {
        id: tempId,
        ...newResource,
        created_at: new Date().toISOString(),
      } as T;

      setResources(prev => [...prev, optimisticResource]);

      const { data, error } = await options.api.create(newResource);

      if (error) {
        setResources(prev => prev.filter(resource => resource.id !== tempId));
        return { data: null, error };
      }

      setResources(prev => prev.map(resource => 
        resource.id === tempId ? data! : resource
      ));

      return { data, error: null };
    };

    const optimisticUpdate = async (id: string, updates: Partial<T>) => {
      setResources(prev => prev.map(resource =>
        resource.id === id ? { ...resource, ...updates } : resource
      ));

      const { data, error } = await options.api.update(id, updates);

      if (error) {
        await fetchResources();
        return { data: null, error };
      }

      return { data, error: null };
    };

    const optimisticDelete = async (id: string) => {
      const previousResources = [...resources];
      setResources(prev => prev.filter(resource => resource.id !== id));

      const { data, error } = await options.api.delete(id);

      if (error) {
        setResources(previousResources);
        return { data: null, error };
      }

      return { data, error: null };
    };

    if (options.userScoped && !user) {
      return { 
        resources: [], 
        isLoading, 
        optimisticCreate, 
        optimisticUpdate, 
        optimisticDelete 
      };
    }

    return { 
      resources, 
      isLoading, 
      optimisticCreate, 
      optimisticUpdate, 
      optimisticDelete 
    };
  };
} 