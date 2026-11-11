# ADR-0001: Use React and Vite

- Status: Accepted
- Date: 2026-11-10

## Context
We need a personal profile web app. The owner requested React with Vite.

## Decision
Build the app as a single-page React application bundled and served in development by Vite. JavaScript by default (TypeScript can be adopted via a new ADR).

## Consequences
- Fast dev server and builds; simple static output deployable to any static host.
- Requires Node.js (LTS) for tooling.
- No SSR/SEO-first features out of the box; revisit if SEO becomes important.

## Alternatives considered
- Next.js / Astro – better SEO/SSR, but not requested and heavier than needed.
