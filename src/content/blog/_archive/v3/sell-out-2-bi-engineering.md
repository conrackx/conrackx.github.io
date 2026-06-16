---
title: "BI Engineering: la calidad de datos es un problema de ingeniería"
date: 2026-07-05
tags: ["bi", "power-bi", "dax", "data-modeling", "calidad"]
description: "La diferencia entre un dashboard bonito y uno confiable es la ingeniería detrás. Power Query, auditoría de datos y quality gates en BI."
---

## El problema real

El modelo de datos del proyecto Sell-Out vs Consumo empezó con un problema conocido: los códigos de barra de productos no coincidían entre las fuentes de ventas y las de consumo. El equipo de BI anterior los había ignorado, asumiendo que "más o menos" coincidían.

El resultado: medidas DAX que calculaban shares incorrectos porque productos equivalentes se trataban como diferentes.

## Los 3 principios del BI Engineering

### 1. Auditoría de datos antes de modelar

Antes de tocar una medida DAX, el pipeline ETL en Power Query audita cada dimensión:

| Dimensión | Auditoría | Resultado |
|-----------|-----------|-----------|
| Productos | Códigos de barra únicos vs duplicados | 12% duplicados |
| Tiendas | Coordenadas geográficas vs zona asignada | 5% mal asignadas |
| Calendario | Días hábiles vs festivos regionales | Festivos cargados manualmente |

### 2. Power Query no es solo "cargar datos"

Cada transformación en Power Query tiene un propósito documentado:

| Transformación | Problema que resuelve |
|----------------|----------------------|
| Despivotar objetivos anuales | Columnas → filas para análisis temporal |
| Merge con tabla maestro | Unificar códigos de barra inconsistentes |
| Fill down en jerarquías | Herencia de categorías faltantes |
| Tabla calendario generada | Inteligencia de tiempo sin depender del origen |

### 3. Quality gates en el modelo

El modelo de datos incluye validaciones que se ejecutan al refrescar:

- Integridad referencial: cada venta tiene un producto y una tienda válidos
- Consistencia temporal: fechas de venta dentro del rango del calendario
- Completitud de dimensiones: 0 registros huérfanos en las tablas de hechos

## El resultado

| Métrica | Antes | Después |
|---------|-------|---------|
| Productos no vinculados | ~12% | 0% |
| Precisión de Share de Ventas | Aproximada | Trazable a nivel SKU |
| Tiempo de auditoría manual | 2 días | 0 (automático) |
| Confianza del equipo comercial | Baja | Alta (usan el reporte semanalmente) |

## Lecciones transferibles

1. **BI engineering es ingeniería.** La calidad de datos, el modelado y las medidas DAX requieren el mismo rigor que un pipeline de datos: testing, consistencia, reglas de negocio externalizadas.
2. **Power Query es un pipeline ETL.** No subestimes su capacidad para auditar, limpiar y transformar datos —es la primera línea de defensa contra basura.
3. **Un dashboard sin validación es una mentira reproducible.** Si no verificas la integridad de los datos en el modelo, estás presentando números que pueden estar equivocados.
