import { defineConfig } from 'astro/config';

// Publicado en GitHub Pages desde el repo JuliaGGoenaga/AboutMe:
// https://juliaggoenaga.github.io/AboutMe/
// Si algún día el repo pasa a llamarse "juliaggoenaga.github.io", quitar `base`.
export default defineConfig({
  site: 'https://juliaggoenaga.github.io',
  base: '/AboutMe',
  devToolbar: { enabled: false },
});
