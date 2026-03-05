// Properties page JavaScript - Dynamic JSON-based implementation

// Global properties data
let propertiesData = [];

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const resultsCount = document.getElementById('resultsCount');
const filterType = document.getElementById('filterType');
const filterStatus = document.getElementById('filterStatus');
const filterLocation = document.getElementById('filterLocation');
const filterBedrooms = document.getElementById('filterBedrooms');
const searchInput = document.getElementById('searchInput');
const featureCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
const sortPropertiesSelect = document.getElementById('sortProperties');
const resetFiltersBtn = document.getElementById('resetFilters');

// Fetch properties from JSON file
async function fetchProperties() {
    try {
        const response = await fetch('data/properties.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        propertiesData = data.properties;
        return propertiesData;
    } catch (error) {
        console.error('Error loading properties:', error);
        
        // Check if running from file:// protocol
        const isFileProtocol = window.location.protocol === 'file:';
        const errorMessage = isFileProtocol 
            ? 'This page needs to be served from a web server to load properties. Please use a local development server (like Live Server in VS Code) or deploy to a web server.'
            : 'Unable to load properties. Please check your connection and try again later.';
        
        // Clear loading state and show error message
        if (propertiesGrid) {
            propertiesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                    <p class="text-gray-700 font-semibold mb-2">Failed to Load Properties</p>
                    <p class="text-gray-600 mb-4">${errorMessage}</p>
                    <button onclick="location.reload()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-navyLight transition-colors">
                        <i class="fas fa-redo mr-2"></i>Retry
                    </button>
                </div>
            `;
        }
        return [];
    }
}

// Generate property card HTML
function generatePropertyCard(property) {
    const statusBadge = property.status === 'sale' 
        ? '<span class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">For Sale</span>'
        : '<span class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">For Rent</span>';
    
    const featuredBadge = property.featured 
        ? '<span class="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>'
        : '';
    
    const featuresString = property.features.join(',');
    
    // Handle different property types for display
    let specsDisplay = '';
    if (property.type === 'commercial') {
        specsDisplay = `
            <span><i class="fas fa-building mr-1"></i> ${property.floors || 'Multi'} Floors</span>
            <span><i class="fas fa-parking mr-1"></i> ${property.parkingSpaces} Spaces</span>
            <span><i class="fas fa-ruler-combined mr-1"></i> ${property.size} sqm</span>
        `;
    } else if (property.type === 'land') {
        specsDisplay = `
            <span><i class="fas fa-ruler-combined mr-1"></i> ${property.size} sqm</span>
            <span><i class="fas fa-map mr-1"></i> ${property.landType || 'Plot'}</span>
        `;
    } else {
        specsDisplay = `
            <span><i class="fas fa-bed mr-1"></i> ${property.bedrooms} Beds</span>
            <span><i class="fas fa-bath mr-1"></i> ${property.bathrooms} Baths</span>
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
                <button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors favorite-btn" data-id="${property.id}">
                    <i class="far fa-heart text-gray-600"></i>
                </button>
            </div>
            <div class="p-5">
                <h3 class="property-title text-lg font-semibold text-gray-900 mb-2">${property.title}</h3>
                <p class="property-location text-gray-600 mb-3"><i class="fas fa-map-marker-alt text-primary mr-2"></i> ${property.address}</p>
                
               
                <div class="flex gap-2">
                    <a href="property-detail.html?id=${property.id}" class="flex-1 text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
                    <a href="contact.html?property=${property.id}" class="flex-1 text-center bg-secondary text-white px-4 py-2 rounded-lg hover:bg-maroonDark transition-colors">Contact Agent</a>
                </div>
            </div>
        </div>
    `;
}

// Render properties to the grid
function renderProperties(properties) {
    if (!propertiesGrid) return;
    
    if (properties.length === 0) {
        propertiesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <p class="text-gray-500 mt-2">Try adjusting your filters or <button class="text-primary underline" onclick="resetFilters()">reset filters</button></p>
            </div>
        `;
        updateResultsCount(0);
        return;
    }
    
    const propertiesHTML = properties.map(generatePropertyCard).join('');
    propertiesGrid.innerHTML = propertiesHTML;
    updateResultsCount(properties.length);
    
    // Re-attach favorite button listeners
    attachFavoriteListeners();
}

// Update results count display
function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = count;
    }
}

// Filter properties based on current filter values
function filterProperties() {
    let filteredProperties = [...propertiesData];
    
    // Filter by type
    if (filterType && filterType.value) {
        filteredProperties = filteredProperties.filter(p => p.type === filterType.value);
    }
    
    // Filter by status
    if (filterStatus && filterStatus.value) {
        filteredProperties = filteredProperties.filter(p => p.status === filterStatus.value);
    }
    
    // Filter by location
    if (filterLocation && filterLocation.value) {
        filteredProperties = filteredProperties.filter(p => p.location === filterLocation.value);
    }
    
    // Filter by bedrooms
    if (filterBedrooms && filterBedrooms.value) {
        const minBedrooms = parseInt(filterBedrooms.value);
        filteredProperties = filteredProperties.filter(p => (p.bedrooms || 0) >= minBedrooms);
    }
    
    // Filter by search term
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredProperties = filteredProperties.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || 
            p.address.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by features
    const selectedFeatures = Array.from(featureCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (selectedFeatures.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
            selectedFeatures.every(feature => p.features.includes(feature))
        );
    }
    
    // Apply sorting
    if (sortPropertiesSelect && sortPropertiesSelect.value) {
        filteredProperties = sortProperties(filteredProperties, sortPropertiesSelect.value);
    }
    
    renderProperties(filteredProperties);
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
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'size':
            sorted.sort((a, b) => b.size - a.size);
            break;
        case 'featured':
        default:
            sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    return sorted;
}

// Reset all filters
function resetFilters() {
    if (filterType) filterType.value = '';
    if (filterStatus) filterStatus.value = '';
    if (filterLocation) filterLocation.value = '';
    if (filterBedrooms) filterBedrooms.value = '';
    if (searchInput) searchInput.value = '';
    
    // Uncheck all feature checkboxes
    featureCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset sort to default
    if (sortPropertiesSelect) sortPropertiesSelect.value = 'featured';
    
    // Show all properties
    renderProperties(propertiesData);
}

// Attach favorite button listeners
function attachFavoriteListeners() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.classList.toggle('text-red-500');
            
            // Save to localStorage
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
    
    // Restore favorite states from localStorage
    const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
    favoriteButtons.forEach(btn => {
        if (favorites.includes(btn.dataset.id)) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-red-500');
        }
    });
}

// Initialize the page
async function initializePage() {
    // Fetch properties data
    await fetchProperties();
    
    // Render initial properties
    renderProperties(propertiesData);
    
    // Add event listeners to filters
    if (filterType) filterType.addEventListener('change', filterProperties);
    if (filterStatus) filterStatus.addEventListener('change', filterProperties);
    if (filterLocation) filterLocation.addEventListener('change', filterProperties);
    if (filterBedrooms) filterBedrooms.addEventListener('change', filterProperties);
    if (searchInput) searchInput.addEventListener('input', debounce(filterProperties, 300));
    
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProperties);
    });
    
    // Sort event listener
    if (sortPropertiesSelect) {
        sortPropertiesSelect.addEventListener('change', filterProperties);
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // View toggle buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => {
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
    
    console.log('Properties page loaded successfully!');
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions for external use
window.resetFilters = resetFilters;
window.filterProperties = filterProperties;
