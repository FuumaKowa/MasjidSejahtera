const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (!event.target.closest('a, button')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
});

let selectedControls = [];
const clearDiagramSelection = () => {
  document.querySelectorAll('.sel,.dm').forEach((item) => item.classList.remove('sel','dm'));
  selectedControls.forEach((item) => item.setAttribute('aria-pressed','false'));
  selectedControls = [];
};
const selectDiagramItems = (allItems, selectedItems, controls = []) => {
  const all = [...new Set(allItems.filter(Boolean))];
  const hits = [...new Set(selectedItems.filter(Boolean))];
  const alreadySelected = hits.length > 0 && hits.every((item) => item.classList.contains('sel'));
  clearDiagramSelection();
  if (alreadySelected) return;
  all.forEach((item) => {
    item.classList.add(hits.includes(item) ? 'sel' : 'dm');
    item.classList.toggle('is-active', hits.includes(item));
  });
  selectedControls = controls.filter(Boolean);
  selectedControls.forEach((item) => item.setAttribute('aria-pressed', String(hits.includes(item))));
};
const cityItems = [...document.querySelectorAll('#kota-suci .city-item')];
const impactRoot = document.getElementById('impak');
const objectiveRoot = document.getElementById('objektif');
const portfolioRoot = document.querySelector('#portfolio .portfolio-role-map');

const functionRoot = document.getElementById('fungsi');
const functionLines = [...(functionRoot?.querySelectorAll('.function-line') || [])];
const functionFlowParticles = [];
if (functionRoot && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const svg = functionRoot.querySelector('.function-map > svg');
  const svgNs = 'http://www.w3.org/2000/svg';
  functionLines.forEach((line, index) => {
    const particle = document.createElementNS(svgNs, 'circle');
    particle.setAttribute('class', 'function-flow-particle');
    particle.dataset.connectorIndex = String(index);
    particle.setAttribute('r', '1.25');
    particle.setAttribute('aria-hidden', 'true');
    const motion = document.createElementNS(svgNs, 'animateMotion');
    motion.setAttribute('dur', `${3.2 + (index % 3) * 0.3}s`);
    motion.setAttribute('begin', `${index * 0.35}s`);
    motion.setAttribute('repeatCount', 'indefinite');
    motion.setAttribute('path', line.getAttribute('d'));
    particle.append(motion);
    svg?.append(particle);
    functionFlowParticles.push(particle);
  });
}
const stageNodes = [...document.querySelectorAll('#aliran .stage-node')];
const stageColumns = [...document.querySelectorAll('#aliran .stage-co')];
stageNodes.forEach((node, index) => {
  const column = stageColumns[index];
  const label = column?.innerText.replace(/\\s+/g,' ').trim() || 'Peringkat';
  node.dataset.stageIndex = String(index);
  node.setAttribute('role','button');
  node.setAttribute('tabindex','0');
  node.setAttribute('aria-label',label);
  node.setAttribute('aria-pressed','false');
  if (column) {
    column.dataset.stageIndex = String(index);
    column.setAttribute('role','button');
    column.setAttribute('tabindex','0');
    column.setAttribute('aria-pressed','false');
    column.setAttribute('aria-label',label);
  }
});
document.addEventListener('click', (event) => {
  const city = event.target.closest('#kota-suci .city-item');
  if (city) {
    selectDiagramItems(cityItems,[city],cityItems);
    return;
  }
  const layer = event.target.closest('#impak [data-layer]');
  if (layer) {
    const items = [...impactRoot.querySelectorAll('[data-layer]')];
    const linked = items.filter((item) => item.dataset.layer === layer.dataset.layer);
    selectDiagramItems(items,linked,linked.filter((item) => item.matches('button,[role="button"]')));
    return;
  }
  const objectiveCard = event.target.closest('#objektif .objective-card');
  const objectiveVertex = event.target.closest('#objektif .objective-vertex');
  if (objectiveCard || objectiveVertex) {
    const cards = [...objectiveRoot.querySelectorAll('.objective-card')];
    const vertices = [...objectiveRoot.querySelectorAll('.objective-vertex')];
    const selected = objectiveCard || cards[Number(objectiveVertex.dataset.index)];
    const index = cards.indexOf(selected);
    const vertex = vertices[index];
    selectDiagramItems([...cards,...vertices],[selected,vertex],cards);
    return;
  }
  const programme = event.target.closest('#teras-iman .program-steps button,#teras-madinah .program-stack button,#teras-maqdis .maqdis-programs button');
  if (programme) {
    const root = programme.closest('.program-steps,.program-stack,.maqdis-programs');
    const cards = [...root.querySelectorAll('button')];
    selectDiagramItems(cards,[programme],cards);
    return;
  }
  const roleCard = event.target.closest('#portfolio .portfolio-role-card');
  if (roleCard) {
    const cards = [...portfolioRoot.querySelectorAll('.portfolio-role-card')];
    selectDiagramItems(cards,[roleCard],cards);
    return;
  }
  const groupHeading = event.target.closest('#portfolio .portfolio-role-group h3 button');
  if (groupHeading) {
    const groups = [...portfolioRoot.querySelectorAll('.portfolio-role-group')];
    const group = groupHeading.closest('.portfolio-role-group');
    selectDiagramItems(groups,[group],[...portfolioRoot.querySelectorAll('.portfolio-role-group h3 button')]);
    return;
  }
  const functionNode = event.target.closest('#fungsi .function-node');
  if (functionNode) {
    const nodes = [...functionRoot.querySelectorAll('.function-node')];
    const lines = functionLines;
    const lineIndexByNode = {
      'function-knowledge': 0,
      'function-economy': 4,
      'function-worship': 1,
      'function-consensus': 3,
      'function-education': 2
    };
    const nodeKey = [...functionNode.classList].find((name) => Object.hasOwn(lineIndexByNode, name));
    const lineIndex = lineIndexByNode[nodeKey];
    const line = lines[lineIndex];
    const particle = functionFlowParticles[lineIndex];
    selectDiagramItems([...nodes,...lines,...functionFlowParticles],[functionNode,line,particle],nodes);
    return;
  }
  const stageControl = event.target.closest('#aliran .stage-node,#aliran .stage-co');
  if (stageControl) {
    const index = Number(stageControl.dataset.stageIndex);
    const linked = [stageNodes[index],stageColumns[index]];
    selectDiagramItems([...stageNodes,...stageColumns],linked,[...stageNodes,...stageColumns]);
    return;
  }
  clearDiagramSelection();
});
document.addEventListener('keydown',(event) => {
  if (event.key === 'Escape') {
    clearDiagramSelection();
    return;
  }
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('#aliran .stage-node,#aliran .stage-co,#objektif .objective-vertex')) {
    event.preventDefault();
    event.target.click();
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

const referenceSections = ['kota-suci', 'impak', 'objektif', 'portfolio', 'fungsi', 'sahabat', 'aliran', 'dimensi', 'penutup']
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

const impactVisual = document.querySelector('#impak .impact-visual');
if (impactVisual) {
  const highlightLayer = (key, active) => {
    impactVisual.querySelectorAll(`[data-layer="${key}"]`).forEach((item) => item.classList.toggle('is-hover', active));
  };
  impactVisual.querySelectorAll('[data-layer]').forEach((item) => {
    item.addEventListener('pointerenter', () => highlightLayer(item.dataset.layer, true));
    item.addEventListener('pointerleave', () => highlightLayer(item.dataset.layer, false));
    item.addEventListener('focus', () => highlightLayer(item.dataset.layer, true));
    item.addEventListener('blur', () => highlightLayer(item.dataset.layer, false));
    if (item.getAttribute('role') === 'button') {
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
        }
      });
    }
  });
}

const navGroups = [
  { selector: '.main-nav a[href="#kota-suci"]', sections: ['kota-suci','impak','objektif','teras-iman','teras-madinah','teras-maqdis'] },
  { selector: '.main-nav a[href="#sahabat"]', sections: ['sahabat','portfolio'] },
  { selector: '.main-nav a[href="#hubungi"]', sections: ['hubungi'] }
];
const navTargets = navGroups.flatMap((group) => group.sections.map((id) => ({ group, section: document.getElementById(id) })).filter((entry) => entry.section));
const setCurrentNav = (group) => document.querySelectorAll('.main-nav a').forEach((link) => {
  const active = Boolean(group && link.matches(group.selector));
  link.classList.toggle('is-current',active);
  if (active) link.setAttribute('aria-current','location');
  else link.removeAttribute('aria-current');
});
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(() => {
    const top = innerHeight * .38;
    const bottom = innerHeight * .62;
    const current = navTargets.map((item) => ({ ...item, rect: item.section.getBoundingClientRect() }))
      .filter((item) => item.rect.top < bottom && item.rect.bottom > top)
      .sort((a,b) => Math.min(b.rect.bottom,bottom)-Math.max(b.rect.top,top) - (Math.min(a.rect.bottom,bottom)-Math.max(a.rect.top,top)))[0];
    setCurrentNav(current?.group || null);
  }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
  navTargets.forEach((item) => navObserver.observe(item.section));
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

const objectiveNetwork = document.querySelector('#objektif .objective-network');
const objectiveSvg = objectiveNetwork?.querySelector('.objective-constellation');
if (objectiveNetwork && objectiveSvg) {
  const svgNs = 'http://www.w3.org/2000/svg';
  const center = [600, 300];
  const radius = 180;
  const points = Array.from({ length: 5 }, (_, index) => {
    const angle = (-90 + index * 72) * Math.PI / 180;
    return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
  });
  const addLine = (from, to, className, delay) => {
    const path = document.createElementNS(svgNs, 'path');
    path.setAttribute('class', `objective-line ${className}`);
    path.setAttribute('d', `M${from[0].toFixed(2)} ${from[1].toFixed(2)}L${to[0].toFixed(2)} ${to[1].toFixed(2)}`);
    objectiveSvg.append(path);
    path.style.setProperty('--line-length', path.getTotalLength().toFixed(2));
    path.style.setProperty('--line-delay', `${delay}ms`);
  };

  const fill = document.createElementNS(svgNs, 'polygon');
  fill.setAttribute('class', 'objective-pentagon');
  fill.setAttribute('points', points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '));
  objectiveSvg.append(fill);

  points.forEach((point, index) => addLine(point, points[(index + 1) % points.length], 'objective-outline', index * 110));
  [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]].forEach(([from, to], index) => {
    addLine(points[from], points[to], 'objective-starline', 560 + index * 110);
  });
  const leaderEnds = [[600, 88], [846, 244.37], [840, 452], [360, 452], [354, 244.37]];
  points.forEach((point, index) => addLine(point, leaderEnds[index], 'objective-leader', 1120 + index * 110));

  const starPoints = (cx, cy, outer, inner) => Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 5;
    const radius = index % 2 ? inner : outer;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
  points.forEach(([x, y], index) => {
    const marker = document.createElementNS(svgNs, 'g');
    marker.setAttribute('class', 'objective-vertex');
    marker.setAttribute('role','button');
    marker.setAttribute('tabindex','0');
    marker.setAttribute('aria-pressed','false');
    marker.dataset.index = String(index);
    marker.style.setProperty('--node-delay', `${950 + index * 130}ms`);
    const circle = document.createElementNS(svgNs, 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', '13');
    circle.setAttribute('fill', index % 2 ? '#078360' : '#102f4d');
    circle.setAttribute('stroke', '#c5a34d'); circle.setAttribute('stroke-width', '2.2');
    const star = document.createElementNS(svgNs, 'polygon');
    star.setAttribute('points', starPoints(x, y, 7.3, 3.2));
    star.setAttribute('fill', '#f0d37a');
    marker.append(circle, star);
    objectiveSvg.append(marker);
  });

  const cards = [...objectiveNetwork.querySelectorAll('.objective-card')];
  const setVertex = (index, active) => objectiveSvg.querySelector(`[data-index="${index}"]`)?.classList.toggle('hot', active);
  cards.forEach((card, index) => {
    card.addEventListener('pointerenter', () => setVertex(index, true));
    card.addEventListener('pointerleave', () => setVertex(index, false));
    card.addEventListener('focus', () => setVertex(index, true));
    card.addEventListener('blur', () => setVertex(index, false));
  });
}


const registrationDialog = document.getElementById('registration-dialog');
const registrationForm = document.getElementById('registration-form');
const registrationStatus = document.getElementById('registration-status');
let registrationTrigger = null;
document.querySelectorAll('[data-open-registration]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    registrationTrigger = trigger;
    registrationStatus.hidden = true;
    registrationDialog.showModal();
    document.getElementById('registration-name').focus();
  });
});
document.querySelectorAll('[data-close-registration]').forEach((button) => {
  button.addEventListener('click', () => registrationDialog.close());
});
registrationDialog.addEventListener('click', (event) => {
  if (event.target === registrationDialog) registrationDialog.close();
});
registrationDialog.addEventListener('close', () => registrationTrigger?.focus());
registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  registrationForm.reset();
  registrationStatus.hidden = false;
});
