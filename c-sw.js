/* 이음 (c.html) — 앱 설치 · 알림 받기 (hotfix619)
 *   화면 파일은 맡지 않고 그대로 받아 옴(옛 화면이 남지 않게). 알림 서버가 보낸 업체 글 · 현장 알림을 알림창에 띄운다
 *   이음 화면이 앞에 떠 있으면 알림창 대신 그 화면이 소리로 알린다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});   /* 앱 설치 조건 — 가로채지 않음 */
const isApp = u => { try { return /\/c\.html$/.test(new URL(u).pathname); } catch (_) { return false; } };
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  const x = Object.assign({}, d.notification || {}, d.data || {}, (d.data || d.notification) ? {} : d);
  const title = x.title || '이음 · 새 글';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const open = cs.filter(c => isApp(c.url) && c.visibilityState === 'visible');
    if (open.length) { open.forEach(c => c.postMessage({ hwcpush: x })); return; }
    return self.registration.showNotification(title, { body: x.body || '', icon: 'c-192.png', badge: 'c-badge.png', tag: x.tag || 'hwc', renotify: true, silent: false, vibrate: [300, 120, 300], data: { url: new URL('c.html', self.registration.scope).href } });
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || new URL('c.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { const c = cs.find(w => isApp(w.url)); if (c) return c.focus(); return self.clients.openWindow(url); }));
});
