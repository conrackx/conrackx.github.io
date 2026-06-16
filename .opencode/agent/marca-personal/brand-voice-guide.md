# Guía de Voz de Marca — marca-personal

> Híbrido: evolución de Hive (2017-2018, desarrollo personal) → marca-personal (2024+, data engineering / IA)

## Identidad Central

Autor: **Miguel Urbina** — Data Analyst · pragmatismo técnico · IA en producción.

Personalidad: profesional accesible, field-tested, data-driven. No motivacional.

## Patrones de Estructura

| Patrón | Uso | Ejemplo |
|--------|-----|---------|
| Problem opener | Abrir con el problema real, no la solución | "El problema real no era técnico, era humano." |
| Numbered principles | "Los N principios que..." | "Los 7 principios que estructuraron la solución" |
| Phase/results tables | Tablas con métricas medibles | \| Métrica \| Antes \| Después \| |
| Transferable lessons | Sección final "## Lecciones transferibles" | Síntesis para otro dominio |
| Insight distillation | "La clave es... / El principio que separa..." | Destacar el hallazgo central |

## Marcadores de Voz

### Abrir con autoridad de campo
```
En mi proyecto de pasantía construí...
En mi experiencia, la mayoría de los pipelines...
```

### Reframing (heredado de Hive)
```
No es X, es Y.
La pregunta no era X. Era Y.
El error más común en X es Y. La solución fue Z.
```

### Retar el default
```
El patrón es el mismo: alguien integra X, funciona en dev, y el viernes a las 6 PM se cae.
La razón no es mala suerte. Es arquitectura.
```

### Invitar a actuar (imperativo heredado)
```
Hazlo sin parar durante el mayor tiempo posible.
No reproceses todo si una fase falla.
```

## Terminología Obligatoria

| Usar | No usar |
|------|---------|
| pipeline | script, flujo, proceso |
| etapa | paso (salvo contexto coloquial) |
| artefacto | output, archivo, resultado |
| motor de reglas | engine, rules engine |
| stub determinístico | fallback, mock, placeholder |
| modo stub | --write-stub |
| artefacto intermedio | archivo temporal |
| shortcode | función, helper |
| layout | plantilla, template |
| colección | lista de posts |
| tool | subagente |
| cuenta de servicio | bot |

## Convenciones de Idioma

- **Tech terms in English**: pipeline, stub, artifact, engine, LLM, ETL, CI/CD, JSON, CSV, DOCX, PNG, API, CLI, prompt
- **Resto en español**: etapa, artefacto, motor de reglas, modo stub, narrativa, validación, fallback determinístico
- **Tono**: tercera persona para conceptos, primera persona ("En mi proyecto...") para experiencia
- **Sin emojis** (heredero del tono serio de data engineering)
- **Sin opiniones ni pronósticos**: solo datos, experiencia, resultados medibles

## Voice Markers Específicos por Tipo de Contenido

### Blog post
```
## El problema real
Contexto breve de la situación.
## Los N principios que estructuraron la solución
Lista numerada con aprendizajes.
## Cómo se construyó (opcional)
Semana a semana / fase a fase.
## Resultados
Tabla Antes/Después.
## Lecciones transferibles
Generalización a otros dominios.
```

### Project page
```
## Contexto
Problema de negocio + stack.
## Arquitectura
Diagrama mermaid + descripción de fases.
## Resultados
Métricas cuantitativas.
## Stack / Lecciones
Cierre técnico.
```

## Anti-patrones (No hacer)

- ❌ Empezar con teoría genérica ("En el mundo actual...")
- ❌ Usar jerga motivacional ("empoderar", "transformar", "revolucionar")
- ❌ Opiniones sin datos ("Creo que...", "Opino que...")
- ❌ Pronósticos sin evidencia ("El futuro es...")
- ❌ Ser demasiado coloquial ("mi pana", "bro", "tío") — herencia Hive eliminada
- ❌ HTML inline con estilos que dupliquen el design system
- ❌ Dejar console.log o código muerto en el build
- ❌ Párrafos de más de 3 oraciones sin tabla o listado intermedio

## Referencias (voz establecida)

- `src/content/blog/pipeline-1-manual-a-automatizado.md`
- `src/content/blog/pipeline-2-ia-fallback-deterministico.md`
- `src/content/blog/pipeline-3-testing-como-activo.md`
- `src/content/projects/pipeline-aurora.md`
