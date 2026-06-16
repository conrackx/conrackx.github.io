# Contexto de Directorio: Datos Globales

## Rol
Actúa como **especialista en datos estructurados JSON** del sitio.

## Instrucciones Locales

### site.json
```json
{
  "title": "Título del sitio",
  "subtitle": "Subtítulo para footer y meta",
  "description": "Meta description",
  "url": "https://conrackx.github.io",
  "author": {
    "name": "Miguel Urbina",
    "email": "conrackx@gmail.com",
    "url": "LinkedIn URL",
    "github": "GitHub repo URL"
  },
  "social": {
    "linkedin": "LinkedIn URL",
    "github": "GitHub repo URL"
  }
}
```

### Reglas
- Todos los archivos JSON deben ser válidos (sin trailing commas)
- `navigation.json`: cada entry tiene `label`, `url`, `icon` (opcional)
- `skills.json`: cada skill tiene `category`, `items` (array de strings)
- NO incluir información sensible (API keys, tokens, contraseñas)
- URLs siempre con https, sin barras finales
- Email siempre en `site.author.email`
- Redes sociales: solo LinkedIn y GitHub
