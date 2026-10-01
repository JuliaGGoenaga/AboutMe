import { defineConfig } from 'astro/config';

// GitHub Pages:
// - Repo "<usuario>.github.io"  -> site: 'https://<usuario>.github.io', sin base.
// - Cualquier otro nombre        -> además base: '/<nombre-del-repo>'.
// TODO: rellenar cuando sepamos el usuario de GitHub.
export default defineConfig({
  site: 'https://example.github.io',
  devToolbar: { enabled: false },
});
