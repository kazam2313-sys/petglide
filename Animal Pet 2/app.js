/**
 * PetGlide - Royal Premium Tech Logic (Royal AI Wala)
 * Features: Lenis Smooth Scroll, GSAP Reveal, 3D Centerpiece Interaction.
 */

const TRANSLATIONS = {
    en: {
        'nav-categories': 'Categories',
        'nav-services': 'Services',
        'nav-testimonials': 'Owners',
        'nav-contact': 'Consultation',
        'hero-title': 'Your Pet\'s Health, Elevated.',
        'hero-desc': 'Experience the future of pet wellness with our royal anti-gravity care approach. Light, airy, and tailored for every species.',
        'btn-login': 'Login',
        'btn-logout': 'Logout',
    },
    ur: {
        'nav-categories': 'اقسام',
        'nav-services': 'خدمات',
        'nav-testimonials': 'مالکان',
        'nav-contact': 'مشاورت',
        'hero-title': 'آپ کے پالتو جانوروں کی صحت، بلند۔',
        'hero-desc': 'ہمارے شاہی اینٹی گریویٹی کیئر کے ساتھ پالتو جانوروں کی صحت کے مستقبل کا تجربہ کریں۔ ہر نوع کے لیے موزوں۔',
        'btn-login': 'لاگ ان',
        'btn-logout': 'لاگ آؤٹ',
    }
};

let currentLang = 'en';
let currentUser = null;
let lenis;

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initGSAPReveal();
    init3DInteraction();
    initLangToggle();
    initChat();
    initAuth();
    initNav();
});

/* 1. Lenis Smooth Scroll */
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

/* 2. GSAP Reveal Animations */
function initGSAPReveal() {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Hero Entry Animation
    gsap.from('.hero-main h1', { opacity: 0, y: 30, duration: 1.2, ease: 'power4.out', delay: 0.2 });
    gsap.from('.hero-main p', { opacity: 0, y: 20, duration: 1.2, ease: 'power4.out', delay: 0.4 });
    gsap.from('.centerpiece-container', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'expo.out', delay: 0.6 });
}

/* 3. 3D Interaction for Centerpiece */
function init3DInteraction() {
    const box = document.getElementById('centerpiece-box');
    const img = box.querySelector('.centerpiece-img');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Tilt Effect
        const xRotation = ((clientY / innerHeight) - 0.5) * 30; // Max 15 deg
        const yRotation = ((clientX / innerWidth) - 0.5) * -30;

        gsap.to(img, {
            rotationX: xRotation,
            rotationY: yRotation,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Glowing cursor effect (optional addition)
        if (box) {
             const xPos = (clientX / innerWidth - 0.5) * 50;
             const yPos = (clientY / innerHeight - 0.5) * 50;
             gsap.to('.centerpiece-glow', {
                 x: xPos,
                 y: yPos,
                 duration: 1
             });
        }
    });

    // Reset on mouse leave
    window.addEventListener('mouseleave', () => {
        gsap.to(img, { rotationX: 0, rotationY: 0, duration: 1 });
    });
}

/* 4. Urdu Localization */
function initLangToggle() {
    const btn = document.getElementById('toggle-lang');
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ur' : 'en';
        document.documentElement.lang = currentLang;
        document.body.classList.toggle('rtl', currentLang === 'ur');
        btn.textContent = currentLang === 'en' ? 'Urdu' : 'English';
        applyTranslations();
    });
}

function applyTranslations() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (TRANSLATIONS[currentLang][key]) {
            el.textContent = TRANSLATIONS[currentLang][key];
        }
    });
}

/* 5. Gemini AI Integration */
async function handleGeminiQuery(userMessage) {
    const chatMessages = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message msg-ai';
    loadingDiv.textContent = 'Analyzing...';
    chatMessages.appendChild(loadingDiv);

    try {
        const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are 'Royal Pet AI'. Be helpful, luxurious, and concise. User: ${userMessage}` }] }]
            })
        });

        const data = await response.json();
        loadingDiv.remove();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to reach the royal servers.";
    } catch {
        loadingDiv.remove();
        return "Offline Mode: Feed your pet and check the internet.";
    }
}

/* 6. Chat Logic */
function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const win = document.getElementById('chat-window');
    const send = document.getElementById('send-msg');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');

    toggle.onclick = () => win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
    document.getElementById('close-chat').onclick = () => win.style.display = 'none';

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        const msg = document.createElement('div');
        msg.className = 'message msg-user';
        msg.textContent = text;
        messages.appendChild(msg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        const aiRes = await handleGeminiQuery(text);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message msg-ai';
        aiMsg.textContent = aiRes;
        messages.appendChild(aiMsg);
        messages.scrollTop = messages.scrollHeight;
    }

    send.onclick = sendMessage;
    input.onkeypress = (e) => e.key === 'Enter' && sendMessage();
}

/* 7. Auth & Dashboard */
function initAuth() {
    const modal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    document.getElementById('open-login').onclick = (e) => { e.preventDefault(); modal.style.display = 'flex'; };
    document.getElementById('close-login').onclick = () => modal.style.display = 'none';

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        currentUser = { name: 'Admin', role: 'admin' };
        modal.style.display = 'none';
        document.getElementById('auth-nav-area').innerHTML = `<span class="gold-text">Hello, ${currentUser.name}</span>`;
        renderDashboard();
    };
}

function renderDashboard() {
    const dash = document.getElementById('dashboard-container');
    dash.style.display = 'flex';
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('dashboard-content').innerHTML = `<h3>Royal Overview</h3><p>System status: Optimal. Zero-G levels stable.</p>`;
    document.getElementById('perform-logout').onclick = () => { currentUser = null; dash.style.display = 'none'; location.reload(); };
}

/* 8. Navigation Scroll Effect */
function initNav() {
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.top = '0';
            nav.style.width = '100.2%';
            nav.style.borderRadius = '0';
            nav.style.background = 'rgba(5, 5, 5, 0.9)';
        } else {
            nav.style.top = '20px';
            nav.style.width = '90%';
            nav.style.borderRadius = '40px';
            nav.style.background = 'rgba(5, 5, 5, 0.6)';
        }
    });

    // Mobile Toggle
    document.getElementById('mobile-menu-toggle').onclick = () => {
        document.querySelector('.nav-links').classList.toggle('active');
    };
}
function initForm() {
    document.getElementById('consultation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Scheduled! Our tech-vets will contact you.');
        e.target.reset();
    });
}
