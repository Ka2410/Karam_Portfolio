const CACHE_NAME = "karam-portfolio-v38";
const PORTFOLIO_FILES = [
  "./",
  "./index.html",
  "./about.html",
  "./services.html",
  "./strengths.html",
  "./contact.html",
  "./project-01.html",
  "./project-02.html",
  "./project-03.html",
  "./styles.css",
  "./site.js",
  "./site.webmanifest",
  "./assets/portfolio-app-icon.svg",
  "./assets/about-portrait.png",
  "./assets/hero-cutout.png",
  "./assets/megawrat-logo-mark.png",
  "./assets/megawrat-mascot.webm",
  "./assets/megawrat-mascot.webp",
  "./assets/megawrat-mascot-poster.webp",
];
const REMOTE_IMAGES = [
  "https://images.unsplash.com/photo-1624298696100-a6aae4884881?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1637044527986-1727785b1fd6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=85",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PORTFOLIO_FILES);
    await Promise.all(REMOTE_IMAGES.map(async (url) => {
      try {
        const request = new Request(url, { mode: "no-cors", cache: "reload" });
        const response = await fetch(request);
        if (response.ok || response.type === "opaque") await cache.put(request, response);
      } catch {
        // A remote image failure should not prevent local portfolio pages from being cached.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("karam-portfolio-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const cachedImageOrigin = url.origin === "https://images.unsplash.com" && request.destination === "image";
  if (!sameOrigin && !cachedImageOrigin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreVary: cachedImageOrigin });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok || response.type === "opaque") {
        event.waitUntil(cache.put(request, response.clone()));
      }
      return response;
    } catch (error) {
      if (request.mode === "navigate") {
        return (await cache.match(new URL("./index.html", self.registration.scope).href))
          || new Response("This page is not saved on this device yet.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
      throw error;
    }
  })());
});
