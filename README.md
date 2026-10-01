# LuminaPress — Next.js 16 + TypeScript + Strapi CMS 5 Modern Blog

A state-of-the-art digital publication and engineering journal built with **Next.js 16 (React 19 Server Components)**, **TypeScript**, **Tailwind CSS**, and **Strapi CMS 5**.

---

## 🚀 Application Structure & Pages

The application is structured into a decoupled frontend and headless Strapi backend with all requested routes:

| Route | Description | Tech Details |
|---|---|---|
| `/` | **Home Feed** | Hero section with ambient glowing lighting, Flagship story, latest articles grid, visual category browser, top authors spotlight, and newsletter subscription dispatch. |
| `/blog` | **Blog Archive** | Full article catalog with real-time category filtering tabs, keyword search integration, reading time indicators, and responsive grid. |
| `/blog/[slug]` | **Article Detail** | Reading scroll progress bar, cover hero image, rich typography (code blocks, blockquotes, callouts), sticky sidebar with key highlights, social share (Twitter/X, LinkedIn, Copy URL with toast), and interactive discussion comments. |
| `/category/[slug]` | **Category Archive** | Dedicated topic landing page with custom theme accents, topic description, article counters, cross-category chips, and filtered posts. |
| `/author/[slug]` | **Author Profile** | Verified contributor card with avatar, role, comprehensive bio, publication statistics (articles, followers, reads), social media links, and author articles grid. |
| `/search` | **Search Page** | Real-time interactive keyword search with URL param sync (`?q=...`), category filters, tag chips, suggested queries, and instant result count. |
| `/about` | **About Page** | Brand vision, publication statistics banner, core engineering values, technology stack breakdown, and editorial team showcase. |
| `/contact` | **Contact Page** | Interactive editorial contact form with inquiry categories, direct channel cards, SLA response guarantees, and FAQ section. |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (Turbopack, App Router, React 19, React Server Components)
- **Language**: TypeScript 5 (Strict type safety, complete schema contracts)
- **Styling**: Tailwind CSS v4, custom glassmorphism utilities, CSS custom variables, smooth transitions
- **Backend**: Strapi CMS 5 (SQLite database, Document Service, Public REST API endpoints)
- **Icons**: Lucide Icons & Custom SVG Brand Icons

---

## ⚡ Quick Start Guide

### 1. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Zero-Breakage Graceful Fallback**: The frontend is engineered with an intelligent Strapi API client (`frontend/lib/strapi.ts`) that fetches live data from Strapi when active (`http://localhost:1337`) and seamlessly falls back to high-fidelity mock data if Strapi is offline.

---

### 2. Run the Strapi CMS Backend
```bash
cd backend
npm install
npm run dev
```
Access the Strapi Admin Dashboard at **[http://localhost:1337/admin](http://localhost:1337/admin)**.

- **Content Types Configured**:
  - `Article` (`api::article.article`)
  - `Category` (`api::category.category`)
  - `Author` (`api::author.author`)
- **Automated Bootstrap**: Public permissions (`find`, `findOne`) are automatically configured on startup in `backend/src/index.ts`.
