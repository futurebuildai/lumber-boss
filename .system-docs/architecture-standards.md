# Lumber Boss - Architecture Standards

> **Source of Truth** for all frontend development. AI agents and developers MUST follow these standards.

---

## Core Philosophy: "Vanilla-Plus"

We use a **zero-build, zero-framework** architecture that maximizes simplicity while enabling scalable component patterns.

| Principle | Rule |
|-----------|------|
| **Zero Build Step** | No Webpack, Vite, or bundlers. Files run directly in browser. |
| **Zero Runtime Dependencies** | No React, Vue, jQuery, or external JS libraries. |
| **ES Modules** | Use native `import/export` with `type="module"` scripts. |
| **Web Components** | Custom elements for reusable UI (future migration). |
| **Tailwind CSS** | Utility-first styling via CDN (future migration). |
| **Design Tokens** | CSS custom properties for all colors, spacing, typography. |

---

## Current State vs. Target State

### Current (v1 - Prototype)
```
├── style.css          # Global styles + design tokens
├── products.css       # Page-specific styles
├── account.css        # Page-specific styles
├── main.js            # IIFE, no modules
├── products.js        # IIFE, global functions
├── account.js         # IIFE, event handlers
```

### Target (v2 - Vanilla-Plus)
```
├── src/
│   ├── styles/
│   │   ├── tokens.css         # Design tokens only
│   │   ├── base.css           # Reset, typography, layout
│   │   └── utilities.css      # Utility classes (Tailwind-like)
│   ├── components/
│   │   ├── lb-header.js       # Web Component
│   │   ├── lb-product-card.js # Web Component
│   │   ├── lb-inventory-badge.js
│   │   ├── lb-cart-drawer.js
│   │   └── ...
│   ├── services/
│   │   ├── api.js             # Fetch wrapper
│   │   ├── cart.js            # Cart state management
│   │   └── auth.js            # Auth state management
│   ├── pages/
│   │   ├── products.js        # Page controller
│   │   ├── product.js
│   │   └── account.js
│   └── app.js                 # Entry point, component registration
├── data/
│   └── products.json          # Mock data (mirrors API)
└── index.html, products.html, etc.
```

---

## Naming Conventions

### Files
| Type | Pattern | Example |
|------|---------|---------|
| Web Component | `lb-{name}.js` | `lb-product-card.js` |
| Service Module | `{name}.js` | `cart.js`, `api.js` |
| Page Controller | `{page}.js` | `products.js` |
| CSS Module | `{purpose}.css` | `tokens.css`, `base.css` |

### Custom Elements
All custom elements use the `lb-` prefix (Lumber Boss):
```html
<lb-header></lb-header>
<lb-product-card sku="2X4-8-SPF"></lb-product-card>
<lb-inventory-badge status="in_stock"></lb-inventory-badge>
```

### CSS Custom Properties
```css
/* Colors */
--lb-color-primary: #1e293b;
--lb-color-accent: #f97316;

/* Spacing */
--lb-space-xs: 0.25rem;
--lb-space-sm: 0.5rem;

/* Typography */
--lb-font-heading: 'Space Grotesk', sans-serif;
--lb-font-body: 'Inter', sans-serif;
```

---

## ES Module Standards

### Imports
```javascript
// ✅ Correct: Use relative paths with .js extension
import { CartService } from './services/cart.js';
import { LbProductCard } from './components/lb-product-card.js';

// ❌ Wrong: Bare specifiers (requires bundler)
import { CartService } from 'cart';
```

### Exports
```javascript
// ✅ Named exports for services
export class CartService { ... }
export function formatPrice(amount) { ... }

// ✅ Default export for Web Components
export default class LbProductCard extends HTMLElement { ... }
```

### HTML Script Tags
```html
<!-- ✅ Correct: type="module" for ES modules -->
<script type="module" src="./src/app.js"></script>

<!-- ❌ Wrong: Classic script -->
<script src="./src/app.js"></script>
```

---

## Web Component Pattern

### Template
```javascript
// src/components/lb-inventory-badge.js
export default class LbInventoryBadge extends HTMLElement {
  static get observedAttributes() {
    return ['status'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get status() {
    return this.getAttribute('status') || 'in_stock';
  }

  render() {
    const labels = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      ship_to_store: 'Ship to Store',
      unavailable: 'Not Available'
    };

    const colors = {
      in_stock: '#22c55e',
      low_stock: '#f59e0b',
      ship_to_store: '#3b82f6',
      unavailable: '#9ca3af'
    };

    this.shadowRoot.innerHTML = `
      <style>
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          background: ${colors[this.status]}20;
          color: ${colors[this.status]};
        }
      </style>
      <span class="badge">${labels[this.status]}</span>
    `;
  }
}

customElements.define('lb-inventory-badge', LbInventoryBadge);
```

### Registration
```javascript
// src/app.js
import LbInventoryBadge from './components/lb-inventory-badge.js';
import LbProductCard from './components/lb-product-card.js';
import LbHeader from './components/lb-header.js';

// Components auto-register via customElements.define()
console.log('Lumber Boss components loaded');
```

---

## Service Module Pattern

### State Management
```javascript
// src/services/cart.js
const STORAGE_KEY = 'lumberBossCart';

class CartService {
  #items = [];
  #listeners = new Set();

  constructor() {
    this.#load();
  }

  #load() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.#items = stored ? JSON.parse(stored) : [];
  }

  #save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#items));
    this.#notify();
  }

  #notify() {
    this.#listeners.forEach(fn => fn(this.#items));
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  add(product, quantity = 1) {
    const existing = this.#items.find(i => i.sku === product.sku);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.#items.push({ ...product, quantity });
    }
    this.#save();
  }

  remove(sku) {
    this.#items = this.#items.filter(i => i.sku !== sku);
    this.#save();
  }

  get items() {
    return [...this.#items];
  }

  get count() {
    return this.#items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get total() {
    return this.#items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}

export const cart = new CartService();
```

### API Service
```javascript
// src/services/api.js
const BASE_URL = './data'; // Mock data, will become API URL

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products.json`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProduct(sku) {
  const data = await fetchProducts();
  return data.products.find(p => p.sku === sku);
}

export async function fetchCategories() {
  const data = await fetchProducts();
  return data.categories;
}
```

---

## CSS Standards

### Design Tokens (Required)
All visual properties MUST use CSS custom properties:

```css
/* ✅ Correct */
.button {
  background: var(--lb-color-accent);
  padding: var(--lb-space-md) var(--lb-space-lg);
  border-radius: var(--lb-radius-md);
}

/* ❌ Wrong: Hardcoded values */
.button {
  background: #f97316;
  padding: 16px 24px;
  border-radius: 6px;
}
```

### Scoped Styles
Web Components use Shadow DOM for style encapsulation. Page-level CSS uses BEM-like naming:

```css
/* Component: .component-name */
.product-card { }
.product-card__image { }
.product-card__title { }
.product-card--featured { }
```

---

## Migration Path (Current → Target)

### Phase 1: Extract Services (Non-Breaking)
1. Create `src/services/cart.js` from localStorage logic
2. Create `src/services/api.js` from fetch logic
3. Import services into existing page scripts

### Phase 2: Create Web Components (Incremental)
1. Start with `<lb-inventory-badge>` (small, self-contained)
2. Add `<lb-product-card>` (reused on PLP, PDP, Quick Reorder)
3. Add `<lb-header>` (shared across all pages)

### Phase 3: Adopt Tailwind CSS
1. Add Tailwind CDN to `<head>`
2. Migrate utility classes from `style.css`
3. Keep design tokens as CSS custom properties

---

## Forbidden Patterns

| ❌ DON'T | ✅ DO INSTEAD |
|---------|--------------|
| `document.write()` | DOM manipulation with `innerHTML` or `createElement` |
| `eval()` | Use proper data binding |
| jQuery or Lodash | Native ES6+ methods |
| Global variables | ES Modules with explicit exports |
| Inline `onclick=""` | `addEventListener()` |
| `var` | `const` or `let` |
| `==` | `===` |
| Sync XHR | `fetch()` with async/await |

---

## Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-22 | Initial architecture standards document |
