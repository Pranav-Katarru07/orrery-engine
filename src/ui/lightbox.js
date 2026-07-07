// Near-fullscreen image lightbox for the per-body slideshows. Single shared
// instance, opened with a list of images + a start index + the body accent.
// Glass chrome, caption/credit line, prev/next, a thumbnail filmstrip, and
// keyboard (←/→/Esc) plus pointer-swipe navigation.

let instance = null;

class Lightbox {
  constructor() {
    const el = document.createElement('div');
    el.className = 'lightbox-overlay';
    el.innerHTML = `
      <button class="lb-close" title="Close (Esc)">
        <svg viewBox="0 0 16 16" width="15" height="15" stroke="currentColor" stroke-width="1.6" fill="none"><path d="M4 4l8 8M12 4l-8 8"/></svg>
      </button>
      <button class="lb-nav lb-prev" title="Previous (←)" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <div class="lb-stage">
        <img class="lb-img" alt="" />
        <div class="lb-caption">
          <div class="lb-title"></div>
          <div class="lb-credit"></div>
        </div>
        <div class="lb-film"></div>
      </div>
      <button class="lb-nav lb-next" title="Next (→)" aria-label="Next">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
    document.getElementById('ui').appendChild(el);
    this.el = el;
    this.$img = el.querySelector('.lb-img');
    this.$title = el.querySelector('.lb-title');
    this.$credit = el.querySelector('.lb-credit');
    this.$film = el.querySelector('.lb-film');
    this.images = [];
    this.index = 0;

    el.querySelector('.lb-close').addEventListener('click', () => this.close());
    el.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); this.step(-1); });
    el.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); this.step(1); });
    el.addEventListener('pointerdown', (e) => {
      if (e.target === el || e.target.closest('.lb-stage') === el.querySelector('.lb-stage') && e.target === el.querySelector('.lb-stage')) {
        // click on backdrop closes
      }
      this._sx = e.clientX;
    });
    el.addEventListener('pointerup', (e) => {
      const dx = e.clientX - (this._sx ?? e.clientX);
      if (Math.abs(dx) > 60) this.step(dx < 0 ? 1 : -1);
      else if (e.target === el) this.close();
    });
    this._onKey = (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
      else if (e.key === 'ArrowLeft') this.step(-1);
      else if (e.key === 'ArrowRight') this.step(1);
    };
    window.addEventListener('keydown', this._onKey, true);
  }

  get isOpen() {
    return this.el.classList.contains('open');
  }

  open(images, startIndex, accent) {
    this.images = images;
    this.index = Math.max(0, Math.min(startIndex, images.length - 1));
    if (accent) {
      this.el.style.setProperty('--accent', accent.ui);
      this.el.style.setProperty('--accent-glow', accent.glow);
    }
    this._buildFilm();
    this._show();
    this.el.classList.add('open');
  }

  close() {
    this.el.classList.remove('open');
  }

  step(d) {
    this.index = (this.index + d + this.images.length) % this.images.length;
    this._show();
  }

  _show() {
    const im = this.images[this.index];
    this.$img.src = im.file;
    this.$img.alt = im.title || '';
    this.$title.textContent = im.title || '';
    this.$credit.textContent = [im.credit, im.caption].filter(Boolean).join(' — ');
    for (const t of this.$film.children) {
      t.classList.toggle('active', Number(t.dataset.i) === this.index);
    }
    const active = this.$film.children[this.index];
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  _buildFilm() {
    this.$film.innerHTML = '';
    this.images.forEach((im, i) => {
      const t = document.createElement('button');
      t.className = 'lb-thumb';
      t.dataset.i = i;
      t.innerHTML = `<img src="${im.file}" alt="" loading="lazy" />`;
      t.addEventListener('click', (e) => { e.stopPropagation(); this.index = i; this._show(); });
      this.$film.appendChild(t);
    });
  }
}

export function openLightbox(images, startIndex = 0, accent = null) {
  if (!instance) instance = new Lightbox();
  instance.open(images, startIndex, accent);
}
