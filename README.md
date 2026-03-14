# 🌍 Tour Search Application

Client-side tour search service with the ability to search by country, city, or hotel.

🔗 **Live Demo:** https://tour-search-app-lilac.vercel.app/

---

## 📋 Tasks

1. ✅ **Search Form** - combobox with autocomplete for destination selection
2. ✅ **Tour Search** - asynchronous search with polling, retry, and error handling
3. ✅ **Render Results** - display tour cards with data aggregation (prices + hotels)
4. ✅ **Cancel Search** - ability to change parameters during an active search

---

## 🚀 Quick Start

### Online
Just open the [live demo](https://tour-search-app-lilac.vercel.app/)

### Local Development

```bash
# Clone the repository
git clone https://github.com/serepanSmart/tour-search-app.git
cd tour-search-app

# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
# http://localhost:5173

---

Build:
# Production build
npm run build

# Preview production build
npm run preview

---

🛠️ Tech Stack

React 18
TypeScript
Vite
Zustand
TanStack
@floating-ui/react
CSS Modules

---

📁 Project structure

src/
├── api/                    # API layer
│   ├── api.js             # Mock API (provided)
│   ├── tour-api.ts        # Tours API wrapper
│   └── geo-api.ts         # Geo API wrapper
│
├── services/              # Business logic
│   ├── search-service.ts        # Search with polling/retry
│   ├── aggregation-service.ts   # Data aggregation + caching
│   └── search-manager.ts        # Search orchestration + filtering
│
├── hooks/                 # React integration
│   └── use-search-prices.ts
│
├── stores/                # UI state (Zustand)
│   └── search-store.ts          # Form state (destination, inputValue)
│
├── queries/               # TanStack Query
│   └── geo-queries.ts           # Countries & geo search queries
│
├── components/
│   ├── ui/                      # Primitives
│   │   ├── button/
│   │   ├── input/
│   │   ├── popover/
│   │   ├── loader/
│   │   ├── error-message/
│   │   └── empty-state/
│   │
│   ├── composite/               # Composed components
│   │   ├── combobox/           # Popover + Input
│   │   └── geo-option/
│   │
│   └── features/                # Features
│       ├── search-form/
│       ├── search-results/
│       └── tours-list/
│
├── models/                # TypeScript types
│   └── geo-types.ts
│
└── styles/                # Global styles
    ├── reset.css
    └── variables.css
