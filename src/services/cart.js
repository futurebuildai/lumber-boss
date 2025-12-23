// ========================================
// LUMBER BOSS - CART SERVICE
// State management with localStorage
// ========================================

const STORAGE_KEY = 'lumberBossCart';

class CartService {
    #items = [];
    #listeners = new Set();

    constructor() {
        this.#load();
    }

    /**
     * Load cart from localStorage
     */
    #load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            this.#items = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load cart:', e);
            this.#items = [];
        }
    }

    /**
     * Save cart to localStorage and notify listeners
     */
    #save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#items));
        this.#notify();
    }

    /**
     * Notify all subscribed listeners of cart changes
     */
    #notify() {
        this.#listeners.forEach(fn => fn(this.#items));
    }

    /**
     * Subscribe to cart changes
     * @param {Function} listener - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        this.#listeners.add(listener);
        // Immediately call with current state
        listener(this.#items);
        return () => this.#listeners.delete(listener);
    }

    /**
     * Add product to cart
     * @param {Object} product - Product object with sku, name, price, unit
     * @param {number} quantity - Quantity to add
     */
    add(product, quantity = 1) {
        const existing = this.#items.find(i => i.sku === product.sku);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.#items.push({
                sku: product.sku,
                name: product.name,
                price: product.price,
                unit: product.unit,
                quantity
            });
        }
        this.#save();
    }

    /**
     * Update quantity for a product
     * @param {string} sku - Product SKU
     * @param {number} quantity - New quantity
     */
    updateQuantity(sku, quantity) {
        const item = this.#items.find(i => i.sku === sku);
        if (item) {
            if (quantity <= 0) {
                this.remove(sku);
            } else {
                item.quantity = quantity;
                this.#save();
            }
        }
    }

    /**
     * Remove product from cart
     * @param {string} sku - Product SKU
     */
    remove(sku) {
        this.#items = this.#items.filter(i => i.sku !== sku);
        this.#save();
    }

    /**
     * Clear all items from cart
     */
    clear() {
        this.#items = [];
        this.#save();
    }

    /**
     * Get all items (returns copy)
     */
    get items() {
        return [...this.#items];
    }

    /**
     * Get total item count
     */
    get count() {
        return this.#items.reduce((sum, i) => sum + i.quantity, 0);
    }

    /**
     * Get cart subtotal
     */
    get subtotal() {
        return this.#items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
}

// Export singleton instance
export const cart = new CartService();
