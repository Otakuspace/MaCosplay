const CACHE_NAME = 'macosplay-cache-v1';
const STATIC_CACHE_NAME = 'macosplay-static-v1';
const IMAGE_CACHE_NAME = 'macosplay-images-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/favicon.png'
];

// Helper function to check if URL is cacheable
function isCacheableUrl(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle different types of requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static file requests
  if (url.origin === location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle external requests (like PocketBase images)
  if (url.hostname.includes('file.macosplay.com') || 
      url.hostname.includes('pocketbase')) {
    event.respondWith(handleImageRequest(request));
    return;
  }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    // Check cache first
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Image served from cache:', request.url);
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response and cache it
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(IMAGE_CACHE_NAME);
      await cache.put(request, responseToCache);
      console.log('Image cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error handling image request:', error);
    
    // Return fallback image if available
    const fallbackResponse = await caches.match('/images/placeholder.png');
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    // Return a simple error response
    return new Response('Image not available', { status: 404 });
  }
}

// Handle static file requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Check cache first
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response and cache it
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error handling static request:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Resource not available', { status: 404 });
  }
}
