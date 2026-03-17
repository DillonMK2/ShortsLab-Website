# Swarm Board — mmt10spl-e5yt2q — 2026-03-16
**Goal:** Build a full marketing website for ShortsLab — a
desktop app for YouTube creators. Use Next.js,
TypeScript, and Tailwind CSS. Save to D:\ShortsLabWebsite

DESIGN:
- Dark aesthetic matching ShortsLab — near black
  background (#080808)
- Accent colour: white with subtle colour accents
- Font: Sora for headings (heavy/bold), Inter for body
- Strong typographic hierarchy
- Smooth subtle animations — nothing flashy
- Premium, clean, minimal — not generic AI slop
- Fully responsive

PAGES:

1. LANDING PAGE (/)
Hero section:
- Bold headline: "The All-In-One YouTube Automation
  Studio"
- Subheadline explaining what ShortsLab does
- Two CTAs: "Download Free" (links to download section)
  and "See Features"
- Subtle ambient background animation

Features section — one section per feature with
icon, title, and description:
- AI Assistant — YouTube strategy and guidance
- Research & Analytics — track competitor channels,
  normalised view performance, niche health scoring,
  identify underperforming categories
- My Channels — all-in-one personal channel tracker,
  revenue, views, watch time, subscribers over 7D
  28D 3M 1Y
- Script Scraper — scrape any channel's scripts,
  save by category
- Script Rewriter — JSON style profiles to replicate
  creator styles, AI rewriting, ideation lab generates
  ideas from scraped content
- VoiceLab — auto-formats scripts line by line,
  generates voiceovers, trim silence, timeline editor
  with zoom/reorder/cut/crop, export audio
- The Vault — storage for finished audio, mark as
  edited/posted, track progress

Download section:
- "Download ShortsLab" heading
- Windows download button (placeholder .exe link)
- Version number placeholder
- Note: Mac and Linux coming soon
- Brief system requirements

2. FEATURES PAGE (/features)
Detailed breakdown of every feature with more depth
than the landing page. Each feature gets its own
section with a detailed description and bullet points.

3. PRICING PAGE (/pricing)
- Free tier — placeholder features
- Pro tier — placeholder features
- Note: pricing coming soon, join waitlist
- Email capture for waitlist

4. ABOUT PAGE (/about)
- What ShortsLab is and why it was built
- Built for serious YouTube creators
- Placeholder team section

NAVIGATION:
- Sticky header with ShortsLab logo
- Links: Features, Pricing, About, Download
- Download button in nav (CTA style)

FOOTER:
- Logo
- Links: Features, Pricing, About, Download
- Social links placeholders
- Copyright

IMPORTANT:
- No actual app functionality — this is marketing only
- Download button is a placeholder for now
- All forms capture email only (no backend needed yet)
- Make it feel premium and trustworthy
- The site should make a YouTube creator immediately
  understand the value and want to download

SHORTSLAB AESTHETIC REFERENCE:
- Background: near black (#080808 to #0f0f0f)
- Glass morphism cards: rgba white with backdrop blur
- Accent colours: the app has multiple themes but
  the default is black and white with subtle accents
- Fonts: Sora (headings, heavy/bold weights 600-800),
  Inter (body, weights 400-500)
- Strong typographic hierarchy — H1 massive and bold,
  stepping down in size and weight each level
- Subtle ambient particle/orb animations in background
- Glass effect cards and containers with subtle borders
- Smooth hover states on everything interactive
- Premium SaaS feel — think Linear, Vercel but darker
- No purple gradients, no generic AI aesthetics
- Minimal — nothing decorative that serves no purpose
- The app has animated themes: Sakura (cherry blossoms),
  Obsidian Rain (rain drops), Tokyo Midnight (neon),
  Golden Hour (warm amber), Void (default dark)
- Border colours: very subtle, low opacity white
- Button style: glass effect with subtle border,
  hover brightens slightly
- Everything feels intentional and considered
---
## Task Breakdown
| ID | Task | Owner | Owned Files | Depends On | Status |
|----|------|-------|-------------|------------|--------|
| T1 | **Project Setup**: Init Next.js 14 + TS + Tailwind in C:\ShortsLabWebsite. Colors: #080808 bg, #0f0f0f secondary. Fonts: Sora (600-800), Inter (400-500). Dark theme globals. | Builder 2 | package.json, tailwind.config.ts, next.config.ts, tsconfig.json, src/app/globals.css, src/app/layout.tsx, postcss.config.js | — | DONE |
| T2 | **Shared Components**: Header (sticky glass, "ShortsLab" logo, nav links, Download CTA), Footer (logo, links, socials, ©2024), Button (glass, hover brighten), GlassCard (backdrop-blur), BackgroundAnimation (floating orbs) | Builder 2 | src/components/Header.tsx, Footer.tsx, Button.tsx, GlassCard.tsx, BackgroundAnimation.tsx | T1 | DONE |
| T3 | **Landing Page**: Hero (headline + subheadline + 2 CTAs), FeaturesSection (7 features w/ icons), DownloadSection (Windows btn, v1.0.0, Mac/Linux soon) | Builder 3 | src/app/page.tsx, src/components/Hero.tsx, FeaturesSection.tsx, DownloadSection.tsx, FeatureCard.tsx | T1 | DONE |
| T4 | **Features Page**: Detailed 7 features. Each: title, description, 4-5 bullet points. Premium glass cards. | Builder 2 | src/app/features/page.tsx, src/components/FeatureDetailSection.tsx | T2 | DONE |
| T5 | **Pricing Page**: Free tier (5 features), Pro tier (8 features + Coming Soon), Waitlist email form | Builder 3 | src/app/pricing/page.tsx, src/components/PricingCard.tsx, WaitlistForm.tsx | T2 | DONE |
| T6 | **About Page**: Mission hero, "Built for serious creators", Team section (3 placeholder cards) | Builder 2 | src/app/about/page.tsx, src/components/TeamCard.tsx | T4 | DONE |
| T7 | **Final Review**: Premium aesthetic, responsiveness, animations, fonts, glass effects, nav links, no AI slop | Reviewer 5 | (read-only) | T3,T5,T6 | DONE |
---
## Coordinator 1
**Role:** coordinator
**Status:** MONITORING
**Progress:**
- T1 ✓ T2 ✓ T3 ✓ T4 ✓ T5 ✓ T6 ✓ | T7 ready for review
- **RESOLVED**: Scout 4 escalation - Builder 2 integrated Header/Footer/BackgroundAnimation into landing & pricing pages
- All build tasks complete - awaiting Reviewer 5 for T7 final review
---
## Builder 2
**Role:** builder
**Status:** DONE
**Progress:**
- **T1 COMPLETE** - Project setup done
- **T2 COMPLETE** - All 5 shared components created
- **T4 COMPLETE** - Features Page with 7 detailed feature sections
- **T6 COMPLETE** - About Page with mission, values, and team sections
- **INTEGRATION FIX** - Added Header/Footer/BackgroundAnimation to landing & pricing pages
- All assigned tasks finished.
---
## Builder 3
**Role:** builder
**Status:** DONE
**Progress:**
- **T3 COMPLETE** - Landing Page done (5 files created)
- **T5 COMPLETE** - Pricing Page done (3 files created)
- All assigned tasks finished. Available to assist if needed.
---
## Scout 4
**Role:** scout
**Status:** DONE
**Progress:**
- **FINAL SCAN COMPLETE** - 18 source files verified
- T1-T6 all files exist, T7 (Final Review) is only remaining task
- **Escalated & Resolved**: T1 assignment, directory path
- **Escalated & Acknowledged**: layout.tsx integration gap
- **Flagged duplication**: Hero orbs vs BackgroundAnimation, FeatureCard vs GlassCard
- Handing off to Reviewer 5 for T7
---
## Reviewer 5
**Role:** reviewer
**Status:** DONE
**Progress:**
- **T7 COMPLETE** - Final Review finished
- Reviewed 18 source files across all pages and components
- **CRITICAL ISSUES: 0**
- **MODERATE ISSUES: 4**
  - M1: BackgroundAnimation memory leak (requestAnimationFrame not cancelled)
  - M2: No mobile navigation menu (nav hidden on mobile)
  - M3: Download link broken on subpages (href="#download" → should be "/#download")
  - M4: Repeated Header/Footer/BackgroundAnimation in each page (should be in layout.tsx)
- **MINOR ISSUES: 8** (unnecessary 'use client', inconsistent glass opacity, font loading, Hero duplicate orbs, FeatureCard not using GlassCard, no skip link, PricingCard disabled button UX, social icons as letters)
- **PASSED:** Colors, fonts, typography, glass effects, hover states, responsiveness, dark theme, 7 features, download section, pricing tiers, waitlist form, about page, footer, no security vulnerabilities
- **VERDICT:** Site is functional and meets premium aesthetic requirements. Recommend fixing M1-M3 before launch.
---
## Completed Work Log
| Task | Agent | Summary | Files Changed |
|------|-------|---------|---------------|
| T1 | Builder 2 | Project Setup: Next.js 14 + TS + Tailwind, #080808 dark theme, Sora/Inter fonts, glass utilities | package.json, tailwind.config.ts, next.config.ts, tsconfig.json, postcss.config.js, src/app/globals.css, src/app/layout.tsx |
| T3 | Builder 3 | Landing Page: Hero, FeaturesSection (7 features w/ icons), DownloadSection, FeatureCard | src/app/page.tsx, src/components/Hero.tsx, FeaturesSection.tsx, DownloadSection.tsx, FeatureCard.tsx |
| T5 | Builder 3 | Pricing Page: Free/Pro tiers with glass cards, WaitlistForm with email capture | src/app/pricing/page.tsx, src/components/PricingCard.tsx, WaitlistForm.tsx |
| T2 | Builder 2 | Shared Components: Header (sticky glass), Footer, Button, GlassCard, BackgroundAnimation (canvas orbs) | src/components/Header.tsx, Footer.tsx, Button.tsx, GlassCard.tsx, BackgroundAnimation.tsx |
| T4 | Builder 2 | Features Page: 7 detailed features with FeatureDetailSection, alternating layouts, glass cards | src/app/features/page.tsx, src/components/FeatureDetailSection.tsx |
| T6 | Builder 2 | About Page: Mission hero, values grid (Speed/Focus/Privacy), Team section with 3 placeholder cards | src/app/about/page.tsx, src/components/TeamCard.tsx |
| FIX | Builder 2 | Integration: Added Header/Footer/BackgroundAnimation to landing & pricing pages | src/app/page.tsx, src/app/pricing/page.tsx |
| T7 | Reviewer 5 | Final Review: 0 critical, 4 moderate, 8 minor issues. Site functional, meets premium aesthetic. Recommend fixing memory leak, mobile nav, download links before launch. | (read-only review) |
