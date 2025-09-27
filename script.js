// Blog fetching functionality
class BlogFetcher {
    constructor() {
        this.blogContainer = document.querySelector('.blog-grid');
        this.cacheKey = 'crypto-mum-blog-cache';
        this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    }

    async fetchBlogPosts() {
        try {
            // Check localStorage cache first
            const cached = this.getCachedPosts();
            if (cached) {
                console.log('Using localStorage cached blog posts');
                this.renderBlogPosts(cached);
                return;
            }

            console.log('Fetching fresh blog posts...');
            
            // Try to fetch from our API endpoint
            const response = await fetch('/api/blog-posts');
            
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }
            
            const posts = await response.json();
            
            // Cache the results in localStorage
            this.cachePosts(posts);
            
            // Render the posts
            this.renderBlogPosts(posts);
            
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            // Fallback to static content
            this.renderFallbackPosts();
        }
    }

    getCachedPosts() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            const now = Date.now();
            
            if (now - data.timestamp > this.cacheExpiry) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }
            
            return data.posts;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    cachePosts(posts) {
        try {
            const data = {
                posts: posts,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error caching posts:', error);
        }
    }

    renderBlogPosts(posts) {
        if (!this.blogContainer) return;
        
        this.blogContainer.innerHTML = '';
        
        // Only show the last 6 posts
        const recentPosts = posts.slice(-6);
        
        recentPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card';
            
            article.innerHTML = `
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="blog-image-placeholder" style="display: none;">${post.emoji}</div>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="${post.url}" class="blog-link" target="_blank">Read More</a>
            `;
            
            this.blogContainer.appendChild(article);
        });
    }

    renderFallbackPosts() {
        // Fallback to the static content that's already in the HTML
        console.log('Using fallback blog posts');
    }
}

// Initialize blog fetcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const blogFetcher = new BlogFetcher();
    blogFetcher.fetchBlogPosts();
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Height of fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(250, 250, 250, 0.95)';
        header.style.backdropFilter = 'blur(12px)';
    } else {
        header.style.background = 'rgba(250, 250, 250, 0.8)';
        header.style.backdropFilter = 'blur(8px)';
    }
});

// Add hover effects to service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Animated typing effect for rotating titles
class TypingAnimation {
    constructor() {
        this.titles = [
            'Growth Systems Architect',
            'Full-Stack Growth Builder', 
            'Technical Growth Designer'
        ];
        this.currentTitleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 80;
        this.deletingSpeed = 40;
        this.pauseTime = 2500;
        this.titleElement = document.getElementById('rotatingTitle');
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        if (!this.titleElement) return;
        
        // Start the animation after a short delay
        setTimeout(() => {
            this.isRunning = true;
            this.typeTitle();
        }, 1000);
    }
    
    typeTitle() {
        if (!this.isRunning) return;
        
        const currentTitle = this.titles[this.currentTitleIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.titleElement.textContent = currentTitle.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
                // Brief pause before starting to type the next title
                setTimeout(() => this.typeTitle(), this.typingSpeed * 2);
            } else {
                setTimeout(() => this.typeTitle(), this.deletingSpeed);
            }
        } else {
            // Typing characters
            this.titleElement.textContent = currentTitle.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentTitle.length) {
                // Finished typing, pause then start deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeTitle();
                }, this.pauseTime);
            } else {
                // Vary typing speed slightly for more natural feel
                const speedVariation = Math.random() * 20 - 10; // ±10ms variation
                setTimeout(() => this.typeTitle(), this.typingSpeed + speedVariation);
            }
        }
    }
    
    // Method to stop the animation if needed
    stop() {
        this.isRunning = false;
    }
    
    // Method to restart the animation
    restart() {
        this.currentTitleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isRunning = true;
        this.titleElement.textContent = '';
        this.typeTitle();
    }
}

// Initialize typing animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingAnimation();
});

// Add parallax effect to visual elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-particle, .geometric-shape');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index % 3) * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .blog-card, .testimonial-card, .stack-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// VANTA.NET Network Animation
class VantaNetwork {
    constructor() {
        this.effect = null;
    }
    
    init() {
        if (typeof VANTA !== 'undefined' && VANTA.NET) {
            this.effect = VANTA.NET({
                el: "#vanta-network",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x663399,
                backgroundColor: 0xffffff,
                backgroundAlpha: 0.0,
                points: 15.00,
                maxDistance: 20.00,
                spacing: 15.00,
                showDots: false
            });
        }
    }
    
    destroy() {
        if (this.effect) {
            this.effect.destroy();
            this.effect = null;
        }
    }
}

// Animation Toggle Functionality
class AnimationToggle {
    constructor() {
        this.currentAnimation = 1;
        this.animation1 = document.querySelector('.global-visual-elements.animation-1');
        this.animation2 = document.querySelector('.global-visual-elements.animation-2');
        this.toggleText = document.getElementById('animationToggleText');
        this.vantaNetwork = null;
        
        this.init();
    }
    
    init() {
        // Ensure animation 1 is visible by default
        if (this.animation1) {
            this.animation1.style.opacity = '1';
        }
        if (this.animation2) {
            this.animation2.style.opacity = '0';
        }
        
        if (this.toggleText) {
            this.toggleText.addEventListener('click', () => {
                this.switchAnimation();
            });
        }
    }
    
    switchAnimation() {
        if (this.currentAnimation === 1) {
            // Switch to animation 2 (VANTA.NET network)
            if (this.animation1) this.animation1.style.opacity = '0';
            if (this.animation2) this.animation2.style.opacity = '1';
            
            // Initialize VANTA.NET animation
            if (!this.vantaNetwork) {
                this.vantaNetwork = new VantaNetwork();
                // Wait for VANTA to be loaded
                setTimeout(() => {
                    this.vantaNetwork.init();
                }, 100);
            }
            
            this.currentAnimation = 2;
            this.updateToggleText('Clean screen! ;) <span class="click-hint">click to change animation</span>');
        } else {
            // Switch to animation 1 (original grey dots)
            if (this.animation2) this.animation2.style.opacity = '0';
            if (this.animation1) this.animation1.style.opacity = '1';
            
            // Destroy VANTA.NET animation to save resources
            if (this.vantaNetwork) {
                this.vantaNetwork.destroy();
                this.vantaNetwork = null;
            }
            
            this.currentAnimation = 1;
            this.updateToggleText('Clean screen! ;) <span class="click-hint">click to change animation</span>');
        }
    }
    
    updateToggleText(newText) {
        if (this.toggleText) {
            this.toggleText.innerHTML = newText;
        }
    }
}

// Initialize animation toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationToggle();
});

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNav = document.getElementById('mobileNav');
        this.mobileLinks = document.querySelectorAll('.mobile-nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.mobileNav) return;
        
        // Toggle menu on button click
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking on links
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileNav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menuToggle.classList.add('active');
        this.mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});