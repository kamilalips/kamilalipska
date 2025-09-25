// Vercel-Style Minimal Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(250, 250, 250, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(250, 250, 250, 0.8)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .highlight-card, .testimonial-card, .stack-category, .table-row');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Enhanced hover effects
    function addHoverEffects() {
        // Service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Highlight cards
        document.querySelectorAll('.highlight-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Testimonial cards
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Stack categories
        document.querySelectorAll('.stack-category').forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Table rows
        document.querySelectorAll('.table-row').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.05)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
        });

        // Tool items
        document.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.08)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(0, 0, 0, 0.02)';
            });
        });

        // Contact methods
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            });
            
            method.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    addHoverEffects();

    // Profile image hover effect
    const profileImages = document.querySelectorAll('.profile-image, .logo-image');
    profileImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Mobile menu toggle (if needed)
    function createMobileMenu() {
        const header = document.querySelector('.header-container');
        const nav = document.querySelector('.header-nav');
        
        if (window.innerWidth <= 768) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            menuToggle.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 4px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
            `;
            
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('mobile-open');
            });
            
            header.appendChild(menuToggle);
            
            // Add mobile styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .header-nav {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--background);
                        border-top: 1px solid var(--border);
                        flex-direction: column;
                        padding: 20px;
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }
                    
                    .header-nav.mobile-open {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }
                    
                    .mobile-menu-toggle span {
                        width: 20px;
                        height: 2px;
                        background: var(--foreground);
                        transition: all 0.3s ease;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createMobileMenu();

    // Handle window resize
    window.addEventListener('resize', function() {
        createMobileMenu();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add keyboard navigation styles
    const keyboardStyle = document.createElement('style');
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--foreground);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(keyboardStyle);

    // Loading animation
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

    // Add subtle parallax effect to hero
    function addParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Only add parallax on larger screens
    if (window.innerWidth > 1024) {
        addParallaxEffect();
    }

    // Add typing effect to hero title
    function addTypingEffect() {
        const title = document.querySelector('.hero-title');
        if (title) {
            const text = title.textContent;
            title.textContent = '';
            title.style.borderRight = '2px solid var(--foreground)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        title.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing after a delay
            setTimeout(typeWriter, 1000);
        }
    }

    // Add typing effect
    addTypingEffect();
});