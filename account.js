/**
 * Lumber Boss - Account Portal JavaScript
 * Handles navigation, tab switching, and interactive features
 */

document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // Section Navigation
    // ========================================
    const navItems = document.querySelectorAll('.account-nav-item');
    const sections = document.querySelectorAll('.account-section');
    const sectionLinks = document.querySelectorAll('[data-section]');

    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));

        // Remove active from all nav items
        navItems.forEach(item => item.classList.remove('active'));

        // Show target section
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Set active nav item
        const activeNavItem = document.querySelector(`.account-nav-item[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update URL hash
        history.pushState(null, null, `#${sectionId}`);
    }

    // Handle nav item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });

    // Handle section links (e.g., "View All" links)
    sectionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });

    // Handle initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(initialHash);
    }

    // Handle browser back/forward
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.substring(1) || 'overview';
        showSection(hash);
    });

    // ========================================
    // Billing Tabs
    // ========================================
    const billingTabs = document.querySelectorAll('.billing-tab');
    const billingContents = document.querySelectorAll('.billing-content');

    billingTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            // Remove active from all tabs
            billingTabs.forEach(t => t.classList.remove('active'));
            billingContents.forEach(c => c.classList.remove('active'));

            // Activate clicked tab
            this.classList.add('active');
            document.getElementById(`billing-${tabId}`).classList.add('active');
        });
    });

    // ========================================
    // Filter Chips
    // ========================================
    document.querySelectorAll('.filter-chips').forEach(chipGroup => {
        const chips = chipGroup.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', function () {
                chips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                // In a real app, this would trigger a filter action
                console.log(`Filter: ${this.textContent.trim()}`);
            });
        });
    });

    // ========================================
    // Invoice Selection
    // ========================================
    const invoiceCheckboxes = document.querySelectorAll('.invoice-checkbox');
    const selectedCount = document.querySelector('.selected-count');
    const paySelectedBtn = document.querySelector('.bulk-actions .btn-primary');

    function updateInvoiceSelection() {
        const checked = document.querySelectorAll('.invoice-checkbox:checked');
        const count = checked.length;

        if (selectedCount) {
            selectedCount.textContent = `${count} selected`;
        }

        if (paySelectedBtn) {
            paySelectedBtn.disabled = count === 0;

            // Calculate total
            let total = 0;
            checked.forEach(checkbox => {
                const row = checkbox.closest('.invoice-row');
                const amountText = row.querySelector('.invoice-amount').textContent;
                total += parseFloat(amountText.replace(/[$,]/g, ''));
            });

            if (count > 0) {
                paySelectedBtn.textContent = `Pay Selected ($${total.toLocaleString('en-US', { minimumFractionDigits: 2 })})`;
            } else {
                paySelectedBtn.textContent = 'Pay Selected';
            }
        }
    }

    invoiceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateInvoiceSelection);
    });

    // ========================================
    // Quick Actions
    // ========================================
    document.querySelectorAll('.quick-action').forEach(action => {
        action.addEventListener('click', function () {
            const actionText = this.textContent.trim();

            switch (actionText) {
                case 'Pay Balance':
                    alert('Payment modal would open here.\n\nBalance Due: $15,300.00');
                    break;
                case 'Request Estimate':
                    alert('Estimate request form would open here.');
                    break;
                case 'Reorder Last':
                    if (window.showToast) {
                        window.showToast('Last order items added to cart', 'success');
                    } else {
                        alert('Last order items added to cart!');
                    }
                    break;
                case 'Get Support':
                    window.location.href = 'tel:5551234567';
                    break;
            }
        });
    });

    // ========================================
    // Pay Now Button
    // ========================================
    const payBalanceBtn = document.getElementById('pay-balance-btn');
    if (payBalanceBtn) {
        payBalanceBtn.addEventListener('click', function () {
            alert('Payment modal would open here.\n\nTotal Balance Due: $15,300.00\n\nPayment methods:\n• Visa ending in 2689 (default)\n• Add new card\n• ACH bank transfer');
        });
    }

    // Individual invoice pay buttons
    document.querySelectorAll('.invoice-row .btn-cta').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('.invoice-row');
            const invoiceNum = row.querySelector('.invoice-number').textContent;
            const amount = row.querySelector('.invoice-amount').textContent;
            alert(`Pay Invoice ${invoiceNum}\n\nAmount: ${amount}\n\nPayment would be processed here.`);
        });
    });

    // ========================================
    // Estimate Actions
    // ========================================
    document.querySelectorAll('.estimate-actions .btn-cta').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.estimate-card');
            const estNum = card.querySelector('.estimate-number').textContent;
            const total = card.querySelector('.total-value').textContent;

            if (confirm(`Convert ${estNum} to Order?\n\nTotal: ${total}\n\nThis will add all items to your cart and proceed to checkout.`)) {
                if (window.showToast) {
                    window.showToast('Estimate converted to order', 'success');
                }
                // In real app: redirect to checkout
            }
        });
    });

    // Markup & Share button
    document.querySelectorAll('.estimate-actions .btn-outline').forEach(btn => {
        if (btn.textContent.includes('Markup')) {
            btn.addEventListener('click', function () {
                const markup = prompt('Enter markup percentage:', '15');
                if (markup) {
                    const card = this.closest('.estimate-card');
                    const total = parseFloat(card.querySelector('.total-value').textContent.replace(/[$,]/g, ''));
                    const newTotal = total * (1 + parseFloat(markup) / 100);
                    alert(`New total with ${markup}% markup: $${newTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\nShare link copied to clipboard!`);
                }
            });
        }
    });

    // ========================================
    // Order Reorder Buttons
    // ========================================
    document.querySelectorAll('.order-row .btn-outline').forEach(btn => {
        if (btn.textContent.includes('Reorder')) {
            btn.addEventListener('click', function () {
                const row = this.closest('.order-row');
                const orderNum = row.querySelector('.order-number').textContent;

                if (window.showToast) {
                    window.showToast(`${orderNum} items added to cart`, 'success');
                } else {
                    alert(`${orderNum} items added to cart!`);
                }
            });
        }
    });

    // ========================================
    // New Project Button
    // ========================================
    const newProjectBtn = document.getElementById('new-project-btn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function () {
            const name = prompt('Project Name:', '');
            if (name) {
                const address = prompt('Project Address:', '');
                alert(`Project "${name}" created!\n\nAddress: ${address || 'Not specified'}\n\nYou can now assign orders to this project.`);
            }
        });
    }

    // ========================================
    // Mobile Sidebar Toggle
    // ========================================
    const sidebar = document.getElementById('account-sidebar');
    const menuToggle = document.getElementById('menu-toggle');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function (e) {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ========================================
    // Sign Out
    // ========================================
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to sign out?')) {
                // In real app: clear session, redirect to login
                window.location.href = '/';
            }
        });
    }
});
