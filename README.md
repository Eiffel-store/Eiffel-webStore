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
  <a href="#-whats-new--recent-updates">What's New</a> •
  <a href="#-integrated-admin-command-center">Admin Command Center</a> •
  <a href="#-storefront-features">Storefront Features</a> •
  <a href="#-security--jwt-authentication-lifecycle">Auth & Security</a> •
  <a href="#-feature-based-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Zustand-v5-443E38?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/i18n-Cairo%20Font%20%7C%20EN%20%26%20AR%20(RTL)-E11D48?style=flat-square" alt="Bilingual Cairo" />
  <img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-22C55E?style=flat-square&logo=github&logoColor=white" alt="Deployed" />
</p>

---

## 📖 Overview

**EIFFEL** is a production-grade luxury menswear e-commerce platform and management ecosystem inspired by brutalist architecture, monochromatic minimalism, and premium textile craftsmanship.

Built with **React 19, TypeScript 6, Vite 8, Tailwind CSS, TanStack Query, and Zustand**, the platform delivers an ultra-fast, reactive customer shopping experience backed by an **Integrated Real-Time Admin Command Center**. Store managers have full control over the catalog, homepage visual sections, discount offers, promo coupons, physical branches, orders workflow, and customer CRM with instant optimistic updates across the entire application.

---

## 🚀 What's New & Recent Updates

| Feature / Update | Description |
| :--- | :--- |
| **🔐 JWT Auth & Auto-Refresh** | Complete access & refresh token lifecycle with Axios interceptor retry queue and anonymous catalog fallback. |
| **👥 Customers CRM Dashboard** | Comprehensive client management (`/admin/customers`) with order counts, lifetime spend aggregation, and VIP tier badges. |
| **🎨 Visual Home Page Editor** | Real-time home page customizer (`/admin/home`) for hero sliders, promotional banners, and featured categories. |
| **☁️ Cloudinary Media Uploader** | Dual-tab image manager in product & category forms supporting direct file upload to Cloudinary or image URL entry. |
| **🏷️ Offers & Discounts Engine** | Quick discount modal (`AdminAddOfferModal`) for catalog products with strike-through pricing and custom coupon codes. |
| **🇪🇬 Full Egypt Checkout System** | Complete checkout flow (`/checkout`) with Egyptian governorates lookup, InstaPay (`@eiffel.egypt`), COD, and card payments. |
| **⚡ Optimistic State Sync** | TanStack Query cache invalidation with instant optimistic UI updates for add, update, and delete actions. |
| **🔤 Google Font Cairo RTL** | Standardized Arabic typography across all RTL layouts using Google Font **Cairo** paired with **Bebas Neue** and **Inter**. |

---

## ⚡ Integrated Admin Command Center

The application features a secure, full-featured **Admin Command Center** accessible at `#/admin` styled after our **Stitch luxury dashboard designs**:

* **Direct Admin Link**: [`https://eiffel-store.github.io/Eiffel-webStore/#/admin`](https://eiffel-store.github.io/Eiffel-webStore/#/admin)
* **Master PIN & Credentials**: Protected with PIN / JWT authentication (**Default PIN: `123456` or `eiffel2026`**).

### 🛠️ Admin Control Modules:

1. **📊 Executive Dashboard (`/admin`)**:
   - Real-time KPI summary (Total Revenue, Orders, In-Stock & Out-of-Stock Counts, Active Offers, Branches).
   - Live customer orders feed with quick status triggers and featured catalog preview.

2. **🛍️ Product Management (`/admin/products`, `/admin/products/new`, `/admin/products/edit/:id`)**:
   - Full CRUD product catalog manager with real-time preview.
   - **Cloudinary Media Manager**: Dual-mode upload (direct file upload to cloud storage or direct HTTPS URL).
   - **Interactive Color Palette Picker**: Custom HEX color selector with localized color naming.
   - **Sizing Matrix Selector**: Multi-select sizing presets (`S, M, L, XL, 2XL, 3XL, 39-45, One Size`).
   - One-click **In-Stock / Out-of-Stock** toggle instantly synchronized with the storefront.
   - Product badges (`New Arrival`, `Best Seller`, `Limited Edition`).
   - Full bilingual fields for product names, subtitles, descriptions, and fabric specs.

3. **🎨 Visual Home Page Editor (`/admin/home`)**:
   - Interactive visual editor to customize hero slider banners, promotional split banners, category highlights, and announcement texts without touching code.

4. **🏷️ Offers & Promotions Engine (`/admin/offers`)**:
   - Select any piece from the catalog, assign a promotional discounted price, and display dynamic strike-through prices across `/collections/offers`.
   - **Promo Coupon Codes Manager**: Create and manage discount codes (e.g., `EIFFEL10`, `SUMMER20`) with custom percentage discounts, minimum order thresholds, expiration dates, and active status toggles.

5. **🗂️ Categories & Collections Manager (`/admin/categories`)**:
   - Dynamic category CRUD with Cloudinary banner upload, subtitle customization, and reactive category grid synchronization.

6. **📍 Store Branches Management (`/admin/branches`)**:
   - Manage Egyptian flagship and boutique locations:
     * **Zefta Flagship (فرع زفتى)**: Al-Mahatta, in front of Hollywood Hall, Gharbia.
     * **Nahtay Boutique (فرع نهطاي)**: Main Road, next to Emperor Koshary, Gharbia.
   - Add new branches across any governorate with custom working hours, contact phones, Google Maps coordinates, and cover photos.

7. **📦 Orders Tracking & Fulfillment (`/admin/orders`)**:
   - Live order stream connected to checkout submissions.
   - Status workflow: `Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`.
   - Customer shipping details, phone, governorate, address, and itemized receipt breakdown.
   - Printable order invoice slip (`window.print()`).

8. **👥 Customer CRM & Lifetime Metrics (`/admin/customers`)**:
   - Customer directory with aggregated live order count and lifetime spend calculation.
   - Tier status indicators (`Bronze`, `Silver`, `Gold`, `VIP Atelier`).
   - Customer contact cards with direct phone, email, and shipping addresses.

9. **📈 Reports & Analytics (`/admin/reports`)**:
   - Financial breakdown, sales velocity, top-performing products, and customer acquisition metrics.

10. **⚙️ Settings & Database Backup (`/admin/settings`)**:
    - Manage contact channels: WhatsApp phone number, Facebook page URL, Instagram handle, and hotline.
    - Announcement bar marquee texts.
    - **Full JSON Database Export & Import**: Download a complete backup of all products, categories, branches, and orders, or restore from a JSON backup file in one click.
    - Admin Master PIN reconfiguration.

---

## ✨ Storefront Features

- **🌐 Full Bilingual Architecture (English & Arabic with RTL)**: Instant language switcher with automatic layout mirroring and luxury typography (**Google Font Cairo** for Arabic, **Bebas Neue** & **Inter** for English).
- **🛍️ Architectural Product Detail Pages (PDP)**: Multi-angle zoom gallery, sizing matrix modal, garment specifications, stylist recommendations, and sticky mobile purchase bar.
- **🇪🇬 Egypt-Ready Checkout Flow (`/checkout`)**: Native Egyptian checkout experience with governorates auto-fill, dynamic shipping calculation, InstaPay (`@eiffel.egypt`), Cash on Delivery (COD), and credit card payments.
- **🛒 Dynamic Cart & Slide-Out Drawer (`/cart`)**: Real-time free shipping threshold progress bar, coupon code redemption, and persistent cart items.
- **❤️ Luxury Wishlist (`/wishlist`)**: Client saved catalog with instant one-click transfer to cart.
- **📍 Store Locator & Atelier Booking (`/stores`)**: Interactive branch finder with working hours, directions, and private tailoring appointment booking.
- **💬 Floating Contact Concierge**: Quick floating action buttons for **WhatsApp** and **Facebook Messenger** linked directly to admin store settings.
- **🔍 Fullscreen Instant Search**: Fast modal search across all products with live category and price filtering.
- **💼 Customer Account Portal (`/account`)**: Order history, delivery addresses, and profile management.

---

## 🔐 Security & JWT Authentication Lifecycle

The frontend integrates a robust authentication and session management layer:

```text
       [ User Action / API Request ]
                    │
            ┌───────▼────────┐
            │  apiClient.ts  │ ──── Attach Bearer Access Token
            └───────┬────────┘
                    │
            [ 401 Unauthorized? ]
               ├── No  ──► [ Return Response ]
               └── Yes ──► [ Queue Failed Requests ]
                                 │
                     ┌───────────▼───────────┐
                     │ /api/v1/auth/refresh  │ (Send Refresh Token)
                     └───────────┬───────────┘
                                 │
                    ├── Success ──► Save New Token & Replay Queue
                    └── Failure ──► Clear Session & Prompt Login
```

- **Axios Interceptor Retry Queue**: Automatically queues concurrent requests during token refresh to eliminate 401 race conditions.
- **Zustand `useAuthStore`**: Centralized store managing token storage, user roles (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`), and profile synchronization.
- **Anonymous Catalog Fallback**: Unauthenticated guests can seamlessly browse products, collections, and stores without blocking prompts.

---

## 🏛️ Feature-Based Architecture

The codebase follows a clean **Feature-Based / Domain-Driven Architecture** with `@/*` path aliases:

```text
src/
├── features/                     # Domain modules (isolated components, pages & state)
│   ├── admin/                   # Admin Command Center
│   │   ├── components/          # Subcomponents (dashboard, products, orders, customers, home-editor, etc.)
│   │   ├── pages/               # Orchestration pages (Products, Orders, Customers, Reports, Settings...)
│   │   ├── context/             # AdminAuthContext (PIN / credentials session)
│   │   └── index.ts             # Feature barrel export
│   │
│   ├── products/                # Product cards, galleries, filters, detail pages, collections
│   ├── cart/                    # Cart drawer, bag page, free shipping threshold
│   ├── checkout/                # Checkout form, shipping/payment selectors, confirmation
│   ├── stores/                  # Branch cards, interactive map canvas, appointment modal
│   ├── home/                    # Hero slider, category grid, editorial split, shop the look
│   ├── account/                 # User profile, orders tab, address book
│   ├── wishlist/                # Saved items and direct move-to-bag
│   ├── help/                    # Searchable FAQ accordions, concierge form
│   └── search/                  # Fullscreen instant product search modal
│
├── services/                    # API communication layer
│   ├── apiClient.ts             # Axios instance with JWT interceptors & refresh queue
│   ├── authService.ts           # Login, register, token refresh, profile endpoints
│   ├── productService.ts        # Product catalog CRUD & filtering
│   ├── categoryService.ts       # Category CRUD endpoints
│   ├── customerService.ts       # Customers CRM & order metrics
│   ├── orderService.ts          # Order creation, fulfillment & status tracking
│   ├── couponService.ts         # Promo discount codes
│   ├── bannerService.ts         # Hero & promotional banners
│   ├── uploadService.ts         # Cloudinary cloud image upload
│   └── locationService.ts       # Egyptian governorates & shipping rates
│
├── stores/                      # Global state stores (Zustand)
│   ├── useAuthStore.ts          # Auth state, JWT tokens, profile sync
│   ├── useCartStore.ts          # Shopping bag state & persistence
│   └── useWishlistStore.ts      # Wishlist state & persistence
│
├── shared/                      # Shared UI components & global contexts
│   ├── components/              # Navbar, Footer, Logo, ContactButtons, ScrollToTop
│   ├── context/                 # LanguageContext, ThemeContext, CurrencyContext, StoreDataContext
│   └── index.ts                 # Shared module barrel export
│
├── data/                        # Fallback datasets (products, stores, FAQs)
├── types/                       # Global TypeScript interfaces & DTOs
├── i18n/                        # Localization dictionaries (English & Arabic)
├── App.tsx                      # Root routes & feature assembly
├── main.tsx                     # Application entry point
└── index.css                    # Design tokens, Cairo font & custom luxury animations
```

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript 6.0](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **State Management**: [Zustand 5](https://zustand-demo.pmnd.rs/) & [TanStack Query 5 (React Query)](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/) with custom interceptor retry queue
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Backend API**: [Spring Boot 3 + Spring Data MongoDB + Cloudinary SDK](https://github.com/Eiffel-store/Eiffel-admin-panal)
- **Deployment**: [GitHub Pages](https://pages.github.com/) via `gh-pages`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm / yarn / pnpm

### Installation & Local Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/Eiffel-store/Eiffel-webStore.git
   cd Eiffel-webStore
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   * Storefront: `http://localhost:5173/`
   * Admin Command Center: `http://localhost:5173/#/admin` (PIN: `123456`)

5. **Run test suite:**
   ```bash
   npm test
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

7. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 📄 License & Ownership

© 2026 **EIFFEL MENSWEAR S.A.E. / EIFFEL STORE**. All rights reserved.  
Built with precision engineering and luxury aesthetics.
