---
title: "Testing como activo: 200+ pruebas que bajan el costo de cualquier cambio"
date: 2024-11-29
tags: ["testing", "calidad", "ci-cd", "operaciones"]
description: "Más de 200 tests automatizados —unitarios, de integración y smoke— transformaron un pipeline frágil en un sistema donde agregar clientes toma horas en lugar de semanas."
---

## Por qué el testing no es un lujo en data

En muchos proyectos de datos, los tests brillan por su ausencia. Hay razones: los datos cambian, los esquemas evolucionan, los clientes piden excepciones. El testing en data es difícil, dicen. Pero difícil no es lo mismo que innecesario.

En mi proyecto de pasantía implementé un conjunto de más de 200 tests automatizados que corren en 60 a 90 segundos. Cubren todo el flujo.

## Qué se prueba, exactamente

Los tests no son una lista de "todo verde". Son validaciones específicas por capa:

- **Esquema de datos**: cada archivo de entrada tiene la estructura esperada. Si un cliente entrega un CSV con columnas renombradas, el test lo detecta antes de que el pipeline corra.
- **Reglas de negocio**: el motor de evaluación de riesgo produce los niveles esperados para casos conocidos. No confiamos en que "parece correcto".
- **Narrativas**: longitud, tono, presencia de palabras clave de riesgo, ausencia de contradicciones con las métricas.
- **Gráficos**: se generan, tienen el tamaño correcto, corresponden a las secciones del reporte.
- **Documento final**: contiene las ocho secciones obligatorias, cumple reglas de formato, no tiene secciones vacías.

### Las 9 puertas de validación (V1-V9)

Cada documento generado pasa por 9 validaciones automáticas antes de considerarse entregable:

| Regla | Verifica |
|-------|----------|
| V1 | Esquema de `report_context.json` |
| V2 | Cobertura de datos por fuente |
| V3 | Consistencia de métricas entre fases |
| V4 | Formato y existencia de gráficos |
| V5 | Longitud y tono de narrativas |
| V6 | Integridad de secciones del documento |
| V7 | Reglas de negocio contra umbrales |
| V8 | Coherencia cross-cliente |
| V9 | Smoke test end-to-end |

Si alguna regla falla, el documento se rechaza y el pipeline reporta exactamente qué validación no pasó y en qué fase.

## El generador de datos sintéticos

La clave para tests determinísticos es no depender de datos reales que cambian mes a mes. Escribí un generador de datos sintéticos:

- Crea consumos y amenazas con patrones realistas.
- Garantiza condiciones específicas para probar casos borde (sin EDR, con políticas desactualizadas, etc.).
- Permite assert numéricos exactos en lugar de aproximaciones.

El resultado: los tests pueden ejecutarse en cualquier momento, contra cualquier commit, y el resultado es reproducible.

## Distribución de los tests

Los más de 200 tests se organizan en tres capas:

| Capa | Cantidad | Qué cubre |
|------|----------|-----------|
| Unitarios | ~140 | Esquemas, reglas de riesgo, narrativas, generación de gráficos |
| Integración | ~60 | Flujo completo con datos sintéticos, validación cross-cliente |
| End-to-end / Smoke | ~10 | Entrada → DOCX final, ventana de ejecución, modo stub |

```bash
pytest tests/unit/        # ~140 tests, ~15s
pytest tests/integration/ # ~60 tests,  ~30s
pytest tests/e2e/smoke.py # ~10 tests,  ~20s
```

Ejecución completa: **60-90 segundos**. Suficientemente rápido para correr antes de cada commit.

## Cómo impacta en la operación real

El pipeline opera en una ventana temporal controlada: días 26 a 31 del mes en curso o 1 a 5 del mes siguiente. Fuera de este rango, el sistema lanza un `ValueError`. Existe un override vía la variable `REPORTING_MONTH_OVERRIDE`, pero requiere autorización explícita.

Un gerente pidió el reporte antes de tiempo para una presentación. El sistema impidió la generación —sin override no hay reporte— porque los datos del mes no estaban completos. Se evitó entregar información incompleta al cliente.

Los tests hicieron posible ese comportamiento: la validación de integridad no era un chequeo manual después de generado el documento, sino una barrera automática en el flujo.

Agregar un cliente nuevo en la etapa final del desarrollo tomó 2 horas: configuración y validación de tests. En el proceso manual equivalente, habría sido semanas de ajustes manuales.

## La mentalidad: calidad como diseño, no como revisión

Los tests no son una etapa posterior. Se diseñan junto con cada etapa del pipeline. Cuando se agrega una regla de negocio, se agrega el test que la valida. Cuando se modifica el prompt de narrativas, se actualiza el test que verifica tono y contenido.

Cualquier cambio —una métrica nueva, una sección adicional, un formato de gráfico— se despliega con confianza porque los tests cubren el flujo completo en 60 a 90 segundos.

## Próximos pasos recomendados

El proyecto dejó una lista de mejoras priorizadas que aplican a cualquier pipeline de datos en producción:

### Corto plazo (1 a 4 semanas)

| # | Mejora | Impacto |
|---|--------|---------|
| 1 | Tablero de control visual del estado de cada cliente | Visibilidad operativa inmediata |
| 2 | Notificaciones automáticas ante clientes fuera de ventana o validación fallida | Reducción de tiempo de respuesta |
| 3 | Registro de métricas de uso (tiempo promedio, clientes por mes, ejecuciones forzadas) | Visibilidad de negocio |
| 4 | Respaldo histórico de artefactos intermedios en almacenamiento externo | Cumplimiento de auditoría |

### Mediano plazo (1 a 3 meses)

| # | Mejora | Impacto |
|---|--------|---------|
| 5 | Sección de comparativa intermensual en los reportes | Valor analítico para el cliente |
| 6 | Vista previa en PDF con resumen ejecutivo de una página | Diferenciación comercial |
| 7 | Catálogo de secciones modulares activables por cliente | Personalización sin modificar el sistema |

### Largo plazo (3 a 12 meses)

| # | Mejora | Impacto |
|---|--------|---------|
| 8 | API que exponga datos procesados para otros sistemas | Integración con ecosistema de productos |
| 9 | Detector de anomalías en indicadores (picos inusuales de amenazas) | Inteligencia accionable |
| 10 | Conexión con SIEM/SOAR para traducir recomendaciones en tareas de remediación | Ciclo completo detección-acción |

## Lección transferible

El testing exhaustivo no es burocracia. Es un activo que baja el costo de cualquier cambio futuro. Cuanto más ambicioso sea el sistema, más indispensable es invertir en pruebas automatizadas desde el diseño.
