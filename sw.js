/* Service worker — Compta SCI
   Met en cache l'app et ses librairies pour l'installation et l'usage hors-ligne.
   Les appels à l'API Anthropic ne sont JAMAIS mis en cache. */

const CACHE = "compta-sci-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Ne jamais intercepter l'API Anthropic.
  if (url.hostname.endsWith("anthropic.com")) return;

  // Librairies CDN : cache d'abord, puis réseau (et on met en cache au passage).
  const isCDN = /unpkg\.com|cdn\.sheetjs\.com|jsdelivr\.net/.test(url.hostname);
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then((hit) =>
        hit ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        }).catch(() => hit)
      )
    );
    return;
  }

  // App locale : cache d'abord, repli réseau.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((hit) =>
        hit ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
      )
    );
  }
});
