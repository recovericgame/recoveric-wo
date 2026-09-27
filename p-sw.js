/* 현일텍스 공정 체크 — 앱 설치용 (FABIWOS hotfix502 · 509 알림 누르기). 저장(캐시)은 하지 않는다: 늘 새 화면 · 새 자료를 인터넷에서 받는다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => new Response('<meta charset="utf-8"><body style="font-family:sans-serif;padding:40px;text-align:center;color:#334155">인터넷에 연결되지 않았습니다.<br>연결되면 다시 여십시오.</body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
/* hotfix509: 휴대폰 알림창의 새 소식을 누르면 열려 있는 공정 체크 화면으로 (없으면 새로 열기) */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const k = (e.notification.data && e.notification.data.k) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (/\/p(\.html)?([?#]|$)/.test(c.url)) return c.focus(); }
    return self.clients.openWindow('p.html' + (k ? '#k=' + encodeURIComponent(k) : ''));
  }));
});
