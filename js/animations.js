// Advanced animations and effects

// Animation utilities
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.rafId = null;
        this.isAnimating = false;
    }
    
    // Register an animation
    register(name, element, animation) {
        this.animations.set(name, { element, animation });
    }
    
    // Play an animation
    play(name) {
        const anim = this.animations.get(name);
        if (anim) {
            anim.animation();
        }
    }
    
    // Start animation loop
    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.animate();
    }
    
    // Stop animation loop
    stop() {
        this.isAnimating = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    // Animation loop
    animate() {
        if (!this.isAnimating) return;
        
        // Update all active animations
        this.updateAnimations();
        
        this.rafId = requestAnimationFrame(() => this.animate());
    }
    
    updateAnimations() {
        // Update floating shapes
        this.updateFloatingShapes();
        
        // Update particles
        this.updateParticles();
        
        // Update morphing shapes
        this.updateMorphingShapes();
    }
    
    updateFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const time = Date.now() * 0.001;
            const speed = 0.5 + index * 0.2;
            const amplitude = 20 + index * 10;
            
            const x = Math.sin(time * speed) * amplitude;
            const y = Math.cos(time * speed * 0.7) * amplitude;
            const rotation = time * (10 + index * 5);
            
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        });
    }
    
    updateParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const time = Date.now() * 0.001;
            const delay = index * 0.5;
            const adjustedTime = time - delay;
            
            if (adjustedTime > 0) {
                const progress = (adjustedTime % 3) / 3; // 3 second cycle
                const y = window.innerHeight - (progress * window.innerHeight * 1.2);
                const x = Math.sin(adjustedTime * 2) * 50;
                const opacity = Math.sin(progress * Math.PI);
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
            }
        });
    }
    
    updateMorphingShapes() {
        const shapes = document.querySelectorAll('.morph-shape');
        shapes.forEach((shape, index) => {
            const time = Date.now() * 0.001;
            const speed = 0.3 + index * 0.1;
            
            const radius1 = 30 + Math.sin(time * speed) * 20;
            const radius2 = 70 + Math.cos(time * speed * 1.3) * 20;
            const radius3 = 50 + Math.sin(time * speed * 0.8) * 15;
            const radius4 = 40 + Math.cos(time * speed * 1.1) * 25;
            
            shape.style.borderRadius = `${radius1}% ${radius2}% ${radius3}% ${radius4}% / ${radius4}% ${radius1}% ${radius2}% ${radius3}%`;
        });
    }
}

// Initialize animation controller
const animController = new AnimationController();

// Text animation effects
class TextAnimations {
    static typewriter(element, text, speed = 50) {
        return new Promise((resolve) => {
            element.textContent = '';
            let i = 0;
            
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }
    
    static revealWords(element, staggerDelay = 100) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word-reveal" style="opacity: 0; transform: translateY(20px);">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word-reveal');
        
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * staggerDelay);
        });
    }
    
    static scrambleText(element, finalText, duration = 2000) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const originalText = finalText;
        const textLength = originalText.length;
        let iterations = 0;
        const maxIterations = duration / 50;
        
        const timer = setInterval(() => {
            const progress = iterations / maxIterations;
            const revealCount = Math.floor(progress * textLength);
            
            let scrambledText = '';
            
            for (let i = 0; i < textLength; i++) {
                if (i < revealCount) {
                    scrambledText += originalText[i];
                } else {
                    scrambledText += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            
            element.textContent = scrambledText;
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(timer);
                element.textContent = originalText;
            }
        }, 50);
    }
}

// Particle system
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            color: options.color || '#6366f1',
            size: options.size || 2,
            speed: options.speed || 1,
            direction: options.direction || 'up',
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        
        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            background: ${this.options.color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        
        this.resetParticle(particle);
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    resetParticle(particle) {
        const containerRect = this.container.getBoundingClientRect();
        
        particle.style.left = Math.random() * containerRect.width + 'px';
        particle.style.top = containerRect.height + 'px';
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        
        particle.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: -Math.random() * this.options.speed - 1
        };
        
        particle.life = 0;
        particle.maxLife = Math.random() * 3 + 2;
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.life += 0.016; // ~60fps
            
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            particle.style.left = currentLeft + particle.velocity.x + 'px';
            particle.style.top = currentTop + particle.velocity.y + 'px';
            
            // Fade out over time
            const fadeProgress = particle.life / particle.maxLife;
            particle.style.opacity = Math.max(0, 1 - fadeProgress);
            
            // Reset if particle is dead or out of bounds
            if (particle.life >= particle.maxLife || currentTop < -10) {
                this.resetParticle(particle);
            }
        });
    }
    
    start() {
        this.animate();
    }
    
    animate() {
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Advanced scroll animations
class AdvancedScrollAnimations {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: '-10% 0px -10% 0px'
            }
        );
        
        this.observeElements();
    }
    
    observeElements() {
        // Counter animations
        document.querySelectorAll('[data-counter]').forEach(el => {
            this.observer.observe(el);
        });
        
        // Parallax elements
        document.querySelectorAll('[data-parallax]').forEach(el => {
            this.observer.observe(el);
        });
        
        // Stagger animations
        document.querySelectorAll('[data-stagger]').forEach(el => {
            this.observer.observe(el);
        });
        
        // Morph animations
        document.querySelectorAll('[data-morph]').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.triggerAnimation(entry.target, entry.intersectionRatio);
            }
        });
    }
    
    triggerAnimation(element, ratio) {
        // Counter animation
        if (element.hasAttribute('data-counter') && !element.classList.contains('counted')) {
            this.animateCounter(element);
            element.classList.add('counted');
        }
        
        // Parallax effect
        if (element.hasAttribute('data-parallax')) {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = (1 - ratio) * 100 * speed;
            element.style.transform = `translateY(${offset}px)`;
        }
        
        // Stagger animation
        if (element.hasAttribute('data-stagger') && !element.classList.contains('staggered')) {
            this.animateStagger(element);
            element.classList.add('staggered');
        }
        
        // Morph animation
        if (element.hasAttribute('data-morph') && !element.classList.contains('morphed')) {
            this.animateMorph(element);
            element.classList.add('morphed');
        }
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    animateStagger(container) {
        const children = container.children;
        const delay = parseInt(container.dataset.staggerDelay) || 100;
        
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.transition = 'all 0.6s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }
    
    animateMorph(element) {
        element.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        element.style.transform = 'scale(1) rotate(0deg)';
        element.style.opacity = '1';
    }
}

// 3D card effects
class Card3DEffects {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.project-card, .skill-item, .card').forEach(card => {
            this.add3DEffect(card);
        });
    }
    
    add3DEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }
}

// Magnetic cursor effect
class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.followers = [];
        this.isActive = false;
        this.init();
    }
    
    init() {
        // Create cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(this.cursor);
        
        // Create followers
        for (let i = 0; i < 5; i++) {
            const follower = document.createElement('div');
            follower.className = 'cursor-follower';
            follower.style.cssText = `
                position: fixed;
                width: ${15 - i * 2}px;
                height: ${15 - i * 2}px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: ${9999 - i};
                opacity: ${0.6 - i * 0.1};
                transition: transform 0.${2 + i}s ease;
            `;
            document.body.appendChild(follower);
            this.followers.push(follower);
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            if (!this.isActive) {
                this.isActive = true;
                this.cursor.style.opacity = '1';
                this.followers.forEach(f => f.style.opacity = f.style.opacity);
            }
            
            this.updateCursor(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseenter', () => {
            this.isActive = true;
        });
        
        document.addEventListener('mouseleave', () => {
            this.isActive = false;
            this.cursor.style.opacity = '0';
            this.followers.forEach(f => f.style.opacity = '0');
        });
        
        // Add magnetic effect to interactive elements
        document.querySelectorAll('button, a, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.background = 'var(--accent)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'var(--primary)';
            });
        });
    }
    
    updateCursor(x, y) {
        this.cursor.style.left = x - 10 + 'px';
        this.cursor.style.top = y - 10 + 'px';
        
        this.followers.forEach((follower, index) => {
            const delay = (index + 1) * 50;
            setTimeout(() => {
                follower.style.left = x - (7.5 - index) + 'px';
                follower.style.top = y - (7.5 - index) + 'px';
            }, delay);
        });
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    // Start animation controller
    animController.start();
    
    // Initialize advanced scroll animations
    new AdvancedScrollAnimations();
    
    // Initialize 3D card effects
    new Card3DEffects();
    
    // Initialize magnetic cursor (only on desktop)
    if (window.innerWidth > 768) {
        new MagneticCursor();
    }
    
    // Initialize particle systems
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection, {
            count: 30,
            color: 'rgba(99, 102, 241, 0.3)',
            size: 3,
            speed: 0.5
        }).start();
    }
    
    // Add text animations to specific elements
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title .gradient-text');
        if (heroTitle && !heroTitle.classList.contains('animated')) {
            TextAnimations.revealWords(heroTitle, 150);
            heroTitle.classList.add('animated');
        }
    }, 2000);
});

// Cleanup animations on page unload
window.addEventListener('beforeunload', () => {
    animController.stop();
});

// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        animController.stop();
    } else {
        animController.start();
    }
});

// Reduce animations on mobile for performance
if (window.innerWidth <= 768) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Disable some heavy animations on mobile
    const heavyAnimations = document.querySelectorAll('.morph-shape, .floating-shape');
    heavyAnimations.forEach(el => {
        el.style.animation = 'none';
    });
}
