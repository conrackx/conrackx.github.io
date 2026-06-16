# /marca — Miguel Urbina

**Data Analyst · IA en Producción**

Portfolio + blog técnico sobre pipelines de datos, automatización e inteligencia artificial aplicada a productos reales.

[Ver sitio →](https://conrackx.github.io)

---

## Stack

- **[Eleventy](https://www.11ty.dev/)** v3.1.6 — generador estático
- **Nunjucks** + **Markdown** — contenido y templating
- **CSS custom properties** — theming dark/light
- **@11ty/eleventy-img** — procesamiento de imágenes (AVIF, WebP, JPEG)
- **@11ty/eleventy-plugin-rss** — generación de feed RSS 2.0
- **@11ty/eleventy-plugin-syntaxhighlight** — resaltado de sintaxis en bloques de código
- **GitHub Actions** — deploy continuo a GitHub Pages

## Requisitos

- Node.js ≥18 <27 (recomendado 22 LTS)
- npm ≥9

## Comandos

```bash
npm run dev           # Servidor de desarrollo con live reload
npm run build         # Build estático a _site/
npm run build:prod    # Build producción (minifica HTML)
npm run lint          # Valida HTML generado con htmlhint
```

## Estructura

```
src/
├── _data/            # Datos globales (JSON)
├── _includes/        # Plantillas parciales + componentes
├── assets/           # CSS, JS, imágenes, iconos (SVG sprite)
├── content/          # Colecciones: blog, projects, speaking, bio
├── pages/            # Páginas: about, contact, projects, speaking
├── index.njk         # Portada
├── blog.njk          # Listado de blog
├── feed.njk          # Feed RSS (template, datos vía plugin-rss)
├── sitemap.njk       # Sitemap XML
└── 404.njk           # Página 404
```

## Despliegue

- **Host:** GitHub Pages — `https://conrackx.github.io`
- **CI/CD:** `.github/workflows/deploy.yml`
- **Trigger:** push a `master`
- **Dominio custom:** `CNAME` en raíz apuntando al DNS del dominio

El build de producción corre con `NODE_ENV=production` para habilitar la minificación HTML.

## Colecciones

| Colección | Fuente | Orden |
|-----------|--------|-------|
| `blog` | `src/content/blog/*.md` | Fecha descendente |
| `projects` | `src/content/projects/*.md` | Sin orden específico |
| `speaking` | `src/content/speaking/*.md` | Sin orden específico |

## Shortcodes destacados

### `{% image %}`

Procesa imágenes con eleventy-img generando AVIF, WebP y JPEG con srcset.

```njk
{# Sintaxis posicional (legacy) #}
{% image "assets/images/perfil.png", alt, [200, 400], "(max-width: 768px) 200px, 400px", "profile-img" %}

{# Sintaxis objeto (recomendada) #}
{% image "assets/images/perfil.png", alt, { widths: [200, 400], sizes: "(max-width: 768px) 200px, 400px" }, "profile-img" %}
```

### `{% icon %}`

Renderiza un icono desde el sprite SVG.

```njk
{% icon "github" %}
```

## Secciones del sitio

- [Inicio](https://conrackx.github.io/) — presentación + últimos posts
- [Sobre mí](https://conrackx.github.io/pages/about/) — bio, skills, timeline
- [Proyectos](https://conrackx.github.io/pages/projects/) — casos de estudio
- [Blog](https://conrackx.github.io/blog/) — artículos técnicos
- [Charlas](https://conrackx.github.io/pages/speaking/) — conferencias y workshops
- [Contacto](https://conrackx.github.io/pages/contact/) — formulario y redes

## Proyecto destacado

**Pipeline de Reportes Aurora** — Sistema automatizado de generación de informes de seguridad para múltiples clientes.
- 7 etapas declarativas con artefactos intermedios verificables
- Integración de LLM con fallback determinístico
- 122 tests automatizados (60-90s)
- De días a ~15 minutos end-to-end
- [Ver showcase](https://github.com/conrackx/pipeline-aurora-showcase)

---

Construido con [Eleventy](https://www.11ty.dev/). Deploy automático via GitHub Actions.
