/* ============================================================
   shared.js — 全站共用 JavaScript
   簡實制所 Lessary Studio
   ============================================================ */

/* ── Scroll Reveal ── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Portfolio Toggle (用於 service-brand / service-web / service-line) ── */
function togglePort(gridId, btnId) {
  const grid  = document.getElementById(gridId);
  const btn   = document.getElementById(btnId);
  if (!grid || !btn) return;
  const isOpen = grid.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.innerHTML = isOpen
    ? '收起作品 <span class="arrow">↓</span>'
    : '查看更多作品 <span class="arrow">↓</span>';
}

/* ── 漢堡選單（下拉式，對應參考版 nav 結構） ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  /* 開 / 關 nav-links */
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* 右側 toggle 按鈕展開子選單（不攔截左邊連結） */
  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const parent = btn.closest('.has-sub');
      const sub    = parent.querySelector('.nav-sub');
      const isOpen = parent.classList.toggle('is-open');
      if (sub) sub.classList.toggle('is-open', isOpen);
    });
  });

  /* 桌機版 has-sub — 點擊也可切換，但不阻止連結跳頁 */
  document.querySelectorAll('.nav-links li.has-sub > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) return;
      /* 不 preventDefault，讓連結正常跳到 services.html */
    });
  });

  /* 點選單外部關閉桌機子選單 */
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) return;
    if (!e.target.closest('.nav-links li.has-sub')) {
      document.querySelectorAll('.nav-links li.has-sub.is-open').forEach(function (el) {
        el.classList.remove('is-open');
      });
    }
  });

  /* 點選單外部關閉 */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ESC 關閉 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* 視窗放大時關閉並重置子選單 */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.has-sub').forEach(function (el) {
        el.classList.remove('is-open');
        var sub = el.querySelector('.nav-sub');
        if (sub) sub.classList.remove('is-open');
      });
    }
  });
})();
