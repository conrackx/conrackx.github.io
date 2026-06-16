---
title: "Por qué Caracas necesita un pipeline de datos cívicos (y lo construí)"
date: 2026-06-18
tags: ["pipeline", "datos-abiertos", "movilidad", "ingenieria-civica"]
description: "Caracas no tiene GTFS oficial. Los datos existen como KMLs dispersos en portales del gobierno. Construí un pipeline para transformarlos."
---

## El problema real

Si vives en Londres, Madrid o Buenos Aires, abres Google Maps, pones una dirección y el transporte público aparece con horarios, rutas y paradas. En Caracas, esa pantalla está vacía.

El gobierno publica datos de transporte en formato KML, pero son archivos sueltos, sin validación, con geometrías rotas y nombres inconsistentes. No hay un feed GTFS —el estándar global para datos de transporte— que permita a apps como Google Maps, Transit o Moovit mostrar las rutas caraqueñas.

## Los 3 principios del pipeline cívico

### 1. Los datos oficiales son materia prima, no producto terminado

El KML oficial es el punto de partida, no el destino. El pipeline aplica 4 capas de validación antes de producir GTFS:

| Capa | Validación | Herramienta |
|------|-----------|-------------|
| Esquema | GeoJSON válido RFC 7946 | `@tmcw/togeojson` |
| Geometría | LineStrings cerradas, CRS=EPSG:4326 | geojson-validation |
| Topología | Paradas sobre rutas (< 50m) | Script custom |
| Negocio | 300+ rutas, 1200+ paradas, 5 municipios | Jest + datos sintéticos |

### 2. Versionado y CI no son opcionales

Cada cambio en los KML se trackea en git. Cada commit ejecuta un pipeline de CI que valida el GTFS generado. Si un alcalde actualiza una ruta, el feed nuevo pasa por las mismas 300+ pruebas antes de publicarse.

### 3. El formato intermedio es el contrato

GeoJSON es el archivo de intercambio entre el parser y el generador GTFS. Si el gobierno cambia el formato KML, solo se modifica la etapa de parseo. El generador GTFS recibe siempre GeoJSON, sin importar la fuente.

## Datos cívicos como producto de ingeniería

| Práctica | Beneficio |
|----------|-----------|
| Git | Historial de cambios en rutas |
| CI/CD | Validación automática por commit |
| Tests | 300+ aserciones, 0 falsos positivos |
| Reproducibilidad | `npm run build` → GTFS idéntico |

## Lecciones transferibles

1. **La validación topológica no es opcional.** KML oficial trae geometrías inválidas. Sin tests geo, el GTFS rompe routers de navegación.
2. **Datos cívicos merecen ingeniería de software.** Lo mismo que harías para un pipeline de producción: CI, tests, versionado, reproducibilidad.
3. **El mayor valor no es el feed, es la confianza.** Un GTFS que pasa 300+ tests vale más que uno "que parece funcionar".
