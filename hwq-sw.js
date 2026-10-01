/* FABIWOS 현장 QC · 직원 알림 받기 전용 (hotfix569)
 *   화면을 맡지 않는다(범위 ./hwq/ — 그 아래에는 화면이 없음). 알림 서버가 보낸 현장 알림 · 답장만 받아 휴대폰 · PC 알림창에 띄운다
 *   FABIWOS 화면이 앞에 떠 있으면 알림창 대신 그 화면이 직접 큰 창 · 소리로 알린다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
const isMain = u => { try { const p = new URL(u).pathname; return /\/(index\.html)?$/.test(p); } catch (_) { return false; } };
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  const x = Object.assign({}, d.notification || {}, d.data || {}, (d.data || d.notification) ? {} : d);
  const title = x.title || '현장 QC · 현장 알림';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const open = cs.filter(c => isMain(c.url) && c.visibilityState === 'visible');
    if (open.length) { open.forEach(c => c.postMessage({ hwfpush: x })); return; }
    return self.registration.showNotification(title, { body: x.body || '', icon: 'fabiwos-qc-192.png', badge: 'fabiwos-qc-192.png', tag: x.tag || 'hwf', renotify: true, requireInteraction: true, silent: false, vibrate: [400, 120, 400, 120, 400], data: { url: x.url || new URL('../index.html?app=qc#qc', self.registration.scope).href } });
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || new URL('../index.html?app=qc#qc', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const want = /app=qc/.test(url);
    const c = cs.find(w => isMain(w.url) && (/app=qc/.test(w.url) === want)) || cs.find(w => isMain(w.url));
    if (c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
