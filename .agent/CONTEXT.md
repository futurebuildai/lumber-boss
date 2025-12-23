# Project Context

## What is Lumber Boss?

Lumber Boss is a modern e-commerce platform for **LBM (Lumber & Building Materials)** dealers. It provides:
- A public-facing storefront for product browsing and ordering
- A "My Account" portal for Pro customers (contractors, builders)

## Target Users

| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Retail Customer** | Homeowner, DIYer | Browse, single purchase |
| **Pro Customer** | Contractor, builder | Account, credit, reorder, team |
| **Admin** | Lumber yard staff | Manage orders, inventory |

## Business Goals

1. **Drive online sales** — Easy ordering, quick reorder
2. **Build Pro loyalty** — Account portal with value-added features
3. **Reduce friction** — Project organization, saved lists, estimates
4. **Integrate with ERP** — Real-time inventory, pricing, invoices

## Design Language

- **Color Palette:** Slate (#1e293b) + Orange (#f97316)
- **Typography:** Space Grotesk (headings) + Inter (body)
- **Aesthetic:** Modern industrial, clean, professional
- **Logo:** Hexagon (⬡) + "LUMBER BOSS"
- **Tagline:** "Pro Materials. Delivered."

## Competitive Landscape

| Competitor | Notes |
|------------|-------|
| TOOLBX | Current inspiration, feature parity target |
| Home Depot Pro Xtra | Rewards, purchase tracking, Bid Room |
| BuildersFirstSource myBLDR | Project management, 3D visualization |

## Technical Context

- **Frontend:** Vanilla HTML/CSS/JS (Vanilla-Plus architecture)
- **Architecture Docs:** [.system-docs/](../.system-docs/) (Source of Truth)
- **Backend:** Not built yet (see [ARCHITECTURE.md](../docs/ARCHITECTURE.md))
- **Hosting:** Local dev only, future: Vercel + Cloud Run
- **ERP Integration:** Future: Epicor BisTrack, TOOLBX API

## Current State

### Completed
- [x] Homepage with Quick Reorder
- [x] My Account Portal (10 sections)
- [x] Visual redesign (Slate/Orange)
- [x] Backend architecture docs
- [x] Product catalog (PLP + PDP)
- [x] Real-time inventory indicators
- [x] Search functionality
- [x] Category filtering
- [x] Vanilla-Plus Web Components (Phase 1)
- [x] ES Module services (api.js, cart.js)

### Next Up
- [ ] Cart & Checkout flow
- [ ] Continue component migration (lb-header, lb-footer)
- [ ] Backend API (mock → real)
- [ ] ERP integration

