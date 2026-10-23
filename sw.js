/* The Daily Purr service worker: opens instantly and works with no signal.
   When you change any file, bump VERSION so phones pick up the new copy. */
const VERSION = 'dp-v4';
const FILES = ['./', './index.html', './styles.css', './facts.js', './facts-more.js', './complaints.js', './extras.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/apple-touch-icon.png',
  './cats/angus.jpg', './cats/angus-2.jpg', './cats/leo.jpg', './cats/leo-scared.jpg', './cats/ollie.jpg', './cats/ollie-teeth.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  if (/-meow\.m4a$/.test(url.pathname)) return; // optional recordings: always check the network
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, { ignoreSearch: url.origin === location.origin });
    const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (req.mode === 'navigate' ? c.match('./index.html') : Response.error());
  }));
});
