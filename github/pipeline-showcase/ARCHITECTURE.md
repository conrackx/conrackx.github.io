# Arquitectura del Pipeline de Reportes Aurora

## Diagrama de alto nivel

```mermaid
flowchart LR
    subgraph Fuentes
        A1[Consola Aurora<br>dispositivos.json]
        A2[Consola Aurora<br>amenazas.json]
        A3[Consola Aurora<br>usuarios.json]
        A4[Consola Aurora<br>zonas.json]
        A5[Consola Aurora<br>politicas.json]
        B1[CSV<br>estado_equipos.csv]
        B2[CSV<br>amenazas.csv]
        B3[CSV<br>politicas.csv]
    end

    A1 --> C[Extracción]
    A2 --> C
    A3 --> C
    A4 --> C
    A5 --> C
    B1 --> C
    B2 --> C
    B3 --> C

    C --> D[Consolidación<br>report_context.json]
    D --> E[Análisis de Riesgo<br>risk_rules.json]
    E --> F[Narrativas IA<br>enriched_narratives.json]
    F --> G[Gráficos<br>6 charts PNG]
    G --> H[Ensamblado<br>render_plan.json]
    H --> I[Validación<br>122 tests]
    I --> J[PDF Final]
```

## Artefactos intermedios clave

| Artefacto | Etapa | Propósito |
|-----------|-------|-----------|
| `report_context.json` | Consolidación | Dataset unificado de toda la información del cliente en ese mes |
| `risk_rules.json` | Análisis de Riesgo | Reglas de negocio externalizadas: umbrales, pesos, criterios |
| `enriched_narratives.json` | Narrativas IA | Insights redactados (IA o stub) por cada sección |
| `render_plan.json` | Ensamblado | Plan del documento final antes de generarlo — trazabilidad |

## Reglas de negocio (risk_rules.json)

Motor de evaluación en 7 dimensiones. Cada dimensión es un objeto JSON con:

```json
{
  "dimensiones": {
    "amenazas_activas": {
      "peso": 0.25,
      "umbral_alto": 5,
      "umbral_medio": 2,
      "fuente": "amenazas.json"
    },
    "politicas_proteccion": { "peso": 0.2, ... },
    "versiones_software": { "peso": 0.15, ... },
    "conectividad": { "peso": 0.1, ... },
    "cobertura_avanzada": { "peso": 0.15, ... },
    "actividad_admins": { "peso": 0.1, ... },
    "configuracion_zonas": { "peso": 0.05, ... }
  }
}
```

Un analista de seguridad modifica pesos y umbrales sin acceso al código del pipeline.

## Modo stub determinístico

El pipeline mantiene dos caminos para generar narrativas:

- **Camino A (IA)**: LLM local con prompt estructurado.
- **Camino B (stub)**: plantilla fija que genera párrafo base desde métricas.

El stub es la línea base garantizada. El LLM es la mejora opcional.

## Orquestación

- Hasta 8 clientes en paralelo (separación por nombre de cliente en paths).
- Ventana temporal controlada: días 26-31 del mes actual o 1-5 del mes siguiente.
- Override con autorización explícita (flag `--force` + confirmación).

## Trazabilidad

Cada cifra en el PDF final puede trazarse a:
1. Sección de fuente original (JSON/CSV específico).
2. Regla aplicada en `risk_rules.json`.
3. Test que valida esa cifra.
