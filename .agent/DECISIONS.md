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

## Open Questions

- **Q1:** Should we support multiple accounts per user (e.g., personal + business)?
- **Q2:** How to handle guest checkout for retail customers?
- **Q3:** What ERP integration method: direct API or TOOLBX middleware?
