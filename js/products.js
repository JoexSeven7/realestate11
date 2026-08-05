// Products (catalog) page JavaScript - data-driven, XSS-safe

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

    const gridContainer = document.getElementById('gridContainer');
    const listContainer = document.getElementById('listContainer');
    const tableContainer = document.getElementById('tableContainer');
    const resultsCount = document.getElementById('resultsCount');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');

    const filterCategory = document.getElementById('filterCategory');
    const searchInput = document.getElementById('searchInput');
    const sortProducts = document.getElementById('sortProducts');
    const resetFilters = document.getElementById('resetFilters');
    const applyFilters = document.getElementById('applyFilters');

    const viewTabs = document.querySelectorAll('.view-tab-btn');
    const viewContainers = {
        grid: document.getElementById('gridView'),
        list: document.getElementById('listView'),
        table: document.getElementById('tableView')
    };

    let productsData = [];
    let filteredProducts = [];
    let currentView = 'grid';
    let currentFilters = { category: '', search: '', sortBy: 'featured' };

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

    async function loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to load products');
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            console.error('Error loading products:', error);
            return embeddedProductsData;
        }
    }

    function priceValue(p) { return p.priceFrom > 0 ? p.priceFrom : Infinity; }

    function filterProducts() {
        filteredProducts = productsData.filter(p => {
            if (currentFilters.category && p.category !== currentFilters.category) return false;
            if (currentFilters.search) {
                const term = currentFilters.search.toLowerCase();
                if (!p.title.toLowerCase().includes(term) && !p.description.toLowerCase().includes(term) && !p.category.toLowerCase().includes(term)) return false;
            }
            return true;
        });
        filteredProducts = sortProductsFn(filteredProducts, currentFilters.sortBy);
        updateAllViews();
    }

    function sortProductsFn(list, sortBy) {
        const sorted = [...list];
        switch (sortBy) {
            case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'price-low': return sorted.sort((a, b) => priceValue(a) - priceValue(b));
            case 'price-high': return sorted.sort((a, b) => priceValue(b) - priceValue(a));
            case 'featured':
            default: return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }

    function updateAllViews() {
        loadingState.classList.add('hidden');
        if (filteredProducts.length === 0) {
            noResults.classList.remove('hidden');
            Object.values(viewContainers).forEach(el => el.classList.add('hidden'));
            resultsCount.textContent = '0';
            return;
        }
        noResults.classList.add('hidden');
        resultsCount.textContent = filteredProducts.length;
        renderGridView();
        renderListView();
        renderTableView();
        showActiveView();
    }

    function showActiveView() {
        Object.keys(viewContainers).forEach(view => {
            if (view === currentView) {
                viewContainers[view].classList.remove('hidden');
                viewContainers[view].classList.add('block');
            } else {
                viewContainers[view].classList.add('hidden');
                viewContainers[view].classList.remove('block');
            }
        });
    }

    function productCardInner(p) {
        const featuredBadge = p.featured ? '<span class="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>' : '';
        return `
            <div class="relative overflow-hidden">
                <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="product-image w-full h-56 object-cover transition-transform duration-500" onerror="this.src='images/build1.jpeg'">
                ${featuredBadge}
                <span class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">${escapeHtml(p.category)}</span>
            </div>
            <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 mb-2"><a href="product-detail.html?id=${escapeAttr(p.id)}">${escapeHtml(p.title)}</a></h3>
                <p class="text-gray-600 text-sm mb-3"><i class="fas fa-ruler-combined text-primary mr-2"></i>${escapeHtml(p.size)}</p>
                <p class="text-lg font-bold text-primary mb-4">${escapeHtml(p.priceDisplay)}</p>
                <div class="flex gap-2">
                    <a href="product-detail.html?id=${escapeAttr(p.id)}" class="flex-1 text-center border-2 border-primary text-primary px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold">View Details</a>
                    <a href="order.html?product=${escapeAttr(p.id)}" class="flex-1 text-center bg-secondary text-white px-3 py-2 rounded-lg hover:bg-maroonDark transition-colors text-sm font-semibold">Get Quote</a>
                </div>
            </div>`;
    }

    function renderGridView() {
        if (!gridContainer) return;
        gridContainer.innerHTML = filteredProducts.map(p => `<div class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all" data-id="${escapeAttr(p.id)}">${productCardInner(p)}</div>`).join('');
    }

    function renderListView() {
        if (!listContainer) return;
        listContainer.innerHTML = filteredProducts.map(p => `
            <div class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col md:flex-row" data-id="${escapeAttr(p.id)}">
                <div class="md:w-72 relative overflow-hidden">
                    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full h-48 md:h-full object-cover" onerror="this.src='images/build1.jpeg'">
                    <span class="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">${escapeHtml(p.category)}</span>
                </div>
                <div class="flex-1 p-5">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2"><a href="product-detail.html?id=${escapeAttr(p.id)}" class="hover:text-primary transition-colors">${escapeHtml(p.title)}</a></h3>
                    <p class="text-gray-600 mb-3"><i class="fas fa-ruler-combined text-primary mr-2"></i>${escapeHtml(p.size)} &middot; ${escapeHtml(p.material)}</p>
                    <p class="text-gray-500 text-sm mb-4 line-clamp-2">${escapeHtml(p.description || '')}</p>
                    <div class="flex flex-wrap gap-2">
                        <a href="product-detail.html?id=${escapeAttr(p.id)}" class="border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold">View Details</a>
                        <a href="order.html?product=${escapeAttr(p.id)}" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-maroonDark transition-colors font-semibold">Get Quote</a>
                    </div>
                </div>
                <div class="md:w-48 bg-gray-50 p-5 flex flex-col justify-center items-center text-center">
                    <p class="text-gray-500 text-sm mb-1">From</p>
                    <p class="text-2xl font-bold text-primary">${escapeHtml(p.priceDisplay)}</p>
                </div>
            </div>`).join('');
    }

    function renderTableView() {
        if (!tableContainer) return;
        tableContainer.innerHTML = `
            <thead><tr>
                <th>Product</th><th>Category</th><th>Size</th><th>Price</th><th>Turnaround</th><th>Action</th>
            </tr></thead>
            <tbody>${filteredProducts.map(p => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                            <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-16 h-12 object-cover rounded" onerror="this.src='images/build1.jpeg'">
                            <div><a href="product-detail.html?id=${escapeAttr(p.id)}" class="font-semibold text-gray-900 hover:text-primary">${escapeHtml(p.title)}</a><p class="text-xs text-gray-500">${escapeHtml(p.material)}</p></div>
                        </div>
                    </td>
                    <td class="py-4 px-4 capitalize text-gray-700">${escapeHtml(p.category)}</td>
                    <td class="py-4 px-4 text-gray-700">${escapeHtml(p.size)}</td>
                    <td class="py-4 px-4 font-semibold text-primary">${escapeHtml(p.priceDisplay)}</td>
                    <td class="py-4 px-4 text-gray-600">${escapeHtml(p.turnaround)}</td>
                    <td class="py-4 px-4">
                        <a href="product-detail.html?id=${escapeAttr(p.id)}" class="text-primary hover:underline mr-2">View</a>
                        <a href="order.html?product=${escapeAttr(p.id)}" class="text-secondary hover:underline">Quote</a>
                    </td>
                </tr>`).join('')}</tbody>`;
    }

    function switchView(viewName) {
        currentView = viewName;
        viewTabs.forEach(btn => {
            if (btn.dataset.view === viewName) {
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                btn.classList.add('bg-primary', 'text-white');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });
        showActiveView();
    }

    function resetFiltersFn() {
        currentFilters = { category: '', search: '', sortBy: 'featured' };
        if (filterCategory) filterCategory.value = '';
        if (searchInput) searchInput.value = '';
        if (sortProducts) sortProducts.value = 'featured';
        filterProducts();
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
    }

    async function init() {
        productsData = await loadProducts();
        filteredProducts = [...productsData];

        const params = new URLSearchParams(window.location.search);
        if (params.get('category')) { currentFilters.category = params.get('category'); if (filterCategory) filterCategory.value = currentFilters.category; }
        if (params.get('search')) { currentFilters.search = params.get('search'); if (searchInput) searchInput.value = currentFilters.search; }

        filterProducts();

        viewTabs.forEach(btn => btn.addEventListener('click', function() { switchView(this.dataset.view); }));
        if (filterCategory) filterCategory.addEventListener('change', () => { currentFilters.category = filterCategory.value; filterProducts(); });
        if (searchInput) searchInput.addEventListener('input', debounce(() => { currentFilters.search = searchInput.value; filterProducts(); }, 300));
        if (sortProducts) sortProducts.addEventListener('change', () => { currentFilters.sortBy = sortProducts.value; filterProducts(); });
        if (applyFilters) applyFilters.addEventListener('click', filterProducts);
        if (resetFilters) resetFilters.addEventListener('click', resetFiltersFn);

        switchView('grid');
        console.log('[Products] Initialized with', productsData.length, 'products');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
