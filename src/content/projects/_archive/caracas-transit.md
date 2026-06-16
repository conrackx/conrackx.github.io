---
title: "Caracas Transit — Cartografía digital de transporte público"
subtitle: "KML → GTFS: validación geoespacial, 300+ rutas, pipeline Node.js + Python"
date: 2025-03-15
featured: true
stack: ["Node.js", "Python", "KML", "GTFS", "GeoJSON"]
repo: "caracas-transit"
tags: ["geospatial", "data-engineering", "civic-tech", "nodejs"]
description: "Pipeline que transforma datos KML oficiales de transporte de Caracas a GTFS validado, con pruebas de calidad geoespacial automatizadas."
relatedPosts:
  - "caracas-0-por-que-data-pipeline"
  - "caracas-1-kml-a-gtfs"
  - "caracas-2-datos-civicos-producto"
  - "patrones-transferibles"
mermaid: true
---

## Contexto

Caracas no tenía un feed GTFS oficial público. Los datos existían solo como archivos KML dispersos en portales gubernamentales — incompletos, con geometrías rotas, nombres inconsistentes y sin validación topológica.

El objetivo: construir un pipeline reproducible que convierta KML crudo → GTFS válido → calidad certificada, listo para apps de movilidad y análisis de red.

## Arquitectura: KML → GTFS Pipeline

\\\mermaid
flowchart LR
    A[<strong>KML Oficial</strong><br>Rutas + Paradas] --> B[<strong>Parser Node.js</strong><br>@tmcw/togeojson]
    B --> C[<strong>Normalización</strong><br>Limpieza coords + IDs]
    C --> D[<strong>Validador Geo</strong><br>Topología + CRS]
    D --> E[<strong>Generador GTFS</strong><br>stops.txt + shapes.txt]
    E --> F[<strong>Quality Gates</strong><br>300+ tests automatizados]
    style D fill:#00d4aa,color:#0b0f14
\\\

Etapas clave:

| Etapa | Herramienta | Output | Validación |
|-------|-------------|--------|------------|
| 1. Parse | \@tmcw/togeojson\ | GeoJSON FeatureCollection | Esquema GeoJSON |
| 2. Normalize | Script Node.js | Coords WGS84 limpias | 0 coords nulas |
| 3. Validate | \geojson-validation\ + custom | Topología OK | Sin self-intersections |
| 4. GTFS Build | \gtfs-utils\ | \stops.txt\, \shapes.txt\, \outes.txt\ | GTFS Schedule Spec |
| 5. QA | Jest + synthetic data | Reporte HTML | 300+ assertions |

## Stack técnico

**Node.js 20** · **Python 3.11** (geo-utils) · **KML** (origen) · **GTFS** (destino) · **GeoJSON** (intermedio) · **Jest** (testing)

## Calidad de datos geoespacial

El pipeline implementa 4 capas de validación:

1. **Esquema**: GeoJSON válido (RFC 7946)
2. **Geometría**: LineStrings cerradas, sin spikes, CRS=EPSG:4326
3. **Topología**: Paradas sobre shapes (distancia < 50m), rutas conectadas
4. **Negocio**: 300+ rutas únicas, 1.200+ paradas, cobertura 5 municipios

Fallas en cualquier capa → pipeline aborta con reporte detallado.

## Insight: Datos cívicos como producto de ingeniería

Tratar datos abiertos como **código** cambia el resultado:
- Versionado en git (historial de cambios en rutas)
- CI/CD (GitHub Actions valida cada commit)
- Tests como documentación viva
- Reproducibilidad: \
pm run build\ → GTFS idéntico

## Stack / Lecciones

**Stack:** Node.js · Python · KML → GeoJSON → GTFS · Jest · GitHub Actions

1. **La validación topológica no es opcional.** KML oficial trae geometrías inválidas; sin tests geo, el GTFS resultante rompe routers.
2. **El formato intermedio (GeoJSON) es el contrato.** Parser y generador desacoplados permiten cambiar fuentes sin tocar la lógica GTFS.
3. **Datos cívicos merecen ingeniería de software.** CI, tests, versionado, reproducibilidad — no solo "scripts sueltos".
4. **El mayor valor no es el feed, es la confianza.** Un GTFS con 300+ tests pase/a-falla vale más que uno "que parece funcionar".