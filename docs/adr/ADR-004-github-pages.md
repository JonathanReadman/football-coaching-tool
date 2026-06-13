# ADR-004: GitHub Pages as Hosting Platform

**Date:** 2026-06-13
**Status:** Accepted

## Context

The tool must be accessible on an iPad and phone via a URL, with no server to manage.

## Decision

Host on GitHub Pages, deployed automatically via GitHub Actions on push to `main`.
The deployment workflow runs the test suite before deploying — a failing test blocks
the deploy.

## Consequences

- **Pro:** Free, zero-ops, always available.
- **Pro:** Deployment is automatic on merge to main.
- **Pro:** URL is stable: `https://jonathanreadman.github.io/football-coaching-tool`
- **Con:** No server-side logic — everything must be client-side. (Acceptable: the tool
  has no backend requirements in Phase 1.)
- **Con:** GitHub Pages has a soft limit of 1 GB repo size and 100 GB/month bandwidth.
  (Acceptable: this is a small static tool.)
