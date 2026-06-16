---
title: "200+ tests y quality gates: testing como activo de negocio"
date: 2026-07-28
tags: ["pipeline", "testing", "calidad", "data-engineering", "operaciones"]
description: "200 tests que corren en 90 segundos. Unitarios, integración, end-to-end y un generador sintético que crea clientes falsos para pruebas reales."
---

## El problema real

El pipeline Aurora procesa datos de seguridad de clientes reales. Si un cambio introduce un error, el informe de un cliente puede salir con métricas incorrectas. En seguridad informática, un número equivocado no es un error cosmético —es un riesgo operacional.

La solución fue construir una suite de tests que cubriera cada etapa del pipeline, y diseñar un generador de datos sintéticos que permitiera probar con datos realistas sin exponer información sensible.

## Las 4 capas de testing

| Capa | Tests | Propósito | Tiempo |
|------|-------|-----------|--------|
| Unitarios | ~140 | Esquemas, reglas de riesgo, transformaciones, formato de gráficos | ~30s |
| Integración | ~60 | Flujo completo con datos sintéticos multi-cliente | ~45s |
| End-to-end | ~10 | Entrada (datos crudos) → Salida (DOCX validado) | ~15s |
| Smoke | ~1 | Pipeline completo con un solo cliente | ~5s |

## El generador sintético

El activo más valioso de la suite es el generador de datos sintéticos. Crea clientes falsos con configuraciones realistas: dispositivos, amenazas, políticas, usuarios. Cada ejecución genera un cliente nuevo con datos aleatorios pero coherentes.

```python
# Pseudocódigo del generador
def generate_synthetic_client():
    client = {
        "devices": [generate_device() for _ in range(random.randint(10, 200))],
        "threats": [generate_threat() for _ in range(random.randint(0, 50))],
        "policies": generate_policy_set(),
        "users": [generate_user() for _ in range(random.randint(5, 50))]
    }
    return client
```

Beneficio clave: cualquier cambio en el pipeline se prueba contra configuraciones que no existen en producción, detectando edge cases que los datos reales no cubren.

## Quality gates V1-V9

Cada documento generado pasa por 9 reglas de validación antes de considerarse entregable:

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

## Lecciones transferibles

1. **El testing exhaustivo es un activo que baja el costo de cualquier cambio futuro.** 200 tests en 90 segundos = despliegue confiable.
2. **Los datos sintéticos son más valiosos que los reales para testing.** Te dejan probar edge cases que los datos de producción no cubren.
3. **Quality gates no son burocracia, son la última línea de defensa.** Nueve reglas V1-V9 garantizan que lo que se entrega cumple un estándar medible.
