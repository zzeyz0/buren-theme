/**
 * BUREN.CL — Reviews Lightbox
 * Vanilla JS, sin dependencias externas
 */

(function () {
  'use strict';

  class BurenLightbox {
    constructor(lightboxEl) {
      this.el       = lightboxEl;
      this.id       = lightboxEl.id.replace('lightbox-', '');
      this.imgEl    = lightboxEl.querySelector('.buren-lightbox__img');
      this.closeBtn = lightboxEl.querySelector('.buren-lightbox__close');
      this.prevBtn  = lightboxEl.querySelector('.buren-lightbox__prev');
      this.nextBtn  = lightboxEl.querySelector('.buren-lightbox__next');
      this.sources  = Array.from(
        lightboxEl.querySelectorAll('.buren-lightbox__images img')
      ).map(img => ({ src: img.dataset.src, alt: img.alt }));
      this.current  = 0;

      this._bindEvents();
    }

    _bindEvents() {
      this.closeBtn.addEventListener('click', () => this.close());
      this.prevBtn.addEventListener('click',  () => this.navigate(-1));
      this.nextBtn.addEventListener('click',  () => this.navigate(1));

      this.el.addEventListener('click', (e) => {
        if (e.target === this.el) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (this.el.hidden) return;
        if (e.key === 'Escape')     this.close();
        if (e.key === 'ArrowLeft')  this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
      });
    }

    open(index = 0) {
      this.current = index;
      this._render();
      this.el.hidden = false;
      document.body.style.overflow = 'hidden';
      this.closeBtn.focus();
    }

    close() {
      this.el.hidden = true;
      document.body.style.overflow = '';
    }

    navigate(dir) {
      const total = this.sources.length;
      this.current = (this.current + dir + total) % total;
      this._render();
    }

    _render() {
      const item = this.sources[this.current];
      if (!item) return;

      this.imgEl.style.opacity = '0';
      this.imgEl.src = item.src;
      this.imgEl.alt = item.alt;
      this.imgEl.onload = () => {
        this.imgEl.style.opacity = '1';
        this.imgEl.style.transition = 'opacity 0.2s ease';
      };

      // Ocultar flechas si solo hay 1 imagen
      const single = this.sources.length <= 1;
      this.prevBtn.hidden = single;
      this.nextBtn.hidden = single;
    }
  }

  function initReviews() {
    // Inicializar todos los lightboxes de la página
    document.querySelectorAll('.buren-lightbox').forEach(el => {
      const lb = new BurenLightbox(el);

      // Conectar botones de thumbnails
      const blockId = el.id.replace('lightbox-', '');
      document.querySelectorAll(
        `.buren-reviews__thumb-btn[data-lightbox="${blockId}"]`
      ).forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index, 10) || 0;
          lb.open(index);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviews);
  } else {
    initReviews();
  }
})();
