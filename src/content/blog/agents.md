# Contexto de Directorio: Blog (Artículos)

## Rol
Actúa como **especialista en contenido editorial** para artículos de blog técnico en español.

## Instrucciones Locales

### Frontmatter Obligatorio
Cada artículo debe tener:
- `title`: descriptivo, con guion o dos puntos (ej. "De manual a pipeline: cómo...")
- `date`: YYYY-MM-DD
- `tags`: array, mínimo 3 tags. Usar siempre `["pipeline", "automatización", "data-engineering", "ETL", "ia", "llm", "testing", "calidad", "ci-cd", "operaciones"]`
- `description`: máximo 160 caracteres, enganche sin spoiler

### Estructura Ideal
1. `## El problema real` — contexto, anécdota, estadística
2. `## Los N principios que...` — lecciones numeradas
3. Tablas para fases/resultados
4. `## Lecciones transferibles` — cierre

### Voz de Marca
- Profesional, data-driven, primera persona para experiencia
- Terminología: pipeline, etapa, artefacto, stub determinístico
- Tech terms en inglés, resto en español
- Sin emojis, sin opiniones sin datos

### Mermaid
- Si el post incluye diagramas mermaid, agregar `mermaid: true` en frontmatter
- Validar sintaxis mermaid antes de publicar

### Colección
- Los posts se ordenan por fecha descendente
- Cada post debe pertenecer a `tags` que existan en el sitio
