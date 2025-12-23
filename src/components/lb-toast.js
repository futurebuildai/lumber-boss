// ========================================
// LUMBER BOSS - TOAST COMPONENT
// <lb-toast message="Added to cart" type="success">
// ========================================

export default class LbToast extends HTMLElement {
    static get observedAttributes() {
        return ['message', 'type', 'duration'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._timeout = null;
    }

    connectedCallback() {
        this.render();
        this.show();
    }

    disconnectedCallback() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    get message() {
        return this.getAttribute('message') || '';
    }

    get type() {
        return this.getAttribute('type') || 'info';
    }

    get duration() {
        return parseInt(this.getAttribute('duration') || '3000', 10);
    }

    show() {
        // Auto-dismiss after duration
        if (this.duration > 0) {
            this._timeout = setTimeout(() => {
                this.dismiss();
            }, this.duration);
        }
    }

    dismiss() {
        const toast = this.shadowRoot.querySelector('.toast');
        if (toast) {
            toast.classList.add('hiding');
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('dismiss'));
                this.remove();
            }, 300);
        }
    }

    render() {
        const colors = {
            info: { bg: '#3b82f6', icon: 'ℹ️' },
            success: { bg: '#22c55e', icon: '✓' },
            warning: { bg: '#f59e0b', icon: '⚠' },
            error: { bg: '#ef4444', icon: '✕' }
        };

        const { bg, icon } = colors[this.type] || colors.info;

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: ${bg};
          color: white;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease;
          cursor: pointer;
        }
        .toast.hiding {
          animation: slideOut 0.3s ease forwards;
        }
        .icon {
          font-size: 18px;
        }
        .close {
          margin-left: 8px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .close:hover {
          opacity: 1;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      </style>
      <div class="toast" role="alert">
        <span class="icon">${icon}</span>
        <span class="message">${this.message}</span>
        <span class="close" onclick="this.getRootNode().host.dismiss()">✕</span>
      </div>
    `;
    }

    /**
     * Static helper to show a toast
     * @param {string} message
     * @param {string} type - info, success, warning, error
     * @param {number} duration - ms
     */
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('lb-toast');
        toast.setAttribute('message', message);
        toast.setAttribute('type', type);
        toast.setAttribute('duration', duration.toString());
        document.body.appendChild(toast);
        return toast;
    }
}

customElements.define('lb-toast', LbToast);
