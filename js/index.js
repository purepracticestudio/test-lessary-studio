/* ============================================================
   index.js — 首頁專屬 JavaScript
   ============================================================ */

/* ── 浮動粒子 ── */
(function () {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('div');
    d.className = 'p-dot';
    const size = 4 + Math.random() * 8;
    d.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `bottom:${-size}px`,
      `animation-duration:${8 + Math.random() * 12}s`,
      `animation-delay:${Math.random() * 8}s`
    ].join(';');
    container.appendChild(d);
  }
})();

/* ── 視差橫幅 ── */
(function () {
  const pImg = document.getElementById('parallaxImg');
  if (!pImg) return;
  window.addEventListener('scroll', () => {
    const rect = pImg.parentElement.getBoundingClientRect();
    const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
    pImg.style.transform = `scale(1.05) translateY(${progress * 20}px)`;
  });
})();

/* ── 顧客回饋輪播 ── */
(function () {
  const track   = document.getElementById('testiTrack');
  const dotsWrap= document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track) return;

  const REAL_CARDS = Array.from(track.children);
  const TOTAL   = REAL_CARDS.length;   // 6
  const STEP_MS = 10000;               // 10 秒切換
  const GAP     = 24;
  let current   = 0;
  let autoTimer;
  let isTransitioning = false;

  // 複製前 4 張卡片到尾端，實現無縫迴圈
  REAL_CARDS.slice(0, 4).forEach(c => {
    const cl = c.cloneNode(true);
    cl.setAttribute('aria-hidden', 'true');
    track.appendChild(cl);
  });

  // 建立 dots
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `第 ${i + 1} 組`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  function cardWidth() {
    return REAL_CARDS[0].getBoundingClientRect().width + GAP;
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current % TOTAL)
    );
  }

  function setPos(idx, animated) {
    const w = cardWidth();
    track.style.transition = animated ? 'transform .7s cubic-bezier(.4,0,.2,1)' : 'none';
    track.style.transform  = `translateX(-${w * idx}px)`;
  }

  function goTo(idx, animated = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    current = idx;
    setPos(current, animated);
    updateDots();
    resetTimer();
    setTimeout(() => { isTransitioning = false; }, 750);
  }

  function next() {
    if (isTransitioning) return;
    const nextIdx = current + 1;
    if (nextIdx >= TOTAL) {
      isTransitioning = true;
      setPos(nextIdx, true);
      updateDots();
      resetTimer();
      setTimeout(() => {
        setPos(0, false);
        current = 0;
        updateDots();
        isTransitioning = false;
      }, 720);
    } else {
      goTo(nextIdx);
    }
  }

  function prev() {
    if (isTransitioning) return;
    if (current === 0) {
      isTransitioning = true;
      setPos(TOTAL - 1, true);
      current = TOTAL - 1;
      updateDots();
      resetTimer();
      setTimeout(() => { isTransitioning = false; }, 750);
    } else {
      goTo(current - 1);
    }
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, STEP_MS);
  }

  setPos(0, false);
  resetTimer();

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // 滑鼠移入暫停
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(next, STEP_MS); });

  // 觸控滑動
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });

  window.addEventListener('resize', () => setPos(current, false));
})();
