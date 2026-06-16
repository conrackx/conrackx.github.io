---
title: "Aurora: el problema real no era técnico, era que hacíamos todo a mano"
date: 2026-04-23
tags: ["pipeline", "automatizacion", "data-engineering", "narrativa", "postmortem"]
description: "Siete clientes, un analista, informes manuales. La decisión de construir un pipeline de 7 etapas nació de una pregunta que no era técnica: ¿cómo hago que el conocimiento sea reproducible?"
---

## La escena

Era el día 28 del mes, y sabía que venía. El analista de turno abría la consola Aurora, exportaba métricas de cada cliente a Excel, copiaba tablas a Word, insertaba gráficos uno por uno, y repetía. Siete veces.

No era falta de capacidad. Era escala. Un proceso que funciona para un cliente se vuelve insostenible para siete. Y cuando algo se vuelve insostenible, aparecen los errores: cifras que no cuadran, secciones que se olvidan, formatos que cambian entre informes.

## La pregunta correcta

No pregunté "¿cómo escribo más rápido en Word?". Pregunté "¿cómo hago que el conocimiento del analista sea reproducible?".

Esa pregunta cambió todo. Dejé de pensar en herramientas y empecé a pensar en etapas. Cada etapa del pipeline debía tomar una entrada, transformarla y producir una salida verificable. El conocimiento del analista —qué métricas mirar, cómo interpretarlas, qué recomendar— debía codificarse en reglas, no en scripts.

## La decisión de 7 etapas

Siete etapas declarativas, cada una con un script independiente, un artefacto intermedio y una validación. La regla de oro: nunca generar el documento final desde los datos crudos.

El `render_plan.json` —un archivo que captura la intención completa del reporte antes de tocar el Word— fue la decisión que separó este pipeline de uno frágil.
