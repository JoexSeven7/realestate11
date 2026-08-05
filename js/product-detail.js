// Product detail page JavaScript - dynamic JSON-based, XSS-safe

(function() {
    'use strict';

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function escapeAttr(value) {
        if (typeof value !== 'string') return value;
        return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    const productDetailData = [
        { "id": 1, "title": "Business Cards", "slug": "business-cards", "category": "business", "material": "350gsm Art Paper", "size": "85 x 55 mm", "finish": "Matte / Gloss", "minOrder": 100, "turnaround": "2-3 business days", "priceFrom": 5000, "priceDisplay": "From ₦5,000 / 100 pcs", "features": ["double-sided", "full colour", "free design"], "image": "images/house1.jpeg", "images": ["images/house1.jpeg","images/house2.jpeg","images/build1.jpeg"], "description": "Make a lasting first impression with premium business cards printed on thick 350gsm art paper.", "highlights": ["350gsm thick art paper","Double-sided full-colour printing","Matte or gloss lamination","Free basic design assistance","Rounded or square corners","Fast 2-3 business day turnaround"], "featured": true, "createdAt": "2024-03-01" },
        { "id": 2, "title": "Ad Cards & Flyers", "slug": "ad-cards-flyers", "category": "ad", "material": "300gsm Art Paper", "size": "A6 / A5 / A4", "finish": "Matte", "minOrder": 50, "turnaround": "2-4 business days", "priceFrom": 8000, "priceDisplay": "From ₦8,000 / 50 pcs", "features": ["full colour", "multiple sizes", "bulk discount"], "image": "images/build2.jpeg", "images": ["images/build2.jpeg","images/house3.jpeg","images/build3.jpeg"], "description": "Promote your products, services, and events with vibrant ad cards and flyers.", "highlights": ["A6, A5, and A4 sizes","Eye-catching full-colour printing","Bulk order discounts","Matte finish"], "featured": true, "createdAt": "2024-02-15" },
        { "id": 3, "title": "Business Info Cards", "slug": "business-info-cards", "category": "info", "material": "300gsm Art Paper", "size": "90 x 50 mm", "finish": "Gloss", "minOrder": 100, "turnaround": "2-3 business days", "priceFrom": 6000, "priceDisplay": "From ₦6,000 / 100 pcs", "features": ["qr code ready", "full colour", "free design"], "image": "images/house4.jpeg", "images": ["images/house4.jpeg","images/house5.jpeg","images/build4.jpeg"], "description": "Compact business info cards that put your contact details and a QR code in customers' hands.", "highlights": ["90 x 50 mm format","QR code printing supported","Gloss finish","Free layout design"], "featured": true, "createdAt": "2024-02-20" },
        { "id": 4, "title": "Invitation Cards", "slug": "invitation-cards", "category": "invitation", "material": "300gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Matte / Foil", "minOrder": 50, "turnaround": "3-5 business days", "priceFrom": 12000, "priceDisplay": "From ₦12,000 / 50 pcs", "features": ["foil option", "envelopes", "custom design"], "image": "images/build5.jpeg", "images": ["images/build5.jpeg","images/house6.jpeg","images/build6.jpeg"], "description": "Elegant invitation cards for events, parties, weddings, and corporate launches.", "highlights": ["Matte or foil finish","Matching envelopes","Custom event designs"], "featured": false, "createdAt": "2024-01-30" },
        { "id": 5, "title": "Postcards", "slug": "postcards", "category": "ad", "material": "350gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Gloss", "minOrder": 100, "turnaround": "2-4 business days", "priceFrom": 9000, "priceDisplay": "From ₦9,000 / 100 pcs", "features": ["double-sided", "full colour", "bulk discount"], "image": "images/house7.jpeg", "images": ["images/house7.jpeg","images/house8.jpeg","images/build1.jpeg"], "description": "Versatile postcards for direct mail, thank-you notes, and promotional campaigns.", "highlights": ["Double-sided printing","Sturdy 350gsm stock","Bulk discounts"], "featured": false, "createdAt": "2024-02-05" },
        { "id": 6, "title": "Loyalty & Membership Cards", "slug": "loyalty-membership-cards", "category": "custom", "material": "PVC / 350gsm", "size": "85 x 54 mm", "finish": "Matte with magnetic stripe", "minOrder": 100, "turnaround": "4-6 business days", "priceFrom": 15000, "priceDisplay": "From ₦15,000 / 100 pcs", "features": ["pvc option", "barcode", "custom design"], "image": "images/house9.jpeg", "images": ["images/house9.jpeg","images/house10.jpeg","images/build2.jpeg"], "description": "Reward your customers and build repeat business with loyalty and membership cards.", "highlights": ["PVC or card stock","Barcode & serial numbering","Magnetic stripe available"], "featured": true, "createdAt": "2024-03-05" },
        { "id": 7, "title": "Greeting Cards", "slug": "greeting-cards", "category": "invitation", "material": "300gsm Art Paper", "size": "A6 / 148 x 105 mm", "finish": "Matte", "minOrder": 50, "turnaround": "3-4 business days", "priceFrom": 10000, "priceDisplay": "From ₦10,000 / 50 pcs", "features": ["envelopes", "custom design", "blank inside"], "image": "images/house11.jpeg", "images": ["images/house11.jpeg","images/house12.jpeg","images/build3.jpeg"], "description": "Thoughtful greeting cards for holidays, appreciation, and special occasions.", "highlights": ["Blank inside","Matching envelopes","Custom artwork"], "featured": false, "createdAt": "2024-01-20" },
        { "id": 8, "title": "Custom Printed Cards", "slug": "custom-printed-cards", "category": "custom", "material": "Your choice", "size": "Custom", "finish": "Your choice", "minOrder": 50, "turnaround": "Quote based", "priceFrom": 0, "priceDisplay": "Request a quote", "features": ["any size", "any material", "full custom"], "image": "images/house13.jpeg", "images": ["images/house13.jpeg","images/house14.jpeg","images/build4.jpeg"], "description": "Have a unique card idea? We print fully custom cards in any size, material, and finish.", "highlights": ["Any size and material","Bespoke finishes","Design support"], "featured": false, "createdAt": "2024-02-25" }
    ];

    const mainImage = document.getElementById('mainImage');
    const thumbnailsEl = document.getElementById('thumbnails');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    let currentImageIndex = 0;
    let productImages = [];

    async function fetchProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to load');
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            return productDetailData;
        }
    }

    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || 1;
    }

    function setQuoteLinks(id) {
        const href = 'order.html?product=' + id;
        ['quoteBtnTop', 'quoteBtnBottom', 'quoteBtnSide'].forEach(bid => {
            const el = document.getElementById(bid);
            if (el) el.href = href;
        });
    }

    function renderGallery(images, title) {
        productImages = images && images.length ? images : ['images/build1.jpeg'];
        currentImageIndex = 0;
        mainImage.src = productImages[0];
        mainImage.alt = title;
        if (thumbnailsEl) {
            thumbnailsEl.innerHTML = productImages.map((src, i) => `
                <div class="thumbnail cursor-pointer border-2 ${i === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'} rounded-lg overflow-hidden" data-index="${i}">
                    <img src="${escapeAttr(src)}" alt="${escapeAttr(title)} ${i + 1}" class="w-full h-20 object-cover" onerror="this.src='images/build1.jpeg'">
                </div>`).join('');
            thumbnailsEl.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    currentImageIndex = parseInt(this.dataset.index);
                    updateMainImage();
                });
            });
        }
    }

    function updateMainImage() {
        mainImage.src = productImages[currentImageIndex];
        if (thumbnailsEl) {
            thumbnailsEl.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('border-primary', i === currentImageIndex);
                thumb.classList.toggle('border-transparent', i !== currentImageIndex);
            });
        }
    }

    function initGalleryNav() {
        if (galleryPrev) galleryPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            updateMainImage();
        });
        if (galleryNext) galleryNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % productImages.length;
            updateMainImage();
        });
    }

    function renderProduct(p) {
        if (!p) {
            document.getElementById('productTitle').textContent = 'Product not found';
            document.getElementById('productDescription').textContent = 'Sorry, we could not find that product.';
            return;
        }
        document.getElementById('productTitle').textContent = p.title;
        document.getElementById('breadcrumbTitle').textContent = p.title;
        document.getElementById('productCategory').textContent = p.category;
        document.getElementById('categoryBadge').textContent = p.category;
        document.getElementById('sidebarTitle').textContent = p.title;
        document.title = p.title + ' | AY-PRINT';

        const featuredBadge = document.getElementById('featuredBadge');
        if (featuredBadge) featuredBadge.classList.toggle('hidden', !p.featured);

        document.getElementById('specSize').textContent = p.size;
        document.getElementById('specMaterial').textContent = p.material;
        document.getElementById('specFinish').textContent = p.finish;
        document.getElementById('specMin').textContent = p.minOrder;
        document.getElementById('specTurn').textContent = p.turnaround;
        document.getElementById('specPrice').textContent = p.priceFrom > 0 ? '₦' + p.priceFrom.toLocaleString() : 'Quote';
        document.getElementById('productDescription').textContent = p.description;

        const featuresEl = document.getElementById('featuresList');
        featuresEl.innerHTML = (p.features || []).map(f => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="fas fa-check-circle text-primary text-xl"></i>
                <span class="text-gray-700 capitalize">${escapeHtml(f.replace(/-/g, ' '))}</span>
            </div>`).join('');

        const highlightsEl = document.getElementById('highlightsList');
        highlightsEl.innerHTML = (p.highlights || []).map(h => `
            <li class="flex items-start gap-3"><i class="fas fa-check-circle text-green-500 mt-1"></i><span>${escapeHtml(h)}</span></li>`).join('');

        setQuoteLinks(p.id);
        renderGallery(p.images, p.title);
    }

    async function init() {
        const products = await fetchProducts();
        const product = products.find(p => p.id === getProductId()) || products[0];
        renderProduct(product);
        initGalleryNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
