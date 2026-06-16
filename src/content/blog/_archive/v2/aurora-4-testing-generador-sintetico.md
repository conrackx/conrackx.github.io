---
title: "Aurora: el generador sintético que hizo posible tener 200+ tests en producción"
date: 2026-06-04
tags: ["testing", "calidad", "pipeline", "narrativa", "postmortem"]
description: "Para tener tests deterministas necesitas datos que no cambien. Así construí un generador de datos sintéticos que permite ejecutar 200+ test en 60 segundos."
---

## El problema con los datos reales en tests

Tests contra datos reales son frágiles: las métricas cambian mes a mes, los clientes nuevos no existen en los datos históricos, y un test que pasa en enero puede fallar en febrero sin que nada se haya roto.

Para tests deterministas necesitas datos que no cambien. Eso significa generarlos sintéticamente.

## El generador sintético

Escribí un generador que crea consumos y amenazas con patrones realistas. Garantiza condiciones específicas para probar casos borde: sin EDR activo, con políticas desactualizadas, con clientes que dejaron de enviar datos.

Los tests se organizan en tres capas:

| Capa | Cantidad | Qué cubre |
|------|----------|-----------|
| Unitarios | ~140 | Esquemas, reglas de riesgo, narrativas, gráficos |
| Integración | ~60 | Flujo completo con datos sintéticos |
| Smoke | ~10 | Entrada → DOCX final |

Ejecución completa: 60-90 segundos. Suficientemente rápido para correr antes de cada commit.

## Quality gates como barrera automática

Nueve reglas de validación (V1-V9) verifican cada documento generado: esquema, cobertura, consistencia, formato, integridad. Si una regla falla, el documento se rechaza antes de llegar al cliente.

El caso que más recuerdo: un gerente pidió el reporte antes de tiempo. El sistema impidió la generación porque los datos del mes no estaban completos. Los tests evitaron entregar información incompleta.
