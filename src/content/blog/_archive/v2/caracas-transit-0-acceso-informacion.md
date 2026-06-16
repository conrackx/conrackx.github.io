---
title: "Datos abiertos como infraestructura: el caso del GTFS en Caracas"
date: 2026-04-16
tags: ["datos-abiertos", "movilidad", "ingenieria-civica", "narrativa"]
description: "Los datos abiertos no son un lujo ni una moda. Son infraestructura tan necesaria como las calles. Cuando una ciudad no publica su GTFS, alguien tiene que construirlo."
---

## Lo que significa "datos abiertos" en transporte

Cuando hablamos de datos abiertos, a menudo imaginamos portales gubernamentales con dashboards bonitos. En transporte, el estándar de apertura es mucho más concreto: un archivo GTFS que cualquier aplicación —Google Maps, Moovit, Transit— pueda consumir.

Caracas no tenía eso. Tenía KML. Archivos con geometrías quebradas, nombres inconsistentes, y una sola persona en una oficina municipal que sabía cómo se actualizaban.

## ¿Por qué no existe un GTFS oficial?

Las causas son múltiples y se refuerzan entre sí:

| Barrera | Impacto |
|---------|---------|
| Falta de demanda ciudadana visible | Sin presión, no hay prioridad presupuestaria |
| Rotación de personal técnico | El conocimiento se pierde con cada cambio de gobierno |
| Formatos heredados (KML, CAD) | Migrar a GTFS requiere ingeniería que no está contratada |
| Inercia institucional | "Siempre se ha hecho así" |

Ninguna de estas barreras es técnica. Todas son organizacionales. Y la única forma de romper el ciclo es desde afuera: construir el dato, publicarlo, demostrar que funciona.

## El GTFS no es solo un archivo

Un feed GTFS es:

- **stops.txt**: cada parada con coordenadas y nombre
- **routes.txt**: cada ruta con su identificador
- **shapes.txt**: la forma geográfica de cada ruta
- **trips.txt**: los viajes programados
- **stop_times.txt**: los horarios de cada parada en cada viaje

Son cinco archivos de texto plano. Pero representan el modelo más complejo de la movilidad urbana: la red completa de cómo una ciudad se mueve.

## De consumidor a constructor

Empecé este proyecto como usuario. Quería una app que me dijera cómo llegar. Terminé construyendo el pipeline que convierte KML → GeoJSON → GTFS porque esa era la pieza faltante.

El principio detrás del proyecto: si los datos no existen, créalos. Si existen pero son inaccesibles, transfórmalos. Si son frágiles, ponles tests.
