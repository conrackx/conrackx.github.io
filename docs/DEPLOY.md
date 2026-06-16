# Deploy Guide — marca-personal

## GitHub Pages

Rama `gh-pages` (automático) generada por GitHub Actions.
Vercificar en Settings → Pages → Source: "GitHub Actions".

## Build local

```bash
npm install
npm run dev        # http://localhost:8080 con hot reload
npm run build:prod # build optimizado en ./_site
npm run lint       # htmlhint sobre ./_site
```

## Dominio custom (futuro)

1. Comprar dominio (p.ej.: `tunombre.dev`).
2. En `repo Settings → Pages → Custom domain`: ingresar dominio.
3. Subir este archivo a `gh-pages` o configurar CNAME con GitHub Actions.
4. Configurar DNS `A` records o `CNAME` en proveedor.

## Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| 404 en `/blog/...` | archivos no compilados o rutas wrong | Revisar `.eleventy.js` `dir.input` |
| OG image no aparece en LinkedIn | `og-default.jpg` faltante o path sin `/` | Verificar `src/assets/images/og-default.jpg` |
| Markdown anidado roto | TOC filter aplicado fuera de `post.njk` | Solo usar `{{ content \| toc }}` en layout de post |
| SVG sprite no aparece | `sprite.svg` no copiado | Ver `passthroughCopy` en `.eleventy.js` |
| RSS inválido | Faltan campos en frontmatter | Blog posts requieren `title`, `date`, `tags` |
