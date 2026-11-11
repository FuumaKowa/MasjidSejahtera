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

const referenceSections = ['kota-suci', 'impak', 'objektif', 'portfolio', 'fungsi', 'aliran']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18 });
  referenceSections.forEach((section) => sectionObserver.observe(section));
} else {
  referenceSections.forEach((section) => section.classList.add('is-visible'));
}

let snapLocked = false;
const snapToSection = (event) => {
  if (snapLocked) { event.preventDefault(); return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 701) return;
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  if (event.deltaY < 24 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const current = [...document.querySelectorAll('.cover, .page, .closing-cta')]
    .reduce((closest, section) => {
      const distance = Math.abs(section.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || 0));
      return !closest || distance < closest.distance ? { section, distance } : closest;
    }, null);
  if (!current) return;
  const sections = [...document.querySelectorAll('.cover, .page, .closing-cta')];
  const index = sections.indexOf(current.section);
  const next = sections[index + (event.deltaY > 0 ? 1 : -1)];
  if (next) {
    event.preventDefault();
    snapLocked = true;
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { snapLocked = false; }, 850);
  }
};
addEventListener('wheel', snapToSection, { passive: false });

