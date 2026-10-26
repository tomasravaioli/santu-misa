/* Santu Misa — cache the whole missal on first visit so it runs with no network. */
const CACHE = "santu-misa-v4";

const APP_MANIFEST = {
  name: "Santu Misa",
  short_name: "Santu Misa",
  id: "/",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#f3e3af",
  theme_color: "#f3e3af",
  icons: [
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
  ],
};

const PRECACHE = [
  "/",
  "/favicon.svg",
  "/og.jpg",
  "/splash.jpg",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png",
];
/* PRECACHE_END */

const SKIP = [/^\/sw\.js$/, /^\/api\//, /\.docx$/i];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            const res = await fetch(url, { credentials: "same-origin" });
            if (res.ok) await cache.put(url, res);
          } catch {
            /* first visit may not have every static file */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

function sameOriginGet(request) {
  if (request.method !== "GET") return false;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return false;
  }
  if (url.origin !== self.location.origin) return false;
  return !SKIP.some((re) => re.test(url.pathname));
}

async function fromNetwork(request, cache) {
  const fresh = await fetch(request);
  if (fresh && fresh.ok && fresh.type !== "opaque") {
    try {
      await cache.put(request, fresh.clone());
    } catch {
      /* quota / unsupported request */
    }
  }
  return fresh;
}

self.addEventListener("fetch", (event) => {
  if (!sameOriginGet(event.request)) return;
  let path = "";
  try {
    path = new URL(event.request.url).pathname;
  } catch {
    path = "";
  }
  if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") {
    event.respondWith(
      new Response(JSON.stringify(APP_MANIFEST), {
        headers: {
          "content-type": "application/manifest+json; charset=utf-8",
          "cache-control": "no-cache",
        },
      }),
    );
    return;
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request, {
        ignoreSearch: event.request.mode === "navigate",
      });

      if (event.request.mode === "navigate") {
        try {
          return await fromNetwork(event.request, cache);
        } catch {
          if (cached) return cached;
          const home = await cache.match("/");
          if (home) return home;
          throw new Error("offline");
        }
      }

      if (cached) {
        event.waitUntil(fromNetwork(event.request, cache).catch(() => null));
        return cached;
      }

      try {
        return await fromNetwork(event.request, cache);
      } catch (err) {
        throw err;
      }
    })(),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "CACHE_URLS" || !Array.isArray(data.urls)) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const seen = new Set();
      await Promise.all(
        data.urls.map(async (raw) => {
          if (typeof raw !== "string" || seen.has(raw)) return;
          seen.add(raw);
          let url;
          try {
            url = new URL(raw, self.location.origin);
          } catch {
            return;
          }
          if (url.origin !== self.location.origin) return;
          if (SKIP.some((re) => re.test(url.pathname))) return;
          try {
            const res = await fetch(url.href, { credentials: "same-origin" });
            if (res.ok) await cache.put(url.href, res);
          } catch {
            /* ignore missing */
          }
        }),
      );
    })(),
  );
});
