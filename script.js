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

// VANTA.NET Style Network Animation
class NetworkAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createNodes();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        const nodeCount = 50;
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Keep nodes in bounds
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
        });
    }
    
    drawConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.3;
                    this.ctx.strokeStyle = `rgba(102, 51, 153, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                    
                    this.connections.push({ from: i, to: j, distance });
                }
            }
        }
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            // Mouse interaction
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let radius = node.radius;
            let opacity = 0.3;
            
            if (distance < 100) {
                radius = node.radius + (100 - distance) / 100 * 2;
                opacity = 0.3 + (100 - distance) / 100 * 0.4;
            }
            
            this.ctx.fillStyle = `rgba(102, 51, 153, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
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
        this.networkAnimation = null;
        
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
            // Switch to animation 2 (VANTA.NET style network)
            if (this.animation1) this.animation1.style.opacity = '0';
            if (this.animation2) this.animation2.style.opacity = '1';
            
            // Initialize network animation
            const canvas = document.getElementById('network-canvas');
            if (canvas && !this.networkAnimation) {
                this.networkAnimation = new NetworkAnimation(canvas);
            }
            
            this.currentAnimation = 2;
            this.updateToggleText('Clean screen! ;) <span class="click-hint">click to change animation</span>');
        } else {
            // Switch to animation 1 (original grey dots)
            if (this.animation2) this.animation2.style.opacity = '0';
            if (this.animation1) this.animation1.style.opacity = '1';
            
            // Destroy network animation to save resources
            if (this.networkAnimation) {
                this.networkAnimation.destroy();
                this.networkAnimation = null;
            }
            
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