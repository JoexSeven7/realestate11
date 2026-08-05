// Main JavaScript for AY-PRINT website

// Global products data for homepage
let productsData = [];

// ============================================
// SECURITY UTILITIES
// ============================================

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ============================================
// INPUT VALIDATION
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(\+234|0)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function validateEmailInput(inputElement) {
    const email = inputElement.value.trim();
    const isValid = validateEmail(email);
    if (!isValid && email) {
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    }
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
    return true;
}

function validatePhoneInput(inputElement) {
    const phone = inputElement.value.trim();
    const isValid = validatePhone(phone);
    if (!isValid && phone) {
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    }
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
    return true;
}

// ============================================
// LOADING OVERLAY — brand-consistent design
// ============================================

const _BRAND = { primary: '#1e3a8a', secondary: '#db2777' };

function createLoadingOverlay() {
    if (document.getElementById('loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-atomic', 'true');
    overlay.innerHTML = `
        <div class="fixed inset-0 z-[9999] hidden flex items-center justify-center"
             style="background:rgba(30,58,138,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
            <div class="flex flex-col items-center gap-8 loader-enter">
                <div class="relative w-20 h-20">
                    <div class="absolute inset-0 rounded-full"
                         style="background:linear-gradient(135deg,#1e3a8a,#db2777);
                                animation:loader-breathe 2s ease-in-out infinite;"></div>
                    <div class="absolute inset-[4px] rounded-full bg-[#1e3a8a]/80"></div>
                    <div class="absolute inset-[4px] rounded-full"
                         style="border:3px solid transparent;
                                border-top-color:#db2777;
                                border-right-color:#db2777;
                                animation:loader-spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite;"></div>
                </div>
                <p class="text-white text-lg font-medium tracking-[0.25em] uppercase"
                   style="font-family:inherit;">
                    AY-PRINT<span class="loading-dots"></span>
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    if (!document.getElementById('loading-dots-style')) {
        const style = document.createElement('style');
        style.id = 'loading-dots-style';
        style.textContent = `
            .loading-dots::after {
                content: '';
                animation: loading-dots 1.6s steps(4,end) infinite;
            }
            @keyframes loading-dots {
                0%,20%  { content:''; }
                40%     { content:'.'; }
                60%     { content:'..'; }
                80%,100%{ content:'...'; }
            }
            .loader-enter {
                animation: loader-enter 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
            }
            @keyframes loader-enter {
                from { opacity:0; transform:scale(0.85) translateY(12px); }
                to   { opacity:1; transform:scale(1)   translateY(0);   }
            }
            @keyframes loader-spin {
                0%   { transform:rotate(0deg);   }
                100% { transform:rotate(360deg); }
            }
            @keyframes loader-breathe {
                0%,100% { opacity:0.6; transform:scale(1);   }
                50%     { opacity:1;   transform:scale(1.04); }
            }
        `;
        document.head.appendChild(style);
    }
}

function showLoader() {
    const el = document.getElementById('loading-overlay');
    if (el) {
        const inner = el.querySelector('div');
        inner.classList.remove('hidden');
        inner.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoader() {
    const el = document.getElementById('loading-overlay');
    if (el) {
        el.querySelector('div').classList.add('hidden');
        document.body.style.overflow = '';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLoadingOverlay);
} else {
    createLoadingOverlay();
}

// ============================================
// INTERNAL LINK NAVIGATION WITH LOADER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="."], a[href^="/"], a[href^="index.html"], a[href^="products.html"], a[href^="product-detail.html"], a[href^="order.html"], a[href^="about.html"], a[href^="contact.html"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.target === '_blank' || this.hasAttribute('download')) return;
            if (this.classList.contains('no-loader')) return;
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) return;

            e.preventDefault();
            showLoader();
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 800);
        });
    });
});

window.addEventListener('load', function() {
    setTimeout(hideLoader, 500);
});

// ============================================
// EMBEDDED FALLBACK DATA (kept in sync with data/products.json)
// ============================================
const embeddedProductsData = [
    { "id": 1, "title": "Business Cards", "slug": "business-cards", "category": "business", "material": "350gsm Art Paper", "size": "85 x 55 mm", "finish": "Matte / Gloss", "minOrder": 100, "turnaround": "2-3 business days", "priceFrom": 5000, "priceDisplay": "From ₦5,000 / 100 pcs", "features": ["double-sided", "full colour", "free design"], "image": "images/house1.jpeg", "images": ["images/house1.jpeg","images/house2.jpeg","images/build1.jpeg"], "description": "Make a lasting first impression with premium business cards printed on thick 350gsm art paper.", "featured": true, "createdAt": "2024-03-01" },
    { "id": 2, "title": "Ad Cards & Flyers", "slug": "ad-cards-flyers", "category": "ad", "material": "300gsm Art Paper", "size": "A6 / A5 / A4", "finish": "Matte", "minOrder": 50, "turnaround": "2-4 business days", "priceFrom": 8000, "priceDisplay": "From ₦8,000 / 50 pcs", "features": ["full colour", "multiple sizes", "bulk discount"], "image": "images/build2.jpeg", "images": ["images/build2.jpeg","images/house3.jpeg","images/build3.jpeg"], "description": "Promote your products, services, and events with vibrant ad cards and flyers.", "featured": true, "createdAt": "2024-02-15" },
    { "id": 3, "title": "Business Info Cards", "slug": "business-info-cards", "category": "info", "material": "300gsm Art Paper", "size": "90 x 50 mm", "finish": "Gloss", "minOrder": 100, "turnaround": "2-3 business days", "priceFrom": 6000, "priceDisplay": "From ₦6,000 / 100 pcs", "features": ["qr code ready", "full colour", "free design"], "image": "images/house4.jpeg", "images": ["images/house4.jpeg","images/house5.jpeg","images/build4.jpeg"], "description": "Compact business info cards that put your contact details and a QR code in customers' hands.", "featured": true, "createdAt": "2024-02-20" },
    { "id": 4, "title": "Invitation Cards", "slug": "invitation-cards", "category": "invitation", "material": "300gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Matte / Foil", "minOrder": 50, "turnaround": "3-5 business days", "priceFrom": 12000, "priceDisplay": "From ₦12,000 / 50 pcs", "features": ["foil option", "envelopes", "custom design"], "image": "images/build5.jpeg", "images": ["images/build5.jpeg","images/house6.jpeg","images/build6.jpeg"], "description": "Elegant invitation cards for events, parties, weddings, and corporate launches.", "featured": false, "createdAt": "2024-01-30" },
    { "id": 5, "title": "Postcards", "slug": "postcards", "category": "ad", "material": "350gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Gloss", "minOrder": 100, "turnaround": "2-4 business days", "priceFrom": 9000, "priceDisplay": "From ₦9,000 / 100 pcs", "features": ["double-sided", "full colour", "bulk discount"], "image": "images/house7.jpeg", "images": ["images/house7.jpeg","images/house8.jpeg","images/build1.jpeg"], "description": "Versatile postcards for direct mail, thank-you notes, and promotional campaigns.", "featured": false, "createdAt": "2024-02-05" },
    { "id": 6, "title": "Loyalty & Membership Cards", "slug": "loyalty-membership-cards", "category": "custom", "material": "PVC / 350gsm", "size": "85 x 54 mm", "finish": "Matte with magnetic stripe", "minOrder": 100, "turnaround": "4-6 business days", "priceFrom": 15000, "priceDisplay": "From ₦15,000 / 100 pcs", "features": ["pvc option", "barcode", "custom design"], "image": "images/house9.jpeg", "images": ["images/house9.jpeg","images/house10.jpeg","images/build2.jpeg"], "description": "Reward your customers and build repeat business with loyalty and membership cards.", "featured": true, "createdAt": "2024-03-05" },
    { "id": 7, "title": "Greeting Cards", "slug": "greeting-cards", "category": "invitation", "material": "300gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Matte", "minOrder": 50, "turnaround": "3-4 business days", "priceFrom": 10000, "priceDisplay": "From ₦10,000 / 50 pcs", "features": ["envelopes", "custom design", "blank inside"], "image": "images/house11.jpeg", "images": ["images/house11.jpeg","images/house12.jpeg","images/build3.jpeg"], "description": "Thoughtful greeting cards for holidays, appreciation, and special occasions.", "featured": false, "createdAt": "2024-01-20" },
    { "id": 8, "title": "Custom Printed Cards", "slug": "custom-printed-cards", "category": "custom", "material": "Your choice", "size": "Custom", "finish": "Your choice", "minOrder": 50, "turnaround": "Quote based", "priceFrom": 0, "priceDisplay": "Request a quote", "features": ["any size", "any material", "full custom"], "image": "images/house13.jpeg", "images": ["images/house13.jpeg","images/house14.jpeg","images/build4.jpeg"], "description": "Have a unique card idea? We print fully custom cards in any size, material, and finish.", "featured": false, "createdAt": "2024-02-25" }
];

async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        productsData = data.products;
        return productsData;
    } catch (error) {
        console.error('Error loading products:', error);
        const isFileProtocol = window.location.protocol === 'file:';
        if (isFileProtocol) {
            console.warn('Running from file:// protocol - using embedded fallback data');
            productsData = embeddedProductsData;
            return productsData;
        }
        return [];
    }
}

function generateProductCard(product) {
    const featuredBadge = product.featured
        ? '<span class="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>'
        : '';

    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="relative">
                <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.title)}" class="w-full h-48 object-cover" onerror="this.src='images/build1.jpeg'">
                ${featuredBadge}
                <span class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">${escapeHtml(product.category)}</span>
            </div>
            <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${escapeHtml(product.title)}</h3>
                <p class="text-gray-600 text-sm mb-3"><i class="fas fa-ruler-combined text-primary mr-2"></i>${escapeHtml(product.size)}</p>
                <p class="text-lg font-bold text-primary mb-4">${escapeHtml(product.priceDisplay)}</p>
                <div class="flex gap-2">
                    <a href="product-detail.html?id=${escapeAttr(product.id)}" class="flex-1 text-center border-2 border-primary text-primary px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold">View Details</a>
                    <a href="order.html?product=${escapeAttr(product.id)}" class="flex-1 text-center bg-secondary text-white px-3 py-2 rounded-lg hover:bg-maroonDark transition-colors text-sm font-semibold">Get Quote</a>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedProducts(products) {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;

    const featured = products.filter(p => p.featured);
    const display = featured.length > 0 ? featured : products.slice(0, 4);

    if (display.length === 0) {
        carouselTrack.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-gray-600">No products available at the moment.</p></div>`;
        return;
    }

    carouselTrack.innerHTML = display.map(generateProductCard).join('');
}

// ============================================
// SHARED PAGE CHROME
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Load products for homepage
    await fetchProducts();
    renderFeaturedProducts(productsData);

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.remove('bg-white/80');
                navbar.classList.add('bg-gray-100/95');
            } else {
                navbar.classList.remove('bg-gray-100/95');
                navbar.classList.add('bg-white/80');
            }
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.add('opacity-0', 'invisible');
                backToTop.classList.remove('opacity-100', 'visible');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animated Counter for Stats
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    // Newsletter Form - Formspree submission
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterEmail) {
        newsletterEmail.addEventListener('blur', function() { validateEmailInput(this); });
    }
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = newsletterEmail.value;
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                if (newsletterEmail) { newsletterEmail.classList.add('border-red-500'); newsletterEmail.focus(); }
                return;
            }
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            if (typeof showLoader === 'function') showLoader();
            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: new FormData(newsletterForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Thank you for subscribing! You will receive our updates at: ' + escapeHtml(email));
                    newsletterForm.reset();
                } else {
                    alert('There was a problem subscribing. Please try again.');
                }
            } catch (error) {
                alert('There was a problem subscribing. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                if (typeof hideLoader === 'function') setTimeout(hideLoader, 1200);
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('AY-PRINT website loaded successfully!');
});
