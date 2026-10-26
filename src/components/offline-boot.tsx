import { useEffect, useSyncExternalStore } from "react";
import {
  getOfflineState,
  registerOffline,
  subscribeOffline,
  type OfflineState,
} from "@/lib/offline";

export function OfflineBoot() {
  useEffect(() => {
    void registerOffline();
  }, []);
  return null;
}

export function useOfflineState(): OfflineState {
  return useSyncExternalStore(
    (onStoreChange) => subscribeOffline(() => onStoreChange()),
    getOfflineState,
    getOfflineState,
  );
}
