export type OfflineStatus = "dev" | "booting" | "ready" | "unsupported" | "error";

export type OfflineState = {
  status: OfflineStatus;
  persisted: boolean;
};

type Listener = (state: OfflineState) => void;

let state: OfflineState = { status: "booting", persisted: false };
const listeners = new Set<Listener>();

function emit(next: OfflineState) {
  state = next;
  for (const fn of listeners) fn(state);
}

export function getOfflineState(): OfflineState {
  return state;
}

export function subscribeOffline(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function sameOriginUrls(): string[] {
  const urls = new Set<string>([location.href, location.origin + "/"]);
  for (const entry of performance.getEntriesByType("resource")) {
    const name = (entry as PerformanceResourceTiming).name;
    try {
      const url = new URL(name);
      if (url.origin === location.origin) urls.add(url.href);
    } catch {
      /* skip */
    }
  }
  return [...urls];
}

function whenLoaded(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

export async function registerOffline(): Promise<OfflineState> {
  if (typeof window === "undefined") return state;
  if (!import.meta.env.PROD) {
    emit({ status: "dev", persisted: false });
    return state;
  }
  if (!("serviceWorker" in navigator)) {
    emit({ status: "unsupported", persisted: false });
    return state;
  }

  try {
    await whenLoaded();
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;

    let persisted = false;
    try {
      persisted = (await navigator.storage?.persist?.()) ?? false;
    } catch {
      persisted = false;
    }

    const worker = reg.active ?? reg.waiting ?? reg.installing;
    worker?.postMessage({ type: "CACHE_URLS", urls: sameOriginUrls() });
    window.setTimeout(() => {
      worker?.postMessage({ type: "CACHE_URLS", urls: sameOriginUrls() });
    }, 1200);

    emit({ status: "ready", persisted });
    return state;
  } catch {
    emit({ status: "error", persisted: false });
    return state;
  }
}
