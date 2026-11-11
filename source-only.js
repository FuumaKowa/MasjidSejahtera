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

const portfolioData = [
  ['KEILMUAN', 'Pengajian, pendidikan & bimbingan.'],
  ['USAHAWAN', 'Keusahawanan & pembangunan ekonomi.'],
  ['PROFESIONAL', 'Sumbangan kepakaran & kemahiran'],
  ['AGENSI', 'Badan, institusi & NGO manfaat kariah.'],
  ['KASIH', 'Sokongan berterusan kepada golongan asnaf.'],
  ['ANAK MUDA', 'Kepimpinan belia, sukarelawan & kegiatan aktif.'],
  ['WANITA', 'Pendidikan, kebajikan & keluarga.'],
  ['INFAQ', 'Penyumbang tetap mingguan Tabung Mahabbah.']
];
const portfolioSvg = document.querySelector('.portfolio-svg');
const portfolioCards = document.querySelector('.portfolio-cards');
if (portfolioSvg && portfolioCards) {
  const svgNs = 'http://www.w3.org/2000/svg';
  const center = 300;
  const outerRadius = 290;
  const innerRadius = 66;
  const pointOnCircle = (radius, angle) => [
    center + radius * Math.cos(angle), center + radius * Math.sin(angle)
  ];
  const wrapPortfolioText = (text, limit = 16) => {
    const lines = [];
    let line = '';
    text.split(' ').forEach((word) => {
      const next = `${line} ${word}`.trim();
      if (line && next.length > limit) { lines.push(line); line = word; }
      else line = next;
    });
    if (line) lines.push(line);
    return lines;
  };
  const addSvgText = (group, text, x, y, className) => {
    const label = document.createElementNS(svgNs, 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('class', className);
    label.textContent = text;
    group.append(label);
  };
  portfolioData.forEach(([name, description], index) => {
    const start = (-90 + 45 * index - 22.5) * Math.PI / 180;
    const end = start + Math.PI / 4;
    const middle = (start + end) / 2;
    const [x0, y0] = pointOnCircle(outerRadius, start);
    const [x1, y1] = pointOnCircle(outerRadius, end);
    const [x2, y2] = pointOnCircle(innerRadius, end);
    const [x3, y3] = pointOnCircle(innerRadius, start);
    const [textX, textY] = pointOnCircle(178, middle);
    const lines = wrapPortfolioText(description);
    const detailTop = textY + 13 - (lines.length - 1) * 7;
    const sector = document.createElementNS(svgNs, 'g');
    sector.setAttribute('class', 'portfolio-sector');
    sector.setAttribute('role', 'button');
    sector.setAttribute('tabindex', '0');
    sector.setAttribute('aria-pressed', 'false');
    sector.setAttribute('aria-label', `Sahabat ${name}: ${description}`);
    sector.setAttribute('data-portfolio-index', String(index));
    sector.style.setProperty('--sector-delay', `${index * 90}ms`);

    const slice = document.createElementNS(svgNs, 'path');
    slice.setAttribute('d', `M${x0} ${y0} A${outerRadius} ${outerRadius} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${innerRadius} ${innerRadius} 0 0 0 ${x3} ${y3} Z`);
    slice.setAttribute('class', 'portfolio-slice');
    slice.setAttribute('fill', index % 2 ? '#102f4d' : '#087b60');
    sector.append(slice);
    addSvgText(sector, 'SAHABAT', textX, detailTop - 37, 'portfolio-label');
    addSvgText(sector, name, textX, detailTop - 15, 'portfolio-name');
    lines.forEach((line, lineIndex) => addSvgText(sector, line, textX, detailTop + lineIndex * 15, 'portfolio-description'));
    portfolioSvg.append(sector);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'portfolio-card';
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('data-portfolio-index', String(index));
    const label = document.createElement('strong');
    label.textContent = 'SAHABAT';
    const title = document.createElement('b');
    title.textContent = name;
    const detail = document.createElement('span');
    detail.textContent = description;
    card.append(label, title, detail);
    portfolioCards.append(card);
  });

  const hub = document.createElementNS(svgNs, 'g');
  hub.setAttribute('class', 'portfolio-hub');
  const halo = document.createElementNS(svgNs, 'circle');
  halo.setAttribute('cx', center); halo.setAttribute('cy', center); halo.setAttribute('r', '64');
  halo.setAttribute('class', 'portfolio-halo');
  const core = document.createElementNS(svgNs, 'circle');
  core.setAttribute('cx', center); core.setAttribute('cy', center); core.setAttribute('r', '58');
  core.setAttribute('class', 'portfolio-core');
  hub.append(halo, core);
  addSvgText(hub, 'MASJID', center, center + 2, 'portfolio-hub-title');
  const divider = document.createElementNS(svgNs, 'path');
  divider.setAttribute('d', 'M276 310H324'); divider.setAttribute('class', 'portfolio-hub-divider');
  hub.append(divider);
  addSvgText(hub, 'SEJAHTERA', center, center + 27, 'portfolio-hub-subtitle');
  portfolioSvg.append(hub);

  const selectPortfolio = (index) => {
    portfolioSvg.querySelectorAll('.portfolio-sector').forEach((sector) => {
      const active = sector.dataset.portfolioIndex === String(index);
      sector.classList.toggle('is-active', active);
      sector.setAttribute('aria-pressed', String(active));
    });
    portfolioCards.querySelectorAll('.portfolio-card').forEach((card) => {
      const active = card.dataset.portfolioIndex === String(index);
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    });
  };
  [portfolioSvg, portfolioCards].forEach((diagram) => {
    diagram.addEventListener('click', (event) => {
      const sector = event.target.closest('[data-portfolio-index]');
      if (sector) selectPortfolio(sector.dataset.portfolioIndex);
    });
    diagram.addEventListener('keydown', (event) => {
      const sector = event.target.closest('[data-portfolio-index]');
      if (sector && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        selectPortfolio(sector.dataset.portfolioIndex);
      }
    });
  });
}

