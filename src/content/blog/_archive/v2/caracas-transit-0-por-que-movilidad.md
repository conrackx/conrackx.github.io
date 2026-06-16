---
title: "Por qué construir datos de transporte público en ciudades que no los tienen"
date: 2026-04-02
tags: ["movilidad", "datos-abiertos", "ingenieria-civica", "narrativa"]
description: "El transporte público no existe sin datos. En Latinoamérica, la ausencia de feeds GTFS oficiales no es un vacío técnico — es una barrera de acceso a la movilidad."
---

## El momento

La primera vez que abrí un archivo KML de rutas de Caracas en QGIS, vi líneas blancas sobre un fondo gris. Eran las rutas del Metrobús, de los autobuses de la capital, dibujadas con una precisión que parecía hecha a mano. Había curvas que no seguían calles, paradas que flotaban a medio kilómetro de la vía más cercana, y nombres escritos en mayúsculas sin acentos ni consistencia.

Ese archivo era lo más parecido a un mapa de transporte público que tenía la ciudad. No había GTFS. No había API. No había un dataset descargable en ningún portal de datos abiertos.

Lo único que existía era ese KML.

## ¿Por qué es un problema?

El transporte público es un derecho. Para ejercerlo, necesitas saber dónde está la parada, qué ruta tomar, cada cuánto pasa. Eso es información. Sin información, el derecho se vuelve teórico.

En ciudades con datos de transporte estructurados, cualquier desarrollador puede construir una app que te diga cuándo llega el próximo bus. En Caracas, el primer paso no era construir la app. Era crear los datos sobre los que la app se sostiene.

## La brecha de datos en Latinoamérica

El GTFS (General Transit Feed Specification) es el formato estándar mundial para datos de transporte público. Fue creado por Google en 2005. Veinte años después, docenas de ciudades latinoamericanas aún no tienen un feed público mantenido.

Las razones no son técnicas. Son institucionales:
- Los datos existen pero están en formatos cerrados (PDF, KML, CAD)
- Nadie tiene el presupuesto para convertirlos
- Nadie tiene el incentivo: la demanda no se expresa porque la gente no sabe que debería existir

## El rol del ingeniero

En este contexto, construir un pipeline que convierta KML en GTFS no es solo un ejercicio técnico. Es un acto de infraestructura cívica. Los datos de transporte son como las vías: si no existen, no hay por dónde circular.

El proyecto Caracas Transit no nació de un encargo. Nació de una frustración: querer usar el transporte público de mi ciudad y no tener una app que funcionara.
