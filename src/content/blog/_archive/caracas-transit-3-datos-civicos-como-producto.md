---
title: "Datos cívicos como producto de ingeniería: CI, tests y versionado para transporte público"
date: 2025-04-05
tags: ["civic-tech", "data-engineering", "ci-cd", "operaciones"]
description: "Tratar datos abiertos como software cambia el resultado: versionado, CI/CD, tests automatizados y reproducibilidad para feeds GTFS de transporte público."
---

## El problema de los datos cívicos "sueltos"

La mayoría de los proyectos de datos abiertos comienzan como scripts sueltos: un notebook aquí, un archivo KML allá, una transformación ad-hoc que solo funciona en la máquina de quien la escribió.

El resultado es frágil, no reproducible, y muere cuando la persona se va del proyecto.

## Datos como código

El pipeline de Caracas Transit trata los datos con el mismo rigor que el código fuente:

### Versionado en git

Cada cambio en las rutas, paradas o shapes queda registrado en el historial de git. Esto permite:
- Ver quién cambió qué y cuándo
- Revertir cambios que rompen la topología
- Mantener un changelog de la red de transporte

### CI/CD con GitHub Actions

Cada push al repositorio ejecuta automáticamente:

```
1. npm ci                # instalar dependencias
2. npm run parse         # KML → GeoJSON
3. npm run validate      # 4 capas de validación
4. npm run generate      # GeoJSON → GTFS
5. npm test              # 300+ tests
```

Si cualquiera de estos pasos falla, el pipeline se detiene y el equipo recibe una notificación. No se despliega un GTFS inválido.

### Tests como documentación viva

Los 300+ tests automatizados no solo verifican que el código funciona. Documentan el comportamiento esperado de los datos: cuántas rutas debe haber, qué IDs son válidos, qué distancia máxima entre paradas.

Cuando alguien nuevo se suma al proyecto, los tests son la fuente de verdad de cómo funciona el sistema.

## Lecciones transferibles

1. **El mayor valor no es el feed, es la confianza.** Un GTFS que pasa 300+ tests vale más que uno que "parece funcionar".
2. **La reproducibilidad es el mínimo aceptable.** `npm run build` debe producir el mismo GTFS en cualquier máquina, cualquier día.
3. **Los datos cívicos merecen ingeniería de software.** CI, tests, versionado — no son lujo, son requisitos para que el proyecto sobreviva a su creador.
4. **La documentación se vuelve obsoleta; los tests no.** Invertir en tests sobre documentación estática.
