---
name: ui-ux-product-polish
description: >-
  Applies UX and visual polish for web apps: hierarchy, spacing, typography,
  states, and accessibility. Use when the user asks to improve appearance,
  usability, look and feel, consistency, or “make it look professional”.
---

# UI / UX polish

## Visual hierarchy

- One clear primary action per view; secondary actions visually quieter (outline, text button).
- Title → short supporting text → content; avoid walls of undifferentiated text.
- Use weight and size before extra color for emphasis.

## Spacing and layout

- Consistent outer padding on pages; align columns to a simple grid.
- Group related controls (whitespace > borders); separate sections with spacing or subtle dividers, not heavy boxes everywhere.

## Typography

- Limit font sizes/weights (e.g. page title, section title, body, caption).
- Comfortable line length for reading (~45–75 characters where applicable).
- Sufficient contrast (WCAG AA for text); never rely on color alone for meaning.

## Component states

- **Loading**: disable or skeleton; avoid double submits.
- **Empty**: explain why it is empty and what to do next.
- **Error**: specific, actionable message near the field or action; offer recovery when possible.
- **Success**: brief confirmation (toast/snackbar) without blocking the flow unnecessarily.

## Interaction

- Destructive actions: confirm or undo pattern.
- Touch targets large enough; adequate spacing between clickable items.
- Focus order logical; modals trap focus and restore on close.

## Consistency checklist

- [ ] Same control types for the same job (e.g. always `mat-flat-button` for primary).
- [ ] Icons aligned and same stroke/size family.
- [ ] Corner radius and shadows match the rest of the app (flat vs elevated).
- [ ] Copy in the same language and tone as surrounding screens.
- [ ] **Auth / login**: el CTA principal debe tener contraste alto (fondo primario + texto claro) frente a enlaces secundarios; si el formulario está incompleto, el botón deshabilitado debe leerse claramente como no disponible (gris uniforme, sin texto “fantasma” claro sobre gris).

## Scope discipline

- Improve only screens or components the user asked for unless they request a global pass.
- Prefer small, measurable changes (one flow at a time) over sweeping unrequested redesigns.

## Paleta institucional (banca / tickets)

- Fondo de aplicación: tinte frío suave (gris-azulado), no blanco puro; tarjetas/contenedores un escalón más claros para jerarquía.
- Primario: azul marino o azul corporativo con buen contraste sobre blanco; CTA con texto claro.
- Acento secundario/terciario discreto (p. ej. teal o ámbar suave) solo para estados o prioridades, sin competir con el primario.
- Barra lateral oscura + contenido claro es legible y transmite “consola de gestión”; mantener contraste AA en textos e iconos.
