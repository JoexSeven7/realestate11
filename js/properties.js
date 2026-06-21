// Properties page JavaScript - NEW MULTI-VIEW DESIGN
// Supports: Grid, List, Map, Table, Slider views

(function() {
    'use strict';

    // ===== DOM ELEMENTS =====
    const gridContainer = document.getElementById('gridContainer');
    const listContainer = document.getElementById('listContainer');
    const tableContainer = document.getElementById('tableContainer');
    const sliderHero = document.getElementById('sliderHero');
    const sliderThumbnails = document.getElementById('sliderThumbnails');
    const resultsCount = document.getElementById('resultsCount');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');

    // Filter elements
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterLocation = document.getElementById('filterLocation');
    const filterBedrooms = document.getElementById('filterBedrooms');
    const searchInput = document.getElementById('searchInput');
    const sortProperties = document.getElementById('sortProperties');
    const resetFilters = document.getElementById('resetFilters');
    const applyFilters = document.getElementById('applyFilters');

    // View elements
    const viewTabs = document.querySelectorAll('.view-tab-btn');
    const viewContainers = {
        grid: document.getElementById('gridView'),
        list: document.getElementById('listView'),
        map: document.getElementById('mapView'),
        table: document.getElementById('tableView'),
        slider: document.getElementById('sliderView')
    };

    // ===== STATE =====
    let propertiesData = [];
    let filteredProperties = [];
    let currentView = 'grid';
    let currentFilters = {
        type: '',
        status: '',
        location: '',
        bedrooms: '',
        search: '',
        sortBy: 'featured'
    };
    let sliderIndex = 0;

      // ===== EMBEDDED FALLBACK DATA =====
      // Keeped in sync with data/properties.json
      const embeddedPropertiesData = [
          { id: 1, title: "Luxury Shortlet Apartment", slug: "luxury-shortlet-apartment", type: "residential", status: "shortlet", location: "Lekki Ikate", address: "Lekki Ikate, Lagos", bedrooms: 5, bathrooms: 6, size: 120, price: 150000, priceDisplay: "₦150,000/night", features: ["parking", "pool", "gym", "security", "wifi", "kitchen"], amenities: ["Swimming Pool", "Gym Access", "24/7 Security", "Parking Space", "High-speed WiFi", "Fully Equipped Kitchen", "Housekeeping Service", "Concierge"], image: "images/house7.jpeg", images: ["images/house7.jpeg","images/housevideo1.jpeg","images/house9.jpeg","images/house1.jpeg","images/house3.jpeg","images/house4.jpeg"], description: "Experience luxury short-term living in this stunning 2-bedroom apartment with breathtaking city views. This modern residence offers premium finishes and state-of-the-art amenities perfect for business travelers and tourists seeking comfort and convenience.", featured: true, createdAt: "2024-03-01" },
          { id: 2, title: "Royal pine estate, Lekki", slug: "modern-apartment-vi", type: "residential", status: "rent", location: "lagos", address: "Lekki", bedrooms: 3, bathrooms: 2, size: 180, price: 0, priceDisplay: "Contact for price", features: ["parking", "security", "gym"], amenities: ["Gym Access", "24/7 Security", "Parking Space", "Elevator", "Backup Power"], image: "images/house24.jpeg", images: ["images/house17.jpeg","images/house18.jpeg","images/house10.jpeg"], description: "Contemporary 3-bedroom apartment in the heart of Lekki. This modern residence offers stunning city views, premium finishes, and convenient access to Lagos's business district. The open-concept living space is flooded with natural light, featuring a sleek kitchen and spacious bedrooms. Building amenities include a fully equipped gym, elevator access, and reliable backup power.", featured: true, createdAt: "2024-02-01" },
          { id: 3, title: "Executive Office Space in Abuja", slug: "executive-office-abuja", type: "commercial", status: "rent", location: "abuja", address: "Central Business District, Abuja", bedrooms: 0, bathrooms: 4, size: 350, price: 0, priceDisplay: "Contact for price", features: ["parking", "security", "elevator", "gym"], amenities: ["24/7 Security", "Elevator Access", "Backup Power", "Parking Space", "Conference Room"], image: "images/build6.jpeg", images: ["images/build6.jpeg","images/build4.jpeg","images/build1.jpeg"], description: "Premium office space in the heart of Abuja's business district. This contemporary workspace offers modern amenities, reliable power supply, and 24-hour security. Perfect for businesses seeking a prestigious address with all conveniences.", featured: true, createdAt: "2024-02-10" },
          { id: 4, title: "Beachfront Plot in Port Harcourt", slug: "beachfront-plot-ph", type: "land", status: "sale", location: "portharcourt", address: "Oil Mill Field, Port Harcourt", bedrooms: 0, bathrooms: 0, size: 1200, price: 0, priceDisplay: "Contact for price", features: ["security"], amenities: ["24/7 Security", "Perimeter Fence"], image: "images/house2.jpeg", images: ["images/.house2.jpeg"], description: "Prime beachfront plot perfect for development. This extensive land parcel offers great investment potential with beach access and secure perimeter.", featured: true, createdAt: "2024-02-15" },
          { id: 5, title: "Penthouse Suite in Ikoyi", slug: "penthouse-ikoyi", type: "residential", status: "sale", location: "lagos", address: "Ikoyi, Lagos", bedrooms: 4, bathrooms: 4, size: 320, price: 0, priceDisplay: "Contact for price", features: ["parking", "pool", "security", "elevator"], amenities: ["Private Pool", "24/7 Security", "Elevator Access", "Parking Space", "Smart Home System"], image: "images/house27.jpeg", images: ["images/house27.jpeg","images/house26.jpeg"], description: "Luxurious penthouse with panoramic views of Ikoyi. This exclusive residence offers the ultimate in luxury living with private amenities and premium finishes.", featured: true, createdAt: "2024-02-20" },
          { id: 6, title: "Commercial Plaza in Ibadan", slug: "commercial-plaza-ibadan", type: "commercial", status: "sale", location: "ibadan", address: "Ring Road, Ibadan", bedrooms: 0, bathrooms: 8, size: 2500, price: 0, priceDisplay: "Contact for price", features: ["parking", "security", "elevator"], amenities: ["24/7 Security", "Elevator Access", "Backup Power", "Parking Space"], image: "images/build2.jpeg", images: ["images/build2.jpeg"], description: "Multi-story commercial plaza in prime location. This income-generating property offers excellent rental potential with multiple units and prime positioning.", featured: false, createdAt: "2024-02-25" }
      ];

    // ===== LOAD PROPERTIES =====
    async function loadProperties() {
        try {
            const response = await fetch('data/properties.json');
            if (!response.ok) throw new Error('Failed to load properties');
            const data = await response.json();
            return data.properties || [];
        } catch (error) {
            console.error('Error loading properties:', error);
            return embeddedPropertiesData;
        }
    }

    // ===== FILTER PROPERTIES =====
    function filterProperties() {
        filteredProperties = propertiesData.filter(property => {
            if (currentFilters.type && property.type !== currentFilters.type) return false;
            if (currentFilters.status && property.status !== currentFilters.status) return false;
            if (currentFilters.location && property.location !== currentFilters.location) return false;
            if (currentFilters.bedrooms && (property.bedrooms || 0) < parseInt(currentFilters.bedrooms)) return false;
            if (currentFilters.search) {
                const term = currentFilters.search.toLowerCase();
                if (!property.title.toLowerCase().includes(term) && 
                    !property.address.toLowerCase().includes(term)) return false;
            }
            return true;
        });

        // Sort
        filteredProperties = sortPropertiesFn(filteredProperties, currentFilters.sortBy);
        
        // Update UI
        updateAllViews();
    }

    // ===== SORT PROPERTIES =====
    function sortPropertiesFn(properties, sortBy) {
        const sorted = [...properties];
        switch(sortBy) {
            case 'newest': return sorted.sort((a, b) => {
                if (a.id === 1 || b.id === 1) return a.id === 1 ? -1 : 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            case 'price-high': return sorted.sort((a, b) => {
                if (a.id === 1 || b.id === 1) return a.id === 1 ? -1 : 1;
                return (b.price || 0) - (a.price || 0);
            });
            case 'price-low': return sorted.sort((a, b) => {
                if (a.id === 1 || b.id === 1) return a.id === 1 ? -1 : 1;
                return (a.price || 0) - (b.price || 0);
            });
            case 'size': return sorted.sort((a, b) => {
                if (a.id === 1 || b.id === 1) return a.id === 1 ? -1 : 1;
                return (b.size || 0) - (a.size || 0);
            });
            case 'featured': default: return sorted.sort((a, b) => {
                if (a.id === 1 || b.id === 1) return a.id === 1 ? -1 : 1;
                const aShortlet = a.status === 'shortlet' ? 1 : 0;
                const bShortlet = b.status === 'shortlet' ? 1 : 0;
                if (bShortlet !== aShortlet) return bShortlet - aShortlet;
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            });
        }
    }

    // ===== UPDATE ALL VIEWS =====
    function updateAllViews() {
        // Hide loading, show results
        loadingState.classList.add('hidden');
        
        if (filteredProperties.length === 0) {
            noResults.classList.remove('hidden');
            Object.values(viewContainers).forEach(el => el.classList.add('hidden'));
            resultsCount.textContent = '0';
            return;
        }

        noResults.classList.add('hidden');
        resultsCount.textContent = filteredProperties.length;

        // Render each view
        renderGridView();
        renderListView();
        renderTableView();
        renderSliderView();
    }

    // ===== RENDER GRID VIEW =====
    function renderGridView() {
        if (!gridContainer) return;
        
        gridContainer.innerHTML = filteredProperties.map(property => `
            <div class="property-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all" data-id="${property.id}">
                 <div class="relative overflow-hidden">
                     <img src="${property.image}" alt="${property.title}" class="property-image w-full h-56 object-cover transition-transform duration-500" onerror="this.src='images/build1.jpeg'">
                     <div class="absolute top-3 left-3">
                         ${property.featured ? '<span class="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">Featured</span>' : ''}
                     </div>
                     <div class="absolute top-3 right-3">
                         <span class="
                             ${property.status === 'sale' ? 'bg-green-500' : 
                               property.status === 'shortlet' ? 'bg-purple-500' : 'bg-secondary'} 
                             text-white px-3 py-1 rounded-full text-sm font-semibold">
                             ${property.status === 'sale' ? 'For Sale' : 
                               property.status === 'shortlet' ? 'Shortlet' : 'For Rent'}
                         </span>
                     </div>
                     <button class="favorite-btn absolute bottom-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors" data-id="${property.id}">
                         <i class="far fa-heart text-gray-600"></i>
                     </button>
                 </div>
                <div class="p-5">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs font-semibold uppercase px-2 py-1 bg-primary/10 text-primary rounded">${property.type}</span>
                        <span class="text-xs text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>${property.location}</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
                        <a href="property-detail.html?id=${property.id}">${property.title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-3"><i class="fas fa-map-marker-alt text-primary mr-2"></i>${property.address}</p>
                    <div class="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                        ${property.type !== 'land' ? `<span><i class="fas fa-bed mr-1"></i>${property.bedrooms || 0} Beds</span>` : ''}
                        ${property.type !== 'land' ? `<span><i class="fas fa-bath mr-1"></i>${property.bathrooms || 0} Baths</span>` : ''}
                        <span><i class="fas fa-swimming-pool mr-1"></i> ${property.pool}</span>
                    </div>
                    <div class="flex gap-2">
                        <a href="property-detail.html?id=${property.id}" class="flex-1 text-center border-2 border-primary text-primary px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold">View Details</a>
                        <a href="contact.html?property=${property.id}" class="flex-1 text-center bg-secondary text-white px-3 py-2 rounded-lg hover:bg-maroonDark transition-colors text-sm font-semibold">Contact</a>
                    </div>
                </div>
            </div>
        `).join('');

        attachFavoriteListeners();
    }

    // ===== RENDER LIST VIEW =====
    function renderListView() {
        if (!listContainer) return;

        listContainer.innerHTML = filteredProperties.map(property => `
            <div class="property-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col md:flex-row" data-id="${property.id}">
                 <div class="md:w-72 relative overflow-hidden">
                     <img src="${property.image}" alt="${property.title}" class="w-full h-48 md:h-full object-cover" onerror="this.src='images/build1.jpeg'">
                     <div class="absolute top-3 left-3">
                         ${property.featured ? '<span class="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">Featured</span>' : ''}
                     </div>
                     <div class="absolute top-3 right-3">
                         <span class="
                             ${property.status === 'sale' ? 'bg-green-500' : 
                               property.status === 'shortlet' ? 'bg-purple-500' : 'bg-secondary'} 
                             text-white px-3 py-1 rounded-full text-sm font-semibold">
                             ${property.status === 'sale' ? 'For Sale' : 
                               property.status === 'shortlet' ? 'Shortlet' : 'For Rent'}
                         </span>
                     </div>
                 </div>
                <div class="flex-1 p-5">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="text-xs font-semibold uppercase px-2 py-1 bg-primary/10 text-primary rounded">${property.type}</span>
                        <span class="text-xs text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>${property.location}</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">
                        <a href="property-detail.html?id=${property.id}" class="hover:text-primary transition-colors">${property.title}</a>
                    </h3>
                    <p class="text-gray-600 mb-3"><i class="fas fa-map-marker-alt text-primary mr-2"></i>${property.address}</p>
                    <p class="text-gray-500 text-sm mb-4 line-clamp-2">${property.description || ''}</p>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        ${property.type !== 'land' ? `<span class="flex items-center gap-1"><i class="fas fa-bed text-primary"></i>${property.bedrooms || 0} Bedrooms</span>` : ''}
                        ${property.type !== 'land' ? `<span class="flex items-center gap-1"><i class="fas fa-bath text-primary"></i>${property.bathrooms || 0} Bathrooms</span>` : ''}
                        <span class="flex items-center gap-1"><i class="fas fa-swimming-pool text-primary"></i> 1</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <a href="property-detail.html?id=${property.id}" class="border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold">View Details</a>
                        <a href="contact.html?property=${property.id}" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-maroonDark transition-colors font-semibold">Contact Agent</a>
                        <button class="favorite-btn border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors" data-id="${property.id}">
                            <i class="far fa-heart"></i> Save
                        </button>
                    </div>
                </div>
                <div class="md:w-48 bg-gray-50 p-5 flex flex-col justify-center items-center text-center">
                    <p class="text-gray-500 text-sm mb-1">Price</p>
                    <p class="text-2xl font-bold text-primary">${property.priceDisplay}</p>
                    <span class="text-xs text-gray-400 mt-2">${property.status === 'sale' ? 'For Sale' : 'For Rent'}</span>
                </div>
            </div>
        `).join('');

        attachFavoriteListeners();
    }

    // ===== RENDER TABLE VIEW =====
    function renderTableView() {
        if (!tableContainer) return;

        const tbody = tableContainer.querySelector('tbody') || tableContainer;
        tbody.innerHTML = filteredProperties.map(property => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                        <img src="${property.image}" alt="${property.title}" class="w-16 h-12 object-cover rounded" onerror="this.src='images/build1.jpeg'">
                        <div>
                            <a href="property-detail.html?id=${property.id}" class="font-semibold text-gray-900 hover:text-primary">${property.title}</a>
                            <p class="text-xs text-gray-500">${property.address}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="capitalize text-gray-700">${property.type}</span>
                </td>
                <td class="py-4 px-4">
                    <span class="capitalize">${property.location}</span>
                </td>
                <td class="py-4 px-4">
                    <span class="font-semibold text-primary">${property.priceDisplay}</span>
                </td>
                <td class="py-4 px-4">
                    <span class="text-gray-600">1</span>
                </td>
                 <td class="py-4 px-4">
                     <span class="px-2 py-1 rounded-full text-xs font-semibold ${property.status === 'sale' ? 'bg-green-100 text-green-700' : property.status === 'shortlet' ? 'bg-purple-100 text-purple-700' : 'bg-secondary/20 text-secondary'}">
                         ${property.status === 'sale' ? 'For Sale' : property.status === 'shortlet' ? 'Shortlet' : 'For Rent'}
                     </span>
                 </td>
                <td class="py-4 px-4">
                    <a href="property-detail.html?id=${property.id}" class="text-primary hover:underline mr-2">View</a>
                    <a href="contact.html?property=${property.id}" class="text-secondary hover:underline">Contact</a>
                </td>
            </tr>
        `).join('');
    }

    // ===== RENDER SLIDER VIEW =====
    function renderSliderView() {
        if (!sliderHero || !sliderThumbnails) return;

        if (filteredProperties.length === 0) return;

        // Hero (featured property)
        const featured = filteredProperties[sliderIndex] || filteredProperties[0];
        sliderHero.innerHTML = `
            <div class="relative h-96 md:h-[500px]">
                <img src="${featured.image}" alt="${featured.title}" class="w-full h-full object-cover" onerror="this.src='images/build1.jpeg'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                     <div class="flex gap-2 mb-3">
                         <span class="px-3 py-1 bg-primary rounded-full text-sm font-semibold">${featured.type}</span>
                         <span class="px-3 py-1 ${featured.status === 'sale' ? 'bg-green-500' : 
                           featured.status === 'shortlet' ? 'bg-purple-500' : 'bg-secondary'} rounded-full text-sm font-semibold">
                             ${featured.status === 'sale' ? 'For Sale' : 
                               featured.status === 'shortlet' ? 'Shortlet' : 'For Rent'}
                         </span>
                         ${featured.featured ? '<span class="px-3 py-1 bg-accent text-primary rounded-full text-sm font-semibold">Featured</span>' : ''}
                     </div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-2">${featured.title}</h2>
                    <p class="text-xl mb-4"><i class="fas fa-map-marker-alt mr-2"></i>${featured.address}</p>
                    <div class="flex flex-wrap gap-6 mb-6">
                        ${featured.type !== 'land' ? `<span><i class="fas fa-bed mr-2"></i>${featured.bedrooms || 0} Bedrooms</span>` : ''}
                        ${featured.type !== 'land' ? `<span><i class="fas fa-bath mr-2"></i>${featured.bathrooms || 0} Bathrooms</span>` : ''}
                        <span><i class="fas fa-swimming-pool mr-2"></i> 1</span>
                    </div>
                    <div class="flex gap-4">
                        <a href="property-detail.html?id=${featured.id}" class="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">View Details</a>
                        <a href="contact.html?property=${featured.id}" class="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-maroonDark transition-colors">Contact Agent</a>
                    </div>
                </div>
            </div>
        `;

        // Thumbnails
        sliderThumbnails.innerHTML = filteredProperties.map((property, index) => `
            <div class="slider-thumb flex-shrink-0 w-32 cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors ${index === sliderIndex ? 'border-primary' : ''}" data-index="${index}">
                <img src="${property.image}" alt="${property.title}" class="w-32 h-20 object-cover" onerror="this.src='images/build1.jpeg'">
                <div class="p-2 bg-white">
                    <p class="text-xs font-semibold text-gray-900 truncate">${property.title}</p>
                    <p class="text-xs text-gray-500">${property.priceDisplay}</p>
                </div>
            </div>
        `).join('');

        // Attach thumbnail click events
        document.querySelectorAll('.slider-thumb').forEach(thumb => {
            thumb.addEventListener('click', function() {
                sliderIndex = parseInt(this.dataset.index);
                renderSliderView();
            });
        });
    }

    // ===== SWITCH VIEW =====
    function switchView(viewName) {
        currentView = viewName;
        
        // Update tab buttons
        viewTabs.forEach(btn => {
            if (btn.dataset.view === viewName) {
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                btn.classList.add('bg-primary', 'text-white');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });

        // Show/hide view containers
        Object.keys(viewContainers).forEach(view => {
            if (view === viewName) {
                viewContainers[view].classList.remove('hidden');
                viewContainers[view].classList.add('block');
            } else {
                viewContainers[view].classList.add('hidden');
                viewContainers[view].classList.remove('block');
            }
        });
    }

    // ===== FAVORITE LISTENERS =====
    function attachFavoriteListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const icon = this.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('text-red-500');
                
                const propertyId = this.dataset.id;
                let favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
                
                if (favorites.includes(propertyId)) {
                    favorites = favorites.filter(id => id !== propertyId);
                } else {
                    favorites.push(propertyId);
                }
                
                localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
            });
        });
    }

    // ===== RESET FILTERS =====
    function resetFiltersFn() {
        currentFilters = { type: '', status: '', location: '', bedrooms: '', search: '', sortBy: 'featured' };
        
        if (filterType) filterType.value = '';
        if (filterStatus) filterStatus.value = '';
        if (filterLocation) filterLocation.value = '';
        if (filterBedrooms) filterBedrooms.value = '';
        if (searchInput) searchInput.value = '';
        if (sortProperties) sortProperties.value = 'featured';
        
        filterProperties();
    }

    // ===== SLIDER NAVIGATION =====
    function initSliderNavigation() {
        const prevBtn = document.getElementById('sliderPrev');
        const nextBtn = document.getElementById('sliderNext');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                sliderIndex = (sliderIndex - 1 + filteredProperties.length) % filteredProperties.length;
                renderSliderView();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                sliderIndex = (sliderIndex + 1) % filteredProperties.length;
                renderSliderView();
            });
        }

        // Auto-advance every 5 seconds
        setInterval(() => {
            if (currentView === 'slider' && filteredProperties.length > 0) {
                sliderIndex = (sliderIndex + 1) % filteredProperties.length;
                renderSliderView();
            }
        }, 5000);
    }

    // ===== FILTERS TOGGLE =====
    function initFiltersToggle() {
        const toggle = document.getElementById('filtersToggle');
        const panel = document.getElementById('filtersPanel');
        const chevron = document.getElementById('filtersChevron');

        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('hidden');
                chevron.classList.toggle('rotate-180');
            });
        }
    }

    // ===== DEBOUNCE =====
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ===== INITIALIZE =====
    async function init() {
        console.log('[Properties] Initializing...');
        
        // Load properties
        propertiesData = await loadProperties();
        filteredProperties = [...propertiesData];
        
        // Initial render
        updateAllViews();
        
        // Setup view tabs
        viewTabs.forEach(btn => {
            btn.addEventListener('click', function() {
                switchView(this.dataset.view);
            });
        });

        // Setup filters
        if (filterType) filterType.addEventListener('change', () => { currentFilters.type = filterType.value; filterProperties(); });
        if (filterStatus) filterStatus.addEventListener('change', () => { currentFilters.status = filterStatus.value; filterProperties(); });
        if (filterLocation) filterLocation.addEventListener('change', () => { currentFilters.location = filterLocation.value; filterProperties(); });
        if (filterBedrooms) filterBedrooms.addEventListener('change', () => { currentFilters.bedrooms = filterBedrooms.value; filterProperties(); });
        if (searchInput) searchInput.addEventListener('input', debounce(() => { currentFilters.search = searchInput.value; filterProperties(); }, 300));
        if (sortProperties) sortProperties.addEventListener('change', () => { currentFilters.sortBy = sortProperties.value; filterProperties(); });
        if (applyFilters) applyFilters.addEventListener('click', filterProperties);
        if (resetFilters) resetFilters.addEventListener('click', resetFiltersFn);

        // Initialize additional features
        initSliderNavigation();
        initFiltersToggle();

        // Quick filters
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                if (filter === 'featured') currentFilters.sortBy = 'featured';
                if (filter === 'sale') currentFilters.status = 'sale';
                if (filter === 'rent') currentFilters.status = 'rent';
                if (filter === 'new') currentFilters.sortBy = 'newest';
                filterProperties();
            });
        });

        // Set default view
        switchView('grid');

        console.log('[Properties] Initialized with', propertiesData.length, 'properties');
    }

    // Expose reset function globally
    window.resetAllFilters = resetFiltersFn;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
