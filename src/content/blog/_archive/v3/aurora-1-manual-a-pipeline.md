---
title: "De manual a pipeline: 7 etapas declarativas en producción"
date: 2026-06-16
tags: ["pipeline", "automatizacion", "data-engineering", "ETL", "operaciones"]
description: "Siete clientes, un analista, informes manuales. Construí un pipeline de 7 etapas que redujo el tiempo de entrega de días a ~15 minutos."
---

## El problema real

Tres veces al mes, un analista abría la consola Aurora, exportaba datos a Excel, armaba tablas en Word, insertaba gráficos a mano y repetía el flujo para cada cliente. El proceso tomaba días. Los resultados variaban entre clientes porque cada informe dependía de decisiones subjetivas del analista.

El problema no era la herramienta. El problema era que el conocimiento vivía en la cabeza de una persona. Si esa persona se enfermaba, los informes no salían.

## Los 3 principios del pipeline declarativo

### 1. Cada etapa produce un artefacto verificable

No hay "magia" entre los datos crudos y el documento final. Cada etapa del pipeline escribe un archivo JSON intermedio que documenta la transformación:

| Etapa | Entrada | Salida | Verificación |
|-------|---------|--------|-------------|
| 1. Extracción | Consola Aurora | 5 JSON + 3 CSV | Exit code {0,1,2} |
| 2. Normalización | 8 archivos crudos | `report_context.json` | Esquema validado |
| 3. Build Plan | Contexto normalizado | `render_plan.json` | Intención del documento |
| 4. Enrich | Plan + LLM/stub | `enriched_narratives.json` | Narrativas completas |
| 5. Gráficos | Métricas | 6 charts PNG | Formato y resolución |
| 6. Word | Todo lo anterior | `Reporte_Aurora_*.docx` | 8 secciones presentes |
| 7. Validación | DOCX final | `validation.log` | 9 reglas V1-V9 |

### 2. El plan intermedio desacopla contenido de presentación

`render_plan.json` especifica qué va en cada sección del informe, con qué métrica, qué gráfico y qué narrativa. Este archivo es la "intención" del documento. Si cambia el formato del Word, solo se modifica la etapa 6. El resto del pipeline no se entera.

### 3. Fallar temprano, fallar con contexto

Cada etapa valida su salida antes de pasar el control. Si la extracción produce un JSON mal formado, el pipeline aborta en etapa 2 con un mensaje que dice exactamente qué archivo y qué campo falló. No hay debugging a ciegas sobre el DOCX final.

## Resultados en producción

| Métrica | Antes | Después |
|---------|-------|---------|
| Tiempo por reporte | Días | ~15 minutos |
| Errores de copiado | Frecuentes | Cero |
| Consistencia entre clientes | Variable | 100% |
| Agregar cliente nuevo | Semanas | ~2 horas |

## Lecciones transferibles

1. **Los artefactos intermedios son documentación viva.** Cada JSON que escribe el pipeline es un checkpoint que responde "esto es lo que pasó aquí".
2. **El plan antes de la ejecución.** Decidir la estructura del informe como datos estructurados antes de renderizarlo evita que un cambio cosmético requiera reprocesar todo.
3. **La automatización no es solo velocidad, es repetibilidad.** Un informe generado automáticamente es reproducible. Un informe hecho a mano es único, incluso cuando intenta ser igual.
