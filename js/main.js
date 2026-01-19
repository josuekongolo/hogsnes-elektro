/**
 * Hogsnes Elektro - Main JavaScript
 * Professional Electrician Website
 */

(function() {
    'use strict';

    // =====================================================
    // DOM ELEMENTS
    // =====================================================
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // =====================================================
    // MOBILE MENU
    // =====================================================
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    if (header) {
        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerOffset = header ? header.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                jobType: document.getElementById('jobType').value,
                description: document.getElementById('description').value.trim(),
                siteVisit: document.getElementById('siteVisit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.jobType || !formData.description) {
                showFormError('Vennligst fyll ut alle obligatoriske felt.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormError('Vennligst skriv inn en gyldig e-postadresse.');
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[0-9\s]{8,}$/;
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                showFormError('Vennligst skriv inn et gyldig telefonnummer.');
                return;
            }

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sender...';

            try {
                // Prepare email content
                const jobTypeLabels = {
                    'elbillader': 'Elbillader',
                    'smarthus': 'Smarthus / Automasjon',
                    'sikringsskap': 'Sikringsskap',
                    'belysning': 'Belysning',
                    'bolig': 'Boliginstallasjon',
                    'service': 'Service / Reparasjon',
                    'annet': 'Annet'
                };

                const emailContent = `
Ny henvendelse fra nettsiden

Navn: ${formData.name}
E-post: ${formData.email}
Telefon: ${formData.phone}
Adresse/Område: ${formData.address || 'Ikke oppgitt'}
Type jobb: ${jobTypeLabels[formData.jobType] || formData.jobType}
Ønsker befaring: ${formData.siteVisit ? 'Ja' : 'Nei'}

Beskrivelse:
${formData.description}
                `.trim();

                // For demo purposes, we'll simulate a successful submission
                // In production, you would integrate with Resend API or another email service

                // Simulated API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Log the form data (for development)
                console.log('Form submitted:', formData);
                console.log('Email content:', emailContent);

                // Show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                showFormError('Det oppstod en feil. Vennligst prøv igjen eller ring oss direkte.');

                // Restore button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });

        // Real-time validation feedback
        const requiredInputs = contactForm.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                // Remove error state on input
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.form-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }

    /**
     * Show form error message
     * @param {string} message - Error message to display
     */
    function showFormError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.form-error-global');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-global';
        errorDiv.style.cssText = `
            background-color: var(--color-error-light);
            border: 1px solid var(--color-error);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
            color: var(--color-error);
            text-align: center;
        `;
        errorDiv.textContent = message;

        // Insert at top of form
        contactForm.insertBefore(errorDiv, contactForm.firstChild);

        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Validate individual input
     * @param {HTMLElement} input - Input element to validate
     */
    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (input.required && !value) {
            isValid = false;
            errorMessage = 'Dette feltet er obligatorisk';
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ugyldig e-postadresse';
            }
        } else if (input.type === 'tel' && value) {
            const phoneRegex = /^(\+47)?[0-9\s]{8,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Ugyldig telefonnummer';
            }
        }

        // Update UI
        if (!isValid) {
            input.classList.add('error');

            // Remove existing error message
            const existingError = input.parentElement.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = errorMessage;
            input.parentElement.appendChild(errorDiv);
        } else {
            input.classList.remove('error');
            const existingError = input.parentElement.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }
        }

        return isValid;
    }

    // =====================================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // =====================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature-item, .value-card, .highlight-box').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // =====================================================
    // LAZY LOADING IMAGES
    // =====================================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // =====================================================
    // CLICK-TO-CALL TRACKING (for analytics)
    // =====================================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone calls (integrate with analytics if needed)
            console.log('Phone click tracked:', this.href);

            // You can add Google Analytics tracking here
            // gtag('event', 'click', { event_category: 'contact', event_label: 'phone_call' });
        });
    });

    // =====================================================
    // FORM INPUT FORMATTING
    // =====================================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters except + at start
            let value = e.target.value.replace(/[^\d+]/g, '');

            // Keep + only at the start
            if (value.indexOf('+') > 0) {
                value = value.replace(/\+/g, '');
            }

            e.target.value = value;
        });
    }

    // =====================================================
    // ACTIVE NAV LINK HIGHLIGHT
    // =====================================================
    function highlightActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (currentPath.endsWith(href) ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    highlightActiveNavLink();

    // =====================================================
    // PRINT FUNCTIONALITY
    // =====================================================
    window.printPage = function() {
        window.print();
    };

    // =====================================================
    // KEYBOARD NAVIGATION
    // =====================================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // =====================================================
    // SERVICE WORKER REGISTRATION (for PWA)
    // =====================================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Uncomment to enable service worker for PWA functionality
            // navigator.serviceWorker.register('/sw.js')
            //     .then(registration => console.log('SW registered'))
            //     .catch(error => console.log('SW registration failed'));
        });
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================

    /**
     * Debounce function for performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
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

    /**
     * Throttle function for performance
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =====================================================
    // INITIALIZATION COMPLETE
    // =====================================================
    console.log('Hogsnes Elektro website initialized');

})();
