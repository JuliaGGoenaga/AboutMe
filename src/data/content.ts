// Todo el contenido de la web vive aquí. Para añadir un proyecto, una publicación
// o un nodo de la trayectoria, basta con editar estas listas.
// `TODO` marca datos pendientes de confirmar con Julia.

// PDFs grandes: carpeta "Web portfolio - PDFs" en el Google Drive de Julia
// (compartida como "Cualquier persona con el enlace").
const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

// --- Líneas de trabajo ------------------------------------------------------

export type LineId = 'sustainable' | 'computational' | 'integrated';

export const lines: {
  id: LineId;
  title: string;
  summary: string;
  work: string[];
}[] = [
  {
    id: 'sustainable',
    title: 'Sustainable architecture',
    summary:
      'Daylight and solar radiation analysis and optimization, so that envelopes are designed with performance data from the first sketch.',
    work: ['Daylight and radiation analysis', 'Energy analysis', 'Facade design', 'Passive design strategies', 'Embodied carbon'],
  },
  {
    id: 'computational',
    title: 'Computational design and AI',
    summary:
      'Computational tools and AI models applied to design, and the digital transformation of design processes inside a large engineering and architecture firm.',
    work: ['Computational design tools', 'AI model training for design', 'Digital transformation at IDOM'],
  },
  {
    id: 'integrated',
    title: 'Integrated design and human-computer interaction',
    summary:
      'Methods that bring sustainability into the earliest design phases, and simple interactive tools that help architects learn and decide.',
    work: ['Integrated design methods', 'Simple interactive tools', 'Training architects'],
  },
];

// --- Trayectoria: nodos de conocimiento --------------------------------------

export const skills: { id: string; label: string; line: LineId }[] = [
  { id: 'daylight', label: 'Daylight and radiation', line: 'sustainable' },
  { id: 'energy', label: 'Energy analysis', line: 'sustainable' },
  { id: 'envelope', label: 'Envelope and facade design', line: 'sustainable' },
  { id: 'passive', label: 'Passive design', line: 'sustainable' },
  { id: 'carbon', label: 'Embodied carbon', line: 'sustainable' },
  { id: 'computational', label: 'Computational design', line: 'computational' },
  { id: 'ai', label: 'AI for design', line: 'computational' },
  { id: 'digital', label: 'Digital transformation', line: 'computational' },
  { id: 'integrated', label: 'Integrated design', line: 'integrated' },
  { id: 'hci', label: 'Interactive tools', line: 'integrated' },
  { id: 'teaching', label: 'Teaching and outreach', line: 'integrated' },
];

// --- Trayectoria: nodos de experiencia ---------------------------------------
// `inside` = la burbuja se puede abrir y muestra lo que contiene.
// `links` = [skill, año en que empieza esa conexión].

export type Experience = {
  id: string;
  label: string;
  short?: string; // nombre corto para el móvil
  detail: string;
  start: number;
  end?: number; // sin `end` = sigue hoy
  place: string;
  links: [string, number][];
  inside?: { kind: 'archive'; group: 'etsam' | 'unav' } | { kind: 'dialog'; id: 'idom' | 'phd' };
};

export const experiences: Experience[] = [
  {
    id: 'etsam',
    label: 'ETSAM',
    detail: 'Architecture degree, Universidad Politécnica de Madrid',
    start: 2016, // TODO confirmar año de inicio
    end: 2021,
    place: 'Madrid',
    links: [['passive', 2019], ['envelope', 2020], ['energy', 2021]],
    inside: { kind: 'archive', group: 'etsam' },
  },
  {
    id: 'unav-master',
    label: 'Master, UNAV',
    detail: "Master's in Architecture and Sustainability, Universidad de Navarra",
    start: 2021,
    end: 2023, // TODO confirmar
    place: 'Pamplona',
    links: [['energy', 2021], ['passive', 2021], ['carbon', 2022], ['daylight', 2022], ['integrated', 2022]],
    inside: { kind: 'archive', group: 'unav' },
  },
  {
    id: 'idom',
    label: 'IDOM',
    detail: 'Sustainability and computational design. Digital transformation group',
    start: 2022, // TODO confirmar
    place: 'Madrid',
    links: [['carbon', 2022], ['daylight', 2023], ['energy', 2023], ['envelope', 2023], ['computational', 2023], ['digital', 2024], ['ai', 2024], ['teaching', 2024]],
    inside: { kind: 'dialog', id: 'idom' },
  },
  {
    id: 'phd',
    label: 'PhD, UNAV and University of Florida',
    detail: 'Practice-based PhD with IDOM. Humanizing decarbonization: performance-driven optimization workflow in envelope design',
    start: 2023, // TODO confirmar
    place: 'Pamplona and Florida',
    links: [['envelope', 2023], ['daylight', 2023], ['computational', 2024], ['integrated', 2024], ['hci', 2024], ['teaching', 2024], ['ai', 2025]],
    inside: { kind: 'dialog', id: 'phd' },
  },
  {
    id: 'wya',
    label: 'World Youth Alliance',
    short: 'WYA',
    detail: 'And other international organisations',
    start: 2020, // TODO confirmar
    place: 'International',
    links: [['teaching', 2020]],
  },
];

export const PRESENT_YEAR = 2026;

// --- Trabajo en IDOM y en el doctorado ----------------------------------------
// Cada tarjeta es un proyecto con su propia página (/work/<slug>/) y vive dentro
// de la burbuja de IDOM o del PhD. Las marcadas como `featured` salen también en
// el menú de destacados. Pendiente de material en "Material web/01 IDOM".

export type WorkItem = {
  slug: string;
  parent: 'idom' | 'phd';
  kind: 'Project' | 'Field of work' | 'Tool' | 'Research';
  title: string;
  place?: string;
  year?: string;
  summary: string; // una frase para la tarjeta
  text: string[];
  image?: { file: string; alt: string }; // en src/assets/work/
  extra?: { label: string; href: string }[]; // accesos secundarios (p. ej. la web interactiva)
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const work: WorkItem[] = [
  {
    slug: 'fehmarnbelt-tunnel',
    parent: 'idom',
    kind: 'Project',
    title: 'Fehmarnbelt tunnel',
    place: 'Denmark and Germany',
    summary: 'The immersed tunnel between Denmark and Germany. Case study in preparation.',
    text: [
      'The Fehmarnbelt fixed link, the immersed tunnel between Rødby (Denmark) and Puttgarden (Germany). Case study in preparation.', // TODO texto y material
    ],
    featured: true,
  },
  {
    slug: 'multiparametric-facade-analysis',
    parent: 'idom',
    kind: 'Field of work',
    title: 'Multiparametric facade analysis',
    summary: 'Daylight, solar radiation and energy analyses that inform facade design, from early options to the final envelope.',
    text: [
      'Daylight, solar radiation and energy analyses that inform facade design, from early options to the final envelope. Many parameters are explored at once, so that the design team can compare options with performance feedback. Examples in preparation.', // TODO ejemplos
    ],
  },
  {
    slug: 'digital-transformation',
    parent: 'idom',
    kind: 'Field of work',
    title: 'Digital transformation processes',
    summary: 'Bringing computational design and AI into everyday design processes across the company.',
    text: [
      'As part of IDOM’s digital transformation group, I help bring computational design and AI into everyday design processes across the company: new workflows, tools and training for architects and engineers. In preparation.', // TODO
    ],
  },
  {
    slug: 'literature-review',
    parent: 'phd',
    kind: 'Research',
    title: 'Digital workflows for informed decision making in building envelope design',
    year: '2026',
    summary: 'A systematic literature review of performance-based optimization in building envelope design, with an interactive app of its results.',
    text: [
      'This paper systematically reviews 152 studies on performance-based optimization in building envelope design. By disaggregating each process into 155 distinct tasks, the review classifies these processes by design stage, design scale, variable type, performance objective, optimization algorithm and decision-making method.',
      'It identifies patterns in the use of optimization and simulation tools and proposes a methodological framework to guide future integrative workflows. The process leads to several design matrices, shown in an interactive app. The framework lays a foundation for flexible, user-centred digital workflows that improve building efficiency and occupant comfort.',
      'J. Gómez Goenaga, A. Monge-Barrio, K. Saldaña Ochoa, A. Villanueva Peñalver. Applied Soft Computing, 2026.',
    ],
    image: { file: 'literature-review.png', alt: 'General map of the review: design tasks, stages and tools' },
    links: [
      { label: 'Read the article', href: 'https://doi.org/10.1016/j.asoc.2025.114377' },
      { label: 'Interactive results', href: 'https://juliaggoenaga.github.io/Digital_workflows_for_BE_design_LR/' },
    ],
    extra: [
      { label: 'Analysis matrix', href: 'https://juliaggoenaga.github.io/Digital_workflows_for_BE_design_LR/3matrix.html' },
      { label: 'New design framework', href: 'https://juliaggoenaga.github.io/Digital_workflows_for_BE_design_LR/Proposal.html' },
      { label: 'Task classification', href: 'https://juliaggoenaga.github.io/Digital_workflows_for_BE_design_LR/Task_explained.html' },
      { label: 'All references', href: 'https://juliaggoenaga.github.io/Digital_workflows_for_BE_design_LR/All_refs.html' },
    ],
    featured: true,
  },
  {
    slug: 'flex',
    parent: 'phd',
    kind: 'Tool',
    title: 'FLEX',
    summary: 'A Rhino tool for facade analysis.',
    text: [
      'FLEX is a tool for Rhino developed to analyse facades: it brings performance analysis into the modelling environment architects already use, so that options can be compared while they are being drawn. In preparation.', // TODO
    ],
  },
  {
    slug: 'solar-chart-topology',
    parent: 'phd',
    kind: 'Research',
    title: 'The solar chart as a topology of the facade',
    summary: 'A predictive model that reads the whole facade on the solar chart to predict daylight and solar loads.',
    text: [
      'Research on the solar chart as a topology that represents the whole facade. Mapped on the solar chart, the facade becomes the input of a predictive model that estimates daylight and solar loads, and shows possible results of the design options.', // TODO
    ],
    links: [{ label: 'Preprint: From shading masks to surrogate frameworks (SSRN)', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6530551' }],
  },
];

// Menú de destacados, arriba a la derecha: archivo y tarjetas, en este orden.
// `cover` es el dibujo de src/assets/covers/<cover>.jpg
export const featured: { title: string; note: string; href: string; cover: string }[] = [
  { title: 'COLAB', note: 'Intergenerational centre', href: 'archive/colab/', cover: 'colab' },
  { title: 'Fortifications of Cartagena', note: 'Atalaya Castle', href: 'archive/cartagena/', cover: 'cartagena' },
  { title: 'Bioperfectible skin', note: 'Bachelor thesis', href: 'archive/bioperfectible-skin/', cover: 'bioperfectible-skin' },
  { title: 'Digital workflows for informed decision making in building envelope design', note: 'PhD', href: 'work/literature-review/', cover: 'literature-review' },
  { title: 'Fehmarnbelt tunnel', note: 'IDOM', href: 'work/fehmarnbelt-tunnel/', cover: 'fehmarnbelt-tunnel' },
];

// --- Archivo académico -------------------------------------------------------

export type ArchiveProject = {
  slug: string;
  group: 'etsam' | 'unav';
  title: string;
  subtitle: string;
  year?: string;
  place: string;
  text: string[];
  links?: { label: string; href: string }[];
  credit?: string;
  hideImages?: number[]; // posiciones (1 = primera) que ya aparecen en la composición
  white?: boolean; // fondo blanco y más contraste en los dibujos
};

export const archiveGroups = {
  etsam: {
    title: 'ETSAM',
    subtitle: 'Architecture degree, Universidad Politécnica de Madrid',
    years: '2016-2021',
  },
  unav: {
    title: 'Universidad de Navarra',
    subtitle: "Master's in Architecture and Sustainability",
    years: '2021-2023',
  },
} as const;

export const archive: ArchiveProject[] = [
  {
    slug: 'bioperfectible-skin',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8], // después del catálogo solo va la tabla
    group: 'etsam',
    title: 'Bioperfectible skin',
    subtitle: 'The BioPix envelope as integral architecture. Bachelor thesis',
    year: '2021',
    place: 'Madrid',
    text: [
      'A study of the BioPix system used on the Andalusian Energy Agency headquarters in Seville by Ruiz Larrea y Asociados: an envelope conceived as the skin of a living organism.',
      'The thesis catalogues biomimetic facade modules and evaluates their potential to reduce energy demand and to bring ecosystem benefits to energy retrofits. Supervised by Francesca Olivieri.',
      'Later published as "Piel Bioperfectible. La rehabilitación energética que aporta beneficios ecosistémicos" in Ciudad Sostenible (2022).',
    ],
    links: [
      { label: 'Read the thesis (UPM)', href: 'https://oa.upm.es/68305/' },
    ],
  },
  {
    slug: 'lisbon',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // todo va en la lámina
    group: 'etsam',
    title: 'Housing tower in Lisbon',
    subtitle: 'Torre Douro. Next to the 25 de Abril bridge',
    place: 'Lisbon',
    text: [
      'A residential tower beside the 25 de Abril bridge, developed down to construction detail: housing typologies, structure and a sustainable facade.',
    ],
    links: [{ label: 'Full project (PDF)', href: drive('10Lk0Lgo5KBO8TeU4YpFJEtfvhNcuYyn5') }],
  },
  {
    slug: 'cartagena',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // las láminas van en la tira horizontal
    group: 'etsam',
    title: 'Fortifications of Cartagena',
    subtitle: 'A centre for theological studies in the Atalaya Castle',
    place: 'Cartagena',
    text: [
      'A rehabilitation proposal for the fortifications of Cartagena. The new programme settles inside the Atalaya Castle and keeps the traces of time visible, following Juhani Pallasmaa’s idea that old buildings make the continuity of culture tangible.',
    ],
  },
  {
    slug: 'lyulin',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // entre las tipologías y el panel no va nada
    group: 'etsam',
    title: 'Urban forest in Lyulin',
    subtitle: 'Re-naturalisation and housing',
    place: 'Sofia, Bulgaria',
    text: [
      'A re-naturalisation project for the Lyulin district. Six housing typologies whose interior space changes with the layout of the furniture.',
    ],
    links: [
      { label: 'Full panel (PDF)', href: drive('1XrsKSazPoaX3FuRDZ_TPtUTIidr64rWn') },
      { label: 'Project development', href: 'http://multiplayercity.org/hiri-basoa' },
    ],
  },
  {
    slug: 'madrid-zoo',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // no hay nada después de la lámina
    group: 'etsam',
    title: 'Sports space at Madrid Zoo',
    subtitle: 'Reuse of Javier Carvajal’s structures',
    year: '2019',
    place: 'Madrid',
    text: [
      'Reuse and revaluation of Javier Carvajal’s structures. The sports space is defined, and connected with the city, by reshaping the contour lines of the terrain.',
    ],
    links: [{ label: 'More (PDF)', href: drive('1Y8H_9L207p6MIWHD0idRdxge2EBjHwE6') }],
  },
  {
    slug: 'macael',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // no hay nada después de la lámina
    group: 'etsam',
    title: 'Retreat in Macael',
    subtitle: 'In the marble quarries',
    place: 'Macael, Almería',
    text: [
      'A retreat set in the marble quarries of Macael, developed from the site’s topography to the housing typologies.',
      'The project starts by studying the relationship between objects scattered across the quarry, with shapes like those of carved marble.',
    ],
  },
  {
    slug: 'naturelle',
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // todo está en el póster
    group: 'etsam',
    title: 'Naturelle en Bois',
    subtitle: 'Sustainable residential park. Multi Comfort student contest',
    place: 'Competition',
    text: [
      'A bioclimatic residential park: climate and sun analysis of the site, water cycle, and energy and comfort systems designed together with the architecture.',
    ],
  },
  {
    slug: 'embodied-carbon',
    hideImages: [1], // la lámina ya lleva la pregunta y el póster
    group: 'unav',
    title: 'Embodied and operational carbon',
    subtitle: "Master's thesis. The case of IDOM's Madrid headquarters",
    year: '2022',
    place: 'Madrid',
    text: [
      'Carbon emissions from buildings account for 37% of global energy-related emissions, and more and more projects now assess the whole life cycle to reduce them. Many studies state that the more energy efficient a building is, the lower its carbon emissions. That holds for operational carbon. But what about embodied carbon?',
      'IDOM’s Madrid headquarters, built in 2010, uses many measures to cut consumption and, with it, operational carbon. One of them reduces both embodied and operational carbon: the thermally activated building structure (TABS) uses the thermal mass of the concrete to store heat and reduce the power of the machines. To work, it has to do without most interior finishes, so it also has less embodied carbon on top of the expected cut in operational carbon.',
      'A relatively new system, then, that opens the door to reducing the embodied carbon of building services. Supervised by Aurora Monge-Barrio (Universidad de Navarra) and Antonio Villanueva Peñalver (IDOM). Master in Environmental Design and Management of Buildings.',
    ],
    links: [{ label: 'Read the thesis (PDF)', href: drive('1uIsijZs_7Vw1rIy9RSDDzJloHE797KWu') }],
  },
  {
    slug: 'colab',
    white: true,
    hideImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // todo está ya en la lámina
    group: 'unav',
    title: 'COLAB',
    subtitle: 'Intergenerational centre. Master’s final project',
    place: 'Spain', // TODO ciudad
    text: [
      'A centre where different generations share space and activity. Developed from the basic design to the execution project.',
    ],
    links: [
      { label: 'Basic design (PDF)', href: drive('19nx9_qIY8pzNDQXJpwBIp0uB24-3ptGG') },
      { label: 'Execution project (PDF)', href: drive('1PnPXFUim_Ht091Iyrkby_R7SRkQ7mNA2') },
    ],
  },
  {
    slug: 'la-palma',
    hideImages: [1],
    group: 'unav',
    title: 'Housing for La Palma',
    subtitle: 'For those affected by the 2021 volcanic eruption',
    year: '2022',
    place: 'La Palma, Canary Islands',
    text: [
      'Industrialised, parametric housing for those affected by the volcano, adapted to the territory and fast to build.',
    ],
    links: [
      { label: 'Diario de Navarra', href: 'https://www.diariodenavarra.es/noticias/navarra/2022/07/21/viviendas-palma-disenadas-universidad-navarra-535612-300.html' },
      { label: 'COAM', href: 'https://www.coam.org/es/actualidad/agenda/coam-recomienda/grupo-estudiantes-arquitectura-disenan-viviendas-sostenibles' },
      { label: 'All the proposals (PDF)', href: drive('1qeh1wiVfrobVxiIagRaBu1-vOfzt1_zO') },
    ],
    credit: 'Team: Julia Gómez Goenaga, Julia Ramírez Fernández, Doménica Gavilánez Aguilar and Ángel Gallo Díaz.',
  },
];

// Proyectos del archivo sin imágenes todavía (aparecen en la burbuja, sin ficha).
export const archivePending: { group: 'etsam' | 'unav'; title: string; subtitle: string }[] = [];

// --- Publicaciones -----------------------------------------------------------

export const publications: {
  year: string;
  title: string;
  type: 'Journal article' | 'Preprint' | 'Thesis' | 'Article';
  venue: string;
  authors?: string;
  href?: string;
}[] = [
  {
    year: '2026',
    title: 'From shading masks to surrogate frameworks: a topological approach for performance-driven envelope design',
    type: 'Preprint',
    venue: 'SSRN',
    authors: 'J. Gómez Goenaga, S. Gao, A. Monge-Barrio, S. M. Noorani, A. Villanueva Peñalver, B. Nory, K. Saldaña Ochoa',
    href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6530551',
  },
  {
    year: '2026',
    title: 'Digital workflows for informed decision making in building envelope design: a systematic literature review',
    type: 'Journal article',
    venue: 'Applied Soft Computing, 114377',
    authors: 'J. Gómez Goenaga, A. Monge-Barrio, K. Saldaña Ochoa, A. Villanueva Peñalver',
    href: 'https://doi.org/10.1016/j.asoc.2025.114377',
  },
  {
    year: '2022',
    title: 'Piel Bioperfectible. La rehabilitación energética que aporta beneficios ecosistémicos',
    type: 'Article',
    venue: 'Ciudad Sostenible',
    authors: 'J. Gómez Goenaga, F. Olivieri', // TODO confirmar autores
  },
  {
    year: '2021',
    title: 'Piel Bioperfectible. La envolvente BioPix como arquitectura integral',
    type: 'Thesis',
    venue: 'Bachelor thesis, ETSAM, Universidad Politécnica de Madrid',
    href: 'https://oa.upm.es/68305/',
  },
];

export const contact = {
  email: 'juliagomezgoenaga@gmail.com',
  linkedin: 'https://www.linkedin.com/in/julia-g%C3%B3mez-goenaga-52a097155/',
  instagram: 'https://www.instagram.com/mrsj.print/',
};
