addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  let response = await cache.match(cacheKey);
  if (response) {
    return response;
  }
  // Thay YOUR_SCRIPT_URL bằng Web App URL thực tế
  const targetUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=content';
  response = await fetch(targetUrl);
  const newResp = new Response(response.body, response);
  newResp.headers.set('Cache-Control', 'public, max-age=300');
  newResp.headers.set('Access-Control-Allow-Origin', '*');
  event.waitUntil(cache.put(cacheKey, newResp.clone()));
  return newResp;
}
