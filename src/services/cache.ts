export async function initializeCache() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registrado:', registration);
      } catch (error) {
        console.error('Error registrando Service Worker:', error);
      }
    }
  }
  
  export async function clearCache() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }