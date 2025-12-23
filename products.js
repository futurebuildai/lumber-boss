/* ========================================
   LUMBER BOSS - PRODUCTS PAGE JAVASCRIPT
   Product Listing & Filtering
   ======================================== */

// State Management
let allProducts = [];
let allCategories = [];
let filteredProducts = [];
let currentFilters = {
  category: 'all',
  search: '',
  availability: ['in_stock', 'low_stock', 'ship_to_store'],
  brands: [],
  priceMin: null,
  priceMax: null,
  sort: 'name-asc'
};

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoryPills = document.getElementById('category-pills');
const searchInput = document.getElementById('search-input');
const productCount = document.getElementById('product-count');
const sortSelect = document.getElementById('sort-select');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const breadcrumbCategory = document.getElementById('breadcrumb-category');
const filtersSidebar = document.getElementById('filters-sidebar');
const filtersToggle = document.getElementById('filters-toggle');
const filtersClear = document.getElementById('filters-clear');
const clearFiltersBtn = document.getElementById('clear-filters-btn');
const brandFilter = document.getElementById('brand-filter');
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  showLoading(true);
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  
  if (categoryParam) {
    currentFilters.category = categoryParam;
  }
  if (searchParam) {
    currentFilters.search = searchParam;
    searchInput.value = searchParam;
  }
  
  try {
    await loadProducts();
    renderCategoryPills();
    renderBrandFilters();
    applyFilters();
    setupEventListeners();
    updatePageHeader();
  } catch (error) {
    console.error('Error initializing products:', error);
    showError();
  }
  
  showLoading(false);
}

// Load Products from JSON
async function loadProducts() {
  const response = await fetch('data/products.json');
  if (!response.ok) {
    throw new Error('Failed to load products');
  }
  const data = await response.json();
  allProducts = data.products;
  allCategories = data.categories;
}

// Render Category Pills
function renderCategoryPills() {
  const allPill = categoryPills.querySelector('[data-category="all"]');
  
  allCategories.forEach(category => {
    const pill = document.createElement('button');
    pill.className = 'category-pill';
    pill.dataset.category = category.id;
    pill.textContent = category.name;
    
    if (currentFilters.category === category.id) {
      pill.classList.add('active');
      allPill.classList.remove('active');
    }
    
    categoryPills.appendChild(pill);
  });
}

// Render Brand Filters
function renderBrandFilters() {
  const brands = [...new Set(allProducts.map(p => p.brand))].sort();
  const container = brandFilter.querySelector('.filter-options');
  
  brands.forEach(brand => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    label.innerHTML = `
      <input type="checkbox" value="${brand}">
      <span class="checkmark"></span>
      <span class="label-text">${brand}</span>
    `;
    container.appendChild(label);
  });
}

// Apply Filters
function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    // Category filter
    if (currentFilters.category !== 'all' && product.category !== currentFilters.category) {
      return false;
    }
    
    // Search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesSku = product.sku.toLowerCase().includes(searchLower);
      const matchesBrand = product.brand.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesSku && !matchesBrand) {
        return false;
      }
    }
    
    // Availability filter
    if (!currentFilters.availability.includes(product.inventory_status)) {
      return false;
    }
    
    // Brand filter
    if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) {
      return false;
    }
    
    // Price filter
    if (currentFilters.priceMin !== null && product.price < currentFilters.priceMin) {
      return false;
    }
    if (currentFilters.priceMax !== null && product.price > currentFilters.priceMax) {
      return false;
    }
    
    return true;
  });
  
  // Sort
  sortProducts();
  
  // Render
  renderProducts();
  updateProductCount();
}

// Sort Products
function sortProducts() {
  const [field, direction] = currentFilters.sort.split('-');
  
  filteredProducts.sort((a, b) => {
    let valueA, valueB;
    
    if (field === 'name') {
      valueA = a.name.toLowerCase();
      valueB = b.name.toLowerCase();
    } else if (field === 'price') {
      valueA = a.price;
      valueB = b.price;
    }
    
    if (direction === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
}

// Render Products
function renderProducts() {
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  productGrid.innerHTML = filteredProducts.map(product => `
    <a href="product.html?sku=${product.sku}" class="product-card">
      <div class="product-image">
        <div class="product-image-gradient" style="background: ${product.image_gradient};"></div>
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-sku">SKU: ${product.sku}</span>
        <div class="product-pricing">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="product-unit">/${product.unit}</span>
        </div>
        <span class="product-pro-price">Pro: $${product.proPrice.toFixed(2)}</span>
        <div class="product-footer">
          ${getInventoryBadge(product.inventory_status)}
          <button class="add-to-cart-btn" onclick="addToCart(event, '${product.sku}')" 
            ${product.inventory_status === 'unavailable' ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </a>
  `).join('');
}

// Get Inventory Badge HTML
function getInventoryBadge(status) {
  const labels = {
    'in_stock': 'In Stock',
    'low_stock': 'Low Stock',
    'ship_to_store': 'Ship to Store',
    'unavailable': 'Not Available'
  };
  
  return `<span class="inventory-badge ${status}">${labels[status]}</span>`;
}

// Update Product Count
function updateProductCount() {
  productCount.textContent = filteredProducts.length;
}

// Update Page Header
function updatePageHeader() {
  if (currentFilters.category !== 'all') {
    const category = allCategories.find(c => c.id === currentFilters.category);
    if (category) {
      pageTitle.textContent = category.name;
      pageSubtitle.textContent = category.description;
      breadcrumbCategory.textContent = category.name;
      document.title = `${category.name} | Lumber Boss`;
    }
  } else {
    pageTitle.textContent = 'All Products';
    pageSubtitle.textContent = 'Browse our complete catalog of building materials';
    breadcrumbCategory.textContent = 'Products';
    document.title = 'Products | Lumber Boss';
  }
}

// Show Loading State
function showLoading(show) {
  loadingState.style.display = show ? 'block' : 'none';
  productGrid.style.display = show ? 'none' : 'grid';
}

// Show Error
function showError() {
  productGrid.innerHTML = '';
  emptyState.querySelector('h3').textContent = 'Error loading products';
  emptyState.querySelector('p').textContent = 'Please try refreshing the page';
  emptyState.style.display = 'block';
}

// Setup Event Listeners
function setupEventListeners() {
  // Category pills
  categoryPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-pill')) {
      // Update active state
      categoryPills.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
      });
      e.target.classList.add('active');
      
      // Update filter
      currentFilters.category = e.target.dataset.category;
      
      // Update URL
      updateURL();
      updatePageHeader();
      applyFilters();
    }
  });
  
  // Search input
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilters.search = e.target.value;
      updateURL();
      applyFilters();
    }, 300);
  });
  
  // Sort select
  sortSelect.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    applyFilters();
  });
  
  // Availability checkboxes
  document.querySelectorAll('.filter-group .filter-checkbox input').forEach(checkbox => {
    if (['in_stock', 'low_stock', 'ship_to_store', 'unavailable'].includes(checkbox.value)) {
      checkbox.addEventListener('change', () => {
        updateAvailabilityFilter();
        applyFilters();
      });
    }
  });
  
  // Brand checkboxes (delegated)
  brandFilter.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      updateBrandFilter();
      applyFilters();
    }
  });
  
  // Price inputs
  let priceTimeout;
  [priceMin, priceMax].forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(priceTimeout);
      priceTimeout = setTimeout(() => {
        currentFilters.priceMin = priceMin.value ? parseFloat(priceMin.value) : null;
        currentFilters.priceMax = priceMax.value ? parseFloat(priceMax.value) : null;
        applyFilters();
      }, 500);
    });
  });
  
  // Filters toggle (mobile)
  filtersToggle.addEventListener('click', () => {
    filtersSidebar.classList.toggle('open');
    document.body.style.overflow = filtersSidebar.classList.contains('open') ? 'hidden' : '';
  });
  
  // Clear filters
  filtersClear.addEventListener('click', clearAllFilters);
  clearFiltersBtn.addEventListener('click', clearAllFilters);
  
  // Mobile nav toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      mobileNavOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }
  
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }
}

function closeMobileNav() {
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Update Availability Filter
function updateAvailabilityFilter() {
  const checkboxes = document.querySelectorAll('.filter-group .filter-checkbox input');
  currentFilters.availability = [];
  
  checkboxes.forEach(checkbox => {
    if (['in_stock', 'low_stock', 'ship_to_store', 'unavailable'].includes(checkbox.value)) {
      if (checkbox.checked) {
        currentFilters.availability.push(checkbox.value);
      }
    }
  });
}

// Update Brand Filter
function updateBrandFilter() {
  const checkboxes = brandFilter.querySelectorAll('input[type="checkbox"]');
  currentFilters.brands = [];
  
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      currentFilters.brands.push(checkbox.value);
    }
  });
}

// Clear All Filters
function clearAllFilters() {
  // Reset filters
  currentFilters = {
    category: 'all',
    search: '',
    availability: ['in_stock', 'low_stock', 'ship_to_store'],
    brands: [],
    priceMin: null,
    priceMax: null,
    sort: 'name-asc'
  };
  
  // Reset UI
  searchInput.value = '';
  sortSelect.value = 'name-asc';
  priceMin.value = '';
  priceMax.value = '';
  
  // Reset category pills
  categoryPills.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.remove('active');
    if (pill.dataset.category === 'all') {
      pill.classList.add('active');
    }
  });
  
  // Reset availability checkboxes
  document.querySelectorAll('.filter-group .filter-checkbox input').forEach(checkbox => {
    if (['in_stock', 'low_stock', 'ship_to_store'].includes(checkbox.value)) {
      checkbox.checked = true;
    } else if (checkbox.value === 'unavailable') {
      checkbox.checked = false;
    }
  });
  
  // Reset brand checkboxes
  brandFilter.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Close mobile filters
  filtersSidebar.classList.remove('open');
  document.body.style.overflow = '';
  
  // Update URL and apply
  updateURL();
  updatePageHeader();
  applyFilters();
}

// Update URL
function updateURL() {
  const params = new URLSearchParams();
  
  if (currentFilters.category !== 'all') {
    params.set('category', currentFilters.category);
  }
  if (currentFilters.search) {
    params.set('search', currentFilters.search);
  }
  
  const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newURL);
}

// Add to Cart
function addToCart(event, sku) {
  event.preventDefault();
  event.stopPropagation();
  
  const product = allProducts.find(p => p.sku === sku);
  if (!product) return;
  
  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem('lumberBossCart') || '[]');
  
  // Check if product already in cart
  const existingIndex = cart.findIndex(item => item.sku === sku);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      sku: product.sku,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('lumberBossCart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();
  
  // Show feedback
  showAddToCartFeedback(event.currentTarget);
}

// Update Cart Count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('lumberBossCart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// Show Add to Cart Feedback
function showAddToCartFeedback(button) {
  const originalHTML = button.innerHTML;
  button.innerHTML = '✓';
  button.style.background = '#22c55e';
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.style.background = '';
  }, 1000);
}

// Initialize cart count on load
updateCartCount();
