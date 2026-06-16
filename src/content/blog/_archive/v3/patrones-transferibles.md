---
title: "4 proyectos, 3 patrones: testing, configuración externa, IA desacoplada"
date: 2026-08-07
tags: ["pipeline", "testing", "data-engineering", "ia", "calidad"]
description: "Tres patrones que aparecen en los 4 proyectos: testing como inversión, configuración externa, y componentes desacoplables."
---

## El problema real

Cuando trabajé en el pipeline Aurora, el feed GTFS de Caracas, el modelo BI de Sell-Out y el monitor Android, no empecé buscando patrones comunes. Cada proyecto tenía su propio dominio, su propio stack y sus propias restricciones.

Pero al terminarlos, vi que tres decisiones de diseño aparecían en los cuatro. No por planificación —por necesidad.

## Patrón 1: Testing como inversión, no como costo

| Proyecto | Tests | Lo que protegen |
|----------|-------|-----------------|
| Aurora | 200+ unitarios + integración + E2E | Informes de seguridad correctos |
| Caracas Transit | 300+ aserciones geoespaciales | Rutas de navegación válidas |
| Sell-Out vs Consumo | Quality gates en Power Query | Shares y métricas auditables |
| Android Monitor | Healthcheck + integridad de cola | Alertas que llegan siempre |

En cada proyecto, los tests se diseñaron como la primera línea de defensa contra cambios inesperados. El costo de escribirlos se pagó la primera vez que un cambio rompió algo y los tests lo detectaron antes de llegar a producción.

## Patrón 2: Configuración externa como regla de negocio

| Proyecto | Archivo de configuración | Qué define |
|----------|-------------------------|------------|
| Aurora | `risk_rules.json` | Umbrales de riesgo por dimensión |
| Caracas Transit | Parámetros de validación geo | Tolerancia topológica |
| Sell-Out vs Consumo | Tabla de códigos de barra | Mapeo de productos entre fuentes |
| Android Monitor | `config.yaml` | Filtros, retry, healthcheck |

En todos los casos, la regla de negocio vive fuera del código. Los analistas de seguridad modifican umbrales sin tocar Python. Los curadores de datos ajustan tolerancias sin abrir el pipeline. El operador del monitor cambia filtros con un SIGHUP.

## Patrón 3: Componentes desacoplables como anti-fragilidad

El patrón más revelador: en cada proyecto hay un componente que puede fallar sin detener el sistema.

| Proyecto | Componente desacoplable | Fallback |
|----------|------------------------|----------|
| Aurora | LLM de narrativas | Stub determinístico |
| Caracas Transit | Fuente KML oficial | GeoJSON cacheado + datos abiertos alternativos |
| Sell-Out vs Consumo | Fuente de consumo hogareño | Modelo funciona solo con Sell-Out |
| Android Monitor | Telegram API | Cola persistente + reintento infinito |

## Lo que aprendí

Estos tres patrones no son accidentales. Responden a una misma pregunta: **¿cómo construyes un sistema que sobreviva a sus propias dependencias?**

1. Los tests no prueban el código —prueban tu entendimiento del problema.
2. La configuración externa no es comodidad —es la interfaz entre el sistema y el negocio.
3. El componente desacoplable no es contingencia —es reconocer que lo externo no está bajo tu control.

## Lecciones transferibles

1. **Los patrones aparecen cuando resuelves problemas reales, no cuando buscas patrones.** No forces una abstracción antes de tener dos casos concretos.
2. **El testing, la configuración externa y el desacoplamiento no son "buenas prácticas" abstractas.** Son respuestas a riesgos específicos que aparecen en producción.
3. **La transferibilidad no está en el código, está en las decisiones.** Lo que migra de un proyecto a otro no es la implementación —es el razonamiento.
