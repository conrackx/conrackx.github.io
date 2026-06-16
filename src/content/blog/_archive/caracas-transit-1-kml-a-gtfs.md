---
title: "De KML a GTFS: cómo convertir datos de transporte público en un feed válido"
date: 2025-03-22
tags: ["geospatial", "kml", "gtfs", "nodejs", "python"]
description: "El pipeline que transforma archivos KML oficiales de Caracas en GTFS validado: parsing geoespacial, normalización de coordenadas y generación de stops.txt + shapes.txt."
mermaid: true
---

## El problema con los datos de transporte en Latinoamérica

En ciudades como Caracas, la información de transporte público no llega en un formato limpio. No hay un feed GTFS oficial descargable. Lo que existe son archivos KML dispersos en portales gubernamentales, con geometrías rotas, nombres inconsistentes y sin validación topológica.

Convertir ese KML crudo en un GTFS válido no es un problema de mapping. Es un problema de ingeniería de datos.

## La cadena de transformación

```mermaid
flowchart LR
    A[KML Oficial] --> B[@tmcw/togeojson]
    B --> C[GeoJSON FeatureCollection]
    C --> D[Normalización: CRS + IDs]
    D --> E[Validador de geometrías]
    E --> F[Generador GTFS]
    F --> G[stops.txt + shapes.txt + routes.txt]
    style D fill:#00d4aa,color:#0b0f14
```

Cada etapa produce un artefacto verificable:

| Etapa | Entrada | Salida | Herramienta |
|-------|---------|--------|-------------|
| Parse | KML .kmz | FeatureCollection | `@tmcw/togeojson` |
| Normalizar | GeoJSON crudo | Coords WGS84 + IDs únicos | Script Node.js |
| Validar | GeoJSON normalizado | Reporte topológico | `geojson-validation` |
| Generar | GeoJSON válido | stops.txt, shapes.txt, routes.txt | `gtfs-utils` |

## Por qué GeoJSON como intermediario

El formato intermedio —GeoJSON— es el contrato entre el parser y el generador GTFS. Si la fuente cambia (otro portal, otro formato), solo se reemplaza la etapa 1. El generador GTFS nunca se entera.

Esta separación es la que permite que el pipeline sea mantenible: cada etapa se prueba, versiona y depliega de forma independiente.

## Lo que aprendí

1. **El KML oficial no respeta estándares.** Las geometrías llegan con coordenadas invertidas, LineStrings abiertas, y IDs duplicados. Sin normalización, el GTFS resultante es inválido.
2. **GeoJSON es el formato puente perfecto.** Es legible por humanos, soportado por todas las herramientas geo, y fácil de testear con Jest.
3. **Un GTFS no es solo un archivo de texto.** Es un modelo de datos con restricciones: cada parada debe estar en una ruta, cada ruta debe tener una forma. Violar eso rompe los routers de movilidad.
4. **El testing geo no es opcional.** Sin validación topológica automatizada, un shape con un spike de 5 km pasa desapercibido hasta que alguien lo ve en la app.
