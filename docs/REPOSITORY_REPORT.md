# Repository Investigation Report

Investigation date: 2026-10-30  
GitHub profile: https://github.com/edwwinthr-del  
Career source: `Edvin_Tahirovic_CV_.pdf`

## Repository inventory

| Repository | Public status | Main technology observed | Role in portfolio | Local result |
| --- | --- | --- | --- | --- |
| `adminismine` | Public, original | Laravel 13, PHP, Next.js, PostgreSQL, Redis | Featured case study | Backend and frontend launched with seeded local data |
| `MnEcommerce` | Public, original | Laravel 13, Next.js, PostgreSQL, Filament | Featured case study | Storefront and backend launched with seeded local data |
| `EbookEcommerce` | Public, original | Laravel 12, React, Inertia, Stripe | Featured case study | Storefront and admin launched with seeded local data |
| `n8n-crypto-market-ai-report` | Public, original | n8n, JavaScript, Anthropic API, Telegram API | Featured automation case study | Workflow execution blocked by missing n8n runtime and private credentials; repository screenshot used |
| `BatoDetailing` | Public, original | Laravel 13, Alpine.js, Tailwind CSS | Featured case study | Site launched with seeded local data |
| `RadarMe` | Public, original | Flutter, Firebase, GPS/maps | Supporting work only | Could not build because Flutter/Dart was not installed on the capture machine |
| `swot` | Public fork | Kotlin | Excluded | Fork unrelated to Edvin's software portfolio |

No original remote repository was modified or pushed. Repository work was cloned under `tmp/repos` for review and local execution only.

## Project findings

### AdminisMine

The repository is a finance and operations platform split into a Laravel API and a Next.js client. Documentation covers payables, receivables, payroll, attendance, mining operations, housing, travel, loans, customs documents, imports, audit logs, permissions and an AI assistant.

Verified functionality includes calculated financial balances, multi-currency records, 19 Excel/PDF reports, granular permissions, activity logs and a three-language assistant that proposes changes through structured data and requires user confirmation.

Local capture setup used the seeded application roles with SQLite and synchronous/file-based infrastructure. The production configuration remains PostgreSQL and Redis.

Screenshots captured:

- Dark dashboard
- Reports workspace
- Light dashboard

### MnEcommerce

The repository contains a Laravel REST API, a Next.js storefront, a Filament admin panel, Docker configuration and browser/backend tests. The README documents a tested local MVP and clearly states that production deployment is pending.

Verified UI functionality includes catalog discovery, categories, product variants, product details, guest cart, customer authentication, checkout methods and server-confirmed totals.

Local capture used SQLite for the storefront presentation. The repository's PostgreSQL transaction locking and concurrency tests were not re-executed during screenshot capture.

Screenshots captured:

- Editorial storefront homepage
- Product configuration page

### EbookEcommerce

The repository is a Laravel 12 application using React and Inertia. It includes a seeded bookstore catalog, private e-book storage, Stripe Cashier integration, a verified checkout webhook and an authenticated admin dashboard.

Verified locally:

- 20 seeded books appeared in the catalog
- Book detail pages rendered
- Seeded admin login worked
- Admin dashboard loaded and displayed catalog totals

Stripe checkout was not executed because no test credentials or Stripe CLI session were supplied.

Screenshots captured:

- Catalog
- Book detail
- Admin dashboard

### BatoDetailing

The repository is a Laravel and Alpine.js service website with customer registration, service catalog, appointment data, pricing, invoices, marketing consent, language switching and role-based access.

Verified locally:

- Homepage and service catalog rendered
- Customer registration form rendered
- Seeded SQLite database initialized
- Compiled Vite assets loaded without console errors

No booking submission was made because the goal was visual capture and read-only review.

Screenshots captured:

- Car-care homepage
- Service catalog
- Customer registration

### Crypto Market AI Report

The repository describes a scheduled n8n workflow with two market APIs, a JavaScript preprocessing stage, Anthropic analysis and Telegram delivery. It does not include an app server or a browser interface.

Execution was not attempted because the local environment does not include n8n and the workflow requires private Anthropic and Telegram credentials. The implementation was verified from the exported workflow JSON, README and the repository's real `workflow.png` image.

## Unlaunched work

### RadarMe

`RadarMe` is a real Flutter application with Firebase fallback behavior, GPS proximity logic, background alarms and 88 bundled radar records. It was not launched because neither Flutter nor Dart was installed in the local environment. It is presented as supporting work rather than as a screenshot-backed case study.

### SWOT fork

The `swot` repository is a fork of JetBrains' academic-domain classifier. It was excluded from the professional project inventory because there is no evidence it represents Edvin's original application work.

## Selected portfolio projects

The site features the five projects that best demonstrate business application development, e-commerce, service operations, security-aware workflows and practical AI:

1. AdminisMine
2. MnEcommerce
3. EbookEcommerce
4. BatoDetailing
5. Crypto Market AI Report

All project links point to the exact public repository URLs. No live-demo button is shown because no verified public deployment URL was available.
