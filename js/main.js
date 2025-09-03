// Main JavaScript file for Portfolio Website

// Global state
let currentPage = 'home';
let isNavigating = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeLucideIcons();
    initializeScrollAnimations();
    initializeNavigation();
    initializeSplashScreen();
    
    // Set minimum date for date inputs// Main JavaScript file for Portfolio Website

// Global state
let currentPage = 'home';
let isNavigating = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeLucideIcons();
    initializeScrollAnimations();
    initializeNavigation();
    initializeSplashScreen();
    
    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
});

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize the application
function initializeApp() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("your_public_key_here"); // Replace with your EmailJS public key
    }
    
    // Add loading state to body
    document.body.classList.add('loading');
    
    // Remove loading state after a short delay
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);
}

// Splash Screen functionality
function initializeSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    // Show splash screen for 3 seconds
    setTimeout(() => {
        splashScreen.classList.add('exit');
        
        // After exit animation, hide splash and show main content
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('page-3d-enter');
            
            // Initialize scroll animations after content is shown
            setTimeout(() => {
                animateOnScroll();
            }, 500);
        }, 1000);
    }, 3000);
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Toggle mobile navigation
function toggleNav() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// Page navigation
function navigateTo(page) {
    if (isNavigating) return;
    
    isNavigating = true;
    const currentPageEl = document.querySelector('.page.active');
    const targetPageEl = document.getElementById(`${page}-page`);
    
    if (!targetPageEl || currentPage === page) {
        isNavigating = false;
        return;
    }
    
    // Exit animation for current page
    if (currentPageEl) {
        currentPageEl.classList.add('page-3d-exit');
        
        setTimeout(() => {
            currentPageEl.classList.remove('active', 'page-3d-exit');
        }, 600);
    }
    
    // Enter animation for target page
    setTimeout(() => {
        targetPageEl.classList.add('active', 'page-3d-enter');
        currentPage = page;
        
        // Update URL without page reload
        if (page === 'home') {
            window.history.pushState({page}, '', '/');
        } else {
            window.history.pushState({page}, '', `/${page}`);
        }
        
        setTimeout(() => {
            targetPageEl.classList.remove('page-3d-enter');
            isNavigating = false;
            
            // Animate elements on the new page
            animateOnScroll();
            
            // Initialize any page-specific functionality
            initializePageSpecificFeatures(page);
        }, 1200);
    }, page === 'home' ? 300 : 100);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    navigateTo(page);
});

// Smooth scrolling for anchor links
function scrollToSection(sectionId) {
    // First navigate to home if not already there
    if (currentPage !== 'home') {
        navigateTo('home');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
            performScroll(sectionId);
        }, 1500);
    } else {
        performScroll(sectionId);
    }
}

function performScroll(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .about-stats, .skill-category, ' +
        '.project-card, .timeline-item, .contact-info, .contact-cta'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Trigger scroll animations manually
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
        setTimeout(() => {
            if (isElementInViewport(el)) {
                el.classList.add('animated');
            }
        }, index * 100);
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize page-specific features
function initializePageSpecificFeatures(page) {
    switch (page) {
        case 'schedule':
            initializeSchedulePage();
            break;
        case 'resume':
            initializeResumePage();
            break;
        case 'contact':
            initializeContactPage();
            break;
    }
}

// Schedule page functionality
function initializeSchedulePage() {
    const meetingTypes = document.querySelectorAll('.meeting-type');
    const scheduleForm = document.getElementById('schedule-form');
    
    // Meeting type selection
    meetingTypes.forEach(type => {
        type.addEventListener('click', () => {
            meetingTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
        });
    });
    
    // Form submission
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', handleScheduleFormSubmit);
    }
}

// Resume page functionality
function initializeResumePage() {
    // Add any resume-specific interactions here
    console.log('Resume page initialized');
}

// Contact page functionality
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Handle schedule form submission
function handleScheduleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Schedule form data:', data);
    
    // Here you would typically send the data to a backend service
    // For now, we'll just show a success message
    showToast('success', 'Meeting Scheduled!', 'Thank you! I\'ll get back to you within 24 hours to confirm the details.');
    
    // Reset form
    e.target.reset();
    
    // Reset meeting type selection
    const meetingTypes = document.querySelectorAll('.meeting-type');
    meetingTypes.forEach(type => type.classList.remove('active'));
}

// Handle contact form submission with EmailJS
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Check if EmailJS is configured
        if (typeof emailjs === 'undefined' || !emailjs) {
            throw new Error('EmailJS not configured');
        }
        
        // EmailJS configuration
        const serviceId = 'service_xxxxxxx'; // Replace with your EmailJS service ID
        const templateId = 'template_xxxxxxx'; // Replace with your EmailJS template ID
        
        // Check if EmailJS is properly configured
        if (serviceId === 'service_xxxxxxx' || templateId === 'template_xxxxxxx') {
            // Demo mode - show success message without actually sending email
            showToast('success', 'Demo Mode: Message would be sent! 🎉', 
                'EmailJS is not configured yet. In production, this would send an email to kwizerarsn@gmail.com');
            
            console.log('Form data that would be sent:', data);
            form.reset();
            return;
        }
        
        // Template parameters for EmailJS
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_name: 'Kwizera Arsene',
            to_email: 'kwizerarsn@gmail.com',
        };
        
        // Send email using EmailJS
        const response = await emailjs.send(serviceId, templateId, templateParams);
        
        if (response.status === 200) {
            showToast('success', 'Message sent successfully! 🎉', 
                'Thank you for reaching out. I\'ll get back to you within 24 hours.');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showToast('error', 'Failed to send message 😞', 
            'Please try again or contact me directly at kwizerarsn@gmail.com');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
    }
}

// Toast notification system
function showToast(type, title, message, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <h4 class="toast-title">${title}</h4>
            <button class="toast-close" onclick="closeToast(this)">×</button>
        </div>
        <p class="toast-message">${message}</p>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove toast
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

// Close toast
function closeToast(button) {
    const toast = button.closest('.toast');
    removeToast(toast);
}

// Remove toast
function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Download resume functionality
function downloadResume() {
    // In a real implementation, this would download a PDF file
    showToast('info', 'PDF Download', 'In a real implementation, this would download the resume as a PDF file.');
    
    // Simulate download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Resume PDF would be downloaded here';
    link.download = 'Kwizera_Arsene_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Responsive navigation handling
window.addEventListener('resize', debounce(() => {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
}, 250));

// Smooth scroll behavior for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Parallax effect for background shapes
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const bgShapes = document.querySelectorAll('.bg-shape');
    
    bgShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}, 16));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.remove('active');
        
        // Close any open toasts
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(toast => removeToast(toast));
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                navigateTo('home');
                break;
            case '2':
                e.preventDefault();
                navigateTo('schedule');
                break;
            case '3':
                e.preventDefault();
                navigateTo('resume');
                break;
            case '4':
                e.preventDefault();
                navigateTo('contact');
                break;
        }
    }
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show error toasts for every error, but log them
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed');
            });
    });
}
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
});

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize the application
function initializeApp() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("H29aues5IzHpsK6Hs"); // Replace with your EmailJS public key
    }
    
    // Add loading state to body
    document.body.classList.add('loading');
    
    // Remove loading state after a short delay
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);
}

// Splash Screen functionality
function initializeSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    // Show splash screen for 3 seconds
    setTimeout(() => {
        splashScreen.classList.add('exit');
        
        // After exit animation, hide splash and show main content
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('page-3d-enter');
            
            // Initialize scroll animations after content is shown
            setTimeout(() => {
                animateOnScroll();
            }, 500);
        }, 1000);
    }, 3000);
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Toggle mobile navigation
function toggleNav() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// Page navigation
function navigateTo(page) {
    if (isNavigating) return;
    
    isNavigating = true;
    const currentPageEl = document.querySelector('.page.active');
    const targetPageEl = document.getElementById(`${page}-page`);
    
    if (!targetPageEl || currentPage === page) {
        isNavigating = false;
        return;
    }
    
    // Exit animation for current page
    if (currentPageEl) {
        currentPageEl.classList.add('page-3d-exit');
        
        setTimeout(() => {
            currentPageEl.classList.remove('active', 'page-3d-exit');
        }, 600);
    }
    
    // Enter animation for target page
    setTimeout(() => {
        targetPageEl.classList.add('active', 'page-3d-enter');
        currentPage = page;
        
        // Update URL without page reload
        if (page === 'home') {
            window.history.pushState({page}, '', '/');
        } else {
            window.history.pushState({page}, '', `/${page}`);
        }
        
        setTimeout(() => {
            targetPageEl.classList.remove('page-3d-enter');
            isNavigating = false;
            
            // Animate elements on the new page
            animateOnScroll();
            
            // Initialize any page-specific functionality
            initializePageSpecificFeatures(page);
        }, 1200);
    }, page === 'home' ? 300 : 100);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    navigateTo(page);
});

// Smooth scrolling for anchor links
function scrollToSection(sectionId) {
    // First navigate to home if not already there
    if (currentPage !== 'home') {
        navigateTo('home');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
            performScroll(sectionId);
        }, 1500);
    } else {
        performScroll(sectionId);
    }
}

function performScroll(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .about-stats, .skill-category, ' +
        '.project-card, .timeline-item, .contact-info, .contact-cta'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Trigger scroll animations manually
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
        setTimeout(() => {
            if (isElementInViewport(el)) {
                el.classList.add('animated');
            }
        }, index * 100);
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize page-specific features
function initializePageSpecificFeatures(page) {
    switch (page) {
        case 'schedule':
            initializeSchedulePage();
            break;
        case 'resume':
            initializeResumePage();
            break;
        case 'contact':
            initializeContactPage();
            break;
    }
}

// Schedule page functionality
function initializeSchedulePage() {
    const meetingTypes = document.querySelectorAll('.meeting-type');
    const scheduleForm = document.getElementById('schedule-form');
    
    // Meeting type selection
    meetingTypes.forEach(type => {
        type.addEventListener('click', () => {
            meetingTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
        });
    });
    
    // Form submission
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', handleScheduleFormSubmit);
    }
}

// Resume page functionality
function initializeResumePage() {
    // Add any resume-specific interactions here
    console.log('Resume page initialized');
}

// Contact page functionality
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Handle schedule form submission
function handleScheduleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Schedule form data:', data);
    
    // Here you would typically send the data to a backend service
    // For now, we'll just show a success message
    showToast('success', 'Meeting Scheduled!', 'Thank you! I\'ll get back to you within 24 hours to confirm the details.');
    
    // Reset form
    e.target.reset();
    
    // Reset meeting type selection
    const meetingTypes = document.querySelectorAll('.meeting-type');
    meetingTypes.forEach(type => type.classList.remove('active'));
}

// Handle contact form submission with EmailJS
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Check if EmailJS is configured
        if (typeof emailjs === 'undefined' || !emailjs) {
            throw new Error('EmailJS not configured');
        }
        
        // EmailJS configuration
        const serviceId = 'service_t24rax8'; // Replace with your EmailJS service ID
        const templateId = 'template_zt2ptrb'; // Replace with your EmailJS template ID
        
        // Check if EmailJS is properly configured
        if (serviceId === 'service_t24rax8' || templateId === 'template_zt2ptrb') {
            // Demo mode - show success message without actually sending email
            showToast('success', 'Demo Mode: Message would be sent! 🎉', 
                'EmailJS is not configured yet. In production, this would send an email to kwizerarsn@gmail.com');
            
            console.log('Form data that would be sent:', data);
            form.reset();
            return;
        }
        
        // Template parameters for EmailJS
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_name: 'Kwizera Arsene',
            to_email: 'kwizerarsn@gmail.com',
        };
        
        // Send email using EmailJS
        const response = await emailjs.send(serviceId, templateId, templateParams);
        
        if (response.status === 200) {
            showToast('success', 'Message sent successfully! 🎉', 
                'Thank you for reaching out. I\'ll get back to you within 24 hours.');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showToast('error', 'Failed to send message 😞', 
            'Please try again or contact me directly at kwizerarsn@gmail.com');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
    }
}

// Toast notification system
function showToast(type, title, message, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <h4 class="toast-title">${title}</h4>
            <button class="toast-close" onclick="closeToast(this)">×</button>
        </div>
        <p class="toast-message">${message}</p>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove toast
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

// Close toast
function closeToast(button) {
    const toast = button.closest('.toast');
    removeToast(toast);
}

// Remove toast
function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Download resume functionality
function downloadResume() {
    // In a real implementation, this would download a PDF file
    showToast('info', 'PDF Download', 'In a real implementation, this would download the resume as a PDF file.');
    
    // Simulate download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Resume PDF would be downloaded here';
    link.download = 'Kwizera_Arsene_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Responsive navigation handling
window.addEventListener('resize', debounce(() => {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
}, 250));

// Smooth scroll behavior for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Parallax effect for background shapes
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const bgShapes = document.querySelectorAll('.bg-shape');
    
    bgShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}, 16));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.remove('active');
        
        // Close any open toasts
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(toast => removeToast(toast));
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                navigateTo('home');
                break;
            case '2':
                e.preventDefault();
                navigateTo('schedule');
                break;
            case '3':
                e.preventDefault();
                navigateTo('resume');
                break;
            case '4':
                e.preventDefault();
                navigateTo('contact');
                break;
        }
    }
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show error toasts for every error, but log them
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed');
            });
    });
}
