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
        
        posts.forEach(post => {
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

// Add typing animation to hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
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

// Animation Toggle Functionality
class AnimationToggle {
    constructor() {
        this.currentAnimation = 1;
        this.animation1 = document.querySelector('.global-visual-elements.animation-1');
        this.animation2 = document.querySelector('.global-visual-elements.animation-2');
        this.toggleText = document.getElementById('animationToggleText');
        
        this.init();
    }
    
    init() {
        if (this.toggleText) {
            this.toggleText.addEventListener('click', () => {
                this.switchAnimation();
            });
        }
    }
    
    switchAnimation() {
        if (this.currentAnimation === 1) {
            // Switch to animation 2 (connected network)
            this.animation1.classList.remove('active');
            this.animation2.classList.add('active');
            this.currentAnimation = 2;
            this.updateToggleText('Clean screen! ;) <span class="click-hint">click to change animation</span>');
        } else {
            // Switch to animation 1 (original grey dots)
            this.animation2.classList.remove('active');
            this.animation1.classList.add('active');
            this.currentAnimation = 1;
            this.updateToggleText('Is your screen dirty? ;) <span class="click-hint">click to change animation</span>');
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