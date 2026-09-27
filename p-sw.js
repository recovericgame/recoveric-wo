/* 현일텍스 공정 체크 — 앱 설치용 (HIWOS hotfix499) · hotfix518: 앱을 꺼 둬도 알림(웹 푸시) · hotfix521: 소리 + 진동
 *   저장(캐시)은 하지 않는다: 늘 새 화면 · 새 자료를 인터넷에서 받는다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => new Response('<meta charset="utf-8"><body style="font-family:sans-serif;padding:40px;text-align:center;color:#334155">인터넷에 연결되지 않았습니다.<br>연결되면 다시 여십시오.</body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
/* hotfix518: 현일텍스 서버(Cloud Functions)가 보낸 알림 — 앱 화면이 보이고 있으면 화면에 소리만 넘기고, 아니면 휴대폰 알림창에 띄운다 */
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  const x = Object.assign({}, d.notification || {}, d.data || {}, (d.data || d.notification) ? {} : d);
  const title = x.title || 'FABIWOS · 새 소식';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const open = cs.filter(c => { try { return /\/p(\.html)?$/.test(new URL(c.url).pathname) && c.visibilityState === 'visible'; } catch (_) { return false; } });
    if (open.length) { open.forEach(c => c.postMessage({ hwpush: x })); return; }
    return self.registration.showNotification(title, { body: x.body || '', icon: 'p-icon-192.png', badge: 'p-icon-192.png', tag: x.tag || 'hwp-news', renotify: true, silent: false, vibrate: [300, 120, 300, 120, 300], data: { url: x.url || new URL('p.html?app=1', self.registration.scope).href } });
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || new URL('p.html?app=1', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(w => { try { return /\/p(\.html)?$/.test(new URL(w.url).pathname); } catch (_) { return false; } });
    if (c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
