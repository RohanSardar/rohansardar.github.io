document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE LOGIC
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Retrieve saved theme preference or detect system scheme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcons(initialTheme);

    // Toggle theme on click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const lineMid = document.getElementById('line-mid');
    const lineTop = document.getElementById('line-top');
    const lineBot = document.getElementById('line-bottom');

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        
        // Simple SVG hamburger animation
        if (isOpen) {
            if (lineMid) lineMid.style.opacity = '0';
            if (lineTop) {
                lineTop.setAttribute('y1', '6');
                lineTop.setAttribute('y2', '18');
                lineTop.setAttribute('x1', '6');
                lineTop.setAttribute('x2', '18');
            }
            if (lineBot) {
                lineBot.setAttribute('y1', '18');
                lineBot.setAttribute('y2', '6');
                lineBot.setAttribute('x1', '6');
                lineBot.setAttribute('x2', '18');
            }
        } else {
            if (lineMid) lineMid.style.opacity = '1';
            if (lineTop) {
                lineTop.setAttribute('y1', '6');
                lineTop.setAttribute('y2', '6');
                lineTop.setAttribute('x1', '3');
                lineTop.setAttribute('x2', '21');
            }
            if (lineBot) {
                lineBot.setAttribute('y1', '18');
                lineBot.setAttribute('y2', '18');
                lineBot.setAttribute('x1', '3');
                lineBot.setAttribute('x2', '21');
            }
        }
    }

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when a link inside mobile drawer is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
            });
        });

        // Close menu when clicking outside mobile drawer
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    }

    // ==========================================================================
    // SMOOTH SCROLLING FOR ALL NAV LINKS
    // ==========================================================================
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-logo');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Offset scroll for sticky navbar
                    const navbarHeight = 75;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // ACTIVE NAV LINK HIGHLIGHTER (INTERSECTION OBSERVER)
    // ==========================================================================
    const sections = document.querySelectorAll('.content-section, #about');
    const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-drawer .mobile-nav-link');

    const observerOptions = {
        root: null, // Viewport
        rootMargin: '-30% 0px -50% 0px', // Trigger when section is in active viewing area
        threshold: 0.05
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                desktopLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                mobileLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => activeLinkObserver.observe(section));

    // Special case: Highlight "About" if scrolled to the very top
    window.addEventListener('scroll', () => {
        if (window.scrollY < 60) {
            desktopLinks.forEach(link => {
                if (link.getAttribute('href') === '#about') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            mobileLinks.forEach(link => {
                if (link.getAttribute('href') === '#about') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });

    // ==========================================================================
    // STAGGERED ENTRANCE LOAD ANIMATIONS
    // ==========================================================================
    const cardsToAnimate = document.querySelectorAll(
        '.project-cv-card, .skills-cv-card, .timeline-cv-item, .pub-cv-row, .education-cv-card, .achievements-cv-card, .certifications-cv-card'
    );
    
    cardsToAnimate.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        card.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 60)); // Stagger delay
    });
});
