const CACHE_NAME = "app-cache-v703";
const ASSETS_TO_CACHE = [
  "/",
  "/globals.css",
  "/app.js",
  "/logo.png",
  "/icons/android-icon-192x192.png",
  "/icons/apple-icon-144x144.png",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installé");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Mise en cache des fichiers...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((error) => {
      console.error("Erreur lors de la mise en cache :", error);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activé");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    }).catch((error) => {
      console.error("Erreur lors de la suppression des anciens caches :", error);
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        }).catch((error) => {
          console.error("Erreur lors de la récupération de la ressource :", error);
        });
      })
    );
  } else if (event.request.method === "POST") {
    event.respondWith(
      fetch(event.request.clone()).catch(() => {
        return savePostRequest(event.request);
      })
    );
  }
});

async function savePostRequest(request) {
  try {
    const body = await request.clone().json();
    await idbKeyval.set("post-requests", body);
    console.log("Requête POST sauvegardée en IndexedDB");
    return new Response(JSON.stringify({ message: "Données sauvegardées en local" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la requête POST :", error);
    return new Response(JSON.stringify({ message: "Échec de la sauvegarde locale" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-post-requests") {
    event.waitUntil(
      idbKeyval.get("post-requests").then(async (body) => {
        if (!body) return;

        try {
          const response = await fetch("/api/endpoint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            console.log("Requête POST envoyée après reconnexion");
            await idbKeyval.del("post-requests");
          }
        } catch (error) {
          console.error("Erreur lors de la réessai de la requête POST :", error);
        }
      })
    );
  }
});
