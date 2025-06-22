const isDesktop = window.innerWidth >= 1024;

// Set dark mode styles
const root = document.documentElement;
root.style.setProperty('--bg', '#0a0a1a');
root.style.setProperty('--bg-secondary', '#1a1a2e');
root.style.setProperty('--text', '#e0e0e0');
root.style.setProperty('--text-secondary', '#a0a0a0');
root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.1)');
root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)');

// Download Resume
const downloadResumeBtn = document.getElementById('download-resume');
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
        const resumeUrl = 'resume.pdf'; // Replace with actual resume URL
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Animate Skill Progress Bars
function animateSkillBars() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    skillProgressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 2s ease-in-out';
            bar.style.width = targetWidth;
        }, 200);
    });
}

// Interactive Skill Hover Animation
function createParticleExplosion(element) {
    const particleCount = 20;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.width = `${Math.random() * 8 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        element.appendChild(particle);
        particles.push(particle);

        const rect = element.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = Math.random() * 3 + 2;

        particle.style.left = `${startX - particle.offsetWidth / 2}px`;
        particle.style.top = `${startY - particle.offsetHeight / 2}px`;

        const animation = particle.animate([
            { transform: `translate(0, 0) scale(1)` },
            { transform: `translate(${Math.cos(angle) * 100}px, ${Math.sin(angle) * 100}px) scale(0)` }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }
}

const skillCategories = document.querySelectorAll('.skill-category');
if (skillCategories) {
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => createParticleExplosion(category));
    });
}

// Initialize particles.js
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ['#00ff88', '#00ccff'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#00ff88', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 200, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// Initialize cursor elements
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (isDesktop && cursor && cursorFollower) {
    cursor.style.display = 'block';
    cursorFollower.style.display = 'block';
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        requestAnimationFrame(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });
    });

    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .project-card, .skill-category, .carousel-item, .notification-close, .chatbot-icon, .chatbot-close, .filter-btn, #download-resume');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        cursorFollower.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
        cursorFollower.classList.remove('click');
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.7';
    });
}

// Loading Screen
window.addEventListener('load', () => {
    console.log('Page fully loaded');
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.position = 'fixed';
        loading.style.top = '0';
        loading.style.left = '0';
        loading.style.width = '100%';
        loading.style.height = '100%';
        loading.style.background = 'var(--bg)';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        loading.style.justifyContent = 'center';
        loading.style.zIndex = '10000';
        setTimeout(() => {
            loading.classList.add('hidden');
            console.log('Loading screen hidden');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
        setTimeout(() => {
            if (!loading.classList.contains('hidden')) {
                loading.classList.add('hidden');
                loading.remove();
                console.log('Loading screen hidden due to fallback');
            }
        }, 5000);
    }
    updateWeatherWidget(); // Call weather update on page load
});

// Weather Widget
let weatherVisible = false;

async function updateWeatherWidget() {
    const weatherWidget = document.getElementById('weather-widget');
    if (weatherWidget && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                const weatherCode = data.current_weather.weathercode;
                const temp = data.current_weather.temperature;
                const unit = data.current_weather_units.temperature;
                // Always use weather.png for the icon
                weatherWidget.innerHTML = `
                    <div class="weather-info">
                        <img src="weather.png" alt="Weather Icon" class="weather-icon">
                        <p>${getWeatherDescription(weatherCode)}</p>
                        <p>${temp}°${unit}</p>
                    </div>
                `;
                if (!weatherVisible) weatherWidget.style.display = 'none'; // Hide if not toggled
            } catch (error) {
                weatherWidget.innerHTML = `<p>Weather data unavailable. Check internet.</p>`;
                if (!weatherVisible) weatherWidget.style.display = 'none';
            }
        }, () => {
            weatherWidget.innerHTML = `<p>Location access denied. Enable it to see weather.</p>`;
            if (!weatherVisible) weatherWidget.style.display = 'none';
        });
    }
}

function toggleWeatherWidget() {
    const weatherWidget = document.getElementById('weather-widget');
    weatherVisible = !weatherVisible;
    if (weatherWidget) {
        weatherWidget.style.display = weatherVisible ? 'flex' : 'none';
        if (weatherVisible && !weatherWidget.innerHTML.includes('Weather Icon')) {
            updateWeatherWidget(); // Fetch weather only if not already loaded
        }
    }
}

const weatherButton = document.getElementById('weather-btn');
if (weatherButton) {
    weatherButton.addEventListener('click', toggleWeatherWidget);
}

window.addEventListener('load', () => {
    // ...existing loading screen code...
    updateWeatherWidget(); // Initial load to fetch data
});

// Helper function to map weathercode to Weather Icons
function getWeatherIcon(code) {
    const iconMap = {
        0: 'wi-day-sunny',        // Clear sky
        1: 'wi-day-sunny-overcast', // Mainly clear
        2: 'wi-day-cloudy',       // Partly cloudy
        3: 'wi-cloudy',           // Overcast
        45: 'wi-fog',             // Fog
        48: 'wi-fog',             // Depositing rime fog
        51: 'wi-sprinkle',        // Light drizzle
        53: 'wi-sprinkle',        // Moderate drizzle
        55: 'wi-rain',            // Dense drizzle
        61: 'wi-rain',            // Slight rain
        63: 'wi-rain',            // Moderate rain
        65: 'wi-rain',            // Heavy rain
        80: 'wi-showers',         // Light showers
        81: 'wi-showers',         // Moderate showers
        82: 'wi-storm-showers',   // Violent showers
        95: 'wi-thunderstorm',    // Thunderstorm
        96: 'wi-thunderstorm',    // Thunderstorm with slight hail
        99: 'wi-thunderstorm'     // Thunderstorm with heavy hail
    };
    return iconMap[code] || 'wi-na'; // Default to 'not available' if no match
}

// Helper function to map weathercode to description
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle',
        53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain',
        63: 'Moderate rain', 65: 'Heavy rain', 80: 'Light showers',
        81: 'Moderate showers', 82: 'Violent showers', 95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}

// Mobile Navigation
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

// Typing Animation
const typingText = document.getElementById('typing-text');
if (typingText) {
    const texts = ['Full Stack Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Innovator', 'Singing Enthusiast'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar Scroll Effect
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 20);
    });
}

// Carousel Logic
const carousel = document.getElementById('carousel');
if (carousel) {
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add('prev');
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add('next');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    setInterval(nextSlide, 3000);
    updateCarousel();

    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// AI Chatbot Logic
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotSend = document.getElementById('chatbot-send');

if (chatbotToggle && chatbotContainer && chatbotClose && chatbotInput && chatbotMessages && chatbotSend) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    const responses = {
        'skills': 'I specialize in full-stack development with React, Node.js, Python, and MongoDB. I also have expertise in AI technologies like TensorFlow and NLP. Want to know more about a specific skill?',
        'projects': 'I’ve built projects like an e-commerce platform, an analytics dashboard, a mobile app, and an AI chatbot. Check out the Projects section for details or ask me about a specific one!',
        'contact': 'You can reach me via the Contact section or email me at john.doe@example.com. Want to send a message now?',
        'resume': 'You can download my resume by clicking the "Download Resume" button in the hero section or contact me for a detailed CV!',
        'hello': 'Hi there! How can I assist you today?',
        'weather': 'Checking the weather for you... Please allow location access if prompted!',
        'default': 'Hmm, I’m not sure about that one. Try asking about my skills, projects, resume, or how to check the weather!'
    };

    function addMessage(content, isBot = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', isBot ? 'bot' : 'user');
        const messageP = document.createElement('p');
        messageP.textContent = content;
        messageDiv.appendChild(messageP);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function simulateTyping(response) {
        let i = 0;
        const typingSpeed = 50;
        addMessage('', true);
        const lastMessage = chatbotMessages.lastChild.querySelector('p');

        function type() {
            if (i < response.length) {
                lastMessage.textContent += response[i];
                i++;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                setTimeout(type, typingSpeed);
            }
        }
        setTimeout(type, 500);
    }

    chatbotSend.addEventListener('click', () => {
        const message = chatbotInput.value.trim().toLowerCase();
        if (message) {
            addMessage(message, false);
            if (message.includes('weather')) {
                getWeather();
            } else {
                const response = Object.keys(responses).find(key => message.includes(key)) 
                    ? responses[Object.keys(responses).find(key => message.includes(key))]
                    : responses.default;
                simulateTyping(response);
            }
            chatbotInput.value = '';
        }
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatbotInput.value.trim()) {
            chatbotSend.click();
        }
    });

    async function getWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const weatherDesc = data.current_weather.weathercode; // Use weathercode (0-99, map to description)
                    const temp = data.current_weather.temperature;
                    simulateTyping(`The weather at your location is ${getWeatherDescription(weatherDesc)} with a temperature of ${temp}°C.`);
                } catch (error) {
                    simulateTyping('Sorry, I couldn’t fetch the weather. Please check your internet or try again later.');
                }
            }, () => {
                simulateTyping('Please enable location access to get the weather!');
            });
        } else {
            simulateTyping('Geolocation is not supported by your browser.');
        }
    }
}

// Project Filter Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
if (filterButtons && projectCards) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const tags = card.getAttribute('data-tags').split(',');
                if (filter === 'all' || tags.includes(filter)) {
                    card.classList.add('visible');
                    card.style.transitionDelay = `${index * 0.1}s`;
                } else {
                    card.classList.remove('visible');
                }
            });
        });
    });

    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    projectCards.forEach((card, index) => {
        card.classList.add('visible');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Intersection Observer
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats-grid')) {
                animateCounters();
            }
            if (entry.target.classList.contains('skill-category')) {
                animateSkillBars();
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .stats-grid, .contact-info, .contact-form, .carousel-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Form Submission and Notification
const contactForm = document.querySelector('.contact-form');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const notificationClose = document.getElementById('notification-close');

if (contactForm && notification && notificationClose) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
            notificationText.textContent = `Thank you! Your message has been sent. I'll reach out to you at ${data.email} soon regarding "${data.subject}".`;
            notification.classList.add('active');
            setTimeout(() => {
                notification.classList.remove('active');
            }, 5000);
        } else {
            notificationText.textContent = `Oops! There was an error sending your message. Please try again or email me at john.doe@example.com.`;
            notification.classList.add('active');
            setTimeout(() => {
                notification.classList.remove('active');
            }, 5000);
        }

        notificationClose.addEventListener('click', () => {
            notification.classList.remove('active');
        });
    });
}