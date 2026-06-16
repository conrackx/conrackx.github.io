---
title: "Aurora: IA como mejora opcional, no como dependencia"
date: 2026-05-21
tags: ["ia", "llm", "pipeline", "testing", "narrativa", "postmortem"]
description: "El LLM genera narrativas, pero el pipeline nunca depende de él. Un stub determinístico existe desde el día cero. Así se construye IA que no es punto único de falla."
---

## El problema con integrar IA en producción

El patrón es conocido: alguien conecta un LLM, funciona en desarrollo, y el viernes a las 6 PM la API se cae. El pipeline se detiene, los reportes no salen, el cliente no recibe nada.

La razón no es mala suerte. Es arquitectura.

## La decisión: dos caminos, no uno

El pipeline tiene dos etapas de generación de narrativas:

| Etapa | Cómo funciona | Dependencia |
|-------|---------------|-------------|
| A (IA) | LLM recibe métricas, genera párrafo | API externa, latencia |
| B (Stub) | Plantilla determinista, misma estructura | Ninguna |

El sistema elige la etapa A solo si la configuración lo habilita. La etapa B existe desde el primer día, no como plan de contingencia.

## Lo que aprendí

El prompt no es "escribe algo bonito sobre estos datos". Es un contrato con reglas explícitas: formato, tono, longitud, indicadores obligatorios. La salida se valida automáticamente antes de incorporarse al documento.

Si la narrativa no pasa los checks —longitud incorrecta, keyword de riesgo ausente, contradicción con métricas— el stub toma el control. El pipeline avanza, el reporte se entrega, y el equipo recibe una alerta.

La IA debe ser un componente desacoplable. Esa no es una medida de contingencia. Es la línea base para poner IA en producción.
