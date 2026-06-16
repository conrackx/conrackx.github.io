<!-- workspace-version: 1.3.0 -->
# AGENTS.md - marca-personal

> **Herencia:** Este proyecto hereda los [Estándares de Ingeniería Globales](../AGENTS.md#est%C3%A1ndares-de-ingenier%C3%ADa-globales-heredables) del workspace raíz. Las reglas definidas aquí **sobrescriben o extienden** los estándares globales.

## Descripción del Proyecto

Sitio web de **marca personal** — portafolio y blog profesional de **Miguel Urbina** (Data Analyst · IA en Producción).

- **Stack:** Eleventy 11ty (SSG estático), Nunjucks (templating), Markdown (contenido), CSS vanilla (modular).
- **Dominio:** `https://conrackx.github.io` (CNAME apuntando a GitHub Pages).
- **Repositorio:** `https://github.com/conrackx/conrackx.github.io`
- **Branch por defecto:** `master`
- **Host primario:** GitHub Pages
- **Dominio custom:** `CNAME` en raíz, copiado al `_site` durante el build.

## Arquitectura

```
marca-personal/
├── src/                     # Fuente principal
│   ├── _data/               # Datos globales (JSON)
│   │   ├── site.json        # Metadatos del sitio (título, autor, urls)
│   │   ├── skills.json      # Habilidades técnicas
│   │   └── navigation.json  # Navegación del sitio
│   ├── _includes/           # Plantillas parciales
│   │   ├── base.njk         # Layout base
│   │   ├── post.njk         # Layout para posts de blog
│   │   ├── page.njk         # Layout para páginas genéricas
│   │   ├── blog-list.njk    # Layout para listado de blog
│   │   └── components/      # Componentes reutilizables
│   ├── assets/              # Estáticos sin procesar
│   │   ├── css/             # CSS modular (variables, base, components, layout, print)
│   │   ├── js/              # JavaScript del lado cliente
│   │   ├── images/          # Imágenes originales
│   │   └── icons/           # Iconos SVG
│   ├── content/             # Colecciones de contenido (Markdown)
│   │   ├── blog/            # Artículos del blog
│   │   ├── bio/             # Biografía
│   │   ├── projects/        # Proyectos destacados
│   │   └── speaking/        # Charlas y presentaciones
│   ├── pages/               # Páginas del sitio (Nunjucks)
│   ├── index.njk            # Página de inicio
│   ├── blog.njk             # Listado del blog
│   ├── feed.njk             # Feed RSS (legacy — migrado a plugin)
│   ├── sitemap.njk          # Sitemap XML
│   └── 404.njk              # Página 404
├── _site/                   # Output del build
├── .eleventy.js             # Configuración de Eleventy (ESM)
├── CNAME                    # Dominio custom para GitHub Pages
├── .nojekyll                # Desactiva Jekyll en GH Pages
├── robots.txt               # Control de crawlers
└── netlify.toml             # (legacy — ya no se usa)
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con live reload |
| `npm run build` | Build estático a `_site/` |
| `npm run build:prod` | Build producción (minifica HTML) |
| `npm run lint` | Valida HTML generado con htmlhint |

## Despliegue

### GitHub Pages (primario)

- **CI/CD:** GitHub Actions en `.github/workflows/deploy.yml`
- **Trigger:** Push a `master`
- **Node version:** 22 LTS
- **Proceso:** `npm ci` → `npm run build:prod` → `upload-pages-artifact` → `deploy-pages`
- **URL:** `https://conrackx.github.io`
- **Dominio custom:** Configurado via CNAME + DNS del proveedor del dominio

### Netlify (legacy)

- `netlify.toml` existe pero **no está en uso activo**. GitHub Pages es el host primario.

## Convenciones del Proyecto

### Estructura de Colecciones

- `blog`: Artículos en `src/content/blog/*.md`, ordenados por fecha descendente.
- `projects`: Proyectos en `src/content/projects/*.md`.
- `speaking`: Charlas en `src/content/speaking/*.md`.

### Filtros Propios

- `readableDate`: Formatea fecha en español (ej. "14 de junio de 2026").
- `readingTime`: Calcula minutos de lectura (~200 palabras/min).
- `excerpt`: Extrae primeros 160 caracteres del contenido (sin HTML).
- `minifyCss`: Minifica CSS inline (remueve whitespace y comentarios).
- `currentYear`: Retorna el año actual (útil para copyright).
- `limit`: Limita arrays a N elementos.

### Shortcodes

- `{% icon "nombre" %}`: Renderiza un icono SVG desde el sprite.
- `{% image src, alt, options, class %}`: Procesa imágenes con eleventy-img (avif, webp, jpeg).
  - `src`: Ruta relativa a `src/` (ej. `assets/images/perfil.png`)
  - `alt`: Texto alternativo
  - `options`: Objeto con `widths`, `sizes`, `formats`
  - `class`: Clase CSS opcional

### Plugins

- **@11ty/eleventy-plugin-rss**: Generación automática de feed RSS/Atom.
- **@11ty/eleventy-plugin-syntaxhighlight**: Resaltado de sintaxis en bloques de código.
- **html-minifier-terser**: Minificación de HTML en producción.
- **markdown-it-anchor**: Anclas en encabezados Markdown.
- **markdown-it-toc-done-right**: Tabla de contenidos automática.

### Imágenes

- El shortcode `{% image %}` genera formatos AVIF, WebP y JPEG con srcset responsive.
- Imagen origen en `src/assets/images/`, output en `_site/assets/images/`.

### CSS

- CSS modular, concatenado en `all.css` via transform `concatCss`.
- Orden: variables → base → components → layout → print.
- No se usa preprocesador (CSS vanilla).

### SEO

- Feed RSS/Atom generado automáticamente.
- Sitemap XML en `/sitemap.xml`.
- Meta tags Open Graph + Twitter Cards en `base.njk`.
- Archivo `robots.txt` en raíz.

## Workflow `/cerrar-sesion`

Desde este directorio:

```bash
cd .. && opencode run cerrar-sesion
```

El comando detecta actividad en `cwd` actual y genera log en `work_log/` raíz.
