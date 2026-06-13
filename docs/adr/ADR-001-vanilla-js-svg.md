# ADR-001: Vanilla JS + Inline SVG (no framework, no bundler)

**Date:** 2026-06-13
**Status:** Accepted

## Context

The tool must run on GitHub Pages (static hosting), work offline on an iPad, and be
maintainable by a single developer without a complex build pipeline.

## Decision

Use vanilla JavaScript ES modules and inline SVG for the pitch canvas. No React,
Vue, or Angular. No Webpack or Vite bundler for production — `index.html` imports
`src/main.js` directly with `<script type="module">`. Vite is used only as the
Vitest test runner.

## Consequences

- **Pro:** Zero build step for deployment. `index.html` opens in any browser as-is.
- **Pro:** No framework upgrade burden. The codebase will not rot.
- **Pro:** SVG gives precise, scalable, touch-friendly pitch rendering.
- **Con:** No component abstraction layer — UI logic must be carefully modularised by hand.
- **Con:** Cannot use JSX or template literals for complex dynamic HTML without care.
