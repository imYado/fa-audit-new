const nav = document.querySelector('.nav');
document.querySelector('.burger').addEventListener('click', () => nav.classList.toggle('open'));

function countUp(el) {
  const end = +el.dataset.count, start = performance.now(), dur = 1600;
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))).toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(countUp);
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function setLang(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'en' ? 'ltr' : 'rtl';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = (I18N[lang][el.dataset.i18n] ?? I18N.en[el.dataset.i18n]).replace('{year}', new Date().getFullYear());
  });
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  try { localStorage.setItem('lang', lang); } catch (e) {}
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
let saved = 'en';
try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
setLang(I18N[saved] ? saved : 'en');

// open the visitor's mail app with a clean subject and body instead of raw "name=...&message=..."
document.querySelector('.contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = e.target.elements.name.value.trim(), message = e.target.elements.message.value.trim();
  location.href = 'mailto:info@fa-audit.iq'
    + '?subject=' + encodeURIComponent(name + ' - Enquiry')
    + '&body=' + encodeURIComponent(message + '\n\n— ' + name);
});
