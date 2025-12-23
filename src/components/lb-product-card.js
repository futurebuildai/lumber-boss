// ========================================
// LUMBER BOSS - PRODUCT CARD COMPONENT
// <lb-product-card sku="2X4-8-SPF">
// ========================================

import { cart } from '../services/cart.js';
import LbToast from './lb-toast.js';

export default class LbProductCard extends HTMLElement {
    static get observedAttributes() {
        return ['sku', 'variant'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._product = null;
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get sku() {
        return this.getAttribute('sku');
    }

    get variant() {
        return this.getAttribute('variant') || 'default';
    }

    /**
     * Set product data directly (alternative to SKU fetch)
     * @param {Object} product
     */
    set product(product) {
        this._product = product;
        this.render();
    }

    get product() {
        return this._product;
    }

    handleAddToCart(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this._product || this._product.inventory_status === 'unavailable') {
            return;
        }

        cart.add(this._product, 1);
        LbToast.show(`${this._product.name} added to cart`, 'success');

        // Dispatch custom event for external listeners
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            bubbles: true,
            detail: { product: this._product, quantity: 1 }
        }));
    }

    render() {
        if (!this._product) {
            this.shadowRoot.innerHTML = `
        <style>
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            background: #f1f5f9;
            border-radius: 8px;
            color: #94a3b8;
            font-family: 'Inter', sans-serif;
          }
        </style>
        <div class="loading">Loading...</div>
      `;
            return;
        }

        const p = this._product;
        const isUnavailable = p.inventory_status === 'unavailable';

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
        .image {
          height: 160px;
          background: ${p.image_gradient || 'linear-gradient(135deg, #cbd5e1, #94a3b8)'};
        }
        .info {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .brand {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #f97316;
          margin-bottom: 4px;
        }
        .name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        .sku {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .pricing {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 4px;
        }
        .price {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .unit {
          font-size: 13px;
          color: #64748b;
        }
        .pro-price {
          font-size: 12px;
          color: #f97316;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .add-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #1e293b;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }
        .add-btn:hover:not(:disabled) {
          background: #f97316;
          transform: scale(1.1);
        }
        .add-btn:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }
      </style>
      <a href="product.html?sku=${p.sku}" class="card">
        <div class="image"></div>
        <div class="info">
          <span class="brand">${p.brand}</span>
          <h3 class="name">${p.name}</h3>
          <span class="sku">SKU: ${p.sku}</span>
          <div class="pricing">
            <span class="price">$${p.price.toFixed(2)}</span>
            <span class="unit">/${p.unit}</span>
          </div>
          <span class="pro-price">Pro: $${p.proPrice.toFixed(2)}</span>
          <div class="footer">
            <lb-inventory-badge status="${p.inventory_status}"></lb-inventory-badge>
            <button class="add-btn" ${isUnavailable ? 'disabled' : ''} title="Add to Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </a>
    `;

        // Attach event listener to button
        const btn = this.shadowRoot.querySelector('.add-btn');
        if (btn) {
            btn.addEventListener('click', (e) => this.handleAddToCart(e));
        }
    }
}

customElements.define('lb-product-card', LbProductCard);
