---
title: "IA en producción: el modelo que no se cae"
date: 2024-11-22
tags: ["ia", "llm", "pipeline", "testing"]
description: "Cómo integrar un LLM en un pipeline productivo sin que se convierta en un problema de disponibilidad. Stub determinístico, prompts diseñados como código, y validación automática de salidas."
---

## Por qué la mayoría de las integraciones de IA en producción se caen

El patrón es el mismo: alguien integra un LLM para generar texto, el modelo funciona en desarrollo, y el viernes a las 6 PM la API se cae. El pipeline se detiene, los reportes no salen, y el cliente no recibe nada.

La razón no es mala suerte. Es arquitectura.

En mi proyecto de pasantía construí un pipeline que genera narrativas automáticas para reportes de seguridad. Un modelo de lenguaje recibe métricas estructuradas y redacta un párrafo por cada sección del informe. Pero el modelo no es obligatorio. El pipeline nunca depende de él para funcionar.

## Cómo funciona la generación de narrativas

El proceso tiene dos etapas, no dos caminos:

- **Etapa A (IA)**: toma el `report_context.json` —el dataset consolidado— y genera una narrativa que explica el estado actual, los riesgos detectados y las recomendaciones priorizadas.
- **Etapa B (stub)**: genera un texto base determinista que cubre la misma estructura. Sin LLM, sin llamadas externas, sin dependencias.

El sistema elige la etapa A solo si la configuración lo habilita. La etapa B existe desde el primer día, no como medida de contingencia posterior. Eso es lo que la diferencia de un "stub": no es un plan B que esperamos no usar. Es la línea base garantizada sobre la cual la IA es una mejora opcional.

## Lo que el prompt realmente hace

El prompt no es "escribe algo bonito sobre estos datos". Es un contrato con reglas explícitas:

> Con base en las siguientes métricas de seguridad, genera un párrafo que indique:
> 1. Nivel de riesgo detectado (BAJO, MEDIO, ALTO).
> 2. Indicador que lo dispara (ej: "40% de equipos sin EDR activo").
> 3. Recomendación priorizada.
>
> Formato: profesional, tono objetivo, 3-5 oraciones. Sin opiniones, sin pronósticos.

El formato, el tono y la longitud están acotados en la consigna. La respuesta se valida contra reglas automáticas antes de incorporarse al documento final. Si un párrafo excede la longitud esperada o no menciona un indicador de riesgo concreto, se rechaza.

## Validación de salida de IA: ¿confiamos o chequeamos?

Confío hasta que verifico.

Las validaciones automáticas cubren cuatro aspectos:

1. **Longitud**: el párrafo debe estar dentro de 3 a 5 oraciones. Ni resumen, ni novela.
2. **Keywords de riesgo**: debe mencionar indicadores concretos (EDR, cobertura, políticas, amenazas, versiones). Texto genérico sin sustento se rechaza.
3. **Consistencia numérica**: las cifras generadas no pueden contradecir las métricas del `report_context.json`. Si los datos indican 10% de equipos sin EDR y la IA escribe "40%", el stub toma el control.
4. **Tono y estructura**: el párrafo debe seguir el formato profesional y objetivo. Nada de "es importante considerar..." sin acción concreta.

Si la narrativa no pasa los checks, el stub toma su lugar. El pipeline avanza, el reporte se entrega, y el equipo recibe una alerta para revisar ese prompt específico.

## El stub determinístico: `--write-stub`

El modo stub se activa con el flag `--write-stub` en la línea de comandos:

```bash
python pipeline/cli/enrich.py --write-stub
```

En este modo, el pipeline genera narrativas con plantillas predefinidas que cubren la misma estructura que la versión con IA: nivel de riesgo, indicador disparador y recomendación. Sin modelo, sin API, sin latencia.

El stub no es un plan B que esperamos no usar. Es la línea base garantizada desde el día cero. La IA es una mejora opcional sobre esa base.

## El resultado para el cliente

El cliente no quiere una tabla con porcentajes de cobertura. Quiere saber qué hacer. El modelo transforma métricas en acciones concretas:

> Riesgo ALTO en cobertura de protección avanzada: el 40 % de los equipos no tienen EDR activo. Se recomienda priorizar el despliegue en la próxima semana.

Ese párrafo tarda menos de un segundo en generarse, cuesta casi cero en infraestructura y, gracias al stub, nunca deja de existir.

## Lecciones para llevarse

1. **La IA debe ser un componente desacoplable.** Si el LLM falla, el pipeline continúa. El reporte se entrega igual. La dependencia externa no puede ser un punto único de falla.
2. **El prompt es código.** Tiene especificación, validación y modo de prueba. Como cualquier otro componente, requiere tests automáticos.
3. **El stub no es un parche.** Es la implementación base sobre la que la IA es una mejora opcional. Si el sistema no funciona sin IA, no está listo para producción.

El mercado busca analistas que sepan diseñar prompts y reglas que conviertan datos en acción, no solo en texto bonito. La habilidad no es hablar con la IA. Es diseñar sistemas robustos alrededor de la IA.

En el próximo post explico cómo más de 200 tests automatizados hacen que agregar un cliente nuevo tome horas en lugar de semanas.
