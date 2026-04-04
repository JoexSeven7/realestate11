// Contact page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form - Handle Formspree submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
                    contactForm.reset();
                } else {
                    alert('There was a problem sending your message. Please try again or contact us directly.');
                }
            } catch (error) {
                alert('There was a problem sending your message. Please try again or contact us directly.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
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
