---
name: angular-material-ui
description: >-
  Improves Angular UI using Angular Material and project patterns (standalone
  components, SharedModule, SCSS). Use when styling components, forms, layout,
  tables, dialogs, or when the user mentions Angular front, Material, or UI
  implementation in this HelpDesk app.
---

# Angular + Material (HelpDesk)

## Stack assumptions

- Angular standalone components; `SharedModule` for Material imports.
- Prefer existing tokens: spacing, typography, colors from `styles.scss` / theme; do not invent a second design system.
- Use Angular Material components already in the project (`mat-*`) before adding new libraries.
- **Tailwind + Material**: `styles.scss` importa `tailwindcss/base` (preflight). Eso resetea `button` e `input` y suele dejar `mat-flat-button` gris y campos `outline` con labels mal alineados. En pantallas auth, preferir `appearance="fill"` y **estilos globales finales** en `src/app/auth/auth-global.overrides.scss` (importado al final de `styles.scss`). El layout compartido está en `_auth-layout.scss`. Para el CTA, usar una clase dedicada (p. ej. `.auth-submit`) y selectores `button.auth-submit` sin depender solo de `.mat-primary`.
- **Tema / marca**: tokens `--md-sys-color-*` y `--sys-*` en `styles.scss`; shell de app (`--app-shell-sidenav-*`, `--app-shell-content-bg`, `--app-button-primary-hover`) para barra lateral y lienzo. No hardcodear azules sueltos en componentes: usar variables.

## Implementation rules

1. **Match existing patterns**: same import style, `ReactiveFormsModule`, `MatSnackBar` for feedback, `Router` for navigation.
2. **Forms**: `mat-form-field` + clear labels, hints, and `mat-error`; disable submit while invalid or loading; show loading state on async actions.
3. **Layout**: consistent max-width containers, vertical rhythm (8px grid), enough tap targets (min ~44px for primary actions on touch).
4. **Tables/lists**: paginator, sort, empty states (“No hay datos”), loading skeleton or spinner.
5. **Accessibility**: semantic HTML where possible, `aria-label` on icon-only buttons, focus visible, keyboard operable dialogs/menus.
6. **SCSS**: component-scoped styles; use `:host` and CSS variables if the theme exposes them; avoid deep `::ng-deep` unless unavoidable and minimal.

## Before changing UI

- Read the component `.ts`, `.html`, and `.scss` around the change.
- Reuse variables/mixins if they exist; extend rather than duplicate.

## After changing UI

- Ensure no new linter errors; keep diffs focused on the requested screens.
