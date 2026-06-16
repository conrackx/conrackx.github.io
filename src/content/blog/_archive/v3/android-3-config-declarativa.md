---
title: "Config declarativa: YAML + SIGHUP sin redeploy"
date: 2026-08-10
tags: ["shell", "monitoreo", "android", "devops", "calidad"]
description: "El monitor se configura con un archivo YAML. ¿Cambiar filtros? Editar YAML y mandar SIGHUP. Sin redeploy, sin reinicio."
---

## El problema real

El monitor Android filtra notificaciones por paquete y palabras clave. Cuando quería agregar una nueva regla —por ejemplo, capturar errores de una app que antes no monitoreaba— tenía que editar el script y reiniciar el daemon.

En un dispositivo desatendido, modificar un script implica: abrir sesión SSH, recordar dónde está el archivo, editar con sed o vim, matar el proceso, reiniciarlo. Demasiados pasos, demasiado riesgo de error.

## La solución: YAML como API del operador

El monitor ahora lee toda su configuración de un archivo YAML:

```yaml
bot_token: "123456:ABC-DEF"
chat_id: "-1001234567890"
filters:
  - package: "com.whatsapp"
    keywords: ["backup", "falló"]
  - package: "com.termux"
    keywords: ["crashed", "killed"]
retry:
  max_attempts: 50
  base_delay: 1
  max_delay: 3600
healthcheck_interval: 300
```

### ¿Cambiar un filtro?

1. Editar `config.yaml`
2. `kill -HUP $(pidof monitor.sh)`

El daemon atrapa SIGHUP, recarga la configuración, y continúa. Sin redeploy, sin reinicio, sin perder eventos en cola.

## Por qué YAML y no JSON o ENV

| Formato | Ventaja | Desventaja |
|---------|---------|------------|
| YAML | Comentarios, legible, anidación limpia | Parseo requiere `yq` o similar |
| JSON | Parseo nativo con `jq` | Sin comentarios, verboso |
| ENV | Simple | Sin anidación, todo string |

Elegí YAML por la legibilidad. Los operadores que mantienen el monitor no son desarrolladores —poder dejar comentarios en el archivo de configuración reduce errores.

## El trap SIGHUP en bash

```bash
reload_config() {
  eval "$(yq eval -o=shell config.yaml)"
  log "Configuración recargada: $(date)"
}

trap 'reload_config' HUP

# Loop principal
while true; do
  listen_notifications
  sleep 1
done
```

## Lecciones transferibles

1. **La configuración es la API del operador.** YAML + SIGHUP = cambios en caliente sin redeploy. El operador solo necesita saber dos cosas: qué archivo editar y qué señal enviar.
2. **Comentarios en archivos de configuración no son opcionales.** Cuando el que mantiene el sistema no es el que lo construyó, los comentarios salvan horas de debugging.
3. **SIGHUP es el patrón UNIX olvidado.** Antes de systemd, antes de Docker, los daemons recargaban configuración con señales. Sigue funcionando, sigue siendo elegante.
