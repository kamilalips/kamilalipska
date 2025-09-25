// Seth Godin Style Navigation and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navLinks = document.querySelectorAll('.s-nav-link');
    const sections = document.querySelectorAll('.s-section');
    
    // Navigation function
    function navigateToSection(sectionId) {
        // Remove active class from all nav links and sections
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to current nav link and section
        const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(sectionId);
        
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // Add section transition effect
        addSectionTransitionEffect(activeSection);
    }
    
    function addSectionTransitionEffect(element) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                navigateToSection(sectionId);
                
                // Close mobile menu if open
                const nav = document.querySelector('.s-nav.navigator');
                if (nav) {
                    nav.classList.remove('open');
                }
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });
    
    // Mobile menu toggle
    function createMobileMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        toggle.style.cssText = `
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--accent-color);
            border: none;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            flex-direction: column;
            gap: 4px;
        `;
        
        toggle.addEventListener('click', function() {
            const nav = document.querySelector('.s-nav.navigator');
            nav.classList.toggle('open');
        });
        
        document.body.appendChild(toggle);
        
        // Show/hide toggle based on screen size
        function handleResize() {
            if (window.innerWidth <= 768) {
                toggle.style.display = 'flex';
            } else {
                toggle.style.display = 'none';
                document.querySelector('.s-nav.navigator').classList.remove('open');
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize();
    }
    
    createMobileMenuToggle();
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.system-card, .testimonial-card, .stack-category, .service-item, .highlight-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Enhanced hover effects
    function addHoverEffects() {
        // System cards
        document.querySelectorAll('.system-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Service items
        document.querySelectorAll('.service-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(15px)';
                this.style.boxShadow = '0 5px 20px rgba(255, 140, 0, 0.2)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Testimonial cards
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 40px rgba(255, 140, 0, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Stack categories
        document.querySelectorAll('.stack-category').forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 10px 30px rgba(255, 140, 0, 0.2)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Tool items
        document.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.background = 'rgba(255, 140, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.background = 'rgba(255, 140, 0, 0.05)';
            });
        });
    }
    
    addHoverEffects();
    
    // Profile image hover effect
    const profileImage = document.querySelector('.s-logo-image img');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    }
    
    // Social links hover effects
    document.querySelectorAll('.s-social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Button hover effects
    document.querySelectorAll('.s-common-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Contact method hover effects
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentActive = document.querySelector('.s-nav-link.active');
        if (!currentActive) return;
        
        const currentIndex = Array.from(navLinks).indexOf(currentActive);
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                newIndex = (currentIndex + 1) % navLinks.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = navLinks.length - 1;
                break;
        }
        
        if (newIndex !== currentIndex) {
            const targetSection = navLinks[newIndex].getAttribute('data-section');
            navigateToSection(targetSection);
        }
    });
    
    // Add CSS for mobile menu toggle
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-toggle span {
            display: block;
            width: 20px;
            height: 2px;
            background: var(--primary-bg);
            transition: all 0.3s ease;
        }
        
        .mobile-menu-toggle:hover span {
            background: var(--text-primary);
        }
        
        @media (max-width: 768px) {
            .s-nav.navigator {
                transition: transform 0.3s ease;
            }
            
            .s-nav.navigator.open {
                transform: translateX(0);
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with home section active
    navigateToSection('home');
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is hidden
            document.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations when page is visible
            document.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    // Performance optimization
    let ticking = false;
    
    function updateScrollEffects() {
        // Add any scroll-based effects here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
});
