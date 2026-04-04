// Properties page JavaScript - Simplified and robust implementation

(function() {
    'use strict';

    // DOM Elements
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
    const loadingState = document.getElementById('loadingState');
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterLocation = document.getElementById('filterLocation');
    const filterBedrooms = document.getElementById('filterBedrooms');
    const searchInput = document.getElementById('searchInput');
    const sortProperties = document.getElementById('sortProperties');
    const resetFilters = document.getElementById('resetFilters');
    const propertySearchForm = document.getElementById('propertySearchForm');

    // Global state
    let propertiesData = [];
    let currentFilters = {
        type: '',
        status: '',
        location: '',
        bedrooms: '',
        search: '',
        features: [],
        sortBy: 'featured'
    };

    // Embedded fallback data
    const embeddedPropertiesData = [
        {
            id: 1,
            title: "Luxury Villa in Lekki",
            slug: "luxury-villa-lekki",
            type: "residential",
            status: "sale",
            location: "lagos",
            address: "Lekki Phase 1, Lagos",
            bedrooms: 5,
            bathrooms: 4,
            size: 450,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["parking", "pool", "garden", "security"],
            image: "images/build1.jpeg",
            images: ["images/build1.jpeg", "images/build2.jpeg", "images/build3.jpeg"],
            description: "Experience luxury living at its finest in this stunning 5-bedroom villa located in the prestigious Lekki Phase 1.",
            featured: true,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Modern Apartment in Victoria Island",
            slug: "modern-apartment-vi",
            type: "residential",
            status: "rent",
            location: "lagos",
            address: "Victoria Island, Lagos",
            bedrooms: 3,
            bathrooms: 2,
            size: 180,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["parking", "security", "gym"],
            image: "images/build2.jpeg",
            images: ["images/build2.jpeg", "images/build4.jpeg", "images/build5.jpeg"],
            description: "Contemporary 3-bedroom apartment in the heart of Victoria Island.",
            featured: true,
            createdAt: "2024-02-01"
        },
        {
            id: 3,
            title: "Executive Office Space in Abuja",
            slug: "executive-office-abuja",
            type: "commercial",
            status: "rent",
            location: "abuja",
            address: "Central Business District, Abuja",
            bedrooms: 0,
            bathrooms: 4,
            size: 350,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["parking", "security", "elevator", "gym"],
            image: "images/build3.jpeg",
            images: ["images/build3.jpeg", "images/build5.jpeg", "images/build6.jpeg"],
            description: "Premium office space in the heart of Abuja's business district.",
            featured: false,
            createdAt: "2024-02-10"
        },
        {
            id: 4,
            title: "Beachfront Plot in Port Harcourt",
            slug: "beachfront-plot-ph",
            type: "land",
            status: "sale",
            location: "portharcourt",
            address: "Oil Mill Field, Port Harcourt",
            bedrooms: 0,
            bathrooms: 0,
            size: 1200,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["security"],
            image: "images/build4.jpeg",
            images: ["images/build4.jpeg", "images/build1.jpeg", "images/build2.jpeg"],
            description: "Prime beachfront plot perfect for development.",
            featured: true,
            createdAt: "2024-02-15"
        },
        {
            id: 5,
            title: "Penthouse Suite in Ikoyi",
            slug: "penthouse-ikoyi",
            type: "residential",
            status: "sale",
            location: "lagos",
            address: "Ikoyi, Lagos",
            bedrooms: 4,
            bathrooms: 4,
            size: 320,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["parking", "pool", "security", "elevator"],
            image: "images/build5.jpeg",
            images: ["images/build5.jpeg", "images/build6.jpeg", "images/build1.jpeg"],
            description: "Luxurious penthouse with panoramic views of Ikoyi.",
            featured: true,
            createdAt: "2024-02-20"
        },
        {
            id: 6,
            title: "Commercial Plaza in Ibadan",
            slug: "commercial-plaza-ibadan",
            type: "commercial",
            status: "sale",
            location: "ibadan",
            address: "Ring Road, Ibadan",
            bedrooms: 0,
            bathrooms: 8,
            size: 2500,
            price: 0,
            priceDisplay: "Contact for price",
            features: ["parking", "security", "elevator"],
            image: "images/build6.jpeg",
            images: ["images/build6.jpeg", "images/build3.jpeg", "images/build4.jpeg"],
            description: "Multi-story commercial plaza in prime location.",
            featured: false,
            createdAt: "2024-02-25"
        }
    ];

    // Load properties from JSON
    async function loadProperties() {
        try {
            const response = await fetch('data/properties.json');
            
            if (!response.ok) {
                throw new Error('Failed to load properties');
            }
            
            const data = await response.json();
            let propertiesArray = data.properties;
            
            // Handle nested structure for backward compatibility
            if (propertiesArray && propertiesArray.properties) {
                propertiesArray = propertiesArray.properties;
            }
            
            if (!Array.isArray(propertiesArray)) {
                throw new Error('Invalid properties data');
            }
            
            return propertiesArray;
        } catch (error) {
            console.error('Error loading properties:', error);
            return embeddedPropertiesData;
        }
    }

    // Generate property card HTML
    function generatePropertyCard(property) {
        const statusBadge = property.status === 'sale'
            ? '<span class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">For Sale</span>'
            : '<span class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">For Rent</span>';
        
        const featuredBadge = property.featured
            ? '<span class="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">Featured</span>'
            : '';
        
        const featuresString = property.features ? property.features.join(',') : '';
        
        // Build specs based on property type
        let specsDisplay = '';
        if (property.type === 'commercial') {
            specsDisplay = `
                <span><i class="fas fa-building mr-1"></i> ${property.floors || 'Multi'} Floors</span>
                <span><i class="fas fa-parking mr-1"></i> ${property.parkingSpaces || 0} Spaces</span>
                <span><i class="fas fa-ruler-combined mr-1"></i> ${property.size} sqm</span>
            `;
        } else if (property.type === 'land') {
            specsDisplay = `
                <span><i class="fas fa-ruler-combined mr-1"></i> ${property.size} sqm</span>
                <span><i class="fas fa-map mr-1"></i> ${property.landType || 'Plot'}</span>
            `;
        } else {
            specsDisplay = `
                <span><i class="fas fa-bed mr-1"></i> ${property.bedrooms || 0} Beds</span>
                <span><i class="fas fa-bath mr-1"></i> ${property.bathrooms || 0} Baths</span>
                <span><i class="fas fa-ruler-combined mr-1"></i> ${property.size} sqm</span>
            `;
        }

        return `
            <div class="property-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                 data-type="${property.type}"
                 data-status="${property.status}"
                 data-location="${property.location}"
                 data-bedrooms="${property.bedrooms || 0}"
                 data-features="${featuresString}"
                 data-id="${property.id}">
                <div class="relative">
                    <img src="${property.image}" alt="${property.title}" class="w-full h-48 object-cover" onerror="this.src='images/build1.jpeg'">
                    ${featuredBadge}
                    ${statusBadge}
                    <button class="favorite-btn absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors" data-id="${property.id}">
                        <i class="far fa-heart text-gray-600"></i>
                    </button>
                </div>
                <div class="p-5">
                    <h3 class="property-title text-lg font-semibold text-gray-900 mb-2">${property.title}</h3>
                    <p class="property-location text-gray-600 mb-3"><i class="fas fa-map-marker-alt text-primary mr-2"></i> ${property.address}</p>
                    <div class="flex gap-2 text-sm text-gray-500 mb-4">
                        ${specsDisplay}
                    </div>
                    <div class="flex gap-2">
                        <a href="property-detail.html?id=${property.id}" class="flex-1 text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
                        <a href="contact.html?property=${property.id}" class="flex-1 text-center bg-secondary text-white px-4 py-2 rounded-lg hover:bg-maroonDark transition-colors">Contact Agent</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render properties to grid
    function renderProperties(properties) {
        // Clear loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (!propertiesGrid) {
            console.error('propertiesGrid element not found');
            return;
        }
        
        if (!properties || properties.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 text-lg">No properties found matching your criteria.</p>
                    <p class="text-gray-500 mt-2">Try adjusting your filters or <button class="text-primary underline" onclick="window.resetAllFilters()">reset filters</button></p>
                </div>
            `;
            updateResultsCount(0);
            return;
        }
        
        const html = properties.map(generatePropertyCard).join('');
        propertiesGrid.innerHTML = html;
        updateResultsCount(properties.length);
        
        // Attach favorite button listeners
        attachFavoriteListeners();
    }

    // Update results count
    function updateResultsCount(count) {
        if (resultsCount) {
            resultsCount.textContent = count;
        }
    }

    // Filter properties based on current filters
    function filterProperties() {
        let filtered = [...propertiesData];
        
        // Filter by type
        if (currentFilters.type) {
            filtered = filtered.filter(p => p.type === currentFilters.type);
        }
        
        // Filter by status
        if (currentFilters.status) {
            filtered = filtered.filter(p => p.status === currentFilters.status);
        }
        
        // Filter by location
        if (currentFilters.location) {
            filtered = filtered.filter(p => p.location === currentFilters.location);
        }
        
        // Filter by bedrooms
        if (currentFilters.bedrooms) {
            const min = parseInt(currentFilters.bedrooms);
            filtered = filtered.filter(p => (p.bedrooms || 0) >= min);
        }
        
        // Filter by search
        if (currentFilters.search) {
            const term = currentFilters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(term) ||
                p.address.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        }
        
        // Filter by features
        if (currentFilters.features.length > 0) {
            filtered = filtered.filter(p => 
                currentFilters.features.every(f => p.features && p.features.includes(f))
            );
        }
        
        // Sort
        filtered = sortProperties(filtered, currentFilters.sortBy);
        
        renderProperties(filtered);
    }

    // Sort properties
    function sortProperties(properties, sortBy) {
        const sorted = [...properties];
        
        switch(sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'price-high':
                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'price-low':
                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'size':
                sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
                break;
            case 'featured':
            default:
                sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        
        return sorted;
    }

    // Reset all filters
    function resetAllFilters() {
        currentFilters = {
            type: '',
            status: '',
            location: '',
            bedrooms: '',
            search: '',
            features: [],
            sortBy: 'featured'
        };
        
        // Reset form inputs
        if (propertySearchForm) {
            propertySearchForm.reset();
        }
        
        if (sortProperties) {
            sortProperties.value = 'featured';
        }
        
        // Uncheck all feature checkboxes
        document.querySelectorAll('#propertySearchForm input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        renderProperties(propertiesData);
    }

    // Attach favorite button listeners
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

    // Initialize
    async function init() {
        console.log('[init] Starting...');
        
        // Load properties
        propertiesData = await loadProperties();
        console.log('[init] Loaded properties:', propertiesData.length);
        
        // Render initial properties
        renderProperties(propertiesData);
        console.log('[init] Render complete');
        
        // Setup filter event listeners
        if (filterType) {
            filterType.addEventListener('change', function() {
                currentFilters.type = this.value;
                filterProperties();
            });
        }
        
        if (filterStatus) {
            filterStatus.addEventListener('change', function() {
                currentFilters.status = this.value;
                filterProperties();
            });
        }
        
        if (filterLocation) {
            filterLocation.addEventListener('change', function() {
                currentFilters.location = this.value;
                filterProperties();
            });
        }
        
        if (filterBedrooms) {
            filterBedrooms.addEventListener('change', function() {
                currentFilters.bedrooms = this.value;
                filterProperties();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                currentFilters.search = this.value;
                filterProperties();
            }, 300));
        }
        
        if (sortProperties) {
            sortProperties.addEventListener('change', function() {
                currentFilters.sortBy = this.value;
                filterProperties();
            });
        }
        
        // Feature checkboxes
        document.querySelectorAll('#propertySearchForm input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    if (!currentFilters.features.includes(this.value)) {
                        currentFilters.features.push(this.value);
                    }
                } else {
                    currentFilters.features = currentFilters.features.filter(f => f !== this.value);
                }
                filterProperties();
            });
        });
        
        // Reset filters button
        if (resetFilters) {
            resetFilters.addEventListener('click', resetAllFilters);
        }
        
        // Form submit - prevent default and filter
        if (propertySearchForm) {
            propertySearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                filterProperties();
            });
        }
        
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.view-btn').forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-600');
                });
                this.classList.remove('bg-gray-200', 'text-gray-600');
                this.classList.add('bg-primary', 'text-white');
                
                const view = this.dataset.view;
                if (view === 'list') {
                    propertiesGrid.classList.remove('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3');
                    propertiesGrid.classList.add('grid-cols-1');
                } else {
                    propertiesGrid.classList.remove('grid-cols-1');
                    propertiesGrid.classList.add('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3');
                }
            });
        });
        
        console.log('Properties page initialized');
    }

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Expose reset function globally
    window.resetAllFilters = resetAllFilters;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();