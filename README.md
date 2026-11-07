# Exaggerated — Feature Site

A multi-page feature site about Eason Chan's song “Exaggerated,” built as the
final project for a web development course. It uses plain HTML / CSS /
JavaScript with no frameworks, back-end or database.

## Overview

The site covers the story behind “Exaggerated,” its thematic analysis, awards
and legacy. All commentary is original, and lyrics appear only as one or two
short quotes (fair use); no complete lyrics are included.

## Tech stack

- **HTML5**: semantic elements, WAI-ARIA, forms and accessibility
- **CSS3**: custom properties, the box model, Flexbox, Grid, mobile-first layout, light/dark themes
- **JavaScript (ES6+)**: DOM manipulation, event handling, state management, localStorage, form validation

## Pages (5 in total)

| File | Page | Main content |
|---|---|---|
| `index.html` | Home | Hero, quick overview, site-wide entry points |
| `about.html` | About the Song | Facts table, timeline, key people |
| `analysis.html` | Analysis | Accordion commentary, interactive quiz |
| `impact.html` | Impact | Awards table, covers, cultural legacy |
| `contact.html` | Contact | A form with accessible validation |

## Interactive features

1. Light / dark theme toggle, persisted with `localStorage`; first visit follows the system preference
2. Mobile hamburger menu (with synchronized `aria-expanded` state)
3. Accordion on the Analysis page
4. Data-driven quiz (answer state management + instant feedback)
5. Front-end contact form validation (email format, required fields, error messages and focus management)

## Running locally

Open `index.html` directly in a browser, or start a static server in the project root:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## File structure

```
fukua-site/
├── index.html
├── about.html
├── analysis.html
├── impact.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
└── README.md
```

## Git milestones

The commit history is organized to reflect incremental development through the term:

1. Project planning and README
2. Five-page HTML skeleton and navigation
3. Original content and forms on each page
4. CSS design system and base typography
5. Flexbox / Grid layout
6. Responsive adaptation and mobile menu
7. JavaScript interactions
8. Accessibility, SEO and testing
9. Deployment

## Deployment

The static site can be deployed directly to GitHub Pages, Netlify or
Cloudflare Pages, with no server-side runtime required.

## Copyright and academic integrity

- This project is student coursework and an unofficial fan site. It is not
  affiliated with Eason Chan, Wyman Wong, C.Y. Kong or the related record labels.
- The song, lyrics and related names belong to their original authors and rights holders.
- Factual information is compiled from public sources, and the commentary is original.
