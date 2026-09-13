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

/* ===== 实时在线人数（Supabase Realtime Presence） ===== */
(function () {
  const onlineEl = document.getElementById('onlineNum');
  if (!onlineEl) return;

  const SUPABASE_URL = 'https://wneyhpkehpjjvqnptopc.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_WPtCiIczC4Z5jMfpboQX9w_Dg4mDiBk';

  function set(n) { onlineEl.textContent = n; }

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    set('--'); // CDN 未加载
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const channel = client.channel('online-viewers');

  function refresh() {
    set(Object.keys(channel.presenceState()).length);
  }

  channel
    .on('presence', { event: 'sync' }, refresh)
    .on('presence', { event: 'join' }, refresh)
    .on('presence', { event: 'leave' }, refresh)
    .subscribe(function (status) {
      if (status === 'SUBSCRIBED') {
        channel.track({ online_at: new Date().toISOString() });
      }
    });
})();

/* ===== 沉浸式升级 · Hero 鼠标摆动 ===== */
(function () {
  const hero = document.querySelector('.hero');
  const beam = document.querySelector('.hero-beam');
  const content = document.querySelector('.hero-content');
  if (!hero || !beam || !content) return;
  if (!window.matchMedia('(hover: hover)').matches) return;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    beam.style.transform = 'rotate(' + (mx * 3.5).toFixed(2) + 'deg)';
    content.style.transform = 'translate(' + (mx * -6).toFixed(2) + 'px,' + (my * -6).toFixed(2) + 'px)';
  });
  hero.addEventListener('pointerleave', () => {
    beam.style.transform = '';
    content.style.transform = '';
  });
})();

/* ===== 沉浸式升级 · 阅读进度条 ===== */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function upd() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', upd, { passive: true });
  window.addEventListener('resize', upd);
  upd();
})();

/* ===== 沉浸式升级 · 回到顶部 ===== */
(function () {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

/* ===== 沉浸式升级 · 光栅色散角互动演示 ===== */
(function () {
  const canvas = document.getElementById('demoCanvas');
  const slider = document.getElementById('demoSlider');
  const lamEl = document.getElementById('demoLambda');
  const thetaEl = document.getElementById('demoTheta');
  if (!canvas || !slider) return;
  const ctx = canvas.getContext('2d');
  const D = 2000; // 光栅常数 nm
  let W = 0, H = 0, dpr = 1;

  function wlToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440)      { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645)             { r = 1; }
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
    if (wl > 700) f = 0.3 + 0.7 * (780 - wl) / 80;
    return {
      r: Math.max(0, Math.min(1, r * f)),
      g: Math.max(0, Math.min(1, g * f)),
      b: Math.max(0, Math.min(1, b * f))
    };
  }
  function css(col, a) {
    return 'rgba(' + Math.round(col.r * 255) + ',' + Math.round(col.g * 255) + ',' + Math.round(col.b * 255) + ',' + (a == null ? 1 : a) + ')';
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const lambda = +slider.value;
    const col = wlToRGB(lambda);
    const cstr = css(col);
    const sin = lambda / D;
    const theta = Math.asin(Math.min(1, sin));
    const deg = theta * 180 / Math.PI;

    lamEl.textContent = lambda;
    lamEl.style.color = cstr;
    thetaEl.textContent = deg.toFixed(1) + '°';

    ctx.clearRect(0, 0, W, H);
    const gx = W * 0.36, cy = H * 0.5;
    const maxSin = Math.max(Math.sin(theta), 0.15);
    const rayLen = Math.max(70, Math.min(W - gx - 26, (cy - 26) / maxSin));

    ctx.lineCap = 'round';

    // 入射光（所选波长颜色）
    ctx.strokeStyle = cstr;
    ctx.lineWidth = 3;
    ctx.shadowColor = cstr;
    ctx.shadowBlur = 9;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(gx, cy); ctx.stroke();
    ctx.shadowBlur = 0;

    // 光栅刻线
    ctx.strokeStyle = 'rgba(150,180,230,0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(gx, cy - 44); ctx.lineTo(gx, cy + 44); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(120,150,200,0.55)';
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(gx - 4, cy + i * 7.2); ctx.lineTo(gx + 4, cy + i * 7.2); ctx.stroke();
    }

    // 0 级（法线，虚线）
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = css(col, 0.35);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(gx, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    // ±1 级衍射光
    ctx.strokeStyle = cstr;
    ctx.lineWidth = 3;
    ctx.shadowColor = cstr;
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(gx, cy); ctx.lineTo(gx + rayLen * Math.cos(theta), cy - rayLen * Math.sin(theta)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, cy); ctx.lineTo(gx + rayLen * Math.cos(theta), cy + rayLen * Math.sin(theta)); ctx.stroke();
    ctx.shadowBlur = 0;

    // 角度弧
    const arcR = 36;
    ctx.strokeStyle = 'rgba(255,230,140,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(gx, cy, arcR, -theta, 0); ctx.stroke();

    // 标签
    ctx.fillStyle = 'rgba(210,222,250,0.9)';
    ctx.font = '12px "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('光栅', gx, cy - 54);
    ctx.fillText('0 级', W - 24, cy - 10);
    ctx.fillStyle = 'rgba(255,230,140,0.95)';
    ctx.fillText('θ₁', gx + arcR + 20, cy - arcR * 0.55);
    ctx.fillStyle = cstr;
    ctx.font = 'bold 12px "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('+1 / −1 级', gx + rayLen - 34, cy - rayLen * Math.sin(theta) - 14);
  }

  resize();
  draw();
  slider.addEventListener('input', draw);
  window.addEventListener('resize', () => { resize(); draw(); });
})();

/* ===== 沉浸式升级 · 光的波动动画 ===== */
(function () {
  const canvas = document.getElementById('waveCanvas');
  const slider = document.getElementById('waveSlider');
  const lamEl = document.getElementById('waveLambda');
  const fEl = document.getElementById('waveFreq');
  if (!canvas || !slider) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;

  function wlToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440)      { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645)             { r = 1; }
    let f = 1;
    if (wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
    if (wl > 700) f = 0.3 + 0.7 * (780 - wl) / 80;
    return {
      r: Math.max(0, Math.min(1, r * f)),
      g: Math.max(0, Math.min(1, g * f)),
      b: Math.max(0, Math.min(1, b * f))
    };
  }
  function css(col, a) {
    return 'rgba(' + Math.round(col.r * 255) + ',' + Math.round(col.g * 255) + ',' + Math.round(col.b * 255) + ',' + (a == null ? 1 : a) + ')';
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(phase) {
    const lambda = +slider.value;
    const col = wlToRGB(lambda);
    const cstr = css(col);
    const period = 46 + (lambda - 380) / 400 * 74; // 380nm→46px(密), 780nm→120px(疏)
    const amp = H * 0.26;
    const cy = H * 0.5;

    lamEl.textContent = lambda;
    lamEl.style.color = cstr;
    fEl.textContent = (3000 / lambda).toFixed(2);

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';

    // 传播轴 + 方向箭头
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W - 6, cy); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W - 6, cy); ctx.lineTo(W - 14, cy - 4);
    ctx.moveTo(W - 6, cy); ctx.lineTo(W - 14, cy + 4);
    ctx.stroke();

    // 行波（随相位向右传播）
    ctx.strokeStyle = cstr;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = cstr;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = cy - amp * Math.sin(2 * Math.PI * x / period - phase);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // λ 标注（一个波长跨度的双向箭头）
    const lx0 = W * 0.06;
    const lx1 = lx0 + period;
    const ly = cy + amp + 18;
    ctx.strokeStyle = 'rgba(255,230,140,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(lx1, ly); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx0, ly - 6); ctx.lineTo(lx0, ly + 3);
    ctx.moveTo(lx1, ly - 6); ctx.lineTo(lx1, ly + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx0, ly); ctx.lineTo(lx0 + 5, ly - 4); ctx.moveTo(lx0, ly); ctx.lineTo(lx0 + 5, ly + 4);
    ctx.moveTo(lx1, ly); ctx.lineTo(lx1 - 5, ly - 4); ctx.moveTo(lx1, ly); ctx.lineTo(lx1 - 5, ly + 4);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,140,0.95)';
    ctx.font = 'bold 13px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('λ', (lx0 + lx1) / 2, ly + 20);
  }

  resize();
  let start = null;
  function loop(t) {
    if (start === null) start = t;
    const phase = ((t - start) / 1000) * 6; // 约 1 个周期 / 秒
    draw(phase);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.addEventListener('resize', resize);
})();
