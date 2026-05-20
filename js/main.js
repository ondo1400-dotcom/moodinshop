/* ═══════════════════════════════════════════
   MOODINSHOP · main.js
   Shared: Nav · Footer · Animations · Quiz · Forms
═══════════════════════════════════════════ */

// ── GOOGLE SHEETS 연동 ────────────────────────────────────────
// Apps Script 배포 후 아래 URL을 교체하세요
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxTIswEZkTPSj9BGtg9jnhhucRF-khuv1aT1MeiI0OCwnDDxqmA654s7EcoGw-TxcaK/exec';

function sendToSheet(data) {
  if (!GAS_URL || GAS_URL.startsWith('YOUR_')) return;
  fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data)
  }).catch(() => {}); // 네트워크 오류 조용히 처리
}

// ── NAV HTML ──────────────────────────────────────────────────
const NAV_HTML = `
<nav id="mainNav">
  <a href="index.html" class="nav-logo">MOODINSHOP</a>
  <ul class="nav-links">
    <li><a href="index.html"    data-page="index">Home</a></li>
    <li><a href="scent.html"    data-page="scent">Scent</a></li>
    <li><a href="sentence.html" data-page="sentence">Sentence</a></li>
    <li><a href="sound.html"    data-page="sound">Sound</a></li>
    <li><a href="daily.html"    data-page="daily">Daily</a></li>
    <li><a href="magazine.html" data-page="magazine">Magazine</a></li>
    <li><a href="join.html"     data-page="join">Join</a></li>
    <li><a href="index.html#popup" class="nav-pill">팝업 알림</a></li>
  </ul>
  <button class="nav-toggle" id="navToggle">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mob-overlay" id="mobOverlay">
  <button class="mob-close" id="mobClose">✕</button>
  <a href="index.html">HOME</a>
  <a href="scent.html">SCENT</a>
  <a href="sentence.html">SENTENCE</a>
  <a href="sound.html">SOUND</a>
  <a href="daily.html">DAILY</a>
  <a href="magazine.html">MAGAZINE</a>
  <a href="join.html">JOIN</a>
  <a href="index.html#popup" class="mob-pill">팝업 알림 받기 →</a>
</div>
`;

// ── FOOTER HTML ───────────────────────────────────────────────
const FOOTER_HTML = `
<footer>
  <div class="fg">
    <div>
      <a href="index.html" class="flogo">MOODINSHOP</a>
      <p class="fp">나의 사회를 꾸미는<br>감각 편집샵.<br>향에서 시작해 일상 전체로.</p>
      <div class="fsoc">
        <a href="https://instagram.com/moodinshop" target="_blank" rel="noopener">📷</a>
        <a href="#">💬</a>
      </div>
    </div>
    <div class="fc">
      <h5>카테고리</h5>
      <ul>
        <li><a href="scent.html">Scent · 향</a></li>
        <li><a href="sentence.html">Sentence · 문장</a></li>
        <li><a href="sound.html">Sound · 소리</a></li>
        <li><a href="daily.html">Daily · 일상</a></li>
      </ul>
    </div>
    <div class="fc">
      <h5>더보기</h5>
      <ul>
        <li><a href="magazine.html">Magazine</a></li>
        <li><a href="join.html">Join Us</a></li>
        <li><a href="index.html#popup">팝업 알림</a></li>
        <li><a href="index.html#diag">무드 진단</a></li>
      </ul>
    </div>
    <div class="fc">
      <h5>쇼핑 & 연락</h5>
      <ul>
        <li><a href="#" target="_blank">네이버 스토어</a></li>
        <li><a href="https://instagram.com/moodinshop" target="_blank" rel="noopener">@moodinshop</a></li>
      </ul>
    </div>
  </div>
  <div class="fb">
    <p class="fcp">© 2025 무인샵 · Mood in Shop. All rights reserved.</p>
    <span class="ftag">STAY IN YOUR MOOD.</span>
  </div>
</footer>
`;

// ── INJECT NAV + FOOTER ───────────────────────────────────────
function injectComponents() {
  const navRoot = document.getElementById('nav-root');
  const footerRoot = document.getElementById('footer-root');
  if (navRoot) navRoot.innerHTML = NAV_HTML;
  if (footerRoot) footerRoot.innerHTML = FOOTER_HTML;
}

// ── ACTIVE NAV LINK ───────────────────────────────────────────
function setActiveNav() {
  const page = document.body.dataset.page || 'index';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
}

// ── NAV SCROLL BEHAVIOR ───────────────────────────────────────
function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // Pages with dark hero = start with light nav
  const darkHeroPages = ['index','scent','sentence','sound','daily','magazine'];
  const hasDarkHero   = darkHeroPages.includes(document.body.dataset.page || 'index');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.remove('light');
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      if (hasDarkHero) nav.classList.add('light');
      else nav.classList.remove('light');
    }
  }

  if (hasDarkHero) nav.classList.add('light');
  window.addEventListener('scroll', updateNav);
}

// ── MOBILE MENU ───────────────────────────────────────────────
function initMobileMenu() {
  const toggle  = document.getElementById('navToggle');
  const overlay = document.getElementById('mobOverlay');
  const close   = document.getElementById('mobClose');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => overlay.classList.add('open'));
  if (close) close.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => overlay.classList.remove('open'));
  });
}

// ── FADE UP OBSERVER ──────────────────────────────────────────
function initFadeUp() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fu').forEach(el => obs.observe(el));
}

// ── HERO WORD ANIMATION (index only) ─────────────────────────
function initHeroAnimation() {
  const el = document.getElementById('heroBlank');
  if (!el) return;
  const words = ['YOUR', 'SCENT', 'SOUND', 'SENTENCE', 'DAILY', 'MY', 'TODAY\'S'];
  let i = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = words[++i % words.length];
      el.style.opacity = '1';
    }, 300);
  }, 2400);
}

// ── MOOD QUIZ (index only) ────────────────────────────────────
function initQuiz() {
  const slides = document.querySelectorAll('.qs');
  const dots   = document.querySelectorAll('.qd');
  if (!slides.length) return;

  let answers = [];

  slides.forEach(slide => {
    slide.querySelectorAll('.qo').forEach(btn => {
      btn.addEventListener('click', function () {
        const qi = parseInt(this.closest('.qs').dataset.i);
        answers[qi] = this.dataset.t;
        this.closest('.qopts').querySelectorAll('.qo').forEach(b => b.classList.remove('sel'));
        this.classList.add('sel');
        setTimeout(() => qi < 4 ? goToQ(qi + 1) : showResult(), 380);
      });
    });
  });

  function goToQ(idx) {
    const cur = document.querySelector('.qs.on');
    if (cur) { cur.classList.remove('on'); cur.classList.add('out'); setTimeout(() => cur.classList.remove('out'), 520); }
    dots.forEach((d, i) => { d.classList.remove('now','done'); if (i < idx) d.classList.add('done'); if (i === idx) d.classList.add('now'); });
    if (slides[idx]) slides[idx].classList.add('on');
  }

  const moodTypes = {
    A: { icon: '🕯', name: 'WOODY & AMBER',   desc: '따뜻하고 포근한 분위기를 좋아하는 당신. 나무와 바닐라, 앰버 향이 당신의 무드와 가장 잘 어울립니다. 아늑한 공간에서의 머무름이 당신의 리듬입니다.', link: 'scent.html', cta: 'Scent 보러가기 →' },
    B: { icon: '🌿', name: 'GREEN & HERBAL',   desc: '자연과 청량함을 향한 감각. 싱그러운 그린, 허벌 노트가 당신의 무드를 완성합니다. 바람이 통하는 넓은 공간이 당신에게 필요한 온도입니다.', link: 'scent.html', cta: 'Scent 보러가기 →' },
    C: { icon: '🌙', name: 'DARK & QUIET',     desc: '고요함과 깊이를 추구하는 당신. 서늘하고 미스티한 향, 앰비언트 노트가 당신의 세계와 맞닿아 있습니다. 혼자만의 시간이 충전의 원천입니다.', link: 'scent.html', cta: 'Scent 보러가기 →' },
    D: { icon: '🌸', name: 'VIBRANT & CORAL',  desc: '활기차고 밝은 에너지를 가진 당신. 코랄, 플로럴, 프레시한 시트러스 향이 당신의 무드를 더 빛나게 합니다. 사람과 연결되는 순간이 당신의 무드입니다.', link: 'scent.html', cta: 'Scent 보러가기 →' },
  };

  function showResult() {
    const cnt = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(a => { if (a) cnt[a]++; });
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0];
    const m = moodTypes[top];
    document.getElementById('ri').textContent   = m.icon;
    document.getElementById('rn').textContent   = m.name;
    document.getElementById('rd').textContent   = m.desc;
    const cta = document.getElementById('rc');
    if (cta) { cta.textContent = m.cta; cta.href = m.link; }
    const qa = document.getElementById('qa'), qd = document.getElementById('qdots'), qr = document.getElementById('qres');
    if (qa) qa.style.display = 'none';
    if (qd) qd.style.display = 'none';
    if (qr) qr.classList.add('show');
  }

  window.resetQ = function () {
    answers = [];
    slides.forEach(s => { s.classList.remove('on','out'); s.querySelectorAll('.qo').forEach(b => b.classList.remove('sel')); });
    if (slides[0]) slides[0].classList.add('on');
    dots.forEach((d, i) => { d.classList.remove('done','now'); if (i === 0) d.classList.add('now'); });
    const qa = document.getElementById('qa'), qd = document.getElementById('qdots'), qr = document.getElementById('qres');
    if (qr) qr.classList.remove('show');
    if (qa) qa.style.display = '';
    if (qd) qd.style.display = '';
  };
}

// ── POPUP EMAIL FORM ──────────────────────────────────────────
function initPopupForm() {
  const btn = document.getElementById('popupSubmit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const inp = document.getElementById('popupEmail');
    if (!inp || !inp.value.includes('@')) { if (inp) inp.style.background = 'rgba(255,80,60,0.18)'; return; }
    sendToSheet({ type: 'popup-alert', email: inp.value.trim() });
    document.getElementById('emailFormWrap').style.display = 'none';
    document.getElementById('emailSuccess').style.display  = 'block';
    document.getElementById('emailNote').style.display     = 'none';
  });
  const inp = document.getElementById('popupEmail');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
}

// ── MAGAZINE SUBSCRIPTION FORM ────────────────────────────────
window.subMag = function () {
  const e = document.getElementById('subEmail');
  if (!e || !e.value.includes('@')) { if (e) e.style.borderColor = 'rgba(255,100,80,0.5)'; return; }
  sendToSheet({
    type:  'magazine',
    name:  document.getElementById('subName')?.value.trim()  || '',
    email: e.value.trim(),
    phone: document.getElementById('subPhone')?.value.trim() || ''
  });
  const f = document.getElementById('subForm'), s = document.getElementById('subSuccess');
  if (f) f.style.display = 'none';
  if (s) s.style.display = 'block';
};

// ── JOIN APPLICATION FORM ─────────────────────────────────────
window.submitJoin = function () {
  const e = document.getElementById('jEmail');
  if (!e || !e.value.includes('@')) { if (e) e.style.borderColor = 'rgba(255,100,80,0.5)'; return; }
  sendToSheet({
    type:    'join',
    name:    document.getElementById('jName')?.value.trim()  || '',
    email:   e.value.trim(),
    phone:   document.getElementById('jPhone')?.value.trim() || '',
    collab:  document.getElementById('jType')?.value         || '',
    url:     document.getElementById('jUrl')?.value.trim()   || '',
    message: document.getElementById('jMsg')?.value.trim()   || ''
  });
  const f = document.getElementById('joinForm'), s = document.getElementById('joinSuccess');
  if (f) f.style.display = 'none';
  if (s) s.style.display = 'block';
};

// ── POPUP STORE MODAL ─────────────────────────────────────────
function initPopupStoreModal() {
  const overlay = document.getElementById('popupStoreModal');
  if (!overlay) return;

  const widget = document.getElementById('psmWidget');

  function openPsm() {
    overlay.classList.add('open');
    if (widget) widget.classList.remove('visible');
  }

  function closePsm() {
    overlay.classList.remove('open');
    if (widget) widget.classList.add('visible');
  }

  // 홈 들어올 때마다 자동 표시
  setTimeout(openPsm, 1200);

  document.getElementById('psmClose')?.addEventListener('click', closePsm);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePsm(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closePsm(); });
  widget?.addEventListener('click', openPsm);

  const form = document.getElementById('psmForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('psmName');
    const email = document.getElementById('psmEmail');
    let ok = true;

    [name, email].forEach(el => el?.classList.remove('error'));

    if (!name?.value.trim())         { name?.classList.add('error');  name?.focus();  ok = false; }
    if (!email?.value.includes('@')) { email?.classList.add('error'); email?.focus(); ok = false; }
    if (!ok) return;

    sendToSheet({
      type:    'popup-store',
      name:    name.value.trim(),
      phone:   document.getElementById('psmPhone')?.value.trim()  || '',
      email:   email.value.trim(),
      date:    document.getElementById('psmDate')?.value           || '',
      people:  document.getElementById('psmPeople')?.value         || '',
      message: document.getElementById('psmMsg')?.value.trim()    || ''
    });

    form.style.display = 'none';
    document.getElementById('psmSuccess')?.classList.add('show');
  });

  // Clear error state on input
  form.querySelectorAll('.psm-in').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
}

// ── ANCHOR SCROLL (for index.html#popup, #diag) ───────────────
function initAnchorScroll() {
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
}

// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectComponents();
  setActiveNav();
  initNav();
  initMobileMenu();
  initFadeUp();
  initHeroAnimation();
  initQuiz();
  initPopupForm();
  initPopupStoreModal();
  initAnchorScroll();
});
