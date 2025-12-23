# Architecture & Design Decisions

This log tracks significant decisions made during development.

---

## DEC-001: Naming Conventions (TOOLBX → Lumber Boss)

**Date:** 2024-12-22  
**Status:** Decided

### Context
TOOLBX uses certain terminology that we wanted to differentiate and improve.

### Decision
| TOOLBX Term | Lumber Boss Term | Rationale |
|-------------|------------------|-----------|
| Account | Overview | More descriptive |
| Job Tags + Addresses | **Projects** | Combined, project-centric |
| Quotes | **Estimates** | More customer-friendly |
| Crew | **Team** | More inclusive |
| Payment Methods | **Wallet** | Modern, familiar |
| Lists | **Saved Lists** | More descriptive |

---

## DEC-002: Color Palette Change

**Date:** 2024-12-22  
**Status:** Decided

### Context
The original Ashby Lumber green palette was too similar to TOOLBX.

### Decision
Adopted a **Slate + Orange** palette:
- Primary: `#1e293b` (Slate 800)
- Accent: `#f97316` (Orange 500)

### Rationale
- Industrial, professional feel
- High contrast for accessibility
- Distinct from green "lumber yard" aesthetic

---

## DEC-003: Vanilla JS over Framework

**Date:** 2024-12-22  
**Status:** Decided

### Context
Should we use React, Vue, or vanilla JS?

### Decision
Start with **Vanilla JS** for the prototype.

### Rationale
- Faster to prototype
- No build step required
- Can migrate to React/Next.js later
- HTML structure is clear for backend integration

---

## DEC-004: Project-Centric Organization

**Date:** 2024-12-22  
**Status:** Decided

### Context
TOOLBX has separate "Job Tags" and "Addresses" features.

### Decision
Combine into a single **Projects** concept where:
- Each project has a name, address, color badge
- Orders can be assigned to projects
- Invoices filter by project
- Documents attach to projects

### Rationale
- Simpler mental model for users
- Mirrors how contractors think (by job)
- Enables project-level reporting

---

## DEC-005: Inventory Status Indicators

**Date:** 2024-12-22  
**Status:** Decided

### Context
Need to display product availability in a way that's clear and actionable.

### Decision
Implement **4 inventory states** with color-coded badges:

| Status | Label | Color | Use Case |
|--------|-------|-------|----------|
| `in_stock` | In Stock | Green (#22c55e) | Available for immediate purchase |
| `low_stock` | Low Stock | Amber (#f59e0b) | Available but limited quantity |
| `ship_to_store` | Ship to Store | Blue (#3b82f6) | Can order, ships from warehouse |
| `unavailable` | Not Available | Gray (#9ca3af) | Cannot purchase, disabled button |

### Rationale
- Clear visual hierarchy with color coding
- Actionable states (blue indicates action possible, gray does not)
- Matches LBM industry needs (ship-to-store is common)

---

## DEC-006: Mock JSON Data Layer

**Date:** 2024-12-22  
**Status:** Decided

### Context
Need product data for frontend development before backend exists.

### Decision
Create `data/products.json` with:
- 30 mock products across 6 categories
- Both retail and pro pricing
- Full product specs and dimensions
- Inventory status for each product

### Rationale
- Enables full frontend testing without backend
- JSON structure mirrors future API response format
- Easy to swap for real API calls later (just change fetch URL)

---

## DEC-007: Vanilla-Plus Frontend Architecture

**Date:** 2024-12-22  
**Status:** Decided

### Context
Need a scalable, maintainable frontend architecture that avoids framework lock-in while enabling component reuse.

### Decision
Adopt **"Vanilla-Plus" architecture** with:
- **ES Modules** — Native `import/export` with `type="module"` scripts
- **Web Components** — Custom elements (`lb-*` prefix) for reusable UI
- **Tailwind CSS** — Utility-first styling (future CDN add)
- **Zero Runtime Dependencies** — No React, Vue, jQuery
- **Service Modules** — Singleton classes for state (cart, auth, api)

### Implementation
Created `/.system-docs/` as Source of Truth:
- `architecture-standards.md` — Core rules and patterns
- `component-registry.json` — Maps 20 UI elements to target Web Components
- `api-schema-mapping.json` — Formalizes mock JSON as API contracts

### Rationale
- Zero build step = fast iteration, simple deployment
- Web Components = framework-agnostic, future-proof
- Clear migration path from current IIFE scripts
- Documentation enables agentic development

---

## DEC-008: First Web Component Implementation

**Date:** 2024-12-23  
**Status:** Implemented

### Context
Beginning migration from IIFE scripts to Vanilla-Plus architecture (DEC-007).

### Decision
Implemented Phase 1 of migration:
- `src/services/api.js` — Fetch wrapper
- `src/services/cart.js` — Cart state with subscriber pattern
- `src/components/lb-inventory-badge.js` — First Web Component
- `src/components/lb-toast.js` — Notification component
- `src/components/lb-product-card.js` — Product card with cart integration
- `src/app.js` — ES Module entry point

### Rationale
- Non-breaking: existing `products.js` still works alongside new modules
- Enables gradual migration of other components
- Cart now uses proper subscriber pattern for state updates

---

## Open Questions

- **Q1:** Should we support multiple accounts per user (e.g., personal + business)?
- **Q2:** How to handle guest checkout for retail customers?
- **Q3:** What ERP integration method: direct API or TOOLBX middleware?

