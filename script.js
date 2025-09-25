// Enhanced website with Adam Durrant-style navigation and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    // Keyboard navigation mapping
    const keyboardMap = {
        '1': 'home',
        '2': 'about',
        '3': 'skills',
        '4': 'work',
        '5': 'testimonials',
        '6': 'contact',
        '7': 'linkedin'
    };
    
    // Navigation function
    function navigateToPage(pageId) {
        // Remove active class from all nav items and pages
        navItems.forEach(item => item.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Add active class to current nav item and page
        const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
        const activePage = document.getElementById(pageId);
        
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        if (activePage) {
            activePage.classList.add('active');
        }
        
        // Scroll to top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                e.preventDefault();
                navigateToPage(pageId);
            }
        });
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // Check if it's a number key (1-7)
        if (keyboardMap[key]) {
            e.preventDefault();
            navigateToPage(keyboardMap[key]);
        }
        
        // Handle special keys
        if (key === 'Escape') {
            // Close any open modals or return to home
            navigateToPage('home');
        }
    });
    
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
    const animateElements = document.querySelectorAll('.skill-category, .skill-item, .work-item, .testimonial-item, .update-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Enhanced hover effects for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.01)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for testimonial items
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    testimonialItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.01)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for intro cards
    const introCards = document.querySelectorAll('.intro-card');
    introCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for update items
    const updateItems = document.querySelectorAll('.update-item');
    updateItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced hover effects for highlight items
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced contact method interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'var(--gray-200)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Mobile menu toggle (for responsive design)
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        display: none;
        font-size: 18px;
    `;
    
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Show/hide mobile menu toggle based on screen size
    function handleResize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('open');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToPage(targetId);
        });
    });
    
    // Add keyboard shortcut hints
    const shortcutHints = document.createElement('div');
    shortcutHints.className = 'shortcut-hints';
    shortcutHints.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gray-800);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    shortcutHints.innerHTML = 'Press 1-7 to navigate';
    document.body.appendChild(shortcutHints);
    
    // Show shortcut hints on first visit
    let hasShownHints = localStorage.getItem('hasShownHints');
    if (!hasShownHints) {
        setTimeout(() => {
            shortcutHints.style.opacity = '1';
            setTimeout(() => {
                shortcutHints.style.opacity = '0';
                localStorage.setItem('hasShownHints', 'true');
            }, 3000);
        }, 2000);
    }
    
    // Show shortcut hints on keyboard press
    let hintTimeout;
    document.addEventListener('keydown', function(e) {
        if (keyboardMap[e.key]) {
            shortcutHints.style.opacity = '1';
            clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => {
                shortcutHints.style.opacity = '0';
            }, 1000);
        }
    });
    
    // Initialize page animations
    const initPageAnimations = () => {
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            const animateElements = currentPage.querySelectorAll('.skill-category, .skill-item, .work-item, .testimonial-item, .update-item, .highlight-item');
            animateElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    };
    
    // Initialize animations when page changes
    const originalNavigateToPage = navigateToPage;
    navigateToPage = function(pageId) {
        originalNavigateToPage(pageId);
        setTimeout(initPageAnimations, 100);
    };
    
    // Initial page animation
    setTimeout(initPageAnimations, 500);
});

// Add enhanced CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Enhanced hover effects */
    .skill-item:hover {
        transform: translateY(-2px) scale(1.01) !important;
    }
    
    .work-item:hover {
        transform: translateY(-4px) scale(1.02) !important;
    }
    
    .testimonial-item:hover {
        transform: translateY(-4px) scale(1.02) !important;
    }
    
    .skill-category:hover {
        transform: translateY(-4px) scale(1.01) !important;
    }
    
    .intro-card:hover {
        transform: translateY(-2px) !important;
    }
    
    .update-item:hover {
        transform: translateY(-2px) !important;
    }
    
    .highlight-item:hover {
        transform: translateY(-2px) !important;
    }
    
    .contact-method:hover {
        transform: translateY(-2px) !important;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    }
    
    /* Focus states for accessibility */
    .btn:focus,
    .nav-item:focus,
    .contact-method:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .sidebar.open {
            transform: translateX(0);
        }
        
        .menu-toggle {
            display: block !important;
        }
    }
    
    @media (min-width: 769px) {
        .menu-toggle {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);