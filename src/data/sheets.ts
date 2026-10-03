// Composición de cada ficha de proyecto. Cada una es una lámina propia, pensada
// para sus dibujos: una retícula CSS con áreas con nombre.
//
// Valores de cada celda:
//   'a:NN'      imagen del archivo (src/assets/archive/<slug>/NN.jpg)
//   'c:nombre'  recorte para la composición (src/assets/compose/<slug>/nombre.jpg)
//   ['a:..', …] varias imágenes en fila dentro de la celda
//   'text'      texto y enlaces del proyecto
//   'catalogue' catálogo de píxeles (Piel bioperfectible)
//   'typologies' tipologías de vivienda (Lyulin)
//   'flipbook'  fotos de maqueta que se recorren con el ratón (Macael)
//   'stack:ref,ref'  varias imágenes apiladas en la celda, con su pie (ver `captions`)
//   'reveal:ref,ref' imágenes apiladas que aparecen una a una al bajar
// El orden de `cells` es el orden en el móvil, donde todo va apilado.
// Las imágenes 'a:' usadas aquí no se repiten en la galería de debajo.

export type Cell = string | string[];

export type Sheet = {
  // Plano a todo el ancho, como fondo, con el texto del proyecto encima en una tarjeta translúcida
  backdrop?: string;
  // Panel completo a pantalla entera al final, que se recorre en horizontal al bajar
  scroller?: string;
  // Una única imagen a sangre, sin composición (el texto va arriba, como introducción)
  bleed?: string;
  // Dos o más imágenes una junto a otra, a sangre (p. ej. dos pósters)
  pair?: string[];
  // Imágenes a sangre justo debajo del plano de fondo, antes de la lámina
  lead?: string[];
  // Imágenes a sangre después de la lámina (secciones de lado a lado)
  after?: string[];
  // Ancho de esas imágenes si no van a sangre completa (p. ej. '80%')
  afterWidth?: string;
  // Una fila de dibujos con su título, a todo el ancho, justo después de la lámina
  // sameScale: cada columna tan ancha como su recorte, para que todos los dibujos
  // (recortados de láminas a la misma escala) se vean a la misma escala
  band?: { refs: string[]; titles?: string[]; sameScale?: boolean };
  // Filas de cajas con filete fino (detalles constructivos), a la misma altura
  boxes?: string[][];
  // Tira horizontal de fotos pequeñas que ocupa todo el ancho, al final
  strip?: string[];
  // Axonometría explotada interactiva al final
  axo?: { src: string; title: string; intro: string; spots: { x: number; y: number; label: string; text: string }[] };
  // Pies de imagen por referencia
  captions?: Record<string, string>;
  // Celdas que se quedan fijas mientras se recorre la lámina (p. ej. el texto junto a un póster)
  sticky?: string[];
  columns: string;
  areas: string[];
  cells: Record<string, Cell>;
  align?: Record<string, 'start' | 'end' | 'center'>;
  // Ancho máximo de una celda (p. ej. '760px') para que un dibujo no crezca de más
  maxw?: Record<string, string>;
};

export const sheets: Record<string, Sheet> = {
  // La torre: a la izquierda el texto, el perfil del río y el plano de situación
  // en pequeño; a la derecha la axonometría de Fractal. Debajo, las tres
  // tipologías a todo el ancho, la sección constructiva, las cajas de detalle y
  // la tira de fotos de maqueta.
  lisbon: {
    columns: '4fr 8fr',
    areas: ['text axo', 'logo axo', 'sit axo'],
    cells: {
      text: 'text',
      logo: 'c:skyline',
      sit: 'c:situation',
      axo: 'c:fractal',
    },
    band: { refs: ['c:typ-1', 'c:typ-2', 'c:typ-3'], titles: ['Typology 1', 'Typology 2', 'Typology 3'], sameScale: true },
    after: ['c:section'],
    boxes: [
      ['c:detail-1', 'c:detail-2', 'c:detail-3', 'c:detail-4'],
      ['c:detail-5', 'c:detail-6', 'c:detail-7', 'c:detail-8', 'c:detail-9', 'c:detail-10', 'c:detail-11', 'c:detail-12'],
    ],
    strip: ['c:model-1', 'c:model-2', 'c:model-3', 'c:model-4', 'c:model-5', 'c:model-6', 'c:model-7', 'c:model-8', 'c:model-9'],
  },

  // Tesis: el sistema en axonometría junto al catálogo completo de píxeles.
  'bioperfectible-skin': {
    columns: '5fr 7fr',
    areas: ['axo cat', 'text cat'],
    cells: { axo: 'a:01', text: 'text', cat: 'catalogue' },
    // La tabla comparativa de los 16 píxeles, a todo el ancho
    after: ['c:table'],
    afterWidth: '80%',
  },

  // El barrio en axonometría y las tipologías dibujadas con su mobiliario.
  lyulin: {
    columns: '5fr 7fr',
    areas: ['axo typ', 'text typ'],
    cells: { axo: 'a:01', text: 'text', typ: 'typologies' },
    scroller: 'c:panel',
  },

  // Todo Madrid de fondo, con el texto encima; debajo el anillo del parque,
  // los croquis y la maqueta del terreno.
  'madrid-zoo': {
    backdrop: 'c:madrid',
    columns: '3fr 6fr 3fr',
    areas: ['s1 map model', 's2 map model2'],
    cells: {
      map: 'a:05',
      s1: 'a:03',
      s2: 'a:04',
      model: 'a:11',
      model2: 'a:12',
    },
    align: { s1: 'start', s2: 'end', model: 'end', model2: 'start' },
    // La planta en grande, casi a sangre
    after: ['c:plan'],
  },

  // Las fotos de las maquetas de plastilina en su hoja de contactos; las plantas
  // por unidad; el horizonte de las canteras y la planta del poblado.
  macael: {
    columns: '4fr 8fr',
    areas: ['text contact', 'model contact', 'hz hz', 'c1 aerial', 'light aerial', 'finals finals'],
    cells: {
      text: 'text',
      contact: 'flipbook',
      model: 'a:01',
      hz: 'a:13',
      c1: 'a:04',
      aerial: 'a:08',
      light: 'a:11',
      finals: ['c:final-1', 'c:final-2', 'c:final-3'],
    },
    align: { model: 'end', light: 'end' },
  },

  // PFC del máster. El plano de situación de fondo; la parte técnica a la izquierda
  // y los alzados apareciendo poco a poco a la derecha; la sección especial a sangre
  // y la axonometría explotada interactiva al final.
  colab: {
    backdrop: 'c:situation',
    lead: ['c:axo-uses', 'c:section-special'],
    // Franja izquierda al ancho de las secciones bioclimáticas; la derecha se
    // rellena con los alzados enteros y las secciones. Abajo a la izquierda, las maquetas.
    columns: '4fr 8fr',
    areas: ['tech elevs', 'tech axo'],
    cells: {
      tech: 'stack:c:bioclimatic,c:sections-28,c:section-36,a:01,a:02,a:03,a:04,a:05,a:06',
      elevs: 'reveal:c:elev-24,c:elev-26,c:elev-23,c:elev-25,c:section-31',
      axo: 'axo',
    },
    captions: {
      'c:bioclimatic': 'Bioclimatic sections: spring and autumn, summer day and night, winter day and night. Cross ventilation, solar protection and thermal mass through the year.',
      'c:section-36': 'Constructive section, central courtyard',
      'a:01': 'Models',
      'c:elev-24': 'Elevations',
      'c:sections-28': 'Sections A-A and B-B',
      'c:section-31': 'Constructive section, housing',
    },
    axo: {
      src: 'c:axo',
      title: 'Prefabrication',
      intro: 'The building is designed to be assembled from precast elements. Move over the numbers to read each part.',
      spots: [
        { x: 24.3, y: 18.3, label: 'Structure of the private floors', text: 'Precast slabs of 4 by 3.3 metres on a regular grid of columns.' },
        { x: 24.3, y: 34.8, label: 'Beam grid at the transition floor', text: 'A grid of beams collects the loads of the private floors above.' },
        { x: 23.6, y: 50.9, label: 'Transition trees', text: 'Branching supports that carry the housing floors over the open public floors.' },
        { x: 24.3, y: 68.0, label: 'Structure of the public floors', text: 'A wider frame that frees the ground floors for public use.' },
        { x: 26.4, y: 87.9, label: 'Hollow-core slabs', text: 'Precast hollow-core slabs span the public floors.' },
        { x: 53.2, y: 32.1, label: 'Precast slabs', text: 'The floor slabs of the private levels are placed as precast pieces.' },
        { x: 80.0, y: 44.2, label: 'Railing and solar protection', text: 'An industrialised railing that also works as solar protection on the balconies.' },
        { x: 70.4, y: 73.6, label: 'Precast concrete facade', text: 'Precast concrete panels close the public volume.' },
        { x: 58.2, y: 80.2, label: 'Facade of precast elements', text: 'Vertical precast fins give rhythm and shade to the lower floors.' },
      ],
    },
  },

  // TFM: la pregunta de partida dibujada (carbono operacional frente a embebido)
  // junto al texto, y debajo el póster completo a todo el ancho.
  'embodied-carbon': {
    columns: '5fr 7fr',
    areas: ['text q'],
    cells: { text: 'text', q: 'carbon' },
    after: ['c:poster'],
  },

  // Solo el póster del concurso, a sangre, para recorrerlo bajando.
  naturelle: {
    bleed: 'c:poster',
    columns: '1fr',
    areas: [],
    cells: {},
  },
  // Los dos pósters del equipo, uno junto al otro, a sangre.
  'la-palma': {
    pair: ['c:poster-1', 'c:poster-2'],
    columns: '1fr',
    areas: [],
    cells: {},
  },
};

/** Posiciones (1 = primera) de las imágenes del archivo que ya usa la composición. */
export function usedArchive(slug: string): number[] {
  const s = sheets[slug];
  if (!s) return [];
  return Object.values(s.cells)
    .flat()
    .flatMap((r) => (r.startsWith('stack:') || r.startsWith('reveal:') ? r.slice(r.indexOf(':') + 1).split(',') : [r]))
    .filter((r) => r.startsWith('a:'))
    .map((r) => Number(r.slice(2)));
}
