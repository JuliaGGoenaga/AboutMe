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
// El orden de `cells` es el orden en el móvil, donde todo va apilado.
// Las imágenes 'a:' usadas aquí no se repiten en la galería de debajo.

export type Cell = string | string[];

export type Sheet = {
  // Plano a todo el ancho, como fondo, con el texto del proyecto encima en una tarjeta translúcida
  backdrop?: string;
  // Panel completo a pantalla entera al final, que se recorre en horizontal al bajar
  scroller?: string;
  // Celdas que se quedan fijas mientras se recorre la lámina (p. ej. el texto junto a un póster)
  sticky?: string[];
  columns: string;
  areas: string[];
  cells: Record<string, Cell>;
  align?: Record<string, 'start' | 'end' | 'center'>;
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
    areas: ['axo typ', 'text typ', 'text row'],
    cells: { axo: 'a:01', text: 'text', typ: 'typologies', row: ['a:06', 'a:08', 'a:02'] },
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

  // Las fotos de las maquetas de plastilina como un flipbook; después el horizonte
  // de las canteras y la planta del poblado.
  macael: {
    columns: '4fr 8fr',
    areas: ['text flip', 'model flip', 'hz hz', 'c1 aerial', 'light aerial'],
    cells: {
      text: 'text',
      flip: 'flipbook',
      model: 'a:01',
      hz: 'a:13',
      c1: 'a:04',
      aerial: 'a:08',
      light: 'a:11',
    },
    align: { model: 'end', light: 'end' },
  },

  // Tres maquetas en secuencia; debajo, la axonometría y la sección.
  colab: {
    columns: '1fr 1fr 1fr',
    areas: ['m1 m2 m3', 'text axo axo', 'text sec sec'],
    cells: {
      m1: 'a:01',
      m2: 'a:02',
      m3: 'a:03',
      text: 'text',
      axo: 'a:08',
      sec: 'a:09',
    },
  },

  // El póster del concurso, literal, recorrido al bajar; el texto se queda al lado.
  naturelle: {
    columns: '4fr 8fr',
    areas: ['title poster', 'text poster'],
    cells: { title: 'a:02', text: 'text', poster: 'c:poster' },
    sticky: ['text'],
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
