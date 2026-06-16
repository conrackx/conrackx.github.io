# Contexto de Directorio: CSS

## Rol
Actúa como **especialista en CSS vanilla** y sistema de diseño.

## Instrucciones Locales

### Arquitectura
Los archivos se concatenan en `all.css` en este orden:
1. `variables.css` — colores, spacing, tipografía
2. `base.css` — reset, tipografía, elementos base
3. `components.css` — header, footer, hero, cards, botones
4. `layout.css` — grid, container, flex utilities
5. `print.css` — estilos de impresión

### Reglas
- Solo CSS vanilla, sin preprocesador
- Variables personalizadas en `:root` en `variables.css`
- Namespace con clase de componente (`.site-header`, `.post-body`)
- No usar `!important` salvo excepciones de accesibilidad
- Media queries: mobile-first, breakpoints en variables
- Sin estilos inline en Nunjucks (salvo casos excepcionales en footer de post/project)

### Design Tokens (variables.css)
- `--color-primary`, `--color-accent`, `--bg`, `--text`, `--muted`, `--border`
- `--space-xs` a `--space-xl` (progresión geométrica)
- `--font-family`, `--font-size-base`, `--line-height`
- Temas: `[data-theme="dark"]` como default

### Buenas Prácticas
- No duplicar estilos entre archivos
- No hardcodear valores de color, spacing o tipografía
- Los iconos van en sprite.svg, no en CSS
- Imágenes responsive: usar shortcode `{% image %}` con srcset
