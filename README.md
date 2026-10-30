<div align="center">

# Edvin Tahirović

### Software Developer Portfolio

A premium, data-driven portfolio presenting real business systems, commerce platforms and practical AI work.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111)](https://developer.mozilla.org/docs/Web/JavaScript)
[![JSON](https://img.shields.io/badge/Data-JSON-77e6b3?style=flat-square)](https://www.json.org/)
[![GitHub Pages](https://img.shields.io/badge/Host-GitHub%20Pages-181717?style=flat-square&logo=github)](https://pages.github.com/)

</div>

![Portfolio homepage preview](docs/preview.webp)

## Overview

This is a fully static portfolio built with HTML5, CSS3, vanilla JavaScript and JSON. It requires no framework, server, database or build process, and is ready to deploy directly through GitHub Pages.

The experience includes:

- A cinematic, responsive homepage with custom motion and 3D interface previews
- Selected project presentations driven by reusable JSON data
- Real screenshots from locally executed applications
- Full English, Turkish and Serbian localization
- Accessible navigation, keyboard support and reduced-motion handling
- Downloadable-free CV viewing in a separate browser tab
- Relative paths for root-domain and project-subpath hosting

## Selected projects

| Project | Focus | Stack |
| --- | --- | --- |
| [AdminisMine](https://github.com/edwwinthr-del/adminismine) | Finance and operations platform | Laravel, Next.js, PostgreSQL, Redis, OpenAI |
| [MnEcommerce](https://github.com/edwwinthr-del/MnEcommerce) | E-commerce MVP | Laravel, Next.js, Filament, PostgreSQL |
| [EbookEcommerce](https://github.com/edwwinthr-del/EbookEcommerce) | Digital book commerce | Laravel, React, Inertia.js, Stripe |
| [BatoDetailing](https://github.com/edwwinthr-del/BatoDetailing) | Car-care service platform | Laravel, Alpine.js, Tailwind CSS |
| [Crypto Market AI Report](https://github.com/edwwinthr-del/n8n-crypto-market-ai-report) | Automated market analysis | n8n, JavaScript, Anthropic, Telegram |

Detailed research, launch results and limitations are documented in [REPOSITORY_REPORT.md](docs/REPOSITORY_REPORT.md).

## Run locally

The site only needs a static HTTP server so browsers can load the JSON data files.

Using Python:

```bash
python -m http.server 5500
```

Using Node.js:

```bash
npx serve .
```

Then open [http://localhost:5500](http://localhost:5500) when using the Python command.

> Opening `index.html` directly through `file://` may prevent JSON files from loading because of browser security restrictions.

## Project structure

```text
.
├── index.html
├── projects.html
├── .nojekyll
├── assets/
│   ├── css/
│   ├── cv/
│   ├── fonts/
│   ├── images/
│   └── js/
├── data/
│   ├── profile.json
│   ├── projects.json
│   ├── skills.json
│   ├── experience.json
│   ├── education.json
│   └── i18n/
│       ├── en.json
│       ├── tr.json
│       └── sr.json
└── docs/
    ├── preview.webp
    ├── REPOSITORY_REPORT.md
    └── QA_REPORT.md
```

## Content architecture

| Content | Source |
| --- | --- |
| Profile and contact details | `data/profile.json` |
| Technical and spoken skills | `data/skills.json` |
| Work history | `data/experience.json` |
| Education | `data/education.json` |
| Project cards and presentations | `data/projects.json` |
| English interface and translations | `data/i18n/en.json` |
| Turkish interface and translations | `data/i18n/tr.json` |
| Serbian interface and translations | `data/i18n/sr.json` |

The home page and project template load structured data at runtime. Updating the JSON files updates the website without changing its core JavaScript.

### Add a project

1. Create a folder under `assets/images/projects/<project-id>/`.
2. Add optimized WebP screenshots.
3. Add the project entry to `data/projects.json`.
4. Add Turkish and Serbian narrative fields to their locale files.

Project presentations are opened using:

```text
projects.html?id=<project-id>
```

If a real public demo exists, set its URL in the project's `demo` field. Keep the value as `null` when no verified deployment exists.

## Localization

The language selector supports:

- English
- Turkish
- Serbian

The selected language is saved in the browser and preserved in project URLs through the `lang` query parameter.

## Accessibility and performance

- Semantic HTML landmarks and headings
- Keyboard-accessible navigation and controls
- Visible focus states and skip links
- Descriptive image alternatives
- Local WebP screenshots with dimensions and lazy loading
- Locally hosted fonts and animation libraries
- Motion reduced automatically through `prefers-reduced-motion`
- Responsive layouts tested from 320 px mobile screens to large desktop viewports
- No backend, database or runtime dependency

QA results are available in [QA_REPORT.md](docs/QA_REPORT.md).

## Deploy to GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages** under **Code and automation**.
3. Choose **Deploy from a branch**.
4. Select the `main` branch and the repository root (`/`).
5. Save and wait for GitHub Pages to publish.

The included `.nojekyll` file ensures that every asset folder is served correctly.

Expected project URL pattern:

```text
https://edwwinthr-del.github.io/edo-app/
```

## Asset provenance

Project screenshots were captured from locally running copies of the original repositories. The n8n workflow image is the real workflow export image from its repository because executing that workflow requires external Anthropic and Telegram credentials.

No production database, application repository, credential or client data was modified.

---

<div align="center">

Built with care by **Edvin Tahirović**

</div>
