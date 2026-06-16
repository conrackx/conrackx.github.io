# Ejecutar el Pipeline de Reportes Aurora

## Requisitos

- Python 3.11+
- pytest
- Node.js 20+ (para generar gráficos o plantillas si aplica)

## Instalación

```bash
git clone https://github.com/tu-usuario/pipeline-aurora-showcase.git
cd pipeline-aurora-showcase
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## Configuración

1. Colocar archivos de entrada en `data/input/`:
   - 5 archivos JSON desde la consola Aurora.
   - 3 archivos CSV complementarios.
2. Revisar `data/rules/risk_rules.json` y ajustar umbrales según el cliente.
3. (Opcional) Configurar endpoint del LLM local en `config/llm.yaml`. Si no hay LLM, se usa modo stub automáticamente.

## Ejecución

```bash
# Pipeline completo (7 etapas)
python -m pipeline.run --customer "ClienteA" --month 2025-03

# Solo tests
pytest tests/

# Smoke test rápido
pytest tests/e2e/test_pipeline_smoke.py
```

## Convenciones de nombres

- Directorios de cliente: `runs/cliente_aaaamm/`
- Archivo timestamp: `cliente_aaaamm_timestamp`
- No hay separadores entre año y mes: `202503` (no `2025-03`)

## Modos

```bash
--write-stub    # Fuerza generación de narrativas en modo stub (sin LLM)
--force         # Ejecuta fuera de la ventana temporal (requiere autorización)
--dry-run       # Ejecuta hasta ensamblado, no genera PDF final
```

## Nota

Este repositorio es una versión **sanitizada para portfolio y documentación**. No incluye datos reales de clientes ni configuraciones internas de DS Cyber.
