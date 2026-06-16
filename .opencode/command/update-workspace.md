# update-workspace

Actualiza sub-proyectos a la versión actual del workspace, aplicando migraciones retrocompatibles en orden. No modifica archivos fuera de `AGENTS.md` y no toca `## Convenciones Propias`.

## Paso 0: Detectar workspace_root (reutilizable)

Para detectar `workspace_root` desde cualquier directorio, ejecuta este bloque PowerShell:

```powershell
$workRoot = $null
$dir = $PWD.Path
$ErrorActionPreference = 'SilentlyContinue'
while ($dir -and $dir -ne (Split-Path $dir -Qualifier)) {
  $hasGit = Test-Path "$dir\.git" -PathType Container
  $hasWL  = Test-Path "$dir\work_log" -PathType Container
  $hasAgents = $false
  if ($hasGit -and $hasWL -and (Test-Path "$dir\AGENTS.md")) {
    try {
      $txt = Get-Content "$dir\AGENTS.md" -Raw -Encoding UTF8
      $hasAgents = $txt -match 'Est.ndares de Ingenier.a Globales'
    } catch { $hasAgents = $false }
  }
  if ($hasGit -and $hasWL -and $hasAgents) { $workRoot = $dir; break }
  $parent = Split-Path $dir -Parent
  if (-not $parent -or $parent -eq $dir) { break }
  $dir = $parent
}
if (-not $workRoot) { throw "Workspace root no válido. Abortando." }
```

> Usar siempre `-Encoding UTF8` al leer/escribir archivos.

---

## Paso 1: Leer versión objetivo

```powershell
$versionFile = "$workRoot\WORKSPACE_VERSION"
if (-not (Test-Path $versionFile -PathType Leaf)) { throw "Falta WORKSPACE_VERSION en $workRoot" }

try {
  $vConfig = Get-Content $versionFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch { throw "WORKSPACE_VERSION no es JSON válido: $_" }

$TARGET_VERSION = $vConfig.version
Write-Host "[INFO] Versión objetivo del workspace: $TARGET_VERSION"
```

---

## Paso 2: Determinar modo de ejecución

```powershell
$isRoot  = ($PWD.Path -eq $workRoot)
$hasAll  = [Environment]::GetCommandLineArgs() -match '--all'
$results = @()
```

### Si raíz sin --all: informar error
```powershell
if ($isRoot -and -not $hasAll) {
  throw "Ejecuta desde un sub-proyecto, o usa --all desde la raíz"
}
```

---

## Paso 3: Recolectar proyectos objetivo

```powershell
function Get-ExcludedDirs {
  return @('_legacy_*', '.git', 'work_log', '.opencode', 'node_modules', '.vscode', 'migrations')
}

function Should-ExcludeDir {
  param([string]$Name)
  $excluded = Get-ExcludedDirs
  foreach ($ex in $excluded) {
    if ($ex -match '^\*' -and $Name -like $ex) { return $true }
    if ($Name -eq $ex) { return $true }
  }
  return $false
}

$projectDirs = @()

if ($hasAll) {
  Get-ChildItem $workRoot -Directory | ForEach-Object {
    if (-not (Should-ExcludeDir $_.Name) -and (Test-Path "$($_.FullName)\AGENTS.md")) {
      $projectDirs += $_.FullName
    }
  }
  Write-Host "[INFO] Modo batch: $($projectDirs.Count) proyecto(s) detectado(s)"
} else {
  if (Test-Path "$PWD.Path\AGENTS.md") {
    $projectDirs += $PWD.Path
    Write-Host "[INFO] Modo single-proyecto: $(Split-Path $PWD.Path -Leaf)"
  } else {
    throw "El directorio actual no contiene AGENTS.md. No es un sub-proyecto válido."
  }
}

if ($projectDirs.Count -eq 0) {
  Write-Host "[OK] No hay proyectos que actualizar."
  exit 0
}
```

---

## Paso 4: Funciones auxiliares

```powershell
function Get-CurrentVersion {
  param([string]$AgentsPath)
  if (-not (Test-Path $AgentsPath -PathType Leaf)) { return $null }
  $firstLine = Get-Content $AgentsPath -Encoding UTF8 -TotalCount 1
  if ($firstLine -match '<!-- workspace-version:\s*([\d]+\.[\d]+\.[\d]+)\s*-->') {
    return $matches[1]
  }
  return "1.0.0"
}

function Compare-Versions {
  param([string]$V1, [string]$V2)
  $parts1 = $V1 -split '\.' | ForEach-Object { [int]$_ }
  $parts2 = $V2 -split '\.' | ForEach-Object { [int]$_ }
  for ($i = 0; $i -lt 3; $i++) {
    if ($parts1[$i] -lt $parts2[$i]) { return -1 }
    if ($parts1[$i] -gt $parts2[$i]) { return 1 }
  }
  return 0
}

function Get-ApplicableMigrations {
  param([string]$CurrentVer, [string]$TargetVer, [string]$MigrationsDir)
  $allMigrations = Get-ChildItem $MigrationsDir -Directory | ForEach-Object {
    if ($_.Name -match '^v([\d]+\.[\d]+\.[\d]+)-to-v([\d]+\.[\d]+\.[\d]+)$') {
      [PSCustomObject]@{
        Path = $_.FullName
        Name = $_.Name
        From = $matches[1]
        To   = $matches[2]
      }
    }
  }
  $applicable = @()
  foreach ($m in $allMigrations) {
    if ((Compare-Versions $CurrentVer $m.To) -lt 0 -and (Compare-Versions $m.To $TargetVer) -le 0) {
      $applicable += $m
    }
  }
  return $applicable | Sort-Object { [version]$_.From }
}

function Apply-Migration {
  param(
    [string]$ProjDir,
    [string]$MigrationPath,
    [string]$TargetMigVer
  )
  $agentsPath = "$ProjDir\AGENTS.md"
  $scriptPath = "$MigrationPath\script.md"
  $manifestPath = "$MigrationPath\manifest.md"

  if (-not (Test-Path $scriptPath -PathType Leaf)) {
    throw "Falta script.md en $MigrationPath"
  }
  if (-not (Test-Path $manifestPath -PathType Leaf)) {
    throw "Falta manifest.md en $MigrationPath"
  }

  # Hacer backup con timestamp
  $ts = Get-Date -Format 'yyyyMMddHHmmss'
  $backupPath = "$ProjDir\AGENTS.md.bak.$ts"
  Copy-Item $agentsPath $backupPath -Force

  # Determinar current_version antes de aplicar
  $currentVer = Get-CurrentVersion $agentsPath

  # Leer script.md para entender qué hacer
  $script = Get-Content $scriptPath -Raw -Encoding UTF8

  # Aplicar migración según versión
  # v1.0.0 -> v1.1.0: Insertar marcador como primera línea
  if ($TargetMigVer -eq "1.1.0") {
    $content = Get-Content $agentsPath -Raw -Encoding UTF8
    $newFirstLine = "<!-- workspace-version: $TargetMigVer -->"
    # Quitar BOM si existe
    $content = $content.TrimStart("`u{FEFF}")
    $content = $newFirstLine + "`r`n" + $content
    Set-Content -Path $agentsPath -Value $content -Encoding UTF8
  }
  # v1.1.0 -> v1.2.0: Reemplazar marcador con validación
  elseif ($TargetMigVer -eq "1.2.0") {
    if ($currentVer -ne "1.1.0") {
      throw "Versión actual inesperada ($currentVer), se esperaba 1.1.0"
    }
    $lines = Get-Content $agentsPath -Encoding UTF8
    $lines[0] = "<!-- workspace-version: $TargetMigVer -->"
    Set-Content -Path $agentsPath -Value ($lines -join "`r`n") -Encoding UTF8
  }
  # v1.2.0 -> v1.3.0: Reemplazar marcador con validación
  elseif ($TargetMigVer -eq "1.3.0") {
    if ($currentVer -ne "1.2.0") {
      throw "Versión actual inesperada ($currentVer), se esperaba 1.2.0"
    }
    $lines = Get-Content $agentsPath -Encoding UTF8
    $lines[0] = "<!-- workspace-version: $TargetMigVer -->"
    Set-Content -Path $agentsPath -Value ($lines -join "`r`n") -Encoding UTF8
  }
  else {
    # Migración futura genérica: solo actualizar marcador
    # Si el script indica cambios adicionales, se añadirán aquí
    $lines = Get-Content $agentsPath -Encoding UTF8
    if ($lines[0] -match '<!-- workspace-version:') {
      $lines[0] = "<!-- workspace-version: $TargetMigVer -->"
      Set-Content -Path $agentsPath -Value ($lines -join "`r`n") -Encoding UTF8
    } else {
      Write-Host "[WARN] No se pudo detectar marcador de versión en $agentsPath para migración a $TargetMigVer"
    }
  }

  # Validación post-migración
  if (-not (Test-Path $agentsPath -PathType Leaf)) {
    throw "AGENTS.md no existe después de migración"
  }
  $postFirstLine = Get-Content $agentsPath -Encoding UTF8 -TotalCount 1
  $expectedLine = "<!-- workspace-version: $TargetMigVer -->"
  if ($postFirstLine -ne $expectedLine) {
    throw "Validación fallida: primera línea esperada '$expectedLine', obtenida '$postFirstLine'"
  }
  if (-not (Test-Path $backupPath -PathType Leaf)) {
    throw "Validación fallida: backup no encontrado en $backupPath"
  }

  return $backupPath
}
```

---

## Paso 5: Ejecutar actualización por proyecto

```powershell
$migrationsDir = "$workRoot\migrations"
$results = @()

foreach ($projDir in $projectDirs) {
  $projName = Split-Path $projDir -Leaf
  $agentsPath = "$projDir\AGENTS.md"

  if (-not (Test-Path $agentsPath -PathType Leaf)) {
    Write-Host "[SKIP] $projName - Sin AGENTS.md"
    continue
  }

  $currentVer = Get-CurrentVersion $agentsPath
  $comparison = Compare-Versions $currentVer $TARGET_VERSION

  if ($comparison -ge 0) {
    Write-Host "[SKIP] $projName - Ya actualizado ($currentVer == $TARGET_VERSION)"
    $results += @{ Name = $projName; Old = $currentVer; New = $TARGET_VERSION; Status = "skipped"; Backup = $null }
    continue
  }

  Write-Host "[INFO] $projName: $currentVer -> $TARGET_VERSION"

  try {
    $applicableMigrations = Get-ApplicableMigrations $currentVer $TARGET_VERSION $migrationsDir

    if ($applicableMigrations.Count -eq 0) {
      Write-Host "[WARN] $projName - No hay migraciones aplicables de $currentVer a $TARGET_VERSION"
      $results += @{ Name = $projName; Old = $currentVer; New = $TARGET_VERSION; Status = "no-migrations"; Backup = $null }
      continue
    }

    $lastBackup = $null
    foreach ($mig in $applicableMigrations) {
      Write-Host "  Aplicando migración: $($mig.Name)"
      $lastBackup = Apply-Migration $projDir $mig.Path $mig.To
    }

    # Verificación final: primera línea debe ser target
    $finalFirstLine = Get-Content $agentsPath -Encoding UTF8 -TotalCount 1
    $expectedFinal = "<!-- workspace-version: $TARGET_VERSION -->"
    if ($finalFirstLine -ne $expectedFinal) {
      throw "Versión final incorrecta. Esperada: $expectedFinal, obtenida: $finalFirstLine"
    }

    Write-Host "[OK] $projName actualizado: $currentVer -> $TARGET_VERSION"
    $results += @{ Name = $projName; Old = $currentVer; New = $TARGET_VERSION; Status = "ok"; Backup = $lastBackup }

  } catch {
    Write-Host "[FAIL] $projName - Error: $_"
    $results += @{ Name = $projName; Old = $currentVer; New = $TARGET_VERSION; Status = "failed"; Backup = $null }
  }
}
```

---

## Paso 6: Reportar resumen

```powershell
Write-Host "`n"
Write-Host "============================================"
Write-Host "  update-workspace - Resumen"
Write-Host "============================================"
Write-Host ""

foreach ($r in $results) {
  $icon = switch ($r.Status) {
    "ok"        { "[OK]" }
    "skipped"   { "[--]" }
    "failed"    { "[FAIL]" }
    "no-migrations" { "[??]" }
    default     { "[??]" }
  }
  Write-Host "$icon $($r.Name) - $($r.Old) -> $($r.New)"
  if ($r.Status -eq "ok" -and $r.Backup) {
    Write-Host "      Backup: $($r.Backup)"
  }
  if ($r.Status -eq "failed") {
    Write-Host "      Error durante la migración"
  }
}

Write-Host "`n"
$okCount = ($results | Where-Object { $_.Status -eq "ok" }).Count
$skipCount = ($results | Where-Object { $_.Status -eq "skipped" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "failed" }).Count
Write-Host "Actualizados: $okCount  Saltados: $skipCount  Fallos: $failCount"
Write-Host "============================================"
```

---

## Validación post-ejecución

```powershell
function Test-PostExecution {
  param([string[]]$ProcessedDirs)

  $allOk = $true
  foreach ($projDir in $ProcessedDirs) {
    $agentsPath = "$projDir\AGENTS.md"
    if (-not (Test-Path $agentsPath -PathType Leaf)) {
      Write-Host "[FAIL] $projDir - AGENTS.md no existe"
      $allOk = $false
      continue
    }
    $content = Get-Content $agentsPath -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($content)) {
      Write-Host "[FAIL] $projDir - AGENTS.md está vacío"
      $allOk = $false
      continue
    }
    $firstLine = Get-Content $agentsPath -Encoding UTF8 -TotalCount 1
    $expected = "<!-- workspace-version: $TARGET_VERSION -->"
    if ($firstLine -ne $expected) {
      Write-Host "[FAIL] $projDir - Primera línea incorrecta"
      Write-Host "  Esperada: $expected"
      Write-Host "  Obtenida: $firstLine"
      $allOk = $false
    }
    $backups = Get-ChildItem "$projDir\AGENTS.md.bak.*" -ErrorAction SilentlyContinue
    if ($backups.Count -eq 0) {
      Write-Host "[FAIL] $projDir - No se encontró backup AGENTS.md.bak.*"
      $allOk = $false
    } else {
      Write-Host "[INFO] $projDir - Backup(s):"
      foreach ($bk in $backups) {
        Write-Host "        $($bk.FullName)"
      }
    }
  }
  return $allOk
}

$validationOk = Test-PostExecution $projectDirs
if (-not $validationOk) {
  Write-Host "[WARN] Algunas validaciones post-ejecución fallaron"
}
```
