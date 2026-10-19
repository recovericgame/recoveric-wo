/* 편직팀 시험판(k_demo.html) 전용 — 휴대폰에 앱으로 설치되게 하는 최소 서비스 워커 (2026-10-19)
 *   scope ./k_demo : 진짜 편직팀 앱(k-sw.js · scope ./k)이 /k_demo.html 까지 덮지 않도록 더 좁은 자기 범위
 *   네트워크 우선 · 끊겼을 때만 마지막으로 받은 시험판 화면 · 알림/푸시 없음 · 같은 주소의 시험 앱 파일만 담음 */
const CACHE = 'k-demo-v1';
const MINE = /\/(k_demo\.html|k-demo-[^/]+)$/;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('k-demo-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const keep = MINE.test(u.pathname);
  e.respondWith(fetch(e.request).then(r => {
    if (keep && r && r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(u.pathname, c)).catch(() => {}); }
    return r;
  }).catch(() => caches.match(u.pathname).then(r => r || new Response('<meta charset="utf-8"><body style="font-family:sans-serif;padding:40px;text-align:center;color:#334155">인터넷에 연결되지 않았습니다.<br>연결되면 다시 여십시오.</body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))));
});
