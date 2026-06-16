---
title: "Datos cívicos como producto: CI, tests, versionado"
date: 2026-07-16
tags: ["pipeline", "datos-abiertos", "movilidad", "testing", "ingenieria-civica"]
description: "Un feed GTFS no es un archivo, es un producto. CI/CD, 300+ tests y versionado para datos que deberían ser infraestructura."
---

## El problema real

La mayoría de los datasets de transporte público se publican como archivos sueltos en portales web. Se actualizan "cuando se puede". No tienen historial, no tienen tests, no tienen dueño. Si un archivo se corrompe, nadie lo sabe hasta que un ciudadano se queja.

Este enfoque trata los datos como un documento. Pero un feed GTFS que usan apps de navegación, investigadores y planificadores merece el mismo trato que un producto de software.

## Datos como producto: 3 prácticas

### 1. Versionado en git

Cada cambio en las rutas de Caracas queda registrado en git. El historial muestra quién modificó qué ruta, cuándo y por qué. Si una actualización rompe la cobertura, el diff muestra exactamente qué cambió.

| Práctica | Cómo se implementa |
|----------|-------------------|
| Commits atómicos | Un cambio por ruta o grupo de rutas |
| Mensajes descriptivos | "Agrega ruta 315: Los Palos Grandes → Bello Monte" |
| Tags semánticos | v1.2.0 = nueva ruta, v2.0.0 = recálculo de geometrías |

### 2. CI/CD para datos

Cada push a master ejecuta:

```bash
npm run build       # KML → GTFS
npm run test        # 300+ aserciones
npm run validate    # GTFS Schedule Spec
```

Si los tests fallan, el feed no se publica. El pipeline de CI es la primera barrera contra datos corruptos.

### 3. Tests como documentación viva

Los tests no solo verifican —documentan qué significa "calidad" para este dataset:

| Test | Lo que documenta |
|------|-----------------|
| `routes_count >= 300` | Cobertura mínima de la ciudad |
| `all_stops_on_route()` | Paradas están donde deben |
| `no_duplicate_ids()` | IDs únicos en todo el feed |
| `stops_in_5_municipios()` | Distribución geográfica |

## El resultado

| Práctica | Antes | Después |
|----------|-------|---------|
| Publicación | Archivo manual en portal | CI/CD automático |
| Historial | Ninguno | Git completo |
| Calidad | Nadie la verifica | 300+ tests por commit |
| Confianza | Baja | Feed certificado |

## Lecciones transferibles

1. **Tratar datos como código cambia el resultado.** Git, CI/CD, tests —las mismas prácticas que usas para software funcionan para datasets.
2. **Los tests son la especificación de calidad.** No digas "el feed es confiable". Demuéstralo con aserciones que cualquiera pueda leer.
3. **La reproducibilidad es el mínimo.** Si no puedes regenerar el feed con un solo comando, no tienes un producto —tienes un accidente.
