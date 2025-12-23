# Feature Roadmap

## Current Phase: MVP Frontend

Building the complete frontend with mock data to validate UX before backend development.

---

## Phase 1: Frontend Foundation ✅

- [x] Homepage with hero, categories, showrooms, services
- [x] Quick Reorder section with recent orders
- [x] Visual redesign (Slate/Orange palette)
- [x] My Account Portal with all sections
- [x] Responsive design

---

## Phase 2: Product Catalog ✅

- [x] Product listing page (PLP)
- [x] Product detail page (PDP)
- [x] Real-time inventory indicators
- [x] Search functionality
- [x] Category filtering

---

## Phase 2.5: Vanilla-Plus Architecture ✅

- [x] Create `src/services/api.js` — fetch wrapper
- [x] Create `src/services/cart.js` — state management
- [x] Create `src/components/lb-inventory-badge.js`
- [x] Create `src/components/lb-toast.js`
- [x] Create `src/components/lb-product-card.js`
- [x] Create `src/app.js` — ES Module entry point
- [x] Update `products.html` and `product.html` with module scripts

---

## Phase 3: Cart & Checkout

- [ ] Persistent cart
- [ ] Project assignment at checkout
- [ ] Delivery scheduling
- [ ] Payment integration (Stripe)
- [ ] Order confirmation

---

## Phase 4: Backend API

- [ ] Set up Node.js/Express or FastAPI
- [ ] PostgreSQL schema
- [ ] Auth (Auth0 or Firebase)
- [ ] REST API for all portal features
- [ ] Connect frontend to real API

---

## Phase 5: ERP Integration

- [ ] Define ERP contract (BisTrack)
- [ ] Product/inventory sync
- [ ] Order push to ERP
- [ ] Invoice pull from ERP
- [ ] Real-time pricing

---

## Future Ideas (Backlog)

| Feature | Priority | Notes |
|---------|----------|-------|
| Voice/Chat ordering | High | Hands-free job site ordering |
| Bill of Materials upload | High | Paste takeoff → auto-match SKUs |
| Delivery tracking | Medium | Live GPS for trucks |
| 3D product visualization | Low | Like BuildersFirstSource |
| Mobile app | Low | PWA first, native later |
