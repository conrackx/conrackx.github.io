# Testing — Pipeline de Reportes Aurora

## Resumen

- **Total tests**: 122
- **Cobertura**: esquemas, reglas de negocio, narrativas, gráficos, documento final
- **Tiempo de ejecución**: 60-90 segundos

## Estructura

```text
tests/
├── unit/
│   ├── test_schemas.py          # Validación de esquemas de entrada
│   ├── test_risk_rules.py       # Evaluación de reglas en casos conocidos
│   ├── test_narratives.py       # Longitud, tono, palabras clave, consistencia
│   └── test_charts.py           # Existencia, tamaño, formato de gráficos
├── integration/
│   ├── test_consolidation.py    # Extracción + Consolidación
│   ├── test_risk_engine.py      # Análisis de Riesgo end-to-end
│   ├── test_render_plan.py      # Ensamblado desde render_plan.json
│   └── test_full_pipeline.py    # Flujo completo con datos sintéticos
└── e2e/
    └── test_pipeline_smoke.py   # End-to-end: entrada → PDF validado
```

## Generador de datos sintéticos

Los tests generan datos sintéticos reproducible para evitar dependencias de datos reales que cambian mes a mes.

```python
from tests.fixtures.synthetic_data import generate_month, guarantee_condition

# Datos sintéticos del mes actual
data = generate_month(year=2025, month=3)

# Garantizar condición específica (para probar fallback, etc.)
data = guarantee_condition(data, condition="no_edr", percentage=0.4)
```

Ventajas:
- Tests determinísticos (misma entrada → misma salida siempre).
- Cobertura de casos borde sin esperar a que ocurran en producción.
- Assert numérico exacto en lugar de aproximaciones.

## Ejecutar tests

```bash
# Todos los tests
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=pipeline --cov-report=html

# Solo smoke (más rápido)
pytest tests/e2e/test_pipeline_smoke.py -v

# Un test específico
pytest tests/unit/test_narratives.py::test_narrative_length -v
```

## CI/CD

Los tests se ejecutan automáticamente en cada push vía GitHub Actions (`ci.yml` en `.github/workflows/`). Si cualquier test falla, el deploy se detiene.
