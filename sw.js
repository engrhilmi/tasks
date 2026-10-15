// Offline support: app files are served network-first (so updates show up), with a cached copy when offline.
const CACHE = 'mts-v11';
const SHELL = ['./', './index.html', './firebase-config.js', './manifest.webmanifest', './icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isLib = /(^|\.)gstatic\.com$|cdnjs\.cloudflare\.com$|cdn\.jsdelivr\.net$|fonts\.googleapis\.com$/.test(url.hostname);
  const isOwn = url.origin === self.location.origin;
  if (!isOwn && !isLib) return; // never touch Firebase API traffic
  if (isLib) { // libraries: cache first
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
    return;
  }
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
    .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
