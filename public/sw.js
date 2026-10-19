const CACHE_NAME = "katalog-umkm-v1";
const STATIC_ASSETS = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Hanya tangani permintaan GET dan bukan supabase
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Simpan respons ke cache untuk halaman navigasi
        if (
          response.ok &&
          event.request.mode === "navigate"
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) =>
            cached ||
            new Response("Halaman tidak tersedia secara offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
        )
      )
  );
});

