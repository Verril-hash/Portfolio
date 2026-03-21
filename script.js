document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Grab elements to animate with a subtle fade up
    const elementsToAnimate = document.querySelectorAll('.hero-title, .meta-col, .section-label, .section-heading, .section-paragraph, .info-item, .project-row, .contact-links, .social-footer');
    
    // Add base class and observe
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-up');
        
        // Stagger meta columns slightly if they are together
        if(el.classList.contains('meta-col')) {
            el.style.transitionDelay = `${(index % 4) * 0.15}s`;
        }
        
        // Stagger info items
        if(el.classList.contains('info-item')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }

        observer.observe(el);
    });

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});