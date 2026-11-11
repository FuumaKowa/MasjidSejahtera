const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
});
document.addEventListener('click', (event) => {
  const city = event.target.closest('.city-item');
  if (city) {
    document.querySelectorAll('.city-item').forEach((item) => {
      const active = item === city;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }

  const layer = event.target.closest('[data-layer]');
  if (layer) {
    const activeLayer = layer.dataset.layer;
    document.querySelectorAll('[data-layer]').forEach((item) => {
      const active = item.dataset.layer === activeLayer;
      item.classList.toggle('is-active', active);
      if (item.hasAttribute('aria-pressed')) item.setAttribute('aria-pressed', String(active));
    });
  }

  const control = event.target.closest('button[aria-pressed]');
  if (control && !control.matches('.city-item,[data-layer]')) {
    const group = control.closest('.objective-network,.program-steps,.program-stack,.maqdis-programs,.portfolio-wheel,.function-map,.stage-list');
    if (group) {
      group.querySelectorAll('button[aria-pressed]').forEach((item) => {
        const active = item === control;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('is-active', active);
      });
    } else {
      const active = control.getAttribute('aria-pressed') !== 'true';
      control.setAttribute('aria-pressed', String(active));
      control.classList.toggle('is-active', active);
    }
  }
});
const progress = document.querySelector('.scroll-progress span');
const updateProgress = () => {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (distance > 0 ? (scrollY / distance) * 100 : 0) + '%';
};
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
