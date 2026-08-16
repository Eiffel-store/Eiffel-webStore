# 🏛️ EIFFEL — Luxury Menswear Platform & Integrated Admin Command Center

<p align="center">
  <img src="public/favicon.svg" alt="EIFFEL Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>High-End Architectural Menswear E-Commerce Experience & Complete Real-Time Admin Command Center</strong>
</p>

<p align="center">
  <a href="https://eiffel-store.github.io/Eiffel-webStore/"><strong>🌐 Live Storefront Preview</strong></a> •
  <a href="https://eiffel-store.github.io/Eiffel-webStore/#/admin"><strong>⚡ Live Admin Panel</strong></a>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-integrated-admin-command-center">Admin Panel</a> •
  <a href="#-storefront-features">Storefront Features</a> •
  <a href="#-feature-based-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Architecture-Feature--Based-8B5CF6?style=flat-square" alt="Feature Based" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20AR%20(RTL)-E11D48?style=flat-square" alt="Bilingual Support" />
  <img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-22C55E?style=flat-square&logo=github&logoColor=white" alt="Deployed" />
</p>

---

## 📖 Overview

**EIFFEL** is a production-grade luxury menswear e-commerce platform and management ecosystem inspired by brutalist architecture, monochromatic minimalism, and premium textile craftsmanship.

Built with **React 18, Vite, TypeScript, and Tailwind CSS**, the project follows a **Feature-Based Architecture (Domain-Driven)** with an **Integrated Real-Time Admin Command Center**. Store managers can add, edit, and control products, discount offers, promo coupons, physical branches, categories, orders, and contact channels with instant reactive updates across the entire customer-facing storefront.

---

## ⚡ Integrated Admin Command Center

The application features a secure, full-featured **Admin Panel** (`#/admin`) styled after our **Stitch luxury dashboard designs**:

* **Direct Admin Link**: [`https://eiffel-store.github.io/Eiffel-webStore/#/admin`](https://eiffel-store.github.io/Eiffel-webStore/#/admin)
* **Master PIN Security**: Access is protected with PIN authentication (**Default: `123456` or `eiffel2026`**).

### 🛠️ Admin Control Modules:

1. **📊 Executive Dashboard (`/admin`)**:
   - Live KPI metrics (Total products, in-stock count, out-of-stock alerts, active promotions, branch count, total revenue, and pending orders).
   - Real-time customer orders feed and featured catalog preview.

2. **🛍️ Full Product Management (`/admin/products` & `/admin/products/new`)**:
   - Add, edit, and delete catalog pieces with live preview.
   - Media gallery manager: Upload local images or specify image URLs, with primary thumbnail selector.
   - Interactive Color Palette Picker (HEX color selector and custom color names).
   - Sizing matrix selector (`S, M, L, XL, 2XL, 3XL, 39-45, One Size`).
   - One-click **In-Stock / Out-of-Stock** toggle instantly updated on the storefront.
   - Badges control (`New Arrival`, `Best Seller`, `Limited Edition`).

3. **🏷️ Offers & Promotions Engine (`/admin/offers`)**:
   - Select any product from the catalog, assign a promotional discounted price, and display strike-through pricing on `/collections/offers`.
   - **Promo Coupon Codes Manager**: Create and manage discount codes (e.g. `EIFFEL10`, `SUMMER20`) with custom percentage discounts, minimum order thresholds, and active status toggles.

4. **📍 Store Branches Management (`/admin/branches`)**:
   - Manage Egyptian flagship and boutique locations:
     * **Zefta Flagship (فرع زفتى)**: Al-Mahatta, in front of Hollywood Hall, Gharbia.
     * **Nahtay Boutique (فرع نهطاي)**: On the road, next to Emperor Koshary, Gharbia.
   - Add new branches across any governorate with custom hours, phones, and cover images.

5. **🗂️ Categories & Collections Manager (`/admin/categories`)**:
   - Edit collection names, subtitles, and cover banners for Men, Kids, Accessories, Offers, and custom categories.

6. **📦 Orders Tracking & Fulfillment (`/admin/orders`)**:
   - View orders received from checkout in real-time.
   - Filter by status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - Customer shipping details, phone, address, and itemized breakdown.
   - Printable order invoice slip (`window.print()`).

7. **⚙️ Settings & Database Backup (`/admin/settings`)**:
   - Configure WhatsApp phone number, Facebook URL, Instagram handle, customer service hotline, and top announcement banner texts.
   - Change Admin Master PIN.
   - **Full JSON Database Export & Import**: Download a complete backup of all products, categories, branches, and orders, or restore from a JSON backup file in one click.

---

## ✨ Storefront Features

- **🌐 Full Bilingual Architecture (English & Arabic with RTL)**: Instant language switcher with automatic layout mirroring and tailored typography (`Bebas Neue`, `Inter`, `IBM Plex Sans Arabic`).
- **🛍️ Architectural Product Detail Pages (PDP)**: Multi-angle zoom gallery, sizing matrix modal, garment specifications, stylist recommendations, and sticky mobile purchase bar.
- **💬 Floating Contact Actions**: Quick access buttons for **WhatsApp** and **Facebook** connected directly to store settings.
- **🇪🇬 Egypt-Ready Checkout**: Support for **InstaPay (@eiffel.egypt)**, **Cash on Delivery (COD)**, and Card payments with Egyptian governorates address auto-fill.
- **💼 Customer Account Portal**: Client order history, saved addresses, and payment methods.
- **📍 Store Locator & Atelier Booking**: Interactive map canvas and private fitting appointment reservation.
- **⚡ Reactive Global State**: All data changes made in Admin reflect instantly across Home, Collections, Product Details, Cart, and Stores.

---

## 🏛️ Feature-Based Architecture

The codebase is structured using a **Feature-Based / Domain-Driven Architecture** with clean **`@/*` Path Aliases**:

```text
src/
├── features/                     # Domain modules (isolated components, pages & contexts)
│   ├── admin/                   # Admin panel dashboard, catalog, offers, branches, orders, settings
│   │   ├── components/          # 20+ modular subcomponents (tables, modals, forms, cards)
│   │   ├── pages/               # Clean orchestration pages
│   │   ├── context/             # AdminAuthContext (PIN session)
│   │   └── index.ts             # Central feature barrel export
│   │
│   ├── products/                # Product cards, galleries, filters, detail pages, collections
│   ├── cart/                    # Cart drawer, bag page, free shipping threshold
│   ├── checkout/                # Checkout forms, shipping/payment selectors, confirmation
│   ├── stores/                  # Branch cards, interactive map canvas, appointment modal
│   ├── home/                    # Hero section, category grid, editorial split, shop the look
│   ├── account/                 # User profile, orders tab, address book, payment cards
│   ├── wishlist/                # Saved items and direct add-to-bag
│   ├── help/                    # Searchable FAQ accordions, concierge form, live chat
│   └── search/                  # Fullscreen instant product search modal
│
├── shared/                      # Cross-cutting reusable UI & global state
│   ├── components/              # Navbar, Footer, Logo, SocialIcons, ContactButtons, ScrollToTop
│   ├── context/                 # StoreDataContext, LanguageContext, ThemeContext, CurrencyContext
│   └── index.ts                 # Shared module barrel export
│
├── data/                        # Default fallback datasets (products, stores, FAQs)
├── types/                       # Global TypeScript data definitions
├── i18n/                        # Localization dictionaries (English & Arabic)
├── App.tsx                      # Root routes & feature assembly
├── main.tsx                     # React application entry point
└── index.css                    # Design tokens, custom animations & Tailwind utilities
```

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (with GitHub Pages Hash/Base routing)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) via `gh-pages` automated scripts

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm / yarn / pnpm

### Installation & Local Run

1. **Clone repository:**
   ```bash
   git clone https://github.com/Eiffel-store/Eiffel-webStore.git
   cd Eiffel-webStore
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local dev server:**
   ```bash
   npm run dev
   ```
   * Storefront: `http://localhost:5173/`
   * Admin Panel: `http://localhost:5173/#/admin` (PIN: `123456`)

4. **Build production bundle:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 📄 License & Ownership

© 2026 **EIFFEL MENSWEAR S.A.E. / EIFFEL STORE**. All rights reserved.
Built with precision engineering and luxury aesthetics.
