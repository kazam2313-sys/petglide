/**
 * Anti-gravity Pet Care App Logic
 * Enhanced with Gemini API, Parallax, Particles, and Bilingual Support.
 */

const TRANSLATIONS = {
    en: {
        'nav-categories': 'Categories',
        'nav-services': 'Services',
        'nav-directory': 'Veterinary',
        'nav-blog': 'Blog',
        'nav-contact': 'Consultation',
        'hero-title': 'Your Pet\'s Health, Elevated.',
        'hero-desc': 'Experience the future of pet wellness with our anti-gravity care approach. Light, airy, and tailored for every species.',
        'btn-login': 'Login',
        'btn-logout': 'Logout',
        'chat-welcome': 'Hi! I\'m your AI Pet Assistant. How is your pet feeling today?',
        'safety-checking': 'Checking link security...',
    },
    ur: {
        'nav-categories': 'اقسام',
        'nav-services': 'خدمات',
        'nav-directory': 'ڈیپلومہ',
        'nav-blog': 'بلاگ',
        'nav-contact': 'مشاورت',
        'hero-title': 'آپ کے پالتو جانوروں کی صحت، بلند۔',
        'hero-desc': 'ہمارے اینٹی گریویٹی کیئر اپروچ کے ساتھ پالتو جانوروں کی صحت کے مستقبل کا تجربہ کریں۔ ہر نوع کے لیے موزوں۔',
        'btn-login': 'لاگ ان',
        'btn-logout': 'لاگ آؤٹ',
        'chat-welcome': 'سلام! میں آپ کا AI پالتو اسسٹنٹ ہوں۔ آج آپ کا پالتو جانور کیسا محسوس کر رہا ہے؟',
        'safety-checking': 'لنک کی سیکیورٹی چیک کی جا رہی ہے...',
    }
};

let currentLang = 'en';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initParallax();
    initLangToggle();
    initChat();
    initSearch();
    initForm();
    initNav();
    initAuth();
    initDashboard();
    initScrollAnimations();
});

/* 0. Scroll Animations */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });
}

/* 1. Gemini API Integration */
async function handleGeminiQuery(userMessage) {
    const chatMessages = document.getElementById('chat-messages');

    // Add Loading Indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message msg-ai loading-dots';
    loadingDiv.textContent = '...Analyzing...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // SECURITY: Users should replace YOUR_API_KEY with their actual key or use a backend proxy.
        // For demonstration, we use a placeholder fetch.
        const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const systemInstruction = "You are an 'Anti-gravity Pet Expert' for PetGlide. Provide high-end, futuristic, and helpful advice for cats, dogs, birds, and exotic pets. Keep responses premium and concise.";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }]
                }]
            })
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "I'm having trouble connecting to the celestial database. Please try again in zero-gravity!";
        }
    } catch (error) {
        loadingDiv.remove();
        console.error("Gemini Error:", error);
        return "Offline Mode: As an Anti-gravity expert, I recommend maintaining a stress-free environment for your pet. (Check your internet/API key)";
    }
}

/* 2. Advanced Anti-Gravity UI (Particles & Parallax) */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(112, 214, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initParallax() {
    const hero = document.getElementById('parallax-hero');
    const heroImg = document.getElementById('hero-img');
    const circles = document.querySelectorAll('.ambient-circle');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;

        if (hero) hero.style.transform = `translate(${x}px, ${y}px)`;
        if (heroImg) heroImg.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px) rotate(${x * 0.1}deg)`;

        circles.forEach((c, i) => {
            const depth = (i + 1) * 2;
            c.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });
}

/* 3. Urdu Localization */
function initLangToggle() {
    const btn = document.getElementById('toggle-lang');
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ur' : 'en';
        document.body.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
        btn.textContent = currentLang === 'en' ? 'Urdu' : 'English';
        btn.setAttribute('data-lang', currentLang);
        applyTranslations();
    });
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (TRANSLATIONS[currentLang][key]) {
            el.textContent = TRANSLATIONS[currentLang][key];
        }
    });
}

/* 4. Enhanced Dashboard & Authentication */
function initAuth() {
    const openBtn = document.getElementById('open-login');
    const modal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('close-login');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });

    tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    [loginForm, signupForm].forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.toLowerCase();
            let role = (email === 'admin@petglide.com') ? 'admin' : 'customer';

            currentUser = {
                name: email.split('@')[0],
                role: role
            };

            modal.style.display = 'none';
            updateAuthNav();
            renderDashboard();
            form.reset();
        });
    });
}

function updateAuthNav() {
    const authArea = document.getElementById('auth-nav-area');
    if (!currentUser) {
        authArea.innerHTML = `<a href="#" class="login-btn" id="open-login">Login</a>`;
        initAuth();
        return;
    }

    authArea.innerHTML = `
        <div class="user-profile-nav">
            <i class="fas fa-user-circle"></i>
            <span>${currentUser.name}</span>
            <div class="profile-dropdown">
                <a href="#" id="view-dashboard-btn">Dashboard</a>
                <a href="#" id="perform-logout">Logout</a>
            </div>
        </div>
    `;

    document.getElementById('perform-logout').addEventListener('click', logout);
    document.getElementById('view-dashboard-btn').addEventListener('click', () => {
        renderDashboard();
    });
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard-container').style.display = 'none';
    updateAuthNav();
    window.scrollTo(0, 0);
}

function initDashboard() {
    // Shared init logic
}

function renderDashboard() {
    if (!currentUser) return;

    const container = document.getElementById('dashboard-container');
    const title = document.getElementById('dashboard-title');
    const content = document.getElementById('dashboard-content');
    const sidebar = document.getElementById('sidebar-menu');
    const userDisplay = document.getElementById('user-name');
    const roleBadge = document.getElementById('user-role-badge');

    container.style.display = 'flex';
    userDisplay.textContent = currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1);
    roleBadge.textContent = currentUser.role;
    roleBadge.className = `role-badge badge-${currentUser.role}`;

    if (currentUser.role === 'admin') {
        title.innerHTML = `Admin Management Panel <input type="text" placeholder="Search activity..." style="font-size: 0.8rem; padding: 5px 15px; border-radius: 10px; border: 1px solid #eee; margin-left: 20px;">`;
        sidebar.innerHTML = `
            <div class="sidebar-item active">Overview</div>
            <div class="sidebar-item">Live Traffic</div>
            <div class="sidebar-item">Users</div>
            <div class="sidebar-item">All Orders</div>
        `;
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card"><h4>Live Traffic</h4><div style="height: 60px; background: #f0faff; border-radius: 10px; display: flex; align-items: flex-end; gap: 4px; padding: 10px;">
                    <div style="width: 20%; height: 40%; background: var(--primary);"></div>
                    <div style="width: 20%; height: 70%; background: var(--primary);"></div>
                    <div style="width: 20%; height: 50%; background: var(--primary);"></div>
                    <div style="width: 20%; height: 90%; background: var(--primary);"></div>
                </div></div>
                <div class="stat-card"><h4>Active Users</h4><p>1,284</p></div>
                <div class="stat-card"><h4>Total Orders</h4><p>4,902</p></div>
            </div>
            <h3>Platform Activity</h3>
            <table class="data-table">
                <tr><th>User</th><th>Action</th><th>Time</th></tr>
                <tr><td>Zeeshan</td><td>Ordered Cat Food</td><td>2 mins ago</td></tr>
                <tr><td>Kiran</td><td>Booked Vet</td><td>15 mins ago</td></tr>
            </table>
        `;
    } else {
        title.textContent = "Customer Dashboard";
        sidebar.innerHTML = `
            <div class="sidebar-item active">My Orders</div>
            <div class="sidebar-item">My Pets</div>
            <div class="sidebar-item">Consultations</div>
        `;
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Pet Health Score</h4>
                    <div class="health-bar-container"><div class="health-bar-fill" style="width: 85%;"></div></div>
                    <p style="font-size: 1rem;">Excellent (85%)</p>
                </div>
                <div class="stat-card"><h4>Pending Orders</h4><p>1</p></div>
                <div class="stat-card"><h4>Loyalty Points</h4><p>450</p></div>
            </div>
            <h3>Your Recent Orders</h3>
            <table class="data-table">
                <tr><th>Order ID</th><th>Product</th><th>Status</th></tr>
                <tr><td>#PGC-1092</td><td>Organic Cat Food (5kg)</td><td><span style="color: #4caf50;">Shipped</span></td></tr>
            </table>
        `;
    }
}

/* 5. Chat URL Security */
function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const windowEl = document.getElementById('chat-window');
    const close = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-msg');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');

    toggle.addEventListener('click', () => {
        windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
    });

    close.addEventListener('click', () => windowEl.style.display = 'none');

    const addMessage = (text, type, isSecure = null) => {
        const div = document.createElement('div');
        div.className = `message msg-${type}`;

        let content = text;
        if (isSecure !== null) {
            const badgeClass = isSecure >= 80 ? 'safety-secure' : (isSecure >= 50 ? 'safety-warning' : 'safety-danger');
            const badgeText = isSecure >= 80 ? 'SECURE' : (isSecure >= 50 ? 'CAUTION' : 'DANGER');
            content += ` <span class="safety-badge ${badgeClass}">${badgeText} (${isSecure}%)</span>`;
        }

        div.innerHTML = content;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        // URL Check
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        const foundUrls = text.match(urlPattern);

        if (foundUrls) {
            addMessage(text, 'user', 92); // Simulated Trust Audit
        } else {
            addMessage(text, 'user');
        }

        input.value = '';
        const aiResponse = await handleGeminiQuery(text);
        addMessage(aiResponse, 'ai');
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

/* Common Logic */
function initNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = toggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = toggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = toggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.width = '100.1%'; // Slight offset for sub-pixel rendering
            nav.style.top = '0';
            nav.style.borderRadius = '0';
        } else {
            nav.style.width = '90%';
            nav.style.top = '20px';
            nav.style.borderRadius = '50px';
        }
    });
}

function initSearch() {
    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.category-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? 'block' : 'none';
        });
    });
}

function initForm() {
    document.getElementById('consultation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Scheduled! Our tech-vets will contact you.');
        e.target.reset();
    });
}
