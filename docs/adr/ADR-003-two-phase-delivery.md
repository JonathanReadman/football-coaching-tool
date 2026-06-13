# ADR-003: Two-Phase Delivery (Static First, Interactive Later)

**Date:** 2026-06-13
**Status:** Accepted

## Context

The full feature set includes: (a) zone reference with coaching content, (b) pre-built
passages of play, (c) live draw canvas with drag-and-drop players and freehand arrows.
Building all three at once increases risk and delays getting useful content to the coach.

## Decision

Phase 1 delivers the zone reference and static passages of play library — fully usable
at training. Phase 2 adds the live draw canvas and interactive features, tracked as
GitHub Issues, to be built after Phase 1 content is validated in real sessions.

## Consequences

- **Pro:** The coach has a working tool quickly — content can be refined based on real use.
- **Pro:** Phase 2 feature scope is informed by what the coach actually reaches for at training.
- **Con:** Live drawing is not available until Phase 2. Coaches must use pre-built diagrams.
