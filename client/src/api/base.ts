import supabase from "./client";
import { PostgrestError } from "@supabase/supabase-js";

export type ApiResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export class BaseAPI<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    return { data: data as T, error };
  }

  async create(payload: Partial<T>): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    return { data: data as T, error };
  }

  async update(id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    return { data: data as T, error };
  }

  async delete(id: string): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select()
      .single();

    return { data: data as T, error };
  }

  async list(): Promise<ApiResponse<T[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*");

    return { data: data as T[], error };
  }
} 