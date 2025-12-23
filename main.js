/**
 * Lumber Boss - Main JavaScript
 * Handles interactive UI components
 */

document.addEventListener('DOMContentLoaded', function () {
  // ========================================
  // Location Modal
  // ========================================
  const locationModal = document.getElementById('location-modal');
  const locationButtons = locationModal.querySelectorAll('[data-location]');

  // Check if location is already set
  const savedLocation = localStorage.getItem('lumberboss-location');
  if (savedLocation) {
    locationModal.classList.add('hidden');
    updateLocationUI(savedLocation);
  }

  locationButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const location = this.dataset.location;
      localStorage.setItem('lumberboss-location', location);
      locationModal.classList.add('hidden');
      updateLocationUI(location);
    });
  });

  function updateLocationUI(location) {
    // Update location picker buttons
    document.querySelectorAll('.location-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.location === location);
    });

    // Could also update store info, pricing, etc. based on location
    console.log(`Location set to: ${location}`);
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Mobile nav location buttons
  mobileNav.querySelectorAll('[data-location]').forEach(btn => {
    btn.addEventListener('click', function () {
      const location = this.dataset.location;
      localStorage.setItem('lumberboss-location', location);
      updateLocationUI(location);
      closeMobileNav();
    });
  });

  // ========================================
  // Header Location Picker
  // ========================================
  document.querySelectorAll('.location-picker .location-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const location = this.dataset.location;
      localStorage.setItem('lumberboss-location', location);
      updateLocationUI(location);
    });
  });

  // ========================================
  // Search Bar
  // ========================================
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          // In a real TOOLBX integration, this would:
          // 1. Call the product search API
          // 2. Navigate to a search results page
          console.log(`Searching for: ${query}`);
          alert(`Search functionality would query TOOLBX API for: "${query}"`);
        }
      }
    });
  }

  // ========================================
  // Sign In (Pro Account)
  // ========================================
  document.querySelectorAll('[data-action="sign-in"]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      // In a real TOOLBX integration, this would:
      // 1. Open a sign-in modal or redirect to login page
      // 2. Handle OAuth or credential-based auth
      // 3. Store session token
      alert('Pro Account Sign-In\n\nThis would connect to the TOOLBX Pro Portal for:\n- Account management\n- Invoice viewing & payment\n- Order history\n- Volume pricing');
    });
  });

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========================================
  // Cart Functionality (Mock)
  // ========================================
  const cartCount = document.querySelector('.cart-count');

  // Mock function to add item to cart
  window.addToCart = function (productId, quantity = 1) {
    // In a real TOOLBX integration:
    // 1. POST to cart API with product ID and quantity
    // 2. ERP would validate inventory and pricing
    // 3. Update cart state

    let currentCount = parseInt(cartCount.textContent) || 0;
    currentCount += quantity;
    cartCount.textContent = currentCount;

    // Visual feedback
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartCount.style.transform = 'scale(1)';
    }, 200);

    console.log(`Added product ${productId} to cart. Quantity: ${quantity}`);
  };

  // ========================================
  // Quick Reorder Functionality
  // ========================================

  // Reorder a single item
  window.reorderItem = function (productId, quantity) {
    // In a real implementation:
    // 1. POST /api/cart/items with productId and quantity
    // 2. Show success toast
    // 3. Update cart count

    addToCart(productId, quantity);

    // Show success feedback
    showToast(`Added ${quantity} items to cart`, 'success');
  };

  // Reorder all recent items
  const reorderAllBtn = document.getElementById('reorder-all-btn');
  if (reorderAllBtn) {
    reorderAllBtn.addEventListener('click', function () {
      const recentCards = document.querySelectorAll('.recent-order-card');
      let totalItems = 0;

      recentCards.forEach(card => {
        const productId = card.dataset.productId;
        const quantityMatch = card.querySelector('.recent-order-meta').textContent.match(/Qty: (\d+)/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

        addToCart(productId, quantity);
        totalItems += quantity;
      });

      showToast(`Added ${totalItems} items from ${recentCards.length} products to cart`, 'success');
    });
  }

  // Toast notification system
  window.showToast = function (message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ========================================
  // Intersection Observer for Animations
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards for scroll animations
  document.querySelectorAll('.category-card, .showroom-card, .service-card').forEach(card => {
    observer.observe(card);
  });

  // ========================================
  // Keyboard Navigation
  // ========================================
  document.addEventListener('keydown', function (e) {
    // Close mobile nav on Escape
    if (e.key === 'Escape') {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
      if (!locationModal.classList.contains('hidden')) {
        // Don't close location modal with Escape - user must choose
      }
    }
  });
});
