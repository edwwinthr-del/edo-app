# QA and Testing Report

Test date: 2026-10-30  
Test browser: Google Chrome via Playwright  
Static server: local Python HTTP server  
Base URL tested: `http://127.0.0.1:5500`

## Covered routes

| Route | Desktop 1440×900 | Mobile 390×844 | Result |
| --- | --- | --- | --- |
| `index.html` | Passed | Passed | Passed |
| `projects.html?id=adminismine` | Passed | Passed | Passed |
| `projects.html?id=mn-ecommerce` | Passed | Not separately captured | Passed |
| `projects.html?id=ebook-commerce` | Passed | Not separately captured | Passed |
| `projects.html?id=bato-detailing` | Passed | Not separately captured | Passed |
| `projects.html?id=radarme` | Passed | Passed | Passed |
| `projects.html?id=crypto-ai-report` | Passed | Not separately captured | Passed |
| English, Turkish and Serbian homepage variants | Passed | Passed | Passed |
| English, Turkish and Serbian project variants | Passed | Passed | Passed |

## Automated and manual checks

- JSON syntax validated for all eight data files.
- JavaScript syntax checked with Node.js.
- All six homepage project cards rendered.
- Six skill cards and both employment timeline entries rendered.
- Every selected project presentation loaded the correct title, screenshot set, statistics and GitHub URL.
- All catalog project images loaded with non-zero natural dimensions.
- No browser console errors or failed requests occurred on the final static site.
- No horizontal page scrolling occurred at 1440 px or 390 px after layout fixes.
- Mobile screenshot frames were rechecked at 320 px and 390 px across the homepage and all six project routes; loaded screenshot boxes matched their source image aspect ratios with no cropping.
- Project screenshot corners are unobstructed: card numbers and actions sit outside the image, gradient masks were removed, and all 21 language/page combinations were checked for `undefined`, `null` or unrendered template text.
- Gradient display headings now extend their paint area below the baseline; descenders were visually checked at desktop width in English, Turkish and Serbian for the hero, experience, projects and contact headings.
- The language selector preserved the active project ID, updated the document language and page metadata, stored the selection, and reloaded translated interface and project content for `en`, `tr`, and `sr`.
- Mobile navigation opened, closed and remained keyboard accessible.
- Project-card links resolved to their matching presentation route.
- GitHub links use the exact repository URLs.
- No live-demo button appears where `demo` is `null`.
- The CV is available at `assets/cv/cv.pdf`.
- Full resource paths are relative and compatible with a GitHub Pages project subpath.
- A nested-path simulation at `/Edo-app/index.html` loaded all JSON, opened a project and returned zero broken images or network errors.
- Scroll progress, sticky project reveals, section navigation and back-to-top behavior are present.
- All nonessential motion is disabled or shortened under `prefers-reduced-motion`.
- Images are local WebP files and include dimensions, alt text and lazy loading below the initial viewport.

## Responsive review

Desktop and mobile screenshots were visually inspected. The mobile layout uses a full-screen navigation menu, single-column skill and project cards, reduced 3D transforms, wrapped project titles and touch-sized controls.

## Known constraints

- No automated Lighthouse score was generated because Lighthouse is not installed in the local environment.
- GitHub Pages publication was not performed because the user did not provide a dedicated portfolio repository or authorize a remote push.
- The site intentionally shows no live-demo links because no verified public deployment URLs were available in the repositories.
