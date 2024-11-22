import { database } from "@/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect } from "react";

export function usePathOnValue<T>(
  path?: string,
  callback?: (value: Record<string, T>) => void
) {
  useEffect(() => {
    if (!path) return;
    const pathRef = ref(database, path);

    const extractValue = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) return;
      callback?.(snapshot.val() as Record<string, T>);
    };

    onValue(pathRef, extractValue);

    return () => {
      off(pathRef, "value", extractValue);
    };
  }, [path, callback]);
}
