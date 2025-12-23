// ========================================
// LUMBER BOSS - INVENTORY BADGE COMPONENT
// <lb-inventory-badge status="in_stock">
// ========================================

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
        const config = {
            in_stock: { label: 'In Stock', color: '#22c55e' },
            low_stock: { label: 'Low Stock', color: '#f59e0b' },
            ship_to_store: { label: 'Ship to Store', color: '#3b82f6' },
            unavailable: { label: 'Not Available', color: '#9ca3af' }
        };

        const { label, color } = config[this.status] || config.in_stock;

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          background: ${color}20;
          color: ${color};
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${color};
        }
      </style>
      <span class="badge">
        <span class="dot"></span>
        ${label}
      </span>
    `;
    }
}

customElements.define('lb-inventory-badge', LbInventoryBadge);
