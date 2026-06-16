---
title: "Aurora: orquestación multi-cliente, ventana temporal y las lecciones de 8 semanas de desarrollo"
date: 2026-06-18
tags: ["pipeline", "operaciones", "ci-cd", "narrativa", "postmortem"]
description: "Ocho clientes en paralelo, ventana temporal estricta, override controlado. Las lecciones transferibles de un pipeline que pasó de 'no existe' a producción en 8 semanas."
---

## La orquestación

El pipeline orquesta hasta 8 clientes en paralelo. Si un cliente falla, los demás continúan. El resumen consolidado al final reporta qué salió bien y qué no.

Los controles operativos son estrictos:

| Control | Comportamiento |
|---------|----------------|
| Ventana temporal | Días 26-31 del mes actual o 1-5 del siguiente |
| Fuera de ventana | `ValueError` a menos que exista override explícito |
| Paralelismo | Hasta 8 clientes simultáneos; más de 8 → secuencial |
| Resiliencia | Cliente falla ≠ pipeline falla |

## La ventana temporal como barrera de calidad

La ventana no es un capricho técnico. Los datos del mes no están completos hasta el día 26. Generar un reporte antes es entregar información incompleta al cliente.

El override existe —`REPORTING_MONTH_OVERRIDE`— pero requiere autorización explícita. Es una decisión consciente, no un bypass accidental.

## Lo que aprendí en 8 semanas

1. **Los artefactos intermedios verificables valen más que una caja negra.** Generar salida final desde datos crudos sin trazabilidad no escala.
2. **Las reglas de negocio en archivos de configuración dan agilidad real.** Los analistas modifican umbrales sin tocar el pipeline.
3. **El testing exhaustivo es un activo que baja el costo de cualquier cambio futuro.** El despliegue de cambios es confiable porque los tests corren en <2 minutos.
4. **La IA debe ser un componente desacoplable.** Si el LLM falla, el pipeline continúa. El informe se entrega igual.

El pipeline pasó de "no existe" a producción con 7 clientes activos en 8 semanas. No por el stack —Python y librerías estándar— sino por las decisiones de diseño: etapas declarativas, artefactos intermedios, reglas externalizadas.
