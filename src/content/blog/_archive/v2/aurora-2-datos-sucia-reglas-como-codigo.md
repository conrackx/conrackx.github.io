---
title: "Aurora: datos sucios, fusión sin jerarquía y reglas de negocio externalizadas"
date: 2026-05-07
tags: ["pipeline", "data-engineering", "automatizacion", "narrativa", "postmortem"]
description: "Cinco JSON, tres CSV y una regla: ninguna fuente prevalece. Cómo diseñar un motor de riesgo externalizado que los analistas modifican sin tocar el código."
---

## El caos de las fuentes

Los datos de seguridad no llegan en un CSV limpio. Llegan en cinco archivos JSON desde la consola Aurora —dispositivos, amenazas, usuarios, zonas, políticas— más tres CSV complementarios de estado.

El primer instinto es jerarquizar: elegir una fuente como "verdad" y usar las otras como complemento. Eso es un error.

## Fusión sin jerarquía

La decisión fue: ninguna fuente prevalece sobre la otra. Si un cliente deja de enviar los CSV, el sistema continúa con los JSON disponibles. No hay una única fuente de verdad; hay un consenso entre fuentes.

El resultado es un archivo unificado —`report_context.json`— que encapsula el estado consolidado. A partir de ahí, todas las etapas siguientes consumen esa única abstracción.

## Reglas como código

El motor de riesgo evalúa siete dimensiones: amenazas, políticas, versiones, conectividad, cobertura EDR, actividad de administradores y configuración de zonas. Cada dimensión tiene una ponderación configurable en `risk_rules.json`.

Los analistas modifican umbrales y pesos en ese archivo. Sin tocar el código del pipeline. Esa separación —entre la lógica del dominio y la lógica de la ingeniería— fue la decisión que hizo que el pipeline no solo funcionara, sino que evolucionara.
