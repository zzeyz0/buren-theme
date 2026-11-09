/**
 * BUREN.CL — UX Enhancements
 * Sticky ATC · Scroll reveal · Mejoras de conversión
 */
(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. STICKY ATC MOBILE
     Muestra el botón fijo cuando el ATC original sale del viewport
     ---------------------------------------------------------------- */
  function initStickyATC() {
    const stickyBtns = document.querySelectorAll('.buren-sticky-atc');
    if (!stickyBtns.length) return;

    stickyBtns.forEach(stickyBtn => {
      const sectionId = stickyBtn.id.replace('buren-sticky-atc-', '');
      const originalBtn = document.getElementById(`ProductSubmitButton-${sectionId}`);
      if (!originalBtn) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            stickyBtn.classList.add('is-visible');
            stickyBtn.setAttribute('aria-hidden', 'false');
          } else {
            stickyBtn.classList.remove('is-visible');
            stickyBtn.setAttribute('aria-hidden', 'true');
          }
        },
        { threshold: 0, rootMargin: '0px 0px -60px 0px' }
      );

      observer.observe(originalBtn);
    });
  }

  /* ----------------------------------------------------------------
     2. QUICK ADD — mostrar badge de rating en cards si existe
     ---------------------------------------------------------------- */
  function initCardRatings() {
    document.querySelectorAll('.card-wrapper').forEach(card => {
      const ratingEl = card.querySelector('.rating');
      if (ratingEl) {
        ratingEl.style.display = 'flex';
      }
    });
  }

  /* ----------------------------------------------------------------
     3. SAVINGS BADGE — mostrar ahorro en PDP
     ---------------------------------------------------------------- */
  function initSavingsBadge() {
    document.querySelectorAll('.price--on-sale').forEach(priceEl => {
      const compareEl = priceEl.querySelector('.price-item--regular');
      const saleEl    = priceEl.querySelector('.price-item--sale');
      if (!compareEl || !saleEl) return;
      if (priceEl.querySelector('.buren-savings-badge')) return;

      const parsePrice = (el) => {
        const text = el.textContent.replace(/[^\d]/g, '');
        return parseInt(text, 10);
      };

      const comparePrice = parsePrice(compareEl);
      const salePrice    = parsePrice(saleEl);
      if (!comparePrice || !salePrice || comparePrice <= salePrice) return;

      const savings = comparePrice - salePrice;
      const pct     = Math.round((savings / comparePrice) * 100);

      const badge = document.createElement('span');
      badge.className = 'buren-savings-badge';
      badge.textContent = `-${pct}%`;
      saleEl.insertAdjacentElement('afterend', badge);
    });
  }

  /* ----------------------------------------------------------------
     4. ANNOUNCEMENT BAR — rotación de mensajes
     ---------------------------------------------------------------- */
  function initAnnouncementRotation() {
    const bar = document.querySelector('.announcement-bar__message');
    if (!bar) return;
    // La animación CSS marquee ya está activa vía buren-custom.css
  }

  /* ----------------------------------------------------------------
     5. OVERLAY HEADER — homepage
     El header flota sobre el slideshow. Al hacer scroll > 60px
     recupera el fondo de marca con transición suave.
     ---------------------------------------------------------------- */
  function initOverlayHeader() {
    if (!document.body.classList.contains('template-index')) return;

    const wrapper = document.querySelector('.header-wrapper');
    if (!wrapper) return;

    const THRESHOLD = 60;

    function onScroll() {
      if (window.scrollY > THRESHOLD) {
        wrapper.classList.add('buren-header--scrolled');
      } else {
        wrapper.classList.remove('buren-header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // estado inicial
  }

  /* ----------------------------------------------------------------
     6. AUTH POPUP — modal al hacer clic en el ícono de cuenta
     ---------------------------------------------------------------- */
  function initAuthPopup() {
    const btn   = document.getElementById('buren-account-btn');
    const popup = document.getElementById('buren-auth-popup');
    if (!btn || !popup) return;

    function openPopup() {
      popup.hidden = false;
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
      document.getElementById('buren-auth-close')?.focus();
    }

    function closePopup() {
      popup.hidden = true;
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    function setMode(mode) {
      popup.querySelectorAll('.buren-auth-mode').forEach(function (el) {
        el.hidden = el.dataset.mode !== mode;
      });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      setMode('login');
      openPopup();
    });

    popup.addEventListener('click', function (e) {
      const switchBtn = e.target.closest('[data-auth-switch]');
      if (switchBtn) setMode(switchBtn.dataset.authSwitch);
    });

    document.getElementById('buren-auth-overlay')?.addEventListener('click', closePopup);
    document.getElementById('buren-auth-close')?.addEventListener('click', closePopup);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !popup.hidden) closePopup();
    });
  }

  /* ----------------------------------------------------------------
     INIT
     ---------------------------------------------------------------- */
  function init() {
    initStickyATC();
    initCardRatings();
    initSavingsBadge();
    initAnnouncementRotation();
    initOverlayHeader();
    initAuthPopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
