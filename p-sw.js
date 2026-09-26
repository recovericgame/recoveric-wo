/* 현일텍스 공정 체크 — 앱 설치용 (FABIWOS hotfix502). 저장(캐시)은 하지 않는다: 늘 새 화면 · 새 자료를 인터넷에서 받는다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => new Response('<meta charset="utf-8"><body style="font-family:sans-serif;padding:40px;text-align:center;color:#334155">인터넷에 연결되지 않았습니다.<br>연결되면 다시 여십시오.</body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
