// =========================================
// RASEL PORTFOLIO - FULL 3D THREE.JS ENGINE
// =========================================

// ===== THREE.JS 3D BACKGROUND =====
(() => {
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.z = 30;

  // Create floating particles
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorPalette = [
    new THREE.Color('#54C5F8'),
    new THREE.Color('#027DFD'),
    new THREE.Color('#A855F7'),
    new THREE.Color('#00FFFF'),
    new THREE.Color('#EC4899'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Create 3D geometric shapes
  const shapes = [];

  // Wireframe icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(3, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x54C5F8,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-35, 15, -20);
  scene.add(ico);
  shapes.push({ mesh: ico, rotX: 0.003, rotY: 0.005 });

  // Wireframe octahedron
  const octGeo = new THREE.OctahedronGeometry(2.5, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: 0xA855F7,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const oct = new THREE.Mesh(octGeo, octMat);
  oct.position.set(35, -10, -15);
  scene.add(oct);
  shapes.push({ mesh: oct, rotX: 0.006, rotY: 0.003 });

  // Torus ring
  const torusGeo = new THREE.TorusGeometry(4, 0.3, 16, 80);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x54C5F8,
    wireframe: false,
    transparent: true,
    opacity: 0.08,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(20, 25, -25);
  scene.add(torus);
  shapes.push({ mesh: torus, rotX: 0.008, rotY: 0.004 });

  // Second torus
  const torus2Geo = new THREE.TorusGeometry(3, 0.15, 16, 60);
  const torus2Mat = new THREE.MeshBasicMaterial({
    color: 0xEC4899,
    wireframe: false,
    transparent: true,
    opacity: 0.1,
  });
  const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
  torus2.position.set(-25, -20, -18);
  scene.add(torus2);
  shapes.push({ mesh: torus2, rotX: 0.005, rotY: 0.007 });

  // Tetrahedron
  const tetraGeo = new THREE.TetrahedronGeometry(2, 0);
  const tetraMat = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const tetra = new THREE.Mesh(tetraGeo, tetraMat);
  tetra.position.set(10, -30, -10);
  scene.add(tetra);
  shapes.push({ mesh: tetra, rotX: 0.01, rotY: 0.005 });

  // Connecting lines
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x54C5F8,
    transparent: true,
    opacity: 0.04,
  });

  for (let i = 0; i < 30; i++) {
    const points = [];
    points.push(new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 60
    ));
    points.push(new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 60
    ));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
  }

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    targetX += (mouseX * 2 - targetX) * 0.04;
    targetY += (-mouseY * 2 - targetY) * 0.04;

    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Rotate particles slowly
    particles.rotation.y = time * 0.05;
    particles.rotation.x = time * 0.02;

    // Animate shapes
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rotX;
      s.mesh.rotation.y += s.rotY;
    });

    // Pulse particle opacity
    particleMat.opacity = 0.55 + Math.sin(time) * 0.15;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ===== PRELOADER =====
(() => {
  const pre = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const count = document.getElementById('preloader-count');
  const nameEl = document.getElementById('preloader-name');
  if (!pre || !bar) return;

  const name = 'Rasel';
  if (nameEl) {
    const make = (txt, cls, delay) => {
      const s = document.createElement('span');
      s.textContent = txt;
      if (cls) s.className = cls;
      s.style.animationDelay = delay + 's';
      nameEl.appendChild(s);
    };
    make('<', 'br', 0);
    [...name].forEach((ch, i) => make(ch, null, (i + 1) * 0.08));
    make('/>', 'br', (name.length + 1) * 0.08);
  }

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 6;
    if (p >= 100) { p = 100; clearInterval(tick); finish(); }
    bar.style.width = p + '%';
    if (count) count.textContent = String(Math.floor(p)).padStart(2, '0');
  }, 180);

  // Preloader hidden once window load fires (or fallback timeout)
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    setTimeout(() => pre.classList.add('done'), 350);
  }
  window.addEventListener('load', () => setTimeout(finish, 500));
  setTimeout(finish, 3500); // safety
})();

// ===== SCROLL PROGRESS =====
(() => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== MAGNETIC BUTTONS =====
(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== 3D PHOTO TILT (Hero) =====
const photoWrapper = document.getElementById('photo-wrapper');
if (photoWrapper) {
  document.addEventListener('mousemove', (e) => {
    const rect = photoWrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const inner = photoWrapper.querySelector('.photo-3d-inner');
    if (inner) {
      inner.style.transform = `rotateY(${dx * 18}deg) rotateX(${-dy * 12}deg) translateZ(20px)`;
      inner.style.transition = 'transform 0.1s ease';
    }
  });

  photoWrapper.addEventListener('mouseleave', () => {
    const inner = photoWrapper.querySelector('.photo-3d-inner');
    if (inner) {
      inner.style.transform = '';
      inner.style.transition = 'transform 0.6s ease';
    }
  });
}

// ===== CARD TILT EFFECT =====
function initTiltCards() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 24}deg) rotateY(${x * 24}deg) translateZ(30px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

initTiltCards();

// ===== SCROLL REVEAL =====
function initReveal() {
  const elements = document.querySelectorAll(
    '.skill-category-card, .project-card, .contact-card, .highlight-card, ' +
    '.timeline-item, .about-text-col, .skill-bars-container, .edu-entry, .edu-card'
  );
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => observer.observe(el));
}

initReveal();

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillBarsContainer = document.querySelector('.skill-bars-container');
if (skillBarsContainer) skillObserver.observe(skillBarsContainer);

// ===== AI ASSISTANT =====
const aiKnowledgeBase = {
  tech: {
    patterns: ['tech', 'stack', 'language', 'framework', 'tool', 'use', 'know', 'skill', 'expertise'],
    response: `🚀 **Rasel's Tech Stack:**

**Primary:** Flutter & Dart (Expert level)
**State Management:** BLoC, GetX, Provider
**Backend:** Firebase (Firestore, Auth, Storage), REST APIs
**Database:** SQLite, Hive, SharedPreferences
**Other Languages:** Java, C++
**Tools:** Git, GitHub, Postman, Android SDK

Flutter is his core expertise — he can build pixel-perfect, high-performance cross-platform apps for both iOS and Android! 📱`
  },
  projects: {
    patterns: ['project', 'built', 'work', 'app', 'portfolio', 'make', 'create', 'develop'],
    response: `📂 **Rasel's Featured Projects:**

🛒 **E-commerce Platform** — Full shopping experience with Firebase real-time sync, product filtering, cart management & secure checkout.

📍 **Mirzagonj Totho Seba** — Community service app connecting citizens of Mirzagonj with local services via REST API.

📅 **Task Manager & Note Pad** — Minimalist productivity tool with SQLite local storage & GetX state management.

🆔 **Student Card System** — Digital ID solution with QR code integration for institutional record management.

Would you like details on any specific project? 🎯`
  },
  diu: {
    patterns: ['diu', 'daffodil', 'university', 'education', 'study', 'degree', 'college', 'graduate'],
    response: `🎓 **Rasel at Daffodil International University:**

He completed his **B.Sc. in Software Engineering** at DIU, focusing on:
• Software Architecture & Design Patterns
• Algorithm Design & Data Structures
• Mobile Computing & App Development
• Database Systems & Management

DIU gave him the foundation to build real-world, scalable applications and develop a problem-solving mindset. It's where his Flutter journey truly began! 🚀`
  },
  services: {
    patterns: ['service', 'offer', 'provide', 'deliver', 'specialize'],
    response: `🛠️ **Services Rasel Provides:**

• **Custom Flutter App Development** — building production-ready cross-platform mobile applications with clean architecture.
• **UI/UX Implementation** — designing polished user interfaces, intuitive navigation, and accessible interactions.
• **Firebase & Backend Integration** — integrating authentication, real-time data sync, cloud functions and REST APIs.
• **Performance Optimization** — tuning app speed, stability, and production readiness for smooth user experiences.`
  },
  role: {
    patterns: ['current role', 'junior software', 'code studio', 'position', 'company', 'work at'],
    response: `💼 **Current Role:**

Rasel is currently working as a **Junior Software Engineer at Code Studio**. He focuses on Flutter mobile development, Firebase integration, reusable component design, and maintaining scalable project architecture.`
  },
  work: {
    patterns: ['available', 'hire', 'job', 'work', 'freelance', 'opportunity', 'contact', 'reach'],
    response: `✅ **Yes, Rasel is available for work!**

He's open to:
• 💼 Full-time Flutter Developer roles
• 🤝 Freelance mobile app projects
• 🚀 Startup collaborations
• 📱 Cross-platform app development

You can reach him via:
• 📧 **Email:** aminulislamrasel@email.com
• 💼 **LinkedIn:** linkedin.com/in/rasel
• 🐙 **GitHub:** github.com/rasel

Don't hesitate to reach out — he responds quickly! 😊`
  },
  experience: {
    patterns: ['experience', 'year', 'long', 'background', 'history', 'how long'],
    response: `👨‍💻 **Rasel's Experience:**

He's been deeply immersed in Flutter & mobile development for **3+ years**, with hands-on experience building:

• Production-ready E-commerce platforms
• Community service applications used by real users
• Productivity tools with clean, minimalist UIs
• Institutional management systems

His expertise spans the full mobile development lifecycle — from architecture design to deployment. Still early in his professional journey but with a strong portfolio and solid fundamentals! 💪`
  },
  default: {
    response: `🤔 Great question! Here are some things I can tell you about Rasel:

• 🚀 **Tech Stack** — Flutter, Dart, Firebase, REST APIs
• 📂 **Projects** — E-commerce, Community App, Task Manager, Student ID
• 🎓 **Education** — B.Sc. Software Engineering at DIU
• 💼 **Availability** — Open to work opportunities
• 👨‍💻 **Experience** — 3+ years in Flutter development

Try asking me something more specific! 😊`
  }
};

function getAIResponse(query) {
  const q = query.toLowerCase();
  for (const key of Object.keys(aiKnowledgeBase)) {
    if (key === 'default') continue;
    const kb = aiKnowledgeBase[key];
    if (kb.patterns && kb.patterns.some(p => q.includes(p))) {
      return kb.response;
    }
  }
  return aiKnowledgeBase.default.response;
}

function addMessage(text, type) {
  const messages = document.getElementById('ai-messages');
  const msg = document.createElement('div');
  msg.className = `ai-message ${type}`;

  const bubble = document.createElement('div');
  bubble.className = 'ai-message-bubble';
  bubble.innerHTML = type === 'bot' ? formatMarkdown(text) : escapeHtml(text);

  msg.appendChild(bubble);
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• (.*)/gm, '<div style="padding-left:12px">• $1</div>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showTyping() {
  const messages = document.getElementById('ai-messages');
  const typing = document.createElement('div');
  typing.className = 'ai-message bot';
  typing.id = 'typing-indicator';
  typing.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function askAI(question) {
  const input = document.getElementById('ai-input');
  input.value = question;
  sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  sendBtn.classList.add('loading');

  showTyping();

  setTimeout(() => {
    hideTyping();
    const response = getAIResponse(text);
    addMessage(response, 'bot');
    sendBtn.classList.remove('loading');
  }, 1200 + Math.random() * 800);
}

document.getElementById('ai-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendAIMessage();
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== TYPING EFFECT IN HERO =====
function startTypingEffect() {
  const titles = [
    'Flutter Expert',
    'Mobile Developer',
    'Software Engineer',
    'UI/UX Enthusiast',
  ];
  let currentTitle = 0;
  let currentChar = 0;
  let isDeleting = false;

  const heroTitle = document.querySelector('.hero-title');
  const originalHTML = heroTitle.innerHTML;

  // We only optionally add this if desired
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const text = counter.innerText;
    const num = parseFloat(text);
    if (isNaN(num)) return;
    const suffix = text.replace(num.toString(), '');
    let current = 0;
    const increment = num / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      counter.innerText = (Number.isInteger(num) ? Math.floor(current) : current.toFixed(0)) + suffix;
    }, 40);
  });
}

// Trigger counter when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ===== GLITCH EFFECT ON LOGO =====
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  setInterval(() => {
    navLogo.style.textShadow = `2px 0 #54C5F8, -2px 0 #A855F7`;
    setTimeout(() => {
      navLogo.style.textShadow = '';
    }, 100);
  }, 4000);
}

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
  });

  const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category-card, .contact-card, .edu-card, input');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('active');
      cursorOutline.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('active');
      cursorOutline.classList.remove('active');
    });
  });
}

// ===== CARD GLOW EFFECTS =====
document.querySelectorAll('.project-card, .skill-category-card, .contact-card, .edu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== AVATAR MAN SCROLL LOGIC =====
const avatarMan = document.getElementById('avatar-man');
if (avatarMan) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      avatarMan.classList.add('sitting');
    } else {
      avatarMan.classList.remove('sitting');
    }
  });
}

console.log('%c🚀 Rasel Portfolio', 'font-size: 24px; font-weight: bold; color: #54C5F8;');
console.log('%cBuilt with Flutter 💙 and Three.js 3D', 'font-size: 14px; color: #8BA4BE;');

(function () {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const defaultTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      themeToggle?.querySelector('i')?.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('light-theme');
      themeToggle?.querySelector('i')?.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  if (themeToggle) {
    setTheme(defaultTheme);
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  } else if (defaultTheme === 'light') {
    document.body.classList.add('light-theme');
  }
})();