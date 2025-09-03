// Form handling and validation

// Form validation utilities
class FormValidator {
    constructor() {
        this.rules = new Map();
        this.errorMessages = new Map();
        this.init();
    }
    
    init() {
        // Default validation rules
        this.addRule('required', (value) => value && value.trim() !== '');
        this.addRule('email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        this.addRule('phone', (value) => /^\+?[\d\s\-\(\)]+$/.test(value));
        this.addRule('minLength', (value, min) => value && value.length >= min);
        this.addRule('maxLength', (value, max) => value && value.length <= max);
        this.addRule('url', (value) => /^https?:\/\/.+\..+/.test(value));
        
        // Default error messages
        this.setErrorMessage('required', 'This field is required');
        this.setErrorMessage('email', 'Please enter a valid email address');
        this.setErrorMessage('phone', 'Please enter a valid phone number');
        this.setErrorMessage('minLength', 'This field must be at least {0} characters long');
        this.setErrorMessage('maxLength', 'This field must be no more than {0} characters long');
        this.setErrorMessage('url', 'Please enter a valid URL');
    }
    
    addRule(name, validator) {
        this.rules.set(name, validator);
    }
    
    setErrorMessage(rule, message) {
        this.errorMessages.set(rule, message);
    }
    
    validateField(field, rules) {
        const value = field.value;
        const errors = [];
        
        for (const rule of rules) {
            const [ruleName, ...params] = rule.split(':');
            const validator = this.rules.get(ruleName);
            
            if (validator && !validator(value, ...params)) {
                let message = this.errorMessages.get(ruleName) || 'Invalid value';
                // Replace placeholders in error message
                params.forEach((param, index) => {
                    message = message.replace(`{${index}}`, param);
                });
                errors.push(message);
            }
        }
        
        return errors;
    }
    
    validateForm(form) {
        const errors = new Map();
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            const rules = field.dataset.validate.split('|');
            const fieldErrors = this.validateField(field, rules);
            
            if (fieldErrors.length > 0) {
                errors.set(field.name || field.id, fieldErrors);
            }
        });
        
        return errors;
    }
    
    showFieldError(field, errors) {
        // Remove existing error
        this.clearFieldError(field);
        
        if (errors.length === 0) return;
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errors[0]; // Show first error
        errorElement.style.cssText = `
            color: var(--destructive);
            font-size: var(--font-size-xs);
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        // Add error styling to field
        field.classList.add('error');
        field.style.borderColor = 'var(--destructive)';
        
        // Insert error message
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.classList.remove('error');
        field.style.borderColor = '';
    }
    
    showFormErrors(form, errors) {
        // Clear all existing errors
        this.clearFormErrors(form);
        
        // Show individual field errors
        errors.forEach((fieldErrors, fieldName) => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                this.showFieldError(field, fieldErrors);
            }
        });
    }
    
    clearFormErrors(form) {
        const fields = form.querySelectorAll('[data-validate]');
        fields.forEach(field => this.clearFieldError(field));
    }
}

// Initialize form validator
const formValidator = new FormValidator();

// Enhanced form handling
class FormHandler {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    init() {
        // Initialize all forms
        document.querySelectorAll('form').forEach(form => {
            this.initializeForm(form);
        });
    }
    
    initializeForm(form) {
        const formId = form.id || `form_${Math.random().toString(36).substr(2, 9)}`;
        
        this.forms.set(formId, {
            element: form,
            fields: new Map(),
            isSubmitting: false
        });
        
        // Add real-time validation
        this.addRealTimeValidation(form);
        
        // Add form submission handling
        this.addSubmissionHandling(form);
        
        // Add field enhancements
        this.addFieldEnhancements(form);
    }
    
    addRealTimeValidation(form) {
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            // Clear errors on input
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    formValidator.clearFieldError(field);
                }
            });
        });
    }
    
    addSubmissionHandling(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }
    
    addFieldEnhancements(form) {
        // Add floating labels
        this.addFloatingLabels(form);
        
        // Add input masks
        this.addInputMasks(form);
        
        // Add character counters
        this.addCharacterCounters(form);
        
        // Add file upload enhancements
        this.addFileUploadEnhancements(form);
    }
    
    addFloatingLabels(form) {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        
        inputs.forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (!label) return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'floating-label-wrapper';
            wrapper.style.cssText = 'position: relative;';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            
            label.style.cssText = `
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                background: var(--input-background);
                padding: 0 0.25rem;
                transition: all 0.3s ease;
                pointer-events: none;
                color: var(--muted-foreground);
            `;
            
            const updateLabel = () => {
                if (input.value || input === document.activeElement) {
                    label.style.top = '0';
                    label.style.fontSize = 'var(--font-size-xs)';
                    label.style.color = 'var(--primary)';
                } else {
                    label.style.top = '50%';
                    label.style.fontSize = 'var(--font-size-base)';
                    label.style.color = 'var(--muted-foreground)';
                }
            };
            
            input.addEventListener('focus', updateLabel);
            input.addEventListener('blur', updateLabel);
            input.addEventListener('input', updateLabel);
            
            // Initial state
            updateLabel();
        });
    }
    
    addInputMasks(form) {
        // Phone number masking
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 10) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            });
        });
        
        // Date inputs
        const dateInputs = form.querySelectorAll('input[data-mask="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 4) {
                    value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
                }
                e.target.value = value;
            });
        });
    }
    
    addCharacterCounters(form) {
        const textareas = form.querySelectorAll('textarea[data-max-length]');
        
        textareas.forEach(textarea => {
            const maxLength = parseInt(textarea.dataset.maxLength);
            
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: var(--font-size-xs);
                color: var(--muted-foreground);
                margin-top: 0.25rem;
            `;
            
            const updateCounter = () => {
                const length = textarea.value.length;
                counter.textContent = `${length}/${maxLength}`;
                
                if (length > maxLength * 0.8) {
                    counter.style.color = 'var(--destructive)';
                } else {
                    counter.style.color = 'var(--muted-foreground)';
                }
            };
            
            textarea.addEventListener('input', updateCounter);
            textarea.parentNode.appendChild(counter);
            
            updateCounter();
        });
    }
    
    addFileUploadEnhancements(form) {
        const fileInputs = form.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'file-upload-wrapper';
            
            const dropZone = document.createElement('div');
            dropZone.className = 'file-drop-zone';
            dropZone.style.cssText = `
                border: 2px dashed var(--border);
                border-radius: var(--radius-lg);
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            dropZone.innerHTML = `
                <div class="drop-zone-content">
                    <i data-lucide="upload" style="margin-bottom: 1rem; color: var(--primary);"></i>
                    <p>Click to upload or drag and drop</p>
                    <small>Supported formats: PDF, DOC, DOCX</small>
                </div>
            `;
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(dropZone);
            wrapper.appendChild(input);
            
            input.style.display = 'none';
            
            // Click to upload
            dropZone.addEventListener('click', () => input.click());
            
            // Drag and drop
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.style.borderColor = 'var(--primary)';
                    dropZone.style.background = 'rgba(99, 102, 241, 0.05)';
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.style.borderColor = 'var(--border)';
                    dropZone.style.background = 'transparent';
                });
            });
            
            dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                input.files = files;
                this.updateFileDisplay(dropZone, files);
            });
            
            input.addEventListener('change', (e) => {
                this.updateFileDisplay(dropZone, e.target.files);
            });
        });
    }
    
    updateFileDisplay(dropZone, files) {
        if (files.length > 0) {
            const fileNames = Array.from(files).map(file => file.name).join(', ');
            dropZone.querySelector('.drop-zone-content').innerHTML = `
                <i data-lucide="file-check" style="margin-bottom: 1rem; color: var(--primary);"></i>
                <p style="color: var(--primary);">Files selected:</p>
                <small>${fileNames}</small>
            `;
        }
    }
    
    validateField(field) {
        const rules = field.dataset.validate ? field.dataset.validate.split('|') : [];
        const errors = formValidator.validateField(field, rules);
        formValidator.showFieldError(field, errors);
        return errors.length === 0;
    }
    
    async handleFormSubmission(form) {
        const formData = this.forms.get(form.id);
        if (!formData || formData.isSubmitting) return;
        
        // Validate form
        const errors = formValidator.validateForm(form);
        
        if (errors.size > 0) {
            formValidator.showFormErrors(form, errors);
            this.shakeForm(form);
            return;
        }
        
        // Set submitting state
        formData.isSubmitting = true;
        this.setFormSubmittingState(form, true);
        
        try {
            // Handle different form types
            if (form.id === 'contact-form') {
                await this.handleContactForm(form);
            } else if (form.id === 'schedule-form') {
                await this.handleScheduleForm(form);
            } else {
                await this.handleGenericForm(form);
            }
            
            // Success feedback
            this.showFormSuccess(form);
            this.resetForm(form);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(form, error.message);
        } finally {
            formData.isSubmitting = false;
            this.setFormSubmittingState(form, false);
        }
    }
    
    async handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // EmailJS integration (if configured)
        if (typeof emailjs !== 'undefined' && emailjs) {
            const serviceId = 'service_xxxxxxx';
            const templateId = 'template_xxxxxxx';
            
            if (serviceId !== 'service_xxxxxxx' && templateId !== 'template_xxxxxxx') {
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                    to_name: 'Kwizera Arsene',
                    to_email: 'kwizerarsn@gmail.com',
                };
                
                const response = await emailjs.send(serviceId, templateId, templateParams);
                
                if (response.status !== 200) {
                    throw new Error('Failed to send email');
                }
            } else {
                // Demo mode
                console.log('Contact form data (demo mode):', data);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            }
        } else {
            // Fallback: just log the data
            console.log('Contact form data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    async handleScheduleForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // In a real app, this would send to a scheduling service
        console.log('Schedule form data:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    async handleGenericForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Generic form data:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setFormSubmittingState(form, isSubmitting) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        
        if (submitBtn) {
            submitBtn.disabled = isSubmitting;
            
            if (btnText && btnLoading) {
                btnText.style.display = isSubmitting ? 'none' : 'inline-flex';
                btnLoading.style.display = isSubmitting ? 'inline-flex' : 'none';
            }
        }
        
        // Disable all form inputs
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = isSubmitting;
        });
    }
    
    showFormSuccess(form) {
        if (form.id === 'contact-form') {
            showToast('success', 'Message sent successfully! 🎉', 
                'Thank you for reaching out. I\'ll get back to you within 24 hours.');
        } else if (form.id === 'schedule-form') {
            showToast('success', 'Meeting scheduled! 📅', 
                'Thank you! I\'ll get back to you within 24 hours to confirm the details.');
        } else {
            showToast('success', 'Form submitted successfully!', 
                'Thank you for your submission.');
        }
    }
    
    showFormError(form, message) {
        showToast('error', 'Submission failed', 
            message || 'Please try again or contact me directly.');
    }
    
    shakeForm(form) {
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
    
    resetForm(form) {
        form.reset();
        formValidator.clearFormErrors(form);
        
        // Reset floating labels
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.dispatchEvent(new Event('blur'));
        });
        
        // Reset file uploads
        const fileWrappers = form.querySelectorAll('.file-upload-wrapper');
        fileWrappers.forEach(wrapper => {
            const dropZone = wrapper.querySelector('.file-drop-zone');
            if (dropZone) {
                dropZone.querySelector('.drop-zone-content').innerHTML = `
                    <i data-lucide="upload" style="margin-bottom: 1rem; color: var(--primary);"></i>
                    <p>Click to upload or drag and drop</p>
                    <small>Supported formats: PDF, DOC, DOCX</small>
                `;
            }
        });
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
    
    // Re-initialize icons after dynamic content changes
    if (typeof lucide !== 'undefined') {
        const observer = new MutationObserver(() => {
            lucide.createIcons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Form accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to form fields
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            }
        }
    });
    
    // Add ARIA live regions for form feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        form.appendChild(liveRegion);
    });
});
