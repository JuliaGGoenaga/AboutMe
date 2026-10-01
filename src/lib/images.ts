import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/archive/*/*.jpg', { eager: true });

/** Imágenes de un proyecto del archivo, en orden (01.jpg es la portada). */
export function imagesFor(slug: string): ImageMetadata[] {
  return Object.entries(all)
    .filter(([path]) => path.includes(`/archive/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

/** Une la base del sitio con una ruta interna. */
export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`;
}
