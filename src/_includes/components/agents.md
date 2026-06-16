# Contexto de Directorio: Componentes

## Rol
Actúa como **especialista en componentes Nunjucks** y patrones de templating.

## Instrucciones Locales

### Nunjucks Patterns
- Usar bloques `{% block %}` / `{% extends %}` consistentemente
- Componentes en `components/` deben ser autocontenidos
- Preferir filtros y shortcodes sobre lógica inline

### Accesibilidad
- Enlaces externos: `target="_blank" rel="noopener"` + `aria-label`
- Iconos SVG: `role="img" aria-hidden="true"` + `aria-label` en contenedor
- Skip link: presente en `base.njk`
- Contraste: mínimo 4.5:1 para texto normal

### Design Tokens
- Usar variables CSS (`var(--space-sm)`, `var(--color-primary)`) nunca valores hardcodeados
- No usar estilos inline salvo excepciones justificadas (post navigation, project footer)
- Clases BEM semánticas: `.site-footer`, `.post-body`, `.page-header`

### Componentes Específicos
- **Header**: logo, navigation de `site.json`, active state
- **Footer**: subtitle + author + año + redes sociales
- **Hero**: solo en homepage
- **PostCard**: título, fecha, excerpt, reading time
- **ProjectCard**: título, subtitle, stack, featured flag
