---
title: "De manual a pipeline: cómo reduje la generación de reportes de días a 15 minutos"
date: 2024-11-15
tags: ["pipeline", "automatización", "data-engineering", "ETL"]
description: "El problema real no era técnico, era humano: no escalaba. Cómo construí 7 etapas declarativas con artefactos verificables para automatizar reportes de seguridad."
---

## El problema real

El análisis de datos en producción rara vez se muere por falta de código. Se muere porque lo hacemos a mano.

Contexto: siete clientes que reciben un reporte mensual de seguridad. Antes del pipeline, el flujo era:

1. Analista entra a la consola Aurora.
2. Exporta métricas a Excel.
3. Arma tablas en Word.
4. Inserta los gráficos manualmente.
5. Repite el proceso para cada cliente.

El cuello de botella no era técnico. Era humano: el proceso no escalaba, los números se copiaban mal, las secciones se olvidaban y el formato variaba entre clientes. Un cambio en una regla de negocio implicaba modificar informes uno por uno, reinsertar gráficos y volver a revisar cifras.

La pregunta no era "¿cómo escribo más rápido en Word?". Era "¿cómo hago que el conocimiento del analista sea reproducible?".

## Los principios que estructuraron la solución

### 1. Cada etapa produce un artefacto verificable

La clave es que cada eslabón de la cadena convierta entradas en salidas con formato conocido, no que el pipeline entero funcione como una caja negra.

La mentalidad de data engineer no es "juntar todo y procesar". Es diseñar una cadena donde cada eslabón convierte entradas en salidas con formato conocido. Escribí el pipeline como siete etapas declarativas:

- **Extracción**: leer las fuentes originales sin transformar nada.
- **Consolidación**: fusionar múltiples archivos en un dataset único.
- **Análisis de riesgo**: evaluar métricas contra reglas de negocio.
- **Generación de narrativas**: redactar insights en lenguaje natural.
- **Gráficos**: producir visualizaciones reproducibles.
- **Ensamblado**: armar el documento final, sección por sección.
- **Validación**: verificar que el documento cumpla reglas de integridad.

Cada una genera un artefacto intermedio que puede verse, inspeccionarse y volverse a procesar. Esa separación permite dos cosas que la mayoría de los pipelines caseros no tienen: trazabilidad y regeneración barata.

### 2. Los datos reales son sucios; diseñar para eso

Los datos de seguridad no llegan en un CSV limpio. Llegan en cinco archivos JSON desde la consola Aurora —dispositivos, amenazas, usuarios, zonas, políticas— más tres CSV complementarios de estado.

La clave es que ninguna fuente prevalezca sobre la otra. Si un cliente deja de enviar los CSV durante un mes, el sistema continúa generando el reporte con los JSON que siguen disponibles. No hay una única fuente de verdad; hay un consenso entre fuentes.

El resultado es un archivo unificado —el `report_context.json` — que encapsula el estado consolidado. A partir de ahí, todas las etapas siguientes consumen esa única abstracción.

### 3. Las 7 etapas declarativas con tiempos reales

El pipeline no es una caja negra. Son siete etapas, cada una con un script independiente, un artefacto de salida y un tiempo acotado:

| Etapa | Script | Output | Duración |
|------|--------|--------|----------|
| F0 · Verificar crudos | `check_raw_data.py` | exit_code {0,1,2} | ~1s |
| F1 · Recolectar | `fetch_report_data.py` | 5 JSON + 3 CSV | 5-15s |
| F2 · Normalizar | `normalize_context.py` | `report_context.json` | 5-15s |
| F3 · Build Plan | `build_plan.py` | `render_plan.json` | 5-15s |
| F4 · Enrich | `enrich.py` | `enriched_narratives.json` | ~1s |
| F5 · Gráficos | `render_charts.py` | 6 charts PNG | 15-30s |
| F6 · Word | `build_docx.py` | `Reporte_Aurora_*.docx` | 60-90s |
| F7 · Validar | `validate.py` | `validation.log` | ~1s |

Cada una puede reprocesarse de forma independiente. Si las narrativas fallan, no hay que re-extraer los datos.

### 4. Nunca redactar el Word desde datos crudos

El error más común en pipelines de reportes es tomar los datos fuente y generar el documento final en un solo paso. Si hay que cambiar el formato, se reprocesa todo.

La solución fue un archivo intermedio —`render_plan.json`— que contiene todas las métricas, riesgos, textos y referencias a gráficos antes de tocar el documento. Es la *intención* del reporte en formato estructurado. Esto permite:

- Regenerar el Word sin reprocesar datos originales. Si falla el ensamblado, F0-F5 no se repiten.
- Auditar exactamente qué cifras y textos se incluyeron.
- Cambiar estilo, secciones o reglas de riesgo sin tocar la fuente de datos.

Es el principio que separa un pipeline frágil de uno mantenible.

### 5. Motor de reglas separado del código

Las reglas de negocio no son constantes en un `.py`. Son un archivo de configuración independiente que un analista de seguridad modifica sin pedir acceso al código del pipeline.

El motor evalúa el riesgo en siete dimensiones, cada una con una ponderación específica:

| Dimensión | Peso | Evalúa |
|-----------|------|--------|
| A · Amenazas activas | 30 pts | Incidentes abiertos, severidad, evolución mensual |
| B · Políticas de protección | 25 pts | Cobertura de políticas por dispositivo |
| C · Versiones de software | 15 pts | End-of-life, parches críticos |
| D · Conectividad | 10 pts | Equipos sin conexión reciente |
| E · Cobertura EDR | 10 pts | Equipos sin endpoint detection |
| F · Actividad de admins | 5 pts | Accesos anómalos, cuentas privilegiadas |
| G · Configuración de zonas | 5 pts | Segmentación, zonas sin monitoreo |

La suma del score determina el nivel de riesgo final (Bajo, Medio, Alto). Los umbrales y ponderaciones viven en `risk_rules.json`. La separación de responsabilidades es clara: el dominio define qué es el riesgo; la ingeniería define cómo se calcula.

## Cómo se construyó: semana a semana

El pipeline no se diseñó de una sola vez. Fue un proceso iterativo de 8 semanas:

- **Semana 1** — Análisis del proceso manual actual. Entrevistas con el equipo operativo para entender el flujo artesanal y documentar las 8 secciones del reporte.
- **Semana 2** — Diseño de la arquitectura declarativa. Decisión clave: 7 etapas con artefactos intermedios verificables y el principio de "nunca redactar el Word desde datos crudos".
- **Semana 3** — Módulos de extracción y consolidación. Lectura de los 5 JSON + 3 CSV, fusión sin jerarquía, definición de `report_context.json`.
- **Semana 4** — Motor de riesgo en 7 dimensiones con reglas externalizadas en `risk_rules.json`.
- **Semana 5** — Generación de narrativas automáticas con modo stub (`--write-stub`) y enriquecimiento opcional mediante IA.
- **Semana 6** — 6 gráficos automáticos con identidad corporativa.
- **Semana 7** — Ensamblado del documento Word, 9 reglas de validación final (V1-V9), ventana de ejecución mensual, generador de datos sintéticos para tests.
- **Semana 8** — Orquestador multi-cliente con paralelismo (hasta 8), compatibilidad multiplataforma, documentación técnica y entrega formal.

De la semana 1 a la 8, el entregable pasó de "no existe" a un pipeline en producción con 7 clientes activos.

## Resultados

| Métrica | Antes | Después |
|---------|--------|---------|
| Tiempo por reporte | Días | ~15 minutos |
| Errores de copiado | Frecuentes | Cero |
| Consistencia entre clientes | Variable | 100% |
| Escalabilidad para agregar cliente | Semanas | Horas |
| Trazabilidad por cifra | No | Completa |

## Lecciones transferibles

La automatización no es reemplazar al analista. Es hacer que lo que el analista ya sabe hacer sea reproducible, verificable y escalable. Esto vale para cualquier dominio: finanzas, marketing, operaciones. El patrón —etapas declarativas, artefactos intermedios, reglas externalizadas— se transfiere tal cual.

El stack fue Python y librerías estándar del ecosistema de datos. No hace falta un stack exótico para construir algo que produzca valor real.

**¿Qué sigue?** En el siguiente post explico cómo integré IA para generar narrativas sin convertirla en un punto único de falla.
