// Red de trayectoria: experiencias que se conectan con conocimientos.
// El scroll dentro de la sección avanza el tiempo; los conocimientos crecen
// con cada conexión. Las burbujas con contenido se abren al hacer clic.

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
};

export function initNetwork(root) {
  const data = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
  const { experiences, skills, lines, from, to } = data;
  const stage = root.querySelector('.stage');
  const svg = root.querySelector('svg');
  const yearOut = root.querySelector('[data-year]');
  const presentBtn = root.querySelector('[data-present]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let year = from;
  let nodes = {};
  let pendingOpen = null;

  // --- Maquetación -----------------------------------------------------------
  // Horizontal (escritorio): tiempo en x, experiencias arriba, conocimientos abajo.
  // Vertical (móvil): tiempo en y, experiencias a la izquierda, conocimientos a la derecha.
  function build() {
    svg.replaceChildren();
    const { width, height } = stage.getBoundingClientRect();
    const vertical = width < 760;
    const W = width;
    const H = height;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const pad = vertical ? 24 : 56;
    const tAxis = (y) => (y - from) / (to - from);
    const rows = assignRows(experiences);
    const nRows = Math.max(...Object.values(rows)) + 1;

    const pos = {};
    if (!vertical) {
      const x0 = pad + 40;
      const x1 = W - pad - 170; // columna libre a la derecha para Other stuff
      const yTop = 72;
      const rowGap = Math.min(52, (H * 0.5) / nRows);
      experiences.forEach((e) => {
        pos[e.id] = { x: x0 + tAxis(e.start) * (x1 - x0), y: yTop + rows[e.id] * rowGap, x1: x0 + tAxis(e.end ?? to) * (x1 - x0) };
      });
      const yS = H * 0.74;
      skills.forEach((s, i) => {
        // agrupados por línea, con un hueco entre líneas
        const g = lines.findIndex((l) => l.id === s.line);
        const slot = i + g * 0.8;
        const total = skills.length - 1 + (lines.length - 1) * 0.8;
        pos[s.id] = { x: x0 + (slot / total) * (x1 - x0), y: yS };
      });
      // eje de años
      const axis = el('g', { class: 'axis' }, svg);
      for (let y = from; y <= to; y++) {
        const x = x0 + tAxis(y) * (x1 - x0);
        el('line', { x1: x, x2: x, y1: yTop - 42, y2: yTop - 34 }, axis);
        if (y % 2 === 0 || y === to) el('text', { x, y: yTop - 50, 'text-anchor': 'middle' }, axis).textContent = y;
      }
    } else {
      const y0 = pad + 28;
      const y1 = H - pad - 28;
      const colGap = Math.min(26, (W * 0.34) / nRows);
      experiences.forEach((e) => {
        pos[e.id] = { x: 34 + rows[e.id] * colGap, y: y0 + tAxis(e.start) * (y1 - y0), y1: y0 + tAxis(e.end ?? to) * (y1 - y0) };
      });
      skills.forEach((s, i) => {
        const g = lines.findIndex((l) => l.id === s.line);
        const slot = i + g * 0.8;
        const total = skills.length - 1 + (lines.length - 1) * 0.8;
        pos[s.id] = { x: W - 150, y: y0 + (slot / total) * (y1 - y0) };
      });
    }

    // --- Conexiones ----------------------------------------------------------
    const gEdges = el('g', { class: 'edges' }, svg);
    const edges = [];
    experiences.forEach((e) =>
      e.links.forEach(([sid, y]) => {
        const a = pos[e.id];
        const b = pos[sid];
        const d = vertical
          ? `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`
          : `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`;
        const p = el('path', { d, class: `edge line-${skills.find((s) => s.id === sid).line}` }, gEdges);
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        edges.push({ p, len, year: y, skill: sid });
      })
    );

    // --- Duración de cada experiencia ----------------------------------------
    const gSpans = el('g', { class: 'spans' }, svg);
    const spans = experiences.map((e) => {
      const a = pos[e.id];
      const l = vertical
        ? el('line', { x1: a.x, x2: a.x, y1: a.y, y2: a.y }, gSpans)
        : el('line', { x1: a.x, x2: a.x, y1: a.y, y2: a.y }, gSpans);
      return { e, l, a };
    });

    // --- Conocimientos -------------------------------------------------------
    const gSkills = el('g', { class: 'skills' }, svg);
    const skillNodes = {};
    skills.forEach((s) => {
      const p = pos[s.id];
      const g = el('g', { class: `skill line-${s.line}`, transform: `translate(${p.x},${p.y})` }, gSkills);
      const c = el('circle', { r: 3 }, g);
      const t = el(
        'text',
        vertical
          ? { x: 16, y: 4, 'text-anchor': 'start' }
          : { x: 4, y: 22, 'text-anchor': 'end', transform: 'rotate(-40)' },
        g
      );
      t.textContent = s.label;
      skillNodes[s.id] = { g, c };
    });

    // --- Experiencias --------------------------------------------------------
    const gExp = el('g', { class: 'experiences' }, svg);
    const expNodes = {};
    experiences.forEach((e) => {
      const p = pos[e.id];
      const open = Boolean(e.inside);
      const g = el('g', { class: `exp${open ? ' can-open' : ''}`, transform: `translate(${p.x},${p.y})` }, gExp);
      if (open) {
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `${e.label}: ${e.detail}. Open`);
        g.addEventListener('click', () => enter(e, g));
        g.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            enter(e, g);
          }
        });
      }
      // La burbuja crece cuando el scroll pasa por su año y luego vuelve a su tamaño.
      const bub = el('g', { class: 'bub' }, g);
      el('circle', { r: open ? 11 : 7, class: 'dot' }, bub);
      if (open) el('circle', { r: 17, class: 'halo' }, bub);
      const t = el('text', vertical ? { x: 10, y: -12, class: 'name' } : { x: 16, y: -10, class: 'name' }, g);
      const d = el('text', vertical ? { x: 10, y: 26, class: 'detail' } : { x: 30, y: 30, class: 'detail' }, g);
      d.textContent = e.detail.length > 70 ? `${e.detail.slice(0, 68).trim()}…` : e.detail;
      // En el móvil (vertical) el nombre corto, para no pisar los conocimientos
      t.textContent = vertical ? (e.short ?? e.label.split(',')[0]) : e.label;
      expNodes[e.id] = g;
    });

    svg.classList.toggle('is-vertical', vertical);
    nodes = { edges, spans, skillNodes, expNodes, vertical };
    render();

    if (pendingOpen) {
      const which = pendingOpen;
      pendingOpen = null;
      const target =
        which === 'other'
          ? root.querySelector('[data-open-other]')
          : expNodes[{ etsam: 'etsam', unav: 'unav-master', idom: 'idom', phd: 'phd' }[which]];
      history.replaceState(null, '', location.pathname);
      requestAnimationFrame(() => openBubble(document.getElementById(`bubble-${which}`), target));
    }
  }

  // Asigna filas para que ni las etiquetas ni las barras de duración se pisen:
  // una fila se reutiliza solo cuando la experiencia anterior ya ha terminado.
  function assignRows(list) {
    const rows = {};
    const freeFrom = [];
    [...list]
      .sort((a, b) => a.start - b.start)
      .forEach((e) => {
        let r = freeFrom.findIndex((x) => x <= e.start);
        if (r === -1) r = freeFrom.length;
        freeFrom[r] = (e.end ?? to) + 0.8;
        rows[e.id] = r;
      });
    return rows;
  }

  // --- Estado según el año -----------------------------------------------------
  function render() {
    const { edges, spans, skillNodes, expNodes, vertical } = nodes;
    if (!edges) return;
    const count = {};
    edges.forEach(({ p, len, year: y, skill }) => {
      const k = Math.min(Math.max(year - y + 0.6, 0), 1); // se dibuja en ~medio año
      p.style.strokeDashoffset = len * (1 - k);
      if (k > 0.5) count[skill] = (count[skill] || 0) + 1;
    });
    Object.entries(skillNodes).forEach(([id, { g, c }]) => {
      const n = count[id] || 0;
      c.setAttribute('r', n ? (vertical ? 4 + n * 2 : 5 + n * 4) : 3);
      g.classList.toggle('on', n > 0);
    });
    spans.forEach(({ e, l, a }) => {
      const endT = Math.min(year, e.end ?? data.to);
      const k = Math.max(0, (endT - e.start) / ((e.end ?? data.to) - e.start || 1));
      if (vertical) l.setAttribute('y2', a.y + (a.y1 - a.y) * Math.min(k, 1));
      else l.setAttribute('x2', a.x + (a.x1 - a.x) * Math.min(k, 1));
    });
    experiences.forEach((e) => {
      const g = expNodes[e.id];
      g.classList.toggle('on', year >= e.start - 0.05);
      // Pulso: máximo justo después de su año de inicio, ~1 año de duración.
      const k = Math.exp(-(((year - e.start - 0.35) / 0.45) ** 2));
      g.querySelector('.bub').style.transform = `scale(${1 + k * 1.6})`;
      g.querySelector('.detail').style.opacity = String(Math.max(0, (k - 0.25) / 0.75));
      g.querySelector('.name').style.transform = `translate(${k * 18}px, ${-k * 10}px)`;
      g.classList.toggle('pulse', k > 0.5);
    });
    yearOut.textContent = Math.floor(year);
  }

  // --- Scroll -> año --------------------------------------------------------------
  const onScroll = () => {
    const r = root.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    const k = Math.min(Math.max(-r.top / travel, 0), 1);
    year = from + k * (to - from + 0.6);
    render();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  presentBtn.addEventListener('click', () => {
    const r = root.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.bottom - window.innerHeight, behavior: reduce ? 'auto' : 'smooth' });
  });

  // --- Entrar en una burbuja ------------------------------------------------------
  function enter(e, g) {
    const inside = e.inside;
    const id = inside.kind === 'archive' ? inside.group : inside.id;
    openBubble(document.getElementById(`bubble-${id}`), g);
  }

  root.querySelector('[data-open-other]')?.addEventListener('click', (ev) => {
    openBubble(document.getElementById('bubble-other'), ev.currentTarget);
  });

  // Abre el diálogo como un círculo que crece desde el elemento pulsado.
  function openBubble(dialog, g) {
    const b = g.getBoundingClientRect();
    dialog.style.setProperty('--x', `${b.left + b.width / 2}px`);
    dialog.style.setProperty('--y', `${b.top + b.height / 2}px`);
    // Radio final: casi toda la pantalla, de modo que el borde de la burbuja
    // asoma en las esquinas y recuerda que estás dentro de ella.
    dialog.style.setProperty('--r', `${Math.round((Math.hypot(innerWidth, innerHeight) / 2) * 0.93)}px`);
    dialog.showModal();
    dialog.addEventListener('close', () => g.focus(), { once: true });
  }

  new ResizeObserver(() => build()).observe(stage);
  onScroll();

  // Abrir una burbuja desde un enlace: /#open-etsam, /#open-unav, /#open-idom, /#open-phd, /#open-other.
  // Se resuelve tras el primer dibujado de la red (ver build).
  pendingOpen = location.hash.match(/^#open-(etsam|unav|idom|phd|other)$/)?.[1] ?? null;
  if (pendingOpen) {
    const r = root.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.bottom - window.innerHeight, behavior: 'auto' });
  }
}

// Cierre de los diálogos-burbuja con animación inversa.
export function initBubbles() {
  document.querySelectorAll('dialog.bubble').forEach((d) => {
    d.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => d.close()));
    d.addEventListener('click', (ev) => {
      if (ev.target === d) d.close();
    });
  });
}
