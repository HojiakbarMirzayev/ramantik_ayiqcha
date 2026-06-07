/* ============================================
   RAMANTIK AYIQCHA — Zamonaviy harakatlar + Telegram
   Token bu yerda YO'Q — u maxfiy serverda (api/order.js) turadi.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Nav scroll effekti ---------- */
  const nav = document.querySelector('header.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- 2. Scroll-reveal (IntersectionObserver) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- 3. Hero rasm 3D parallax (sichqoncha) ---------- */
  const frame = document.querySelector('.hero-img .frame');
  const heroImg = document.querySelector('.hero-img');
  if (frame && heroImg && window.matchMedia('(pointer:fine)').matches){
    heroImg.addEventListener('mousemove', (ev) => {
      const r = heroImg.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(0)`;
    });
    heroImg.addEventListener('mouseleave', () => { frame.style.transform = ''; });
  }

  /* ---------- 4. Float kartochkalar yumshoq parallax ---------- */
  const floats = document.querySelectorAll('.float-card');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    floats.forEach((f,i) => { f.style.translate = `0 ${y * (i? -0.04 : 0.04)}px`; });
  }, { passive:true });

  /* ---------- 5. Hisoblagich animatsiyasi (price) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1100; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start)/dur, 1);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('ru-RU') + " so'm";
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cObserver.unobserve(el);
    });
  }, { threshold:0.6 });
  counters.forEach(c => cObserver.observe(c));

  /* ---------- 6. Tugma ripple effekti ---------- */
  document.querySelectorAll('.btn, .submit').forEach(btn => {
    btn.addEventListener('click', function(e){
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const r = this.getBoundingClientRect();
      circle.className = 'ripple';
      circle.style.width = circle.style.height = d + 'px';
      circle.style.left = (e.clientX - r.left - d/2) + 'px';
      circle.style.top  = (e.clientY - r.top  - d/2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ---------- 7. Telefon formatlash ---------- */
  const phone = document.getElementById('phone');
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g,'').slice(0,9);
    let out = d;
    if (d.length > 2) out = d.slice(0,2) + ' ' + d.slice(2);
    if (d.length > 5) out = d.slice(0,2) + ' ' + d.slice(2,5) + ' ' + d.slice(5);
    if (d.length > 7) out = d.slice(0,2) + ' ' + d.slice(2,5) + ' ' + d.slice(5,7) + ' ' + d.slice(7);
    phone.value = out;
  });

  /* ---------- 8. Forma yuborish -> Telegram ---------- */
  const form  = document.getElementById('orderForm');
  const nameI = document.getElementById('name');
  const btn   = document.getElementById('submitBtn');
  const btnText = btn.querySelector('span');
  const msg   = document.getElementById('formMsg');

  const ICON_OK  = '<svg class="ico" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  const ICON_ERR = '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>';

  function showMsg(text, ok){
    msg.innerHTML = (ok?ICON_OK:ICON_ERR) + '<span>'+text+'</span>';
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameI.value.trim();
    const digits = phone.value.replace(/\D/g,'');

    if (name.length < 2){ showMsg('Iltimos, ismingizni to\'liq kiriting.', false); nameI.focus(); return; }
    if (digits.length !== 9){ showMsg('Telefon raqam noto\'g\'ri. +998 dan keyin 9 ta raqam kiriting.', false); phone.focus(); return; }

    const fullPhone = '+998' + digits;
    btn.disabled = true;
    btnText.textContent = 'Yuborilmoqda...';

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, phone: fullPhone })
      });
      const data = await res.json();
      if (data.ok){
        // Muvaffaqiyatli — thank you sahifasiga ism bilan o'tkazamiz
        window.location.href = 'thank-you.html?name=' + encodeURIComponent(name);
        return;
      } else {
        showMsg('Yuborishda xatolik. Iltimos, qayta urinib ko\'ring.', false);
        console.error('Telegram error:', data);
      }
    } catch(err){
      showMsg('Internet aloqasida muammo. Iltimos, qayta urinib ko\'ring.', false);
      console.error(err);
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Buyurtmani yuborish';
    }
  });
});
