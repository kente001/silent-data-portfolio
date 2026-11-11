# ADR-0002: Port the "Silent Data" HTML template into React components

- Status: Accepted
- Date: 2026-11-10

## Context
The owner supplied a complete single-file HTML design, stored at `design/silent-data.template.html` (inline CSS and JS, inline SVG logos, ECharts loaded from CDN, a canvas "brain" animation, Google Fonts). The app must be React + Vite (ADR-0001).

## Decision
Treat the template as the visual and content source of truth. Keep it unmodified in `design/`. Port it into React: one component per section (Nav, Hero, About, Skills, Tools, Work, Experience, Contact, Footer), CSS variables and styles moved to a stylesheet, the brain canvas and charts as components/hooks with proper cleanup, ECharts installed as an npm dependency instead of CDN loading, and repeated inline SVG logos extracted into data/components.

## Consequences
- Design fidelity is preserved; changes to the look go through the template's tokens (`:root` variables).
- Content (copy, project data, contact details) should move into a data module so it is editable without touching components.
- The template's duplicated SVG gradient ids (`-u2` suffixes) must stay unique when logos are reused.
- The template's chart data is illustrative; real figures stay private.

## Alternatives considered
- Serve the HTML as-is from `public/` – defeats the purpose of using React.
