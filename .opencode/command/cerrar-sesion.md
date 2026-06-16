# cerrar-sesion

Cierre automático de sesión: genera un resumen en `work_log/` sin pedir datos al usuario. Timestamp del sistema como bloque de 14 dígitos + nombre representativo inferido del directorio activo. Cero inputs.

Actúa como el comando `/cerrar-sesion`. CERO PREGUNTAS AL USUARIO. Pasos obligatorios:
1. Fecha y hora actual del sistema como bloque único de 14 dígitos (YYYYMMDDHHMMSS), sin guiones, puntos, espacios ni separadores. Ej.: 2026-06-03 16:53:00 → `20260603165300`.
2. Inferir el tema representativo:
 - Listar archivos modificados en los últimos 30 minutos en el cwd.
 - Detectar el subdirectorio de primer nivel del workspace donde ocurre la mayor parte de la actividad. Usar el nombre de ese subdirectorio (slugificado) como prefijo del tema. Esto cubre automaticamente cualquier proyecto presente en el workspace, sin conocimiento previo de nombres.
 - Si toda la actividad ocurre en la raíz del workspace, usar el prefijo `general-`.
 - Si no hay actividad reciente, usar el basename del cwd como tema.
 - Slugify: minúsculas, guiones en lugar de espacios/acentos, máximo 40 caracteres.
3. Construir la ruta: `work_log/YYYYMMDDHHMMSS_tema.md`
4. Crear `work_log/` si no existe.
5. Si el archivo ya existe, sobrescribirlo directamente.
6. Redactar el contenido con tres secciones:
 # Sesión YYYY-MM-DD HH:MM:SS — [tema legible en Title Case]
 ## Objetivo
 Una o dos frases inferidas de la actividad detectada. Si no se puede inferir con precisión: "Sesión de trabajo en [cwd]."
 ## Qué se hizo
 - Bullets de archivos creados/modificados durante la sesión, agrupados por tipo. Si exceden 10, resumir los menos relevantes en "Otros cambios menores en N archivos adicionales."
 ## Qué falta
 - "Pendiente de revisión por el usuario."
 - Si existe `00_esqueleto.md` o similar, listar secciones marcadas como Pendiente/Plantilla.
7. Escribir el archivo y devolver la ruta exacta.

Es transversal al workspace; no asumas proyecto en particular.
