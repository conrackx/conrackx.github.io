# install-dynamic-context

Instala el Plugin de Contexto Dinámico en la configuración global de OpenCode. Este plugin permite que el agente cambie automáticamente su rol al navegar a subdirectorios con `agents.md`.

## Contexto

El plugin se despliega en `~/.config/opencode/plugins/dynamic-context/` y se registra en `~/.config/opencode/opencode.jsonc`. Una vez instalado, el agente detectará automáticamente los `agents.md` locales al ejecutar `cd`/`Set-Location` y ajustará su comportamiento.

## Prerrequisitos

- OpenCode v1.17+ instalado.
- Carpeta `~/.config/opencode/` existente (se crea automáticamente al usar OpenCode).
- Este comando debe ejecutarse **desde la raíz del workspace**.

## Pasos

### 1. Detectar workspace root

Verificar que `cwd` es la raíz del workspace:
- Debe contener `.git/`, `work_log/` y `AGENTS.md` con sección "Estándares de Ingeniería Globales".
- Si no: informar error "Ejecuta desde la raíz del workspace" y abortar.

### 2. Leer fuente del plugin

Leer los archivos desde `cwd/.opencode/plugins/dynamic-context/`:
- `package.json`
- `index.js`

### 3. Crear directorio destino

Crear `~/.config/opencode/plugins/dynamic-context/` (recursivo, no fallar si ya existe):

```powershell
$pluginDir = "$env:USERPROFILE\.config\opencode\plugins\dynamic-context"
New-Item -ItemType Directory -Path $pluginDir -Force
```

### 4. Copiar archivos

Copiar `package.json` e `index.js` al directorio destino:

```powershell
Copy-Item -Path "cwd\.opencode\plugins\dynamic-context\package.json" -Destination $pluginDir -Force
Copy-Item -Path "cwd\.opencode\plugins\dynamic-context\index.js" -Destination $pluginDir -Force
```

### 5. Registrar plugin en la configuración

Leer `~/.config/opencode/opencode.jsonc`.

Si el archivo no existe, crearlo con contenido inicial:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "./plugins/dynamic-context"
  ]
}
```

Si ya existe:
- Verificar si `"plugin"` está presente en el objeto raíz.
- Si no está, agregar `"plugin": ["./plugins/dynamic-context"]`.
- Si ya existe y NO incluye `"./plugins/dynamic-context"`, agregarlo al array.
- Si ya está registrado, informar "Plugin ya instalado" y omitir este paso.
- Preservar todas las demás claves del JSON.

**Importante:** El archivo es JSONC (permite comentarios). Leer como texto plano y buscar `"plugin"` con regex o similar para evitar parsers que fallen con comentarios. Si se usa modificación programática, preservar el formato original.

### 6. Validar instalación

Verificar que `$pluginDir\index.js` existe y es legible:

```powershell
if (-not (Test-Path "$pluginDir\index.js")) {
  throw "Fallo en la copia del plugin"
}
```

### 7. Reportar resultado

Informar al usuario:
- **Éxito:** "Plugin de Contexto Dinámico instalado. El agente usará `agents.md` locales al navegar con `cd`."
- **Ya instalado:** "Plugin de Contexto Dinámico ya estaba instalado."
- **Ruta del plugin:** `$pluginDir`
- **Config:** `~/.config/opencode/opencode.jsonc`

## Notas

- El plugin funciona a nivel global: aplica a TODAS las sesiones de OpenCode, no solo a este workspace.
- Para desinstalar: eliminar `~/.config/opencode/plugins/dynamic-context/` y remover la entrada del array `plugin` en `opencode.jsonc`.
- Si el plugin no se carga correctamente, OpenCode lo ignorará silenciosamente (no bloquea la sesión).
