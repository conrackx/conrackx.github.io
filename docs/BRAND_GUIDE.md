# Brand Guide — marca-personal

## Claim

> Data Analyst que pone IA en producción con ingeniería real

## Pilares de mensaje

1. **Pipeline over notebook** — procesos reproducibles, no scripts ad-hoc tras ad-hoc.
2. **IA pragmática** — modelos de lenguaje con fallback determinístico; nunca un punto único de falla.
3. **Testing como activo** — 122 tests que validan esquemas, reglas, narrativas y documento final.
4. **Reglas como configuración** — los analistas modifican la lógica de negocio sin tocar código.

## Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0b0f14` | Fondo principal |
| `--surface` | `#141a21` | Tarjetas, sticky header |
| `--card` | `#1a222c` | Cards hover |
| `--border` | `#2a3340` | Bordes sutiles |
| `--fg` | `#e8eaed` | Texto primario |
| `--muted` | `#8b939e` | Texto secundario |
| `--accent` | `#00d4aa` | CTAs, links, highlight |
| `--accent-dim` | `#00b894` | Hover states |

## Tipografía

Sistema nativo; sin fuentes locales ni CDN.
- `--font-sans`: system-ui, -apple-system, "Segoe UI", Roboto
- `--font-mono`: ui-monospace, "SF Mono", Menlo, Monaco

## Tono

Técnico, honesto y orientado a valor concreto.
- Usar números y métricas tangibles.
- Evitar buzzwords vacíos ("synergy", "disrupt", "next-gen" sin contexto).
- En primera persona: yo construí, yo diseñé, yo implementé.
- Sin promesas exageradas; las limitaciones se mencionan explícitamente (ej: "el stub es la línea base, LLM es mejora opcional").

## Foto

Recortada 1:1. Usar `eleventy-img` en build para generar:
- ฿400w` — para cards, mobile
- `266w` — para hero (limitado a 266px visualmente)
- `672w` — para about page (natural size)
Formatos: WebP/AVIF con fallback JPEG original.

## OG Image

`og-default.jpg` 1200×630px.
- Fondo oscuro con claim + nombre.
- Generar con Figma, Canva o script.
