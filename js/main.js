/* ===== 星空画布 ===== */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], w, h, raf;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initStars() {
    const count = Math.min(220, Math.floor((w * h) / 6500));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.008 + 0.002,
        hue: [255, 200, 170, 40, 55][Math.floor(Math.random() * 5)]
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += (Math.random() - 0.5) * 0.03;
      s.a = Math.max(0.15, Math.min(1, s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + s.hue + ', 90%, 78%, ' + s.a + ')';
      ctx.fill();
      s.y += s.speed;
      if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
    }
    raf = requestAnimationFrame(tick);
  }

  resize();
  initStars();
  tick();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

/* ===== 滚动显现 ===== */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });
  els.forEach(el => io.observe(el));
})();

/* ===== 导航滚动收缩 ===== */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 160) nav.style.transform = 'translateY(-100%)';
    else nav.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive: true });
})();

/* ===== 移动端汉堡菜单 ===== */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setMenu(!links.classList.contains('open'));
  });

  // 点击菜单链接后自动收起
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });
})();

/* ===== 虚拟仿真弹窗 ===== */
(function () {
  const modal = document.getElementById('simModal');
  if (!modal) return;
  const frame = document.getElementById('simModalFrame');
  const title = document.getElementById('simModalTitle');
  const openLink = document.getElementById('simModalOpen');
  const cards = document.querySelectorAll('.sim-card');

  function open(src, t) {
    frame.src = src;
    title.textContent = t;
    openLink.href = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { frame.src = ''; }, 300);
  }

  cards.forEach(c => {
    c.addEventListener('click', e => {
      e.preventDefault();
      open(c.getAttribute('href'), c.dataset.title);
    });
  });
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ===== 在线人数（当前为本地模拟；待接入 Supabase 实时在线） ===== */
(function () {
  const onlineEl = document.getElementById('onlineNum');
  if (!onlineEl) return;
  let online = 5 + Math.floor(Math.random() * 15);
  onlineEl.textContent = online;
  setInterval(function () {
    online = Math.max(1, Math.min(99, online + Math.floor(Math.random() * 3) - 1));
    onlineEl.textContent = online;
  }, 20000);
})();
