// Enterprise Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Brief artificial boot-up delay to simulate a heavy application initializing
    setTimeout(() => {
        // Slide up the preloader
        preloader.classList.add('hidden');
        
        // Restore scrolling AFTER the animation completes
        // This prevents the scrollbar from appearing early and shifting the text slightly to the left!
        setTimeout(() => {
            document.body.classList.remove('no-scroll');
            preloader.remove();
        }, 1800); 
    }, 1200); // 1.2 second boot phase
});

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
    const elementsToAnimate = document.querySelectorAll('.hero-title, .meta-col, .section-label, .section-heading, .section-paragraph, .info-item, .project-row, .contact-links, .social-footer, .terminal-container');
    
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

    // Terminal Logic
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-body');

    if (termInput && termBody) {
        termInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const cmd = this.value.trim();
                if (cmd) {
                    processCommand(cmd);
                }
                this.value = '';
            }
        });

        // Ensure clicking anywhere on terminal focuses the input
        termBody.addEventListener('click', () => {
            termInput.focus();
        });
    }

    function processCommand(cmd) {
        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-line';
        inputLine.innerHTML = `<span class="prompt">guest@verril-dev:~$</span> <span class="term-command">${cmd}</span>`;
        
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line term-output';

        const args = cmd.toLowerCase().split(' ');
        const mainCmd = args[0];

        switch(mainCmd) {
            case 'help':
                outputLine.innerHTML = `Available commands:<br>
  <span class="accent-gold">whoami</span>    - Display profile summary<br>
  <span class="accent-gold">skills</span>    - List core technical skills<br>
  <span class="accent-gold">projects</span>  - Show recent projects<br>
  <span class="accent-gold">contact</span>   - Get contact information<br>
  <span class="accent-gold">clear</span>     - Clear the terminal screen<br>
  <span class="accent-red" style="color:#ff5f56">sudo</span>      - Execute a command as superuser`;
                break;
            case 'whoami':
                outputLine.innerHTML = `Verril Vaz<br>Software Engineer & Founder of Team Sahayak Foundation.<br>Based in Bengaluru, India.`;
                break;
            case 'skills':
                outputLine.innerHTML = `Languages: Python, Java, JavaScript/TypeScript, Rust<br>Backend: Node.js, Spring Boot, Flask<br>Data & AI: PostgreSQL, TensorFlow, Apache Spark<br>Other: WebGL, Cloud Infrastructure`;
                break;
            case 'projects':
                outputLine.innerHTML = `1. verril-learn (Python ML Library)<br>2. Bare-Tensor Engine (Rust, wgpu engine)<br>3. Vexa App (NGO Donation Platform)<br>Type <span class="accent-gold">'help'</span> for more options.`;
                break;
            case 'contact':
                outputLine.innerHTML = `Email: <a href="mailto:verrilvaz404@gmail.com" class="accent-blue">verrilvaz404@gmail.com</a><br>LinkedIn: <a href="http://linkedin.com/in/verrilvaz" target="_blank" class="accent-blue">linkedin.com/in/verrilvaz</a><br>GitHub: <a href="https://github.com/Verril-hash" target="_blank" class="accent-blue">github.com/Verril-hash</a>`;
                break;
            case 'clear':
                // remove all elements except the input line
                const allLines = document.querySelectorAll('.terminal-line');
                allLines.forEach(line => line.remove());
                return; // exit early, don't append old command
            case 'sudo':
                outputLine.className = 'terminal-line term-error';
                outputLine.innerHTML = `guest is not in the sudoers file. This incident will be reported.`;
                break;
            case 'ls':
                outputLine.innerHTML = `<span class="accent-blue">src/  tests/  public/  Verril_Resume.pdf  README.md</span>`;
                break;
            case 'cat':
                if(args[1] === 'resume.pdf' || args[1] === 'verril_resume.pdf') {
                     outputLine.innerHTML = `Cannot display binary file. Try downloading it instead.`;
                } else if(args[1] === 'readme.md') {
                     outputLine.innerHTML = `# Verril Vaz Portfolio<br>Welcome to my corner of the web. Explore the GUI or stick to the CLI!`;
                } else {
                     outputLine.className = 'terminal-line term-error';
                     outputLine.innerHTML = `cat: ${args[1] || ''}: No such file or directory`;
                }
                break;
            default:
                outputLine.className = 'terminal-line term-error';
                outputLine.innerHTML = `Command not found: ${mainCmd}. Type 'help' for available commands.`;
        }

        // Insert before the input line
        const inputContainer = document.querySelector('.terminal-input-line');
        termBody.insertBefore(inputLine, inputContainer);
        termBody.insertBefore(outputLine, inputContainer);
        
        // Auto scroll to bottom
        termBody.scrollTop = termBody.scrollHeight;
    }
});