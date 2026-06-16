# Contexto de Directorio: Proyectos

## Rol
Actúa como **especialista en páginas de proyecto** del portafolio.

## Instrucciones Locales

### Frontmatter Obligatorio
- `title`: nombre del proyecto
- `subtitle`: resumen de una línea (ej. "7 clientes, 7 etapas declarativas, 200+ tests")
- `date`: YYYY-MM-DD
- `featured`: boolean (true para destacar)
- `stack`: array de tecnologías
- `repo`: nombre del repositorio sanitizado
- `tags`: array de tags
- `description`: resumen corto
- `relatedPosts`: array de slugs de blog relacionados (opcional)

### Mermaid
Si el proyecto incluye diagramas, agregar `mermaid: true` en frontmatter.

### Estructura
1. `## Contexto` — problema de negocio
2. `## Arquitectura` — diagrama + descripción de etapas
3. Tablas de fases, dimensiones, resultados
4. `## Stack`
5. `## Lecciones` — numbered list

### Voz de Marca
- Más técnico que los blog posts
- Enfocado en resultados cuantitativos
- Sin narrativa emocional, solo datos y arquitectura
