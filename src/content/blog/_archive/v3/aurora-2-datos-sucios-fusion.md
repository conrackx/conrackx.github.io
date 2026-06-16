---
title: "Datos sucios y fusión multi-origen: 5 JSON + 3 CSV sin jerarquía"
date: 2026-06-30
tags: ["pipeline", "automatizacion", "data-engineering", "ETL", "calidad"]
description: "8 fuentes de datos que nadie diseñó para funcionar juntas. Fusión sin jerarquía donde ninguna fuente prevalece sobre otra."
---

## El problema real

El pipeline Aurora recibe datos de 8 fuentes distintas: 5 archivos JSON desde la consola de seguridad (dispositivos, amenazas, usuarios, zonas, políticas) y 3 archivos CSV complementarios (estado de equipos, amenazas adicionales, políticas extendidas).

Cada fuente tiene su propia estructura, su propio nivel de completitud y su propio ritmo de actualización. Algunos clientes envían todos los archivos; otros omiten los CSV. Algunos JSON llegan con campos nulos; otros con esquemas que cambian sin aviso.

## Los 3 principios de la fusión sin jerarquía

### 1. Ninguna fuente prevalece

Si un cliente no envía los CSV, el pipeline continúa con los datos JSON disponibles. No hay una fuente "principal" que bloquee el proceso. Cada etapa del pipeline pregunta "¿qué tengo?" en lugar de "¿qué debería tener?".

### 2. Validación por fuente, no por conjunto

Cada archivo se valida individualmente contra su esquema esperado. Los errores se registran por fuente, no abortan el pipeline. Al final, el reporte incluye una nota: "Datos de amenazas basados en JSON únicamente (CSV no disponible)".

### 3. Contexto normalizado como contrato

El archivo `report_context.json` es la representación unificada de todas las fuentes. Su esquema está diseñado para ser tolerante: campos opcionales con valores por defecto, arrays vacíos en lugar de nulos, y un metadato `sources` que documenta qué fuentes contribuyeron a cada sección.

## Ejemplo real

Un cliente dejó de generar el CSV de políticas por un cambio en su consola. El pipeline detectó la ausencia, registró "CSV políticas: no disponible", y continuó. El informe se generó con las políticas del JSON. El analista supo exactamente qué datos faltaban y por qué.

## Lecciones transferibles

1. **Diseña para datos imperfectos.** Asumir que todas las fuentes llegarán siempre completas es una receta para pipelines frágiles.
2. **El contrato de integración es el esquema intermedio.** Normalizar todo a un contexto común desacopla las fuentes del consumo.
3. **La transparencia sobre datos faltantes vale más que la completitud.** Un informe que dice "esto falta" es más confiable que uno que oculta la ausencia.
