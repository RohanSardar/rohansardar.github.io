document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine initial theme
    const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcons(currentTheme);

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        const currentDataTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentDataTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });

    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked and smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navMenu.classList.remove('open');

            const targetId = this.getAttribute('href');

            if (this.getAttribute('data-target') === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
        }
    });

    function updateIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    // Optional: Add simple staggered animation delay to cards to make load feel smoother
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Terminal typing effect for titles
    const titlesToType = document.querySelectorAll('.section-title, .prompt');
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.dataset.typed) {
                    el.dataset.typed = "true";
                    let prefixHTML = '';
                    let textToType = '';

                    if (el.classList.contains('section-title')) {
                        prefixHTML = '<span>&gt;</span> ';
                        textToType = el.textContent.replace('>', '').trim();
                    } else if (el.classList.contains('prompt')) {
                        prefixHTML = '';
                        textToType = el.textContent.trim();
                    }

                    el.innerHTML = prefixHTML + '<span class="typing-target"></span><span class="cursor">&nbsp;</span>';
                    const targetSpan = el.querySelector('.typing-target');

                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (i < textToType.length) {
                            targetSpan.textContent += textToType.charAt(i);
                            i++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 80);
                }
            }
        });
    }, { threshold: 0.1 });

    titlesToType.forEach(title => typingObserver.observe(title));
});
