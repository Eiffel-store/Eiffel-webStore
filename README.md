# 🏛️ EIFFEL — Luxury Menswear E-Commerce Platform

<p align="center">
  <img src="public/favicon.svg" alt="EIFFEL Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>High-End Architectural Menswear & Precision Tailoring E-Commerce Experience</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-egypt-market-localization">Egypt Localization</a> •
  <a href="#-design-system">Design System</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20AR%20(RTL)-E11D48?style=flat-square" alt="Bilingual Support" />
  <img src="https://img.shields.io/badge/Deployment-Egypt%20🇪🇬-000000?style=flat-square" alt="Egypt Ready" />
</p>

---

## 📖 Overview

**EIFFEL** is a state-of-the-art luxury e-commerce web application inspired by brutalist architecture, monochromatic discipline, and premium textile craftsmanship.

Built with **React 18, Vite, TypeScript, and Tailwind CSS**, the platform offers a seamless shopping experience tailored specifically for high-net-worth clients in Egypt, featuring authentic **Egyptian Giza Cotton (700GSM)** collections, local courier integrations (Bosta / DHL Egypt), **InstaPay (⚡)** instant transfers, and Cash on Delivery.

---

## ✨ Key Features

### 1. 🛍️ Luxury Catalog & Dynamic Product Detail Page (PDP)
- **Interactive Runway Lookbook Hotspots**: Hover over model lookbooks to discover and add full coordinated outfits to bag with 1-click.
- **Garment Matrix & Size Guide**: Interactive measurement matrix with cm specifications (chest, shoulders, length, sleeve).
- **Multi-Angle Gallery**: High-resolution zoom on hover, thumbnail preview strip, and live colorway swatches.
- **Architectural Specs Accordions**: Structural craftsmanship, 700GSM material composition, fit guides, and stylist recommendations.

### 2. 🇪🇬 Egypt-Ready Checkout & Payments
- **InstaPay (⚡)**: Instant payment via Egyptian IPA address (`@eiffel.egypt`) with automated verification prompts.
- **Cash on Delivery (COD)**: Doorstep trial and inspection with payment upon receiving in all Egyptian governorates.
- **Cards & Meeza**: Encrypted card payment supporting Visa, Mastercard, AMEX, and Egypt's national payment network (Meeza).
- **Governorate Selector**: Fast address autofill for Cairo, Giza, Alexandria, New Cairo (5th Settlement), Sheikh Zayed, El Gouna, and more.

### 3. 🌐 Full Bilingual Architecture (English & Arabic with RTL)
- **Dynamic Language Switcher**: Switch between **English (EN)** and **العربية (AR)** instantly without page reloads.
- **True RTL Layouts**: Mirrors drawers, flex directions, paddings, and navigation icons.
- **Curated Typography**:
  - English: `Bebas Neue` (Editorial display headlines) & `Inter` (Body and high-density functional data).
  - Arabic: `IBM Plex Sans Arabic` for crisp, modern editorial legibility.
- **Modular Locales**: Separate dictionary files (`src/i18n/locales/en.ts` and `src/i18n/locales/ar.ts`).

### 4. 💼 Client Portal & EIFFEL PRIVÉ Membership
- **Bento Grid Dashboard**: View VIP tier status, loyalty points (EGP 1 = 1 Point), and exclusive concierge benefits.
- **Live Order Tracking**: Mock courier timelines with Bosta/DHL tracking numbers and destination details.
- **Address & Payment Manager**: Manage saved delivery addresses and default credit cards.

### 5. 📍 Egyptian Maisons & Private Fitting Appointments
- **Interactive Map Canvas**: Flagship locations in **Zamalek, 5A Waterway (New Cairo), Arkan Plaza (Sheikh Zayed), Kafr Abdo (Alexandria), and Abu Tig Marina (El Gouna)**.
- **Atelier Reservation Modal**: Book private 1-on-1 styling suites with bespoke tailoring and complimentary beverages.

### 6. 📰 The Journal & 24/7 Digital Concierge
- **Editorial Magazine**: Long-form essays on textile architecture, Japanese loopwheel knitting, and Egyptian Giza cotton.
- **Live Concierge Chat**: Embedded real-time chat assistant simulation for styling queries and sizing guidance.

---

## 🇪🇬 Egypt Market Localization

| Area | Adaptation |
|---|---|
| **Primary Currency** | **EGP (ج.م / Egyptian Pound)** as default (with multi-currency switcher for USD, EUR, AED, SAR) |
| **Free Delivery** | Complimentary courier delivery across Egypt on orders exceeding **3,000 EGP** |
| **Local Payment Methods** | **InstaPay (⚡)**, **Cash on Delivery (COD)**, **Meeza Cards**, **Vodafone Cash** |
| **Delivery Timeframe** | 24–48 hours for Greater Cairo & Giza; 2–3 days for Alexandria, Delta, and Coastal destinations |
| **Returns Policy** | 14-day doorstep return & exchange compliant with Egyptian Consumer Protection standards |
| **Boutiques & Ateliers** | Zamalek (Abou El Feda), New Cairo (5A Waterway), Sheikh Zayed (Arkan), Alexandria, El Gouna |

---

## 🎨 Design System

EIFFEL is built upon the **Eiffel Vertical** monochromatic luxury design philosophy:
- **Sharp Geometry**: 0px border radius (`rounded-none`) across buttons, inputs, modals, and product cards.
- **Monochrome High Contrast**: Pure black (`#000000` / `#121313`) and crisp chalk surfaces (`#ffffff` / `#f9f9f9`) with subtle tonal gray borders (`#eeeeee` / `#2f3131`).
- **Dark Mode Support**: Full light/dark mode toggle with persistent local storage.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `CurrencyContext`, `LanguageContext`, `ThemeContext`, `WishlistContext`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Eiffel-store/Eiffel-webStore.git
   cd Eiffel-webStore
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
Eiffel-webStore/
├── public/
│   └── favicon.svg               # SVG luxury monogram favicon
├── src/
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx     # Slide-over bag drawer with free delivery meter
│   │   ├── common/
│   │   │   ├── Navbar.tsx         # Header with mega menu & language toggle
│   │   │   └── Footer.tsx         # Architectural footer with trust badges
│   │   ├── product/
│   │   │   ├── ProductCard.tsx    # 4:5 luxury card with hover preview & quick add
│   │   │   └── QuickViewModal.tsx # Fast product inspection overlay
│   │   └── search/
│   │       └── SearchModal.tsx    # Fullscreen live product search modal
│   ├── context/
│   │   ├── AuthContext.tsx        # User profile, Egyptian addresses, order placement
│   │   ├── CartContext.tsx        # Bag state, promo codes, delivery thresholds
│   │   ├── CurrencyContext.tsx    # EGP / USD / EUR converter
│   │   ├── LanguageContext.tsx    # English & Arabic (RTL) state controller
│   │   ├── ThemeContext.tsx       # Dark & Light mode switcher
│   │   └── WishlistContext.tsx    # Saved silhouettes manager
│   ├── data/
│   │   ├── faq.ts                 # Egyptian delivery, InstaPay, and sizing FAQ
│   │   ├── journal.ts             # Architectural essays & textile articles
│   │   ├── products.ts            # Men's, Kids, and Runway product catalog
│   │   └── stores.ts              # Egyptian flagships (Zamalek, Waterway, Arkan, etc.)
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── ar.ts              # Full Arabic dictionary
│   │   │   └── en.ts              # Full English dictionary
│   │   ├── translations.ts        # Modular re-export hub
│   │   └── types.ts               # Translation type definitions
│   ├── pages/
│   │   ├── AccountPage.tsx        # Client portal, orders, address book, payment cards
│   │   ├── CartPage.tsx           # Full bag overview with gift box packaging
│   │   ├── CheckoutPage.tsx       # Express checkout (InstaPay, COD, Governorates)
│   │   ├── CollectionsPage.tsx    # Catalog with subcategory & filter drawer
│   │   ├── HelpCenterPage.tsx     # Searchable FAQ accordions & live chat
│   │   ├── HomePage.tsx           # Hero, Lookbook hotspots, category grid, Manifesto
│   │   ├── JournalDetailPage.tsx  # Long-form editorial essay reader
│   │   ├── JournalPage.tsx        # Editorial magazine archive
│   │   ├── ProductDetailPage.tsx  # Sizing matrix modal, gallery, garment specs
│   │   ├── StoreLocatorPage.tsx   # Interactive map & private fitting reservation
│   │   └── WishlistPage.tsx       # Saved pieces with direct add-to-bag
│   ├── types/
│   │   └── index.ts               # Global TypeScript interfaces
│   ├── App.tsx                    # Root routing & context wrapper
│   ├── index.css                  # Custom scrollbars, animations, RTL rules
│   └── main.tsx                   # React root entry point
├── index.html                     # Web fonts (Bebas Neue, Inter, IBM Plex Sans Arabic)
├── tailwind.config.js             # Eiffel luxury design tokens & color palette
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🔒 Security & Performance

- **Zero Layout Shift (CLS)**: Predefined aspect ratios (`aspect-[4/5]`, `aspect-[16/10]`) on all media containers.
- **Fast Build Times**: Vite 6 bundle compilation in under 4 seconds with tree-shaking.
- **Client Data Privacy**: All state (Cart, Wishlist, Language, Theme, User) safely persists in `localStorage`.

---

## 📄 License & Ownership

© 2026 **EIFFEL STUDIO S.A.E. / EIFFEL EGYPT**. All rights reserved.
Unauthorized duplication or commercial distribution without prior written consent is strictly prohibited.
