'use strict';

/* ══════════════════════════════════════
   CURRENCY TOGGLE — ZAR ⇄ USD
══════════════════════════════════════ */
(function initCurrencyToggle() {
  const btn = document.getElementById('currency-toggle');
  if (!btn) return;

  let usd = false;

  btn.addEventListener('click', () => {
    usd = !usd;
    btn.textContent = usd ? '⇄ Show ZAR' : '⇄ Show USD';
    btn.classList.toggle('active', usd);

    // Swap main price display
    document.querySelectorAll('.package h3[data-zar]').forEach(el => {
      el.textContent = usd ? el.dataset.usd : el.dataset.zar;
    });

    // Hide the secondary USD line when USD mode is active (it's redundant)
    document.querySelectorAll('.pkg-usd').forEach(el => {
      el.style.display = usd ? 'none' : '';
    });

    // Update price-banner
    const banner = document.querySelector('.price-banner strong[data-zar]');
    if (banner) banner.textContent = usd ? banner.dataset.usd : banner.dataset.zar;
    const bannerSub = document.querySelector('.price-banner small');
    if (bannerSub) bannerSub.style.display = usd ? 'none' : '';
  });
})();


/* ══════════════════════════════════════
   INQUIRY FORM — builds WhatsApp message
══════════════════════════════════════ */
(function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  // Clicking a package card pre-selects it and scrolls to form
  document.querySelectorAll('.package').forEach(card => {
    card.addEventListener('click', () => {
      const badge = card.querySelector('.pkg-badge')?.textContent?.trim();
      const sel   = form.querySelector('[name="package"]');
      if (!badge || !sel) return;
      const match = Array.from(sel.options).find(o => o.value.startsWith(badge));
      if (match) sel.value = match.value;
      document.getElementById('inquiry-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const pkg     = form.querySelector('[name="package"]').value;
    const msg     = form.querySelector('[name="message"]').value.trim();

    if (!name || !contact) {
      (form.querySelector('[name="name"]:placeholder-shown') || form.querySelector('[name="contact"]')).focus();
      return;
    }

    const pageTitle = (document.querySelector('.hero h1')?.innerText || 'your service')
                        .replace(/\n/g, ' ').trim();

    let text = `Hi Gareth! I\u2019d like to inquire about ${pageTitle}.\n\nPackage: ${pkg}\nName: ${name}\nContact: ${contact}`;
    if (msg) text += `\nMessage: ${msg}`;

    window.open('https://wa.me/27826535019?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
