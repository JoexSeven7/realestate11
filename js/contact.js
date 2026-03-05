// Contact page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const propertyInterest = document.getElementById('propertyInterest').value;
            const message = document.getElementById('message').value;
            const newsletter = document.getElementById('newsletter').checked;
            
            // Validate form
            if (!firstName || !lastName || !email || !phone || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            console.log('Form submitted:', {
                firstName,
                lastName,
                email,
                phone,
                subject,
                propertyInterest,
                message,
                newsletter
            });
            
            alert('Thank you ' + firstName + ' ' + lastName + '! Your message has been sent. We will get back to you within 24 hours.');
            contactForm.reset();
        });
    }
    
    // Map tabs functionality
    const mapTabs = document.querySelectorAll('.map-tab');
    const officeCards = document.querySelectorAll('.office-card');
    const officeMap = document.getElementById('officeMap');
    
    if (mapTabs.length > 0) {
        const mapUrls = {
            lagos: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d3.4472!3d6.4398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4d01e5de6b847fe!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890',
            abuja: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d7.4952!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8c8c8c8c8%3A0x4d01e5de6b847fe!2sAsokoro%2C%20Abuja!5e0!3m2!1sen!2sng!4v1234567890',
            portharcourt: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d7.0134!3d4.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8c8c8c8c8%3A0x4d01e5de6b847fe!2sGRA%2C%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1234567890'
        };
        
        mapTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const location = this.getAttribute('data-location');
                
                // Update active tab
                mapTabs.forEach(t => {
                    t.classList.remove('bg-primary', 'text-white');
                    t.classList.add('bg-gray-200', 'text-gray-700');
                });
                this.classList.remove('bg-gray-200', 'text-gray-700');
                this.classList.add('bg-primary', 'text-white');
                
                // Update office cards
                officeCards.forEach(card => {
                    if (card.getAttribute('data-location') === location) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // Update map
                if (officeMap && mapUrls[location]) {
                    officeMap.src = mapUrls[location];
                }
            });
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle answer visibility
            answer.classList.toggle('hidden');
            
            // Rotate icon
            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        });
    });
    
    // Get property ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property');
    
    if (propertyId && document.getElementById('propertyInterest')) {
        document.getElementById('propertyInterest').value = 'Property ID: ' + propertyId;
    }
    
    console.log('Contact page loaded successfully!');
});
