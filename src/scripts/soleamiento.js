// Estudio de soleamiento sobre el Ensanche de Bilbao y Abandoibarra.
// El puntero elige el momento: horizontal = hora (amanecer -> ocaso),
// vertical = fecha (arriba solsticio de verano, abajo solsticio de invierno).
// La posición del sol se calcula con la geometría solar real de Bilbao.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const LAT = THREE.MathUtils.degToRad(43.263);
const MAX_DECL = 23.44;
const MIN_ALT = 3; // por debajo, la luz deja de tener sentido en la escena

const { sin, cos, tan, asin, acos, atan2 } = Math;
const rad = THREE.MathUtils.degToRad;
const deg = THREE.MathUtils.radToDeg;

/** Posición del sol para una declinación (grados) y una hora solar (h). */
function sunPosition(declDeg, hour) {
  const d = rad(declDeg);
  const H = rad(15 * (hour - 12));
  const alt = asin(sin(LAT) * sin(d) + cos(LAT) * cos(d) * cos(H));
  const az = atan2(sin(H), cos(H) * sin(LAT) - tan(d) * cos(LAT)) + Math.PI; // desde el norte
  return { az: deg(az), alt: deg(alt) };
}

/** Horas de orto y ocaso (hora solar) para una declinación. */
function dayLength(declDeg) {
  const H0 = deg(acos(-tan(LAT) * tan(rad(declDeg))));
  return [12 - H0 / 15, 12 + H0 / 15];
}

/** Fecha aproximada (mitad dic -> jun) para una declinación, como '21 mar'. */
function dateFor(declDeg) {
  const f = acos(-declDeg / MAX_DECL) / Math.PI; // 0 = 21 dic, 1 = 21 jun
  const day = new Date(Date.UTC(2025, 11, 21) + f * 182.6 * 864e5);
  return day.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '');
}

export async function initSoleamiento(root) {
  const canvas = root.querySelector('canvas');
  const hero = root.parentElement;
  const readout = {
    date: hero.querySelector('[data-date]'),
    az: hero.querySelector('[data-az]'),
    alt: hero.querySelector('[data-alt]'),
    hour: hero.querySelector('[data-hour]'),
  };
  const css = getComputedStyle(document.documentElement);
  const color = (v) => new THREE.Color(css.getPropertyValue(v).trim());

  const data = await fetch(root.dataset.src).then((r) => r.json());

  // --- Escena -----------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 6000);

  // Axonometría: mirando desde el sureste, para que la ría cruce en diagonal.
  const target = new THREE.Vector3(-140, 0, 210);
  camera.position.set(target.x + 1100, 1150, target.z + 1300);
  camera.lookAt(target);

  scene.add(new THREE.HemisphereLight(0xffffff, color('--paper-2'), 1.7));
  const sun = new THREE.DirectionalLight(0xffffff, 2.9);
  sun.castShadow = true;
  const shadowRes = Math.min(renderer.capabilities.maxTextureSize, window.innerWidth < 700 ? 4096 : 8192);
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  Object.assign(sun.shadow.camera, { left: -2600, right: 2600, top: 2600, bottom: -2600, near: 1, far: 9000 });
  sun.target.position.copy(target);
  scene.add(sun, sun.target);

  // Suelo: el papel es el fondo de la página; aquí solo se pintan las sombras,
  // como una aguada de tinta. Va por encima del agua y los parques.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(6000, 6000).rotateX(-Math.PI / 2),
    new THREE.ShadowMaterial({ color: color('--ink'), opacity: 0.2 })
  );
  ground.position.y = 0.4;
  ground.receiveShadow = true;
  scene.add(ground);

  const toShape = ({ o, i }) => {
    const s = new THREE.Shape(o.map(([x, y]) => new THREE.Vector2(x, y)));
    s.holes = i.map((h) => new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    return s;
  };
  // Planos horizontales (agua, parques) ligeramente sobre el suelo.
  const flat = (items, c, y) => {
    if (!items.length) return;
    const g = new THREE.ShapeGeometry(items.map(toShape)).rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: c }));
    m.position.y = y;
    scene.add(m);
  };
  flat(data.water, new THREE.Color('#c4ced6'), 0.2);
  flat(data.parks, new THREE.Color('#d7ddd3'), 0.1);

  // Edificios extruidos y fusionados en una sola malla.
  const geoms = data.buildings.map((b) =>
    new THREE.ExtrudeGeometry(toShape(b), { depth: b.h, bevelEnabled: false }).rotateX(-Math.PI / 2)
  );
  const city = mergeGeometries(geoms);
  geoms.forEach((g) => g.dispose());
  const blocks = new THREE.Mesh(city, new THREE.MeshLambertMaterial({ color: 0xfafbfc }));
  blocks.castShadow = blocks.receiveShadow = true;
  scene.add(blocks);

  // Aristas en tinta, como un dibujo de línea.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(city, 25),
    new THREE.LineBasicMaterial({ color: color('--ink'), transparent: true, opacity: 0.26 })
  );
  scene.add(edges);

  // --- Sol ----------------------------------------------------------------
  // u: fracción del día (0 orto, 1 ocaso). decl: declinación solar en grados.
  const state = { u: 0.62, decl: 8 };
  const goal = { ...state };

  const placeSun = () => {
    const [rise, set] = dayLength(state.decl);
    const hour = rise + (set - rise) * (0.04 + state.u * 0.92);
    const pos = sunPosition(state.decl, hour);
    const az = rad(pos.az);
    const alt = rad(Math.max(pos.alt, MIN_ALT));
    // x = este, y = arriba, -z = norte. Azimut desde el norte en sentido horario.
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt));
    sun.position.copy(target).addScaledVector(dir, 4000);
    // Con el sol bajo, la luz se calienta un poco.
    const warm = 1 - THREE.MathUtils.smoothstep(pos.alt, MIN_ALT, 25);
    sun.color.setRGB(1, 1 - warm * 0.12, 1 - warm * 0.3);

    readout.date.textContent = dateFor(state.decl);
    readout.az.textContent = `${Math.round(pos.az)}°`;
    readout.alt.textContent = `${Math.max(0, Math.round(pos.alt))}°`;
    const hh = Math.floor(hour);
    const mm = Math.floor(((hour - hh) * 60) / 5) * 5;
    readout.hour.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const resize = () => {
    const { width, height } = root.getBoundingClientRect();
    renderer.setSize(width, height, false);
    // Encuadre: unos 1.400 m de ciudad en el lado más corto, centrado un poco a la izquierda del modelo.
    const span = width < 700 ? 1100 : 1420;
    const aspect = width / height;
    const half = aspect > 1 ? span / 2 : span / 2 / aspect;
    camera.left = -half * aspect;
    camera.right = half * aspect;
    // En vertical, la ciudad baja para dejar el texto arriba sobre papel.
    const shift = aspect < 0.8 ? 0.3 : 0;
    camera.top = half * (1 + shift);
    camera.bottom = -half * (1 - shift);
    camera.updateProjectionMatrix();
    dirty = true;
  };

  // --- Interacción ----------------------------------------------------------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dirty = true;
  let touched = false;

  const aim = (clientX, clientY) => {
    const r = root.getBoundingClientRect();
    const u = THREE.MathUtils.clamp((clientX - r.left) / r.width, 0, 1);
    const v = THREE.MathUtils.clamp((clientY - r.top) / r.height, 0, 1);
    goal.u = u;
    goal.decl = MAX_DECL - v * 2 * MAX_DECL;
    touched = true;
  };
  root.addEventListener('pointermove', (e) => aim(e.clientX, e.clientY));
  root.addEventListener('pointerdown', (e) => aim(e.clientX, e.clientY));

  // Teclado: flechas mueven el sol cuando la escena tiene el foco.
  root.addEventListener('keydown', (e) => {
    const big = e.shiftKey ? 3 : 1;
    const map = { ArrowLeft: ['u', -0.03], ArrowRight: ['u', 0.03], ArrowUp: ['decl', 2], ArrowDown: ['decl', -2] };
    if (!map[e.key]) return;
    e.preventDefault();
    const [k, d] = map[e.key];
    const [lo, hi] = k === 'u' ? [0, 1] : [-MAX_DECL, MAX_DECL];
    goal[k] = THREE.MathUtils.clamp(goal[k] + d * big, lo, hi);
    touched = true;
  });

  new ResizeObserver(resize).observe(root);
  resize();

  // Al cargar, el sol recorre medio día una sola vez hasta que el usuario lo toma.
  const t0 = performance.now();
  const intro = (t) => {
    const k = Math.min((t - t0) / 6000, 1);
    const e = 1 - Math.pow(1 - k, 3);
    goal.u = 0.1 + e * 0.52;
    goal.decl = 8;
    return k < 1;
  };
  let introRunning = !reduceMotion;
  if (reduceMotion) Object.assign(state, goal);

  const tick = (t) => {
    if (introRunning && !touched) introRunning = intro(t);
    const k = reduceMotion ? 1 : 0.08;
    const dU = goal.u - state.u;
    const dDecl = goal.decl - state.decl;
    if (Math.abs(dU) > 0.0005 || Math.abs(dDecl) > 0.01) {
      state.u += dU * k;
      state.decl += dDecl * k;
      dirty = true;
    }
    if (dirty) {
      placeSun();
      renderer.render(scene, camera);
      dirty = false;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  root.classList.add('is-ready');
}
