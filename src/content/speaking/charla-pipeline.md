---
layout: "page.njk"
title: "Charla: IA en Producción — Pipeline Automatizado de Reportes de Seguridad"
date: 2025-03-15
event: "Bootcamp Data Analytics — Estudiantes"
audience: "Estudiantes de Análisis de Datos"
duration: "30 min (sin Q&A) / 40 min (con Q&A)"
slides: "pending"
video: ""
tags: ["charla", "IA", "pipeline", "data-engineering", "testing"]
---

## Resumen

Presentación técnica sobre la construcción de un pipeline de producción que automatiza la generación de informes de seguridad para múltiples clientes. Se muestra la arquitectura de siete etapas, la integración de un LLM con fallback determinístico, el conjunto de 200+ tests automatizados, y las lecciones transferibles para otros dominios.

Objetivo: evidenciar la demanda real del mercado para perfiles "Data Analyst + IA" que saben entregar valor en producción, no solo en notebooks.

## Temas cubiertos

- Problema real: proceso manual no escalable (días → minutos).
- Pipeline ETL declarativo de 7 etapas con artefactos intermedios verificables.
- Fusión multi-origen sin jerarquía: 5 JSON + 3 CSV.
- Motor de reglas de riesgo externalizado (`risk_rules.json`).
- Generación de narrativas con modelo de lenguaje + modo stub determinístico.
- 200+ tests automatizados: unitarios, integración, smoke, generador sintético.
- Operación multi-cliente y ventana temporal controlada.
- Perfil que demanda el mercado: 5 competencias clave.

## Lecciones presentadas

1. Los artefactos intermedios verificables valen más que una caja negra.
2. Las reglas de negocio en archivos de configuración (no en código) dan agilidad real.
3. El testing exhaustivo es un activo que baja el costo de cualquier cambio futuro.

## Recursos

- Slides: \[pendiente\]
- Repo sanitizado: `pipeline-aurora-showcase`
