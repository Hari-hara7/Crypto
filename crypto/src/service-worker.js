// service-worker.js (optional for custom logic)
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
  });
  
  self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // You can add logic here to manage caching
  });
  