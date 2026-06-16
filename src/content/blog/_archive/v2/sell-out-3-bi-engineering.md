---
title: "BI engineering: por qué el modelado de datos en Power BI merece el mismo rigor que un pipeline de datos"
date: 2026-07-05
tags: ["bi", "data-engineering", "calidad", "ci-cd"]
description: "Power Query para ETL, Star Schema para el modelo, DAX para medidas, y quality gates para la entrega. BI engineering aplicado a un ejercicio de analista."
mermaid: true
---

## BI no es solo "arrastrar y soltar campos"

La percepción más común de Power BI es que es una herramienta de visualización. Abres el archivo, arrastras campos, y el gráfico aparece. Pero esa visión oculta la capa más importante: el modelo de datos.

Un dashboard sin un modelo sólido es frágil. Cambia una columna y el reporte se rompe. Agrega una fuente y las medidas no cuadran.

## El enfoque de BI engineering

```mermaid
flowchart LR
    A[Fuentes crudas<br>Excel, CSV] --> B[Power Query<br>ETL + despivotado]
    B --> C[Modelo Star Schema<br>Tres hechos + tres dimensiones]
    C --> D[Medidas DAX<br>YTD, Share, Oportunidad]
    D --> E[QA<br>Validaciones automáticas]
    E --> F[Reporte entregable]
    style E fill:#00d4aa,color:#0b0f14
```

### Power Query como motor ETL

Las fuentes originales llegaban en formatos no analíticos:

- **Objetivos anuales en columnas**: cada mes era una columna separada. Power Query los despivotó filas para crear una tabla relacional.
- **Códigos de barras faltantes**: se reconstruyó la dimensión de Productos desde cero, cruzando múltiples fuentes para corregir gaps.

### Star Schema como garantía de rendimiento

El modelo en estrella no es una decisión estética. Es una decisión de ingeniería que garantiza:

1. **Rendimiento**: las tablas de hechos son largas y delgadas; las de dimensiones, cortas y anchas. Power BI optimiza las consultas sobre esta estructura.
2. **Claridad**: cada tabla tiene un propósito claro. Un analista nuevo entiende el modelo en minutos.
3. **Mantenibilidad**: agregar una nueva fuente implica crear una nueva tabla de hechos y reutilizar dimensiones existentes.

### Quality gates

El archivo .pbix incluye medidas de validación que verifican:
- Consistencia entre totales de Sell-Out y Consumo
- Coincidencia de períodos entre calendario y datos
- Integridad de jerarquías de productos

## Lo que aprendí

1. **Power Query es el héroe olvidado de Power BI.** El despivotado de metas llevó 30 líneas de M y habilitó análisis temporal que antes requería SQL.
2. **El 80% del valor está en el modelo, no en las visualizaciones.** Un Star Schema bien diseñado hace que cualquier visualización sea trivial.
3. **La calidad de datos en BI no es diferente a la calidad en un pipeline de datos.** Las mismas reglas aplican: validación de esquemas, consistencia cross-fuente, tests automáticos.
4. **BI engineering no es un oxímoron.** Power BI, con Power Query y DAX, es un stack de ingeniería de datos legítimo. Tratarlo como herramienta de visualización subestima su capacidad.
