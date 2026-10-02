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
  // Imágenes a sangre después de la lámina (secciones de lado a lado)
  after?: string[];
  // Axonometría explotada interactiva al final
  axo?: {
    bg: string;
    title: string;
    intro: string;
    layers: { src: string; x: number; y: number; w: number; h: number; label: string; text: string }[];
    spots: { x: number; y: number; label: string; text: string }[];
  };
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
  // La torre: el perfil del río como horizonte, la maqueta, dos alzados altos y la
  // axonometría constructiva en paralelo; la piel de píxeles cierra la lámina.
  lisbon: {
    columns: '4fr 2fr 2fr 4fr',
    areas: ['sky sky sky .', 'photo north west axo', 'text north west axo', 'pix pix pix .'],
    cells: {
      sky: 'c:skyline',
      photo: 'a:01',
      text: 'text',
      north: 'c:north',
      west: 'c:west',
      axo: 'c:axo',
      pix: 'c:pixels',
    },
    align: { north: 'end', west: 'end', axo: 'end' },
  },

  // Tesis: el sistema en axonometría junto al catálogo completo de píxeles.
  'bioperfectible-skin': {
    columns: '4fr 8fr',
    areas: ['axo cat', 'text cat', 'text row'],
    cells: { axo: 'a:01', text: 'text', cat: 'catalogue', row: ['a:02', 'a:07', 'a:08'] },
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
    areas: ['s1 map model', 's2 map model', 'row row row'],
    cells: {
      map: 'a:05',
      s1: 'a:03',
      s2: 'a:04',
      model: 'a:11',
      row: ['a:06', 'a:08', 'a:09'],
    },
    align: { s1: 'start', s2: 'end', model: 'center' },
  },

  // Las fotos de las maquetas de plastilina en su hoja de contactos; las plantas
  // por unidad; el horizonte de las canteras y la planta del poblado.
  macael: {
    columns: '4fr 8fr',
    areas: ['text contact', 'model contact', 'units units', 'hz hz', 'c1 aerial', 'light aerial'],
    cells: {
      text: 'text',
      contact: 'flipbook',
      model: 'a:01',
      units: ['c:unit-1', 'c:unit-2', 'c:unit-3'],
      hz: 'a:13',
      c1: 'a:04',
      aerial: 'a:08',
      light: 'a:11',
    },
    align: { model: 'end', light: 'end' },
  },

  // PFC del máster. El plano de situación de fondo; la parte técnica a la izquierda
  // y los alzados apareciendo poco a poco a la derecha; la sección especial a sangre
  // y la axonometría explotada interactiva al final.
  colab: {
    backdrop: 'c:situation',
    columns: '4fr 8fr',
    areas: ['tech elevs', 's28 s28', 's36 s31'],
    cells: {
      tech: 'stack:c:bioclimatic',
      elevs: 'reveal:c:elev-24,c:elev-26,c:elev-23,c:elev-25',
      s28: 'stack:c:sections-28',
      s36: 'stack:c:section-36',
      s31: 'stack:c:section-31',
    },
    align: { s36: 'end' },
    maxw: { s28: '820px', s36: '340px' },
    captions: {
      'c:bioclimatic': 'Bioclimatic sections: spring and autumn, summer day and night, winter day and night. Cross ventilation, solar protection and thermal mass through the year.',
      'c:elev-24': 'Elevations',
      'c:sections-28': 'Sections A-A and B-B',
      'c:section-36': 'Constructive section, central courtyard',
      'c:section-31': 'Constructive section, housing',
    },
    after: ['c:section-special'],
    axo: {
      bg: 'c:axo-bg',
      title: 'Prefabrication',
      intro: 'The building is assembled from precast elements. Scroll to take the structure apart; move over the numbers to read each piece.',
      layers: [
        { src: 'c:axo-layer-1', x: 16.07, y: 7.19, w: 17.36, h: 20.69, label: 'Structure of the private floors', text: 'Precast slabs of 4 by 3.3 metres on a regular grid of columns.' },
        { src: 'c:axo-layer-2', x: 16.07, y: 27.43, w: 17.36, h: 15.6, label: 'Beam grid at the transition floor', text: 'A grid of beams collects the loads of the private floors above.' },
        { src: 'c:axo-layer-3', x: 15.86, y: 44.36, w: 17.0, h: 14.6, label: 'Transition trees', text: 'Branching supports that carry the housing floors over the open public floors.' },
        { src: 'c:axo-layer-4', x: 15.86, y: 58.85, w: 17.57, h: 20.58, label: 'Structure of the public floors', text: 'A wider frame that frees the ground floors for public use.' },
        { src: 'c:axo-layer-5', x: 15.86, y: 78.65, w: 17.71, h: 17.04, label: 'Hollow-core slabs', text: 'Precast hollow-core slabs span the public floors.' },
      ],
      spots: [
        { x: 53.2, y: 32.1, label: 'Precast slabs', text: 'The floor slabs of the private levels are placed as precast pieces.' },
        { x: 80.0, y: 44.2, label: 'Railing and solar protection', text: 'An industrialised railing that also works as solar protection on the balconies.' },
        { x: 70.4, y: 73.6, label: 'Precast concrete facade', text: 'Precast concrete panels close the public volume.' },
        { x: 58.2, y: 80.2, label: 'Facade of precast elements', text: 'Vertical precast fins give rhythm and shade to the lower floors.' },
      ],
    },
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
    .filter((r) => r.startsWith('a:'))
    .map((r) => Number(r.slice(2)));
}
