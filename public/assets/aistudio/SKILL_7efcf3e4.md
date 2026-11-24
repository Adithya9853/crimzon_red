---
name: design-system-aswin-full
description: >
  Apply the Aswin – Full design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for marketing interfaces.
---

# Aswin – Full — Design System Skill

## When to Use

- Building new UI components for Aswin – Full.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for marketing pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Aswin – Full — https://aswin-dev-portfolio.vercel.app/
- **Surface:** marketing
- **Audience:** Developers and technical decision-makers
- **Character:** Conversion-focused marketing presence with a rich, diverse color palette and single-typeface typography.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-3 | `#A31515` | Text Primary |
| color-4 | `#D81E2F` | Accent |
| color-6 | `#FF6E7D` | Accent |
| color-7 | `#FF7887` | Accent |
| color-2 | `#46464C` | Border |
| color-5 | `#9A9AA2` | Border |
| color-1 | `#101012` | Background Dark |
| color-8 | `#F3F4F6` | Text Light |
| color-9 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** General Sans

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 10px | Captions, metadata |
| text-sm | 12px | Labels, secondary text |
| text-base | 14px | Body text (default) |
| text-lg | 16px | Subheadings, emphasis |
| text-xl | 18px | Section headings |
| text-2xl | 20px | Section headings |
| text-3xl | 24px | Section headings |
| text-4xl | 48px | Section headings |
| text-9 | 96px | General use |

**Weight scale:** 400 · 600 · 700 · 900
**Line heights:** 96px · 24px · 48px · 28px · 32px · 20px · 16px · 39px · 32.5px · 25.6px

### Spacing

**Base unit:** 4px

`space-1: 2px` · `space-2: 4px` · `space-3: 6px` · `space-4: 8px` · `space-5: 10px` · `space-6: 12px` · `space-7: 14px` · `space-8: 16px` · `space-9: 20px` · `space-10: 24px` · `space-11: 32px` · `space-12: 48px` · `space-13: 80px` · `space-14: 96px` · `space-15: 100px` · `space-16: 124px` · `space-17: 144px`

### Shapes

**Border radius:** `radius-sm: 2.68435e+07px` · `radius-md: 12px` · `radius-lg: 16px` · `radius-xl: 18px` · `radius-full: 24px` · `radius-full: 9999px`

### Elevation

- **shadow-sm:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(220, 38, 38, 0.8) 0px 0px 8px 0px`
- **shadow-md:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.637 0.214213 0.1014 / 0.3) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`
- **shadow-lg:** `rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.8) 0px 10px 30px -14px, rgba(255, 30, 56, 0.22) 0px 18px 60px -30px`
- **shadow-xl:** `rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.6) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.35) 0px 0px 0px 4px inset, rgb(10, 7, 9) 0px 2px 0px 0px, rgb(7, 5, 6) 0px 4px 0px 0px, rgb(5, 3, 4) 0px 6px 0px 0px, rgba(0, 0, 0, 0.85) 0px 30px 60px -20px`
- **shadow-5:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`
- **shadow-6:** `rgba(0, 0, 0, 0.8) 0px 2px 6px 0px, rgba(255, 30, 56, 0.35) 0px 0px 12px 0px`
- **shadow-7:** `rgba(255, 18, 56, 0.5) 0px 8px 22px -10px`

### Motion

- **duration-fast:** `all`
- **duration-fast:** `color, background-color, border-color, box-shadow, transform, scale, opacity`
- **duration-fast:** `none`
- **duration-fast:** `color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.15s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `0.3s cubic-bezier(0, 0, 0.2, 1)`
- **duration-base:** `border-color 0.3s, background-color 0.3s, color 0.3s`
- **duration-base:** `background 0.3s, border-color 0.3s, box-shadow 0.3s`
- **duration-base:** `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1), rotate 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-slow:** `--glass-warmth 0.45s, border-color 0.45s, box-shadow 0.45s, translate 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s`
- **duration-slow:** `0.7s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-slow:** `28s ease-in-out infinite orb-a`
- **duration-slow:** `31s ease-in-out infinite orb-c`

## Component Inventory

- **Buttons:** 1 detected
- **Links:** 25 detected
- **Inputs:** 3 detected
- **Navigation:** 1 elements
- **Lists:** 2 detected
- **Forms:** 1 detected
- **Images:** 21 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (2.68435e+07px, 12px, 16px, 18px, 24px, 9999px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
