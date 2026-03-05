// Property detail page JavaScript - Dynamic JSON-based implementation

// Global property data
let currentProperty = null;
let allProperties = [];

// DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
let currentImageIndex = 0;
let propertyImages = [];

// Fetch properties from JSON file
async function fetchProperties() {
    try {
        const response = await fetch('data/properties.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        allProperties = data.properties;
        return allProperties;
    } catch (error) {
        console.error('Error loading properties:', error);
        
        // Check if running from file:// protocol
        const isFileProtocol = window.location.protocol === 'file:';
        const errorMessage = isFileProtocol 
            ? 'This page needs to be served from a web server. Please use a local development server (like Live Server in VS Code) or deploy to a web server.'
            : 'Unable to load property details. Please check your connection and try again later.';
        
        showError(errorMessage);
        return [];
    }
}

// Get property by ID
function getPropertyById(id) {
    return allProperties.find(p => p.id === parseInt(id));
}

// Show error message
function showError(message) {
    const mainContent = document.querySelector('.py-16');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
                <i class="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <a href="properties.html" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-navyLight transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Properties
                </a>
            </div>
        `;
    }
}

// Update page content with property data
function updatePageContent(property) {
    if (!property) {
        showError('The requested property could not be found.');
        return;
    }
    
    currentProperty = property;
    
    // Update page title
    document.title = `${property.title} | ATHARRYS PROPERTIES LIMITED`;
    
    // Update header section
    const propertyTitle = document.getElementById('propertyTitle');
    const propertyLocation = document.getElementById('propertyLocation');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    
    if (propertyTitle) propertyTitle.textContent = property.title;
    if (propertyLocation) propertyLocation.innerHTML = `<i class="fas fa-map-marker-alt mr-2"></i> ${property.address}`;
    if (breadcrumbTitle) breadcrumbTitle.textContent = property.title;
    
    // Update header background image
    const headerSection = document.querySelector('.pt-32.pb-20');
    if (headerSection) {
        headerSection.style.backgroundImage = `url('${property.image}')`;
    }
    
    // Update main image
    if (mainImage) {
        mainImage.src = property.image;
        mainImage.alt = property.title;
    }
    
    // Update images array for gallery
    propertyImages = property.images || [property.image];
    updateThumbnails();
    
    // Update status badge
    const propertyStatus = document.getElementById('propertyStatus');
    if (propertyStatus) {
        if (property.status === 'sale') {
            propertyStatus.textContent = 'For Sale';
            propertyStatus.className = 'bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold';
        } else {
            propertyStatus.textContent = 'For Rent';
            propertyStatus.className = 'bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold';
        }
    }
    
    // Update featured badge
    const featuredBadge = document.querySelector('.bg-accent.text-white.px-4');
    if (featuredBadge && !property.featured) {
        featuredBadge.style.display = 'none';
    }
    
    // Update property specs
    const bedrooms = document.getElementById('bedrooms');
    const bathrooms = document.getElementById('bathrooms');
    const area = document.getElementById('area');
    const parking = document.getElementById('parking');
    
    if (bedrooms) bedrooms.textContent = property.bedrooms || 'N/A';
    if (bathrooms) bathrooms.textContent = property.bathrooms || 'N/A';
    if (area) area.textContent = property.size;
    if (parking) parking.textContent = property.parkingSpaces || 'N/A';
    
    // Update price
    const priceElement = document.getElementById('propertyPrice');
    if (priceElement) {
        priceElement.textContent = property.priceDisplay;
    }
    
    // Update description
    const description = document.getElementById('propertyDescription');
    if (description) {
        description.textContent = property.description;
    }
    
    // Update highlights
    const highlightsList = document.getElementById('highlightsList');
    if (highlightsList && property.highlights) {
        highlightsList.innerHTML = property.highlights.map(highlight => 
            `<li class="flex items-start gap-3"><i class="fas fa-check-circle text-green-500 mt-1"></i><span>${highlight}</span></li>`
        ).join('');
    }
    
    // Update amenities
    const amenitiesList = document.getElementById('amenitiesList');
    if (amenitiesList && property.amenities) {
        amenitiesList.innerHTML = property.amenities.map(amenity => 
            `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="fas fa-check text-primary"></i>
                <span>${amenity}</span>
            </div>`
        ).join('');
    }
    
    // Update year built
    const yearBuilt = document.getElementById('yearBuilt');
    if (yearBuilt) {
        yearBuilt.textContent = property.yearBuilt || 'N/A';
    }
    
    // Update property type
    const propertyType = document.getElementById('propertyType');
    if (propertyType) {
        propertyType.textContent = property.type.charAt(0).toUpperCase() + property.type.slice(1);
    }
    
    // Update contact form property reference
    const propertyInput = document.querySelector('input[name="property"]');
    if (propertyInput) {
        propertyInput.value = property.title;
    }
    
    // Update schedule viewing form
    const viewingPropertyInput = document.querySelector('input[name="viewingProperty"]');
    if (viewingPropertyInput) {
        viewingPropertyInput.value = property.title;
    }
}

// Update thumbnail gallery
function updateThumbnails() {
    const thumbnailContainer = document.querySelector('.grid.grid-cols-5');
    if (!thumbnailContainer || propertyImages.length === 0) return;
    
    thumbnailContainer.innerHTML = propertyImages.map((img, index) => `
        <div class="thumbnail cursor-pointer border-2 ${index === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'} rounded-lg overflow-hidden" data-index="${index}">
            <img src="${img}" alt="Property Image ${index + 1}" class="w-full h-20 object-cover" onerror="this.src='images/build1.jpeg'">
        </div>
    `).join('');
    
    // Re-attach thumbnail click events
    const newThumbnails = document.querySelectorAll('.thumbnail');
    newThumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            updateMainImage(index);
        });
    });
}

// Update main image
function updateMainImage(index) {
    if (!mainImage || propertyImages.length === 0) return;
    
    mainImage.src = propertyImages[index];
    currentImageIndex = index;
    
    // Update thumbnail active state
    const thumbs = document.querySelectorAll('.thumbnail');
    thumbs.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('border-primary');
            thumb.classList.remove('border-transparent');
        } else {
            thumb.classList.remove('border-primary');
            thumb.classList.add('border-transparent');
        }
    });
}

// Initialize gallery navigation
function initGalleryNavigation() {
    // Previous button
    if (galleryPrev) {
        galleryPrev.addEventListener('click', function() {
            if (propertyImages.length === 0) return;
            currentImageIndex = (currentImageIndex - 1 + propertyImages.length) % propertyImages.length;
            updateMainImage(currentImageIndex);
        });
    }
    
    // Next button
    if (galleryNext) {
        galleryNext.addEventListener('click', function() {
            if (propertyImages.length === 0) return;
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            updateMainImage(currentImageIndex);
        });
    }
    
    // Auto-advance gallery every 5 seconds
    setInterval(() => {
        if (propertyImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            updateMainImage(currentImageIndex);
        }
    }, 5000);
}

// Initialize contact modal
function initContactModal() {
    const contactModal = document.getElementById('contactModal');
    const contactModalContent = document.getElementById('contactModalContent');
    const openContactModal = document.getElementById('openContactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    
    function openModal() {
        if (contactModal && contactModalContent) {
            contactModal.classList.remove('hidden');
            contactModal.classList.add('flex');
            setTimeout(() => {
                contactModalContent.classList.remove('scale-95', 'opacity-0');
                contactModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    }
    
    function closeModal() {
        if (contactModal && contactModalContent) {
            contactModalContent.classList.remove('scale-100', 'opacity-100');
            contactModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                contactModal.classList.remove('flex');
                contactModal.classList.add('hidden');
            }, 300);
        }
    }
    
    if (openContactModal) {
        openContactModal.addEventListener('click', openModal);
    }
    
    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Initialize forms
function initForms() {
    // Contact Agent Form
    const contactAgentForm = document.getElementById('contactAgentForm');
    
    if (contactAgentForm) {
        contactAgentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            
            // Simulate form submission
            alert('Thank you ' + name + '! Your message has been sent. Our agent will contact you shortly.');
            contactAgentForm.reset();
            
            // Close modal
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.classList.add('hidden');
                contactModal.classList.remove('flex');
            }
        });
    }
    
    // Schedule Viewing Form
    const scheduleViewingForm = document.getElementById('scheduleViewingForm');
    
    if (scheduleViewingForm) {
        scheduleViewingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('viewingDate').value;
            const time = document.getElementById('viewingTime').value;
            
            // Simulate form submission
            alert('Thank you! Your viewing has been scheduled for ' + date + ' at ' + time + '. Our agent will confirm the appointment.');
            scheduleViewingForm.reset();
        });
    }
}

// Initialize share buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = window.location.href;
            const title = currentProperty ? currentProperty.title : 'Property Details';
            
            if (this.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            } else if (this.classList.contains('twitter')) {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
            } else if (this.classList.contains('whatsapp')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
            } else if (this.classList.contains('email')) {
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
            }
        });
    });
}

// Initialize other buttons
function initOtherButtons() {
    // Download Brochure
    const downloadBrochure = document.getElementById('downloadBrochure');
    
    if (downloadBrochure) {
        downloadBrochure.addEventListener('click', function() {
            alert('Property brochure download started!');
        });
    }
    
    // Start Virtual Tour
    const startTour = document.getElementById('startTour');
    
    if (startTour) {
        startTour.addEventListener('click', function() {
            alert('Virtual tour feature coming soon!');
        });
    }
}

// Initialize the page
async function initializePage() {
    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (!propertyId) {
        showError('No property specified. Please select a property from the listings.');
        return;
    }
    
    // Fetch properties data
    await fetchProperties();
    
    // Get the specific property
    const property = getPropertyById(propertyId);
    
    if (!property) {
        showError('The requested property could not be found.');
        return;
    }
    
    // Update page content
    updatePageContent(property);
    
    // Initialize gallery navigation
    initGalleryNavigation();
    
    // Initialize contact modal
    initContactModal();
    
    // Initialize forms
    initForms();
    
    // Initialize share buttons
    initShareButtons();
    
    // Initialize other buttons
    initOtherButtons();
    
    console.log('Property detail page loaded successfully for property ID:', propertyId);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
