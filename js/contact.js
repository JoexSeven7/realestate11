// Contact page JavaScript

function escapeHtmlContact(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function validateEmailContact(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhoneContact(phone) {
    return /^(\+234|0)[0-9]{10}$/.test(phone.replace(/\s+/g, ''));
}

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !validateEmailContact(email)) this.classList.add('border-red-500'); else this.classList.remove('border-red-500');
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone && !validatePhoneContact(phone)) this.classList.add('border-red-500'); else this.classList.remove('border-red-500');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            if (!validateEmailContact(email)) {
                alert('Please enter a valid email address.');
                emailInput.classList.add('border-red-500');
                emailInput.focus();
                return;
            }
            if (phone && !validatePhoneContact(phone)) {
                alert('Please enter a valid phone number (e.g., +234XXXXXXXXXX).');
                phoneInput.classList.add('border-red-500');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            if (typeof showLoader === 'function') showLoader();

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
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
                if (typeof hideLoader === 'function') setTimeout(hideLoader, 1200);
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            answer.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });

    // Prefill product of interest from ?product=ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const productInterest = document.getElementById('productInterest');
    if (productId && productInterest) {
        productInterest.value = 'Product ID: ' + productId;
    }

    console.log('Contact page loaded successfully!');
});
