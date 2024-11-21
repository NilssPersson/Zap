import { useState, useCallback, useEffect } from "react";
import { BaseService, FirebaseResponse } from "@/services/base";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";

interface BaseModel {
  id: string;
  user_id?: string;
}

interface UseOptimisticResourceOptions<T> {
  api: BaseService<T>;
  userScoped?: boolean; // Whether the resource is scoped to the user
}

export type OptimisticResponse<T> = Promise<{
  data: null;
  error: Error;
} | {
  data: T | null;
  error: null;
}>

export type OptimisticCreate<T> = (newResource: Partial<T>) => OptimisticResponse<T>

export type OptimisticUpdate<T> = (id: string, updates: Partial<T>) => OptimisticResponse<T>

export type OptimisticDelete = (id: string) => OptimisticResponse<void>

interface UserScopedService<T> extends BaseService<T> {
  getByUserId: (userId: string) => Promise<FirebaseResponse<T[]>>;
}

export function createOptimisticResourceHook<T extends BaseModel>(options: UseOptimisticResourceOptions<T>) {
  return function useOptimisticResource() {
    const { user } = useGetAuthenticatedUser();
    const [resources, setResources] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchResources = useCallback(() => {
      if (options.userScoped && !user) return;
      
      setIsLoading(true);
      
      const promise = options.userScoped && user
        ? (options.api as UserScopedService<T>).getByUserId(user.id)
        : options.api.list();

      return promise
        .then(response => {
          const { data, error } = response;
          if (!error && data) {
            setResources(data);
          }
          return response;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [user]);

    useEffect(() => {
      fetchResources();
    }, [fetchResources]);

    const optimisticCreate = useCallback(async (newResource: Partial<T>) => {
      const tempId = `temp_${Date.now()}`;
      const optimisticResource = {
        id: tempId,
        ...newResource,
      } as T;

      setResources(prev => [optimisticResource, ...prev]);

      const { data, error } = await options.api.create(newResource);

      if (error) {
        setResources(prev => prev.filter(resource => resource.id !== tempId));
        return { data: null, error };
      }

      setResources(prev => prev.map(resource => 
        resource.id === tempId ? data! : resource
      ));

      return { data, error: null };
    }, []);

    const optimisticUpdate = useCallback(async (id: string, updates: Partial<T>) => {
      setResources(prev => prev.map(resource =>
        resource.id === id ? { ...resource, ...updates } : resource
      ));

      const { data, error } = await options.api.update(id, updates);

      if (error) {
        await fetchResources();
        return { data: null, error };
      }

      return { data, error: null };
    }, [fetchResources]);

    const optimisticDelete = useCallback(async (id: string) => {
      const previousResources = [...resources];
      setResources(prev => prev.filter(resource => resource.id !== id));

      const { data, error } = await options.api.delete(id);

      if (error) {
        setResources(previousResources);
        return { data: null, error };
      }

      return { data, error: null };
    }, [resources]);

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