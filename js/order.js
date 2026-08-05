// Order / quote request page JavaScript

(function() {
    'use strict';

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePhone(phone) {
        return /^(\+234|0)[0-9]{10}$/.test(phone.replace(/\s+/g, ''));
    }

    const embeddedProducts = [
        { id: 1, title: "Business Cards" },
        { id: 2, title: "Ad Cards & Flyers" },
        { id: 3, title: "Business Info Cards" },
        { id: 4, title: "Invitation Cards" },
        { id: 5, title: "Postcards" },
        { id: 6, title: "Loyalty & Membership Cards" },
        { id: 7, title: "Greeting Cards" },
        { id: 8, title: "Custom Printed Cards" }
    ];

    async function loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed');
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            return embeddedProducts;
        }
    }

    function populateProductSelect(products) {
        const select = document.getElementById('productSelect');
        if (!select) return;
        products.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.title;
            select.appendChild(opt);
        });

        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId) {
            select.value = productId;
            const hidden = document.getElementById('productInterest');
            const prod = products.find(p => String(p.id) === String(productId));
            if (hidden) hidden.value = prod ? 'Product: ' + prod.title + ' (ID ' + prod.id + ')' : 'Product ID: ' + productId;
        }
    }

    function initForm() {
        const form = document.getElementById('orderForm');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (emailInput) emailInput.addEventListener('blur', function() {
            const v = this.value.trim();
            if (v && !validateEmail(v)) this.classList.add('border-red-500'); else this.classList.remove('border-red-500');
        });
        if (phoneInput) phoneInput.addEventListener('blur', function() {
            const v = this.value.trim();
            if (v && !validatePhone(v)) this.classList.add('border-red-500'); else this.classList.remove('border-red-500');
        });

        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const email = emailInput.value.trim();
                const phone = phoneInput.value.trim();

                if (!validateEmail(email)) {
                    alert('Please enter a valid email address.');
                    emailInput.classList.add('border-red-500');
                    emailInput.focus();
                    return;
                }
                if (phone && !validatePhone(phone)) {
                    alert('Please enter a valid phone number (e.g., +234XXXXXXXXXX).');
                    phoneInput.classList.add('border-red-500');
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                if (typeof showLoader === 'function') showLoader();

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        alert('Thank you! Your quote request has been sent. We will get back to you within 24 hours.');
                        form.reset();
                    } else {
                        alert('There was a problem sending your request. Please try again or contact us directly.');
                    }
                } catch (error) {
                    alert('There was a problem sending your request. Please try again or contact us directly.');
                } finally {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    if (typeof hideLoader === 'function') setTimeout(hideLoader, 1200);
                }
            });
        }
    }

    async function init() {
        const products = await loadProducts();
        populateProductSelect(products);
        initForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
