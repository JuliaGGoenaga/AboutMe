# Julia Gómez Goenaga · web

Portfolio personal de Julia Gómez Goenaga, arquitecta. Hecho con [Astro](https://astro.build) y publicado en GitHub Pages.

## Portada: estudio de soleamiento

La portada es una axonometría del Ensanche de Bilbao y Abandoibarra (la ría, el Guggenheim y la Torre Iberdrola) con datos reales de edificios de OpenStreetMap. El puntero hace de sol:

- **en horizontal** cambia la hora, del amanecer al ocaso;
- **en vertical** cambia la fecha, del solsticio de invierno (abajo) al de verano (arriba).

La posición del sol se calcula con la geometría solar de Bilbao (43,26° N). Con el teclado se usan las flechas cuando la escena tiene el foco.

- Escena: [`src/scripts/soleamiento.js`](src/scripts/soleamiento.js) (Three.js)
- Componente y cajetín: [`src/components/Soleamiento.astro`](src/components/Soleamiento.astro)
- Datos: [`public/data/bilbao.json`](public/data/bilbao.json), generado con [`tools/osm-to-json.py`](tools/osm-to-json.py) a partir de Overpass. Datos © colaboradores de OpenStreetMap, licencia ODbL.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Publicación

Cada push a `main` publica la web con la Action [`deploy.yml`](.github/workflows/deploy.yml). En GitHub: *Settings → Pages → Source: GitHub Actions*.

Si el repositorio se llama `<usuario>.github.io`, la web queda en `https://<usuario>.github.io`. Con cualquier otro nombre hay que poner `base: '/<nombre-del-repo>'` en [`astro.config.mjs`](astro.config.mjs).
