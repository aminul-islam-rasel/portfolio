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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
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

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // Animation loop
  let time = 0;
  let animationFrameId = null;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  function animate() {
    animationFrameId = null;
    if (document.hidden || motionPreference.matches) return;
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
    animationFrameId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!document.hidden && !motionPreference.matches && animationFrameId === null) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else {
      startAnimation();
    }
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else {
      startAnimation();
    }
  });
  renderer.render(scene, camera);
  startAnimation();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
    if (document.hidden || motionPreference.matches) renderer.render(scene, camera);
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
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
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
    '.about-image-col, .about-text-col, .experience-section .highlight-card, ' +
    '.service-card, .skill-category-card, .skill-bars-container, .project-card, ' +
    '.edu-entry, .ai-chat-container, .contact-card, .contact-form'
  );
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  elements.forEach((element) => element.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter((sibling) => sibling.classList.contains('reveal'));
        const revealIndex = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.setProperty('--reveal-delay', `${Math.min(revealIndex, 4) * 55}ms`);
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  elements.forEach((element) => observer.observe(element));
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

// ===== EDUCATION TIMELINE PROGRESS =====
(() => {
  const timeline = document.querySelector('.edu-timeline-wrapper');
  if (!timeline) return;
  const entries = [...timeline.querySelectorAll('.edu-entry')];

  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const visibleProgress = Math.max(0, Math.min(1, (window.innerHeight * 0.76 - rect.top) / rect.height));
    timeline.style.setProperty('--timeline-progress', String(visibleProgress));
    const activeIndex = Math.min(entries.length - 1, Math.floor(visibleProgress * entries.length));
    entries.forEach((entry, index) => {
      entry.classList.toggle('is-past', visibleProgress >= 1 || index < activeIndex);
      entry.classList.toggle('is-current', visibleProgress < 1 && index === activeIndex);
    });
  };

  updateTimeline();
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline, { passive: true });
})();

// ===== SECTION HEADING SIGNAL =====
(() => {
  const headers = document.querySelectorAll('.section-header');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    headers.forEach((header) => header.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  headers.forEach((header) => observer.observe(header));
})();

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

// ===== PROJECT FILTERS AND DETAILS =====
(() => {
  const projectGrid = document.querySelector('.projects-grid');
  const filterButtons = document.querySelectorAll('.project-filter');
  const filterStatus = document.getElementById('project-filter-status');
  const projectDialog = document.getElementById('project-dialog');
  const dialogTitle = document.getElementById('project-dialog-title');
  const dialogContent = document.getElementById('project-dialog-content');
  if (!projectGrid) return;

  const categoriesByTitle = {
    'boichitro paikari': ['ecommerce'],
    'nova land': ['other'],
    'e-commerce platform': ['ecommerce'],
    'mathbaria tech': ['ecommerce'],
    kashpai: ['rewards'],
    'office buddy': ['productivity'],
    'mirzagonj totho seba': ['community'],
    'ah bangla patente': ['education'],
    'i track ruet': ['other'],
    'side income': ['rewards'],
    'task manager & note pad': ['productivity'],
    'student card system': ['education'],
    'note pad': ['productivity'],
  };

  const projectCards = [...projectGrid.querySelectorAll('.project-card')];
  projectCards.forEach((card) => {
    const title = card.querySelector('.project-title')?.textContent.trim().toLowerCase();
    card.dataset.categories = (categoriesByTitle[title] || ['other']).join(' ');
    const detailsButton = document.createElement('button');
    detailsButton.className = 'project-details-trigger';
    detailsButton.type = 'button';
    detailsButton.textContent = 'View details';
    detailsButton.addEventListener('click', () => openProjectDetails(card));
    const links = card.querySelector('.project-links');
    if (links) links.append(detailsButton);
    else card.querySelector('.project-card-inner')?.append(detailsButton);
  });

  filterButtons.forEach((button) => {
    const category = button.dataset.filter;
    const label = button.textContent.trim();
    const count = category === 'all'
      ? projectCards.length
      : projectCards.filter((card) => card.dataset.categories.split(' ').includes(category)).length;
    const topLine = document.createElement('span');
    const labelElement = document.createElement('span');
    const countElement = document.createElement('span');
    const track = document.createElement('span');
    const fill = document.createElement('span');

    topLine.className = 'project-filter-topline';
    labelElement.className = 'project-filter-label';
    labelElement.textContent = label;
    countElement.className = 'project-filter-count';
    countElement.textContent = String(count);
    countElement.setAttribute('aria-hidden', 'true');
    topLine.append(labelElement, countElement);
    track.className = 'project-filter-track';
    track.setAttribute('aria-hidden', 'true');
    fill.className = 'project-filter-fill';
    fill.style.setProperty('--bar-scale', String(count / projectCards.length));
    track.append(fill);
    button.dataset.projectCount = String(count);
    button.replaceChildren(topLine, track);
    button.setAttribute('aria-label', `${label}: ${count} projects`);
  });

  requestAnimationFrame(() => document.querySelector('.project-filters')?.classList.add('is-ready'));

  function openProjectDetails(card) {
    if (!projectDialog || !dialogTitle || !dialogContent) return;
    const title = card.querySelector('.project-title')?.textContent.trim() || 'Project';
    dialogTitle.textContent = title;
    dialogContent.replaceChildren();

    const technologies = card.querySelector('.project-tech-chips');
    const problem = card.querySelector('.project-problem');
    const solution = card.querySelector('.project-solution');
    const features = card.querySelector('.project-features');
    [technologies, problem, solution, features].forEach((section) => {
      if (!section) return;
      const copy = section.cloneNode(true);
      copy.classList.add('project-dialog-section');
      dialogContent.append(copy);
    });

    const links = [...card.querySelectorAll('.project-footer a')];
    if (links.length) {
      const linkGroup = document.createElement('div');
      linkGroup.className = 'project-dialog-links';
      links.forEach((link) => {
        const copy = link.cloneNode(true);
        copy.removeAttribute('class');
        linkGroup.append(copy);
      });
      dialogContent.append(linkGroup);
    }
    projectDialog.showModal();
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.dataset.filter;
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const matches = selectedCategory === 'all' || card.dataset.categories.split(' ').includes(selectedCategory);
        card.hidden = !matches;
        if (matches) {
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.classList.remove('filter-enter');
            card.style.setProperty('--filter-delay', `${Math.min(visibleCount, 6) * 45}ms`);
            void card.offsetWidth;
            card.classList.add('filter-enter');
            card.addEventListener('animationend', () => {
              card.classList.remove('filter-enter');
              card.style.removeProperty('--filter-delay');
            }, { once: true });
          }
          visibleCount += 1;
        }
      });
      filterButtons.forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle('is-active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      if (filterStatus) {
        filterStatus.dataset.visibleCount = String(visibleCount);
        filterStatus.textContent = document.documentElement.lang === 'bn'
          ? `${visibleCount}টি প্রকল্প দেখানো হচ্ছে।`
          : `${visibleCount} projects shown.`;
      }
    });
  });

  projectDialog?.querySelector('[data-dialog-close]')?.addEventListener('click', () => projectDialog.close());
  projectDialog?.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
})();

// ===== SAMPLE CASHBACK ESTIMATOR =====
(() => {
  const form = document.getElementById('cashback-form');
  const result = document.getElementById('cashback-result');
  if (!form || !result) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(form.elements.amount.value);
    const rate = Number(form.elements.rate.value);
    const cashback = amount * rate / 100;
    result.dataset.reward = cashback.toFixed(2);
    result.textContent = document.documentElement.lang === 'bn'
      ? `উদাহরণস্বরূপ পুরস্কার: ৳${result.dataset.reward}`
      : `Example reward: ৳${result.dataset.reward}`;
  });
})();

// ===== CONTACT FORM =====
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:aminul.islam200256@gmail.com?subject=${subject}&body=${body}`;
  });
})();

// ===== ENGLISH / BANGLA LANGUAGE TOGGLE =====
(() => {
  const toggle = document.getElementById('language-toggle');
  if (!toggle) return;

  const translations = {
    'Skip to content': 'মূল কনটেন্টে যান',
    Home: 'হোম', About: 'পরিচিতি', Experience: 'অভিজ্ঞতা', Services: 'সেবাসমূহ',
    Skills: 'দক্ষতা', Projects: 'প্রকল্প', Education: 'শিক্ষা', Contact: 'যোগাযোগ', 'Ask AI': 'এআই-কে জিজ্ঞাসা',
    'Available for Work': 'কাজের জন্য উপলব্ধ', 'Crafting Seamless': 'সাবলীলভাবে তৈরি করছি',
    'Mobile Experiences': 'মোবাইল অভিজ্ঞতা', 'with Flutter': 'Flutter দিয়ে',
    'Hi, I\'m': 'হ্যালো, আমি', '. A Software Engineer dedicated to building': '. একজন সফটওয়্যার ইঞ্জিনিয়ার, যিনি তৈরি করেন',
    'high-performance, user-centric applications.': 'উচ্চ কর্মক্ষমতাসম্পন্ন, ব্যবহারকারী-কেন্দ্রিক অ্যাপ্লিকেশন।',
    'View My Projects': 'আমার প্রকল্প দেখুন', 'Download Resume': 'জীবনবৃত্তান্ত ডাউনলোড',
    'Projects Built': 'নির্মিত প্রকল্প', 'Years Learning': 'বছরের শেখার অভিজ্ঞতা', Passion: 'আগ্রহ',
    'Who I Am': 'আমি কে', About: 'পরিচিতি', Me: 'আমি',
    'I am a': 'আমি একজন', 'Software Engineering graduate': 'সফটওয়্যার ইঞ্জিনিয়ারিং স্নাতক',
    'from Daffodil International University with a deep': 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি থেকে, যার গভীর',
    'passion for mobile app architecture.': 'আগ্রহ মোবাইল অ্যাপ আর্কিটেকচারে।',
    'Performance First': 'কর্মক্ষমতা সবার আগে', 'Clean Architecture': 'পরিচ্ছন্ন আর্কিটেকচার',
    'Community Impact': 'কমিউনিটিতে প্রভাব',
    Experience: 'অভিজ্ঞতা', 'Current Role': 'বর্তমান পদ',
    'What I Offer': 'আমি যা দিই', 'Services I': 'আমার সেবাসমূহ', Provide: 'প্রদান করি',
    Expertise: 'দক্ষতা', 'My': 'আমার', 'Tech Stack': 'প্রযুক্তির তালিকা',
    'My Work': 'আমার কাজ', Featured: 'নির্বাচিত', 'Project mix': 'প্রকল্পের ধরন',
    'Featured Projects': 'নির্বাচিত প্রকল্প',
    'Filter projects': 'প্রকল্প ফিল্টার করুন', 'All projects': 'সব প্রকল্প',
    'E-commerce': 'ই-কমার্স', Rewards: 'পুরস্কার', Productivity: 'উৎপাদনশীলতা',
    Community: 'কমিউনিটি', Other: 'অন্যান্য', 'View details': 'বিস্তারিত দেখুন',
    'Live Demo': 'লাইভ ডেমো', Problem: 'সমস্যা', Solution: 'সমাধান', Concept: 'ধারণা',
    'Shop Products': 'পণ্য কিনুন', 'Earn Rewards': 'পুরস্কার অর্জন করুন',
    'Try the sample cashback estimator': 'ক্যাশব্যাকের নমুনা হিসাব দেখুন',
    'Purchase amount': 'কেনাকাটার পরিমাণ', 'Example cashback rate (%)': 'নমুনা ক্যাশব্যাকের হার (%)',
    'Calculate example': 'নমুনা হিসাব করুন', 'Enter values to estimate a reward.': 'পুরস্কার হিসাব করতে মান লিখুন।',
    'Illustration only. Actual reward rates and terms are set by Kashpai.': 'এটি শুধু উদাহরণ। প্রকৃত পুরস্কারের হার ও শর্ত Kashpai নির্ধারণ করে।',
    'Academic Timeline': 'শিক্ষাজীবনের ধারাবাহিকতা',
    'The path that shaped my engineering mindset.': 'যে পথ আমার প্রকৌশল-চিন্তাকে গড়ে তুলেছে।',
    Interactive: 'ইন্টারঅ্যাকটিভ', 'Ask': 'জিজ্ঞাসা করুন',
    'Don\'t want to scroll? Ask my AI Assistant!': 'স্ক্রল করতে চান না? আমার এআই সহকারীকে জিজ্ঞাসা করুন!',
    'Get In Touch': 'যোগাযোগ করুন', 'Let\'s': 'চলুন', Connect: 'যোগাযোগ করি',
    'Open for opportunities, collaborations, and conversations.': 'চাকরি, সহযোগিতা ও আলোচনার জন্য যোগাযোগ করতে পারেন।',
    Email: 'ইমেইল', LinkedIn: 'লিংকডইন', GitHub: 'গিটহাব', Location: 'অবস্থান',
    'Dhaka, Bangladesh': 'ঢাকা, বাংলাদেশ', Facebook: 'ফেসবুক', Instagram: 'ইনস্টাগ্রাম', WhatsApp: 'হোয়াটসঅ্যাপ',
    'Send a message': 'বার্তা পাঠান',
    'Your email app will open with your message ready. This form does not send directly from the website.': 'আপনার বার্তাসহ ইমেইল অ্যাপ খুলবে। এই ফর্ম ওয়েবসাইট থেকে সরাসরি বার্তা পাঠায় না।',
    'Your name': 'আপনার নাম', 'Your email': 'আপনার ইমেইল', Message: 'বার্তা',
    'Continue in email': 'ইমেইল অ্যাপে চালিয়ে যান',
    'Scroll Down': 'নিচে স্ক্রল করুন', 'DIU Graduate': 'ডিআইইউ স্নাতক',
    'My journey in development is driven by a simple goal:': 'উন্নয়নকাজে আমার পথচালনার সহজ লক্ষ্য হলো:',
    'solving real-world problems through clean, efficient code': 'পরিচ্ছন্ন ও কার্যকর কোডের মাধ্যমে বাস্তব সমস্যার সমাধান করা',
    '. Whether it\'s a complex E-commerce engine or a community service tool like': '. জটিল ই-কমার্স ব্যবস্থা হোক বা কমিউনিটি সেবার টুল',
    '\'Mirzagonj Totho Seba,\'': '\'Mirzagonj Totho Seba,\'',
    'I focus on delivering quality and scalability.': 'আমি মানসম্মত ও সম্প্রসারণযোগ্য সমাধান দিতে মনোযোগী।',
    'Optimized Flutter apps with smooth 60fps animations': 'মসৃণ ৬০ এফপিএস অ্যানিমেশনসহ অপ্টিমাইজ করা Flutter অ্যাপ',
    'BLoC, MVVM patterns for scalable codebases': 'সম্প্রসারণযোগ্য কোডবেসের জন্য BLoC ও MVVM প্যাটার্ন',
    'Built tools that connect citizens with local services': 'নাগরিকদের স্থানীয় সেবার সঙ্গে যুক্ত করার টুল তৈরি করেছি',
    'Let\'s Talk →': 'কথা বলুন →', 'Current Role': 'বর্তমান পদ', Role: 'পদ',
    'Junior Software Engineer at Code Studio': 'Code Studio-তে জুনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
    'Currently working on Flutter mobile applications, Firebase integrations, and clean architecture implementations for scalable user experiences.': 'বর্তমানে Flutter মোবাইল অ্যাপ, Firebase ইন্টিগ্রেশন এবং সম্প্রসারণযোগ্য ব্যবহারকারী-অভিজ্ঞতার জন্য পরিচ্ছন্ন আর্কিটেকচার নিয়ে কাজ করছি।',
    Responsibilities: 'দায়িত্বসমূহ',
    'Designing reusable Flutter widgets, integrating APIs and Firebase services, and maintaining clean, testable code.': 'পুনর্ব্যবহারযোগ্য Flutter উইজেট তৈরি, API ও Firebase সেবা সংযুক্ত করা এবং পরিচ্ছন্ন, পরীক্ষাযোগ্য কোড বজায় রাখা।',
    'Custom Flutter App Development': 'কাস্টম Flutter অ্যাপ তৈরি',
    'Delivering scalable, production-ready mobile apps with clean architecture, responsive layouts, and smooth cross-platform performance.': 'পরিচ্ছন্ন আর্কিটেকচার, অভিযোজিত লেআউট এবং মসৃণ ক্রস-প্ল্যাটফর্ম পারফরম্যান্সসহ উৎপাদন-প্রস্তুত মোবাইল অ্যাপ তৈরি।',
    'UX-Driven Interface Design': 'UX-ভিত্তিক ইন্টারফেস ডিজাইন',
    'Designing intuitive user journeys, polished interactions, and accessible screens that strengthen engagement and improve usability.': 'সহজ ব্যবহারকারী-যাত্রা, পরিমার্জিত ইন্টারঅ্যাকশন এবং ব্যবহারযোগ্যতা বাড়ায় এমন অ্যাক্সেসিবল স্ক্রিন ডিজাইন।',
    'Firebase & Backend Integration': 'Firebase ও ব্যাকএন্ড সংযুক্তকরণ',
    'Implementing secure authentication, real-time database sync, REST API connectivity, and cloud workflows for reliable app services.': 'নির্ভরযোগ্য অ্যাপ সেবার জন্য নিরাপদ অথেনটিকেশন, রিয়েল-টাইম ডেটাবেস সিঙ্ক, REST API এবং ক্লাউড ওয়ার্কফ্লো যুক্ত করা।',
    'Performance Optimization': 'পারফরম্যান্স উন্নতকরণ',
    'Improving app speed, reducing load times, and maintaining robust code quality for smoother launch, runtime, and scaling.': 'অ্যাপের গতি বাড়ানো, লোডিং সময় কমানো এবং স্থিতিশীল কোডের মাধ্যমে মসৃণ চালু ও সম্প্রসারণ নিশ্চিত করা।',
    Languages: 'প্রোগ্রামিং ভাষা', Frameworks: 'ফ্রেমওয়ার্ক', 'State Management': 'স্টেট ম্যানেজমেন্ট',
    Database: 'ডেটাবেস', 'Backend / API': 'ব্যাকএন্ড / API', 'Version Control': 'ভার্সন কন্ট্রোল',
    'REST API Integration': 'REST API ইন্টিগ্রেশন', 'State Management (BLoC/GetX)': 'স্টেট ম্যানেজমেন্ট (BLoC/GetX)',
    'Java / Android SDK': 'Java / Android SDK',
    'A wholesale business needed a dependable digital platform to streamline product browsing, bulk ordering, and business operations.': 'পণ্য দেখা, পাইকারি অর্ডার এবং ব্যবসায়িক কার্যক্রম সহজ করতে একটি নির্ভরযোগ্য ডিজিটাল প্ল্যাটফর্মের প্রয়োজন ছিল।',
    'A wholesale e-commerce platform built to support organized catalog management, efficient ordering, and scalable business growth.': 'সুশৃঙ্খল পণ্য তালিকা, কার্যকর অর্ডার এবং ব্যবসার সম্প্রসারণে সহায়ক একটি পাইকারি ই-কমার্স প্ল্যাটফর্ম।',
    'Bulk Ordering': 'বাল্ক অর্ডার', 'Product Catalog': 'পণ্যের তালিকা', 'Business Dashboard': 'ব্যবসায়িক ড্যাশবোর্ড',
    'Clients needed a professional digital experience for legal and property-related services with quick access to support and information.': 'আইনি ও সম্পত্তি-সংক্রান্ত সেবার তথ্য এবং সহায়তা সহজে পেতে ক্লায়েন্টদের একটি পেশাদার ডিজিটাল অভিজ্ঞতা দরকার ছিল।',
    'A legal and property services application designed to present services clearly and support smooth client engagement.': 'সেবা স্পষ্টভাবে তুলে ধরা এবং ক্লায়েন্টদের সঙ্গে সহজ যোগাযোগে সহায়তার জন্য তৈরি আইনি ও সম্পত্তি সেবার অ্যাপ।',
    'Service Listings': 'সেবার তালিকা', 'Client Support': 'ক্লায়েন্ট সহায়তা', 'Professional UX': 'পেশাদার UX',
    'Needed a seamless end-to-end shopping experience with real-time database sync and secure transactions.': 'রিয়েল-টাইম ডেটাবেস সিঙ্ক এবং নিরাপদ লেনদেনসহ শুরু থেকে শেষ পর্যন্ত সহজ কেনাকাটার অভিজ্ঞতা দরকার ছিল।',
    'Built a full-featured app with product filtering, cart management, and secure checkout flow.': 'পণ্য ফিল্টার, কার্ট ব্যবস্থাপনা এবং নিরাপদ চেকআউটসহ পূর্ণাঙ্গ অ্যাপ তৈরি করা হয়েছে।',
    'Product Filtering': 'পণ্য ফিল্টার', 'Cart Management': 'কার্ট ব্যবস্থাপনা', 'Secure Checkout': 'নিরাপদ চেকআউট',
    'Mathbaria Tech needed a modern e-commerce platform to reach online customers and manage inventory.': 'অনলাইন ক্রেতাদের কাছে পৌঁছানো ও মজুত ব্যবস্থাপনার জন্য Mathbaria Tech-এর একটি আধুনিক ই-কমার্স প্ল্যাটফর্ম দরকার ছিল।',
    'A full-featured e-commerce app with product catalog, cart management, order tracking, and payment integration.': 'পণ্যের তালিকা, কার্ট ব্যবস্থাপনা, অর্ডার ট্র্যাকিং এবং পেমেন্ট ইন্টিগ্রেশনসহ পূর্ণাঙ্গ ই-কমার্স অ্যাপ।',
    'Order Tracking': 'অর্ডার ট্র্যাকিং', 'Payment Gateway': 'পেমেন্ট গেটওয়ে',
    'Shoppers want to get more value when making purchases.': 'কেনাকাটার সময় ক্রেতারা অতিরিক্ত সুবিধা পেতে চান।',
    'A rewards-based shopping app where users earn rewards when they shop.': 'কেনাকাটা করলে পুরস্কার পাওয়া যায় এমন একটি শপিং অ্যাপ।',
    'Offices needed a simple way to track employee activities and record work progress throughout the day.': 'কর্মীদের কাজের কার্যক্রম ও অগ্রগতি নথিবদ্ধ করার সহজ উপায় অফিসগুলোর দরকার ছিল।',
    'An office activity tracking app that logs work progress, breaks, and provides analytics for productivity insights.': 'কাজের অগ্রগতি ও বিরতি নথিবদ্ধ করে এবং উৎপাদনশীলতার বিশ্লেষণ দেয় এমন অফিস অ্যাক্টিভিটি ট্র্যাকিং অ্যাপ।',
    'Activity Tracking': 'কার্যক্রম ট্র্যাকিং', 'Work Logs': 'কাজের নথি', 'Analytics Dashboard': 'বিশ্লেষণ ড্যাশবোর্ড',
    'Citizens of Mirzagonj lacked a centralized platform for accessing local services and information.': 'স্থানীয় সেবা ও তথ্য পাওয়ার জন্য Mirzagonj-এর নাগরিকদের একটি কেন্দ্রীয় প্ল্যাটফর্ম ছিল না।',
    'A localized community service app that bridges the gap between citizens and local services.': 'নাগরিক ও স্থানীয় সেবার মধ্যে সংযোগ তৈরি করা একটি স্থানীয় কমিউনিটি অ্যাপ।',
    'Local Directory': 'স্থানীয় ডিরেক্টরি', 'Community Hub': 'কমিউনিটি হাব', 'REST API Powered': 'REST API-চালিত',
    'Students preparing for Italian Patente exam needed an interactive learning app with practice tests.': 'ইতালিয়ান Patente পরীক্ষার প্রস্তুতির জন্য শিক্ষার্থীদের অনুশীলনীসহ একটি ইন্টারঅ্যাকটিভ শেখার অ্যাপ দরকার ছিল।',
    'A comprehensive exam preparation app with practice questions, real-time progress tracking, and study materials.': 'অনুশীলনী প্রশ্ন, তাৎক্ষণিক অগ্রগতি ট্র্যাকিং এবং পড়ার উপকরণসহ একটি পূর্ণাঙ্গ পরীক্ষা প্রস্তুতি অ্যাপ।',
    'Practice Tests': 'অনুশীলনী পরীক্ষা', 'Progress Tracking': 'অগ্রগতি ট্র্যাকিং', 'Timed Quizzes': 'সময়-নির্ধারিত কুইজ',
    'RUET students needed a real-time vehicle tracking system to monitor campus transportation.': 'ক্যাম্পাসের যানবাহন পর্যবেক্ষণে RUET শিক্ষার্থীদের রিয়েল-টাইম ট্র্যাকিং ব্যবস্থা দরকার ছিল।',
    'A real-time GPS-based vehicle tracking app with live location updates and arrival estimates for campus vehicles.': 'ক্যাম্পাসের যানবাহনের অবস্থান ও পৌঁছানোর আনুমানিক সময় দেখায় এমন GPS-ভিত্তিক রিয়েল-টাইম ট্র্যাকিং অ্যাপ।',
    'Live GPS Tracking': 'লাইভ GPS ট্র্যাকিং', 'Real-time Updates': 'রিয়েল-টাইম আপডেট', 'Arrival Estimate': 'পৌঁছানোর আনুমানিক সময়',
    'Users wanted to earn rewards and incentives by maintaining an active walking lifestyle.': 'হাঁটার মাধ্যমে সক্রিয় জীবনযাপন বজায় রেখে ব্যবহারকারীরা পুরস্কার পেতে চেয়েছিলেন।',
    'A health app that tracks walking activities and rewards users with coins redeemable for real benefits.': 'হাঁটার কার্যক্রম ট্র্যাক করে এবং সুবিধার জন্য ব্যবহারযোগ্য কয়েন দেয় এমন একটি স্বাস্থ্য অ্যাপ।',
    'Step Tracking': 'পদক্ষেপ ট্র্যাকিং', 'Coin Rewards': 'কয়েন পুরস্কার', Leaderboard: 'লিডারবোর্ড',
    'Users needed a minimalist yet powerful productivity tool without relying on cloud services.': 'ক্লাউড সেবার ওপর নির্ভর না করে ব্যবহারকারীদের সহজ কিন্তু কার্যকর উৎপাদনশীলতার টুল দরকার ছিল।',
    'Productivity app focused on minimalist UI with local data persistence and offline support.': 'সহজ UI, স্থানীয় ডেটা সংরক্ষণ এবং অফলাইন ব্যবহারের সুবিধাসহ উৎপাদনশীলতার অ্যাপ।',
    'Task Tracking': 'কাজ ট্র্যাকিং', 'Minimalist UI': 'মিনিমাল UI',
    'Institutions struggled with paper-based ID systems, making record management inefficient.': 'কাগজভিত্তিক আইডি ব্যবস্থার কারণে প্রতিষ্ঠানগুলোকে রেকর্ড ব্যবস্থাপনায় অসুবিধায় পড়তে হতো।',
    'A digital identification tool with QR code integration, streamlining institutional record management.': 'QR কোড-যুক্ত একটি ডিজিটাল পরিচয়পত্র ব্যবস্থা, যা প্রতিষ্ঠানের রেকর্ড ব্যবস্থাপনা সহজ করে।',
    'QR Code ID': 'QR কোড আইডি', 'Digital Record': 'ডিজিটাল রেকর্ড', 'Instant Scan': 'তাৎক্ষণিক স্ক্যান',
    'Users needed a simple and reliable way to capture notes quickly without relying on complex tools.': 'জটিল টুল ছাড়াই দ্রুত নোট রাখার সহজ ও নির্ভরযোগ্য উপায় ব্যবহারকারীদের দরকার ছিল।',
    'A lightweight note-taking application focused on fast input, easy organization, and clean daily use.': 'দ্রুত লেখা, সহজে সাজানো এবং দৈনন্দিন ব্যবহারের জন্য তৈরি হালকা নোট অ্যাপ।',
    'Quick Notes': 'দ্রুত নোট', 'Clean UI': 'পরিচ্ছন্ন UI', 'Local Saving': 'স্থানীয়ভাবে সংরক্ষণ',
    'My Journey': 'আমার পথচলা', Academic: 'শিক্ষাগত', Timeline: 'সময়রেখা', Completed: 'সম্পন্ন',
    'B.Sc. in Software Engineering': 'সফটওয়্যার ইঞ্জিনিয়ারিংয়ে স্নাতক',
    'Core focus on': 'মূল মনোযোগ ছিল',
    '. Building real-world Flutter applications, studying distributed systems, and working on collaborative capstone projects.': '. বাস্তব Flutter অ্যাপ তৈরি, ডিস্ট্রিবিউটেড সিস্টেম অধ্যয়ন এবং দলগত ক্যাপস্টোন প্রকল্পে কাজ।',
    'Software Architecture': 'সফটওয়্যার আর্কিটেকচার', 'Mobile Ecosystems': 'মোবাইল ইকোসিস্টেম',
    'Algorithm Design': 'অ্যালগরিদম ডিজাইন', 'OOP & Design Patterns': 'OOP ও ডিজাইন প্যাটার্ন', 'Database Systems': 'ডেটাবেস সিস্টেম',
    'Higher Secondary Certificate (HSC)': 'উচ্চ মাধ্যমিক সার্টিফিকেট (HSC)',
    'Completed Higher Secondary education with a focus on Science. Developed a strong foundation in Mathematics and Physics that fuels analytical problem-solving today.': 'বিজ্ঞান বিভাগে উচ্চ মাধ্যমিক সম্পন্ন করেছি। গণিত ও পদার্থবিজ্ঞানের দৃঢ় ভিত্তি আজ বিশ্লেষণধর্মী সমস্যা সমাধানে সহায়তা করে।',
    'Science Group': 'বিজ্ঞান বিভাগ', Mathematics: 'গণিত', Physics: 'পদার্থবিজ্ঞান',
    'Secondary School Certificate (SSC)': 'মাধ্যমিক স্কুল সার্টিফিকেট (SSC)',
    'Completed secondary education with distinction. The early years where curiosity turned into a passion for technology and problem-solving.': 'কৃতিত্বের সঙ্গে মাধ্যমিক সম্পন্ন করেছি। এই সময়ের কৌতূহল থেকেই প্রযুক্তি ও সমস্যা সমাধানের প্রতি আগ্রহ তৈরি হয়।',
    'General Studies': 'সাধারণ শিক্ষা',
    'Rasel AI': 'রাসেল এআই', 'Rasel AI Assistant': 'রাসেল এআই সহকারী', '🟢 Always Online': '🟢 সবসময় অনলাইনে', 'Powered by AI': 'এআই দ্বারা চালিত',
    'Welcome!': 'স্বাগতম!',
    'I’m Rasel’s AI assistant. I can share details on his technical skills, development experience, current role, and portfolio highlights. How can I assist you today?': 'আমি রাসেলের এআই সহকারী। তার প্রযুক্তিগত দক্ষতা, কাজের অভিজ্ঞতা, বর্তমান পদ এবং প্রকল্প সম্পর্কে জানাতে পারি। কীভাবে সাহায্য করতে পারি?',
    'What is Rasel\'s tech stack?': 'রাসেলের প্রযুক্তির তালিকা কী?', 'Summarize his experience': 'তার অভিজ্ঞতা সংক্ষেপে বলুন',
    'What services does he provide?': 'তিনি কী কী সেবা দেন?', 'Tell me about his current role': 'তার বর্তমান পদ সম্পর্কে বলুন',
    'How can I contact him?': 'তার সঙ্গে কীভাবে যোগাযোগ করব?', 'What are his strongest technologies?': 'তার সবচেয়ে শক্তিশালী প্রযুক্তিগত দক্ষতা কী?',
    'What type of apps does he build?': 'তিনি কী ধরনের অ্যাপ তৈরি করেন?', 'Does he work with Firebase?': 'তিনি কি Firebase নিয়ে কাজ করেন?',
    'Q: What kind of applications does Rasel build?': 'প্রশ্ন: রাসেল কী ধরনের অ্যাপ তৈরি করেন?',
    'A: He creates cross-platform Flutter applications with polished UI, backend integration, and responsive performance.': 'উত্তর: তিনি পরিমার্জিত UI, ব্যাকএন্ড ইন্টিগ্রেশন ও মসৃণ পারফরম্যান্সসহ ক্রস-প্ল্যাটফর্ম Flutter অ্যাপ তৈরি করেন।',
    'Q: What services can he provide?': 'প্রশ্ন: তিনি কী কী সেবা দিতে পারেন?',
    'A: Mobile app development, UI/UX implementation, Firebase backend integration, and production optimization.': 'উত্তর: মোবাইল অ্যাপ তৈরি, UI/UX বাস্তবায়ন, Firebase ব্যাকএন্ড ইন্টিগ্রেশন এবং পারফরম্যান্স উন্নয়ন।',
    'Q: Where is he working now?': 'প্রশ্ন: তিনি বর্তমানে কোথায় কাজ করছেন?',
    'A: He is currently a Junior Software Engineer at Code Studio, crafting Flutter apps and supporting scalable mobile solutions.': 'উত্তর: তিনি বর্তমানে Code Studio-তে জুনিয়র সফটওয়্যার ইঞ্জিনিয়ার হিসেবে Flutter অ্যাপ ও সম্প্রসারণযোগ্য মোবাইল সমাধান তৈরি করছেন।',
    'linkedin.com/in/MD Aminul Islam Rasel': 'linkedin.com/in/MD Aminul Islam Rasel', 'github.com/rasel': 'github.com/rasel',
    'Crafted with 💙 by Md. Aminul Islam Rasel | Flutter Developer': 'Md. Aminul Islam Rasel-এর তৈরি 💙 | Flutter ডেভেলপার',
    'Hi, I\'m Rasel!': 'হ্যালো, আমি রাসেল!', 'Welcome to my world! 👋': 'আমার জগতে স্বাগতম! 👋',
    'Crafted with 💙 by Md. Aminul Islam Rasel': 'Md. Aminul Islam Rasel-এর তৈরি 💙', 'Flutter Developer': 'Flutter ডেভেলপার',
  };
  const originalText = new WeakMap();
  const originalPlaceholders = new WeakMap();

  function applyLanguage(language) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const normalized = original.replace(/\s+/g, ' ').trim();
      const translated = language === 'bn' ? translations[normalized] : null;
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.nodeValue = translated ? `${leading}${translated}${trailing}` : original;
    }

    document.querySelectorAll('[placeholder]').forEach((input) => {
      if (!originalPlaceholders.has(input)) originalPlaceholders.set(input, input.placeholder);
      const placeholder = originalPlaceholders.get(input);
      input.placeholder = language === 'bn'
        ? (translations[placeholder] || placeholder)
        : placeholder;
    });

    document.documentElement.lang = language;
    document.body.dataset.language = language;
    toggle.textContent = language === 'bn' ? 'English' : 'বাংলা';
    toggle.setAttribute('aria-pressed', String(language === 'bn'));
    toggle.setAttribute('aria-label', language === 'bn' ? 'Switch language to English' : 'Switch language to Bangla');
    const filterStatus = document.getElementById('project-filter-status');
    if (filterStatus?.dataset.visibleCount) {
      filterStatus.textContent = language === 'bn'
        ? `${filterStatus.dataset.visibleCount}টি প্রকল্প দেখানো হচ্ছে।`
        : `${filterStatus.dataset.visibleCount} projects shown.`;
    }
    const cashbackResult = document.getElementById('cashback-result');
    if (cashbackResult?.dataset.reward) {
      cashbackResult.textContent = language === 'bn'
        ? `উদাহরণস্বরূপ পুরস্কার: ৳${cashbackResult.dataset.reward}`
        : `Example reward: ৳${cashbackResult.dataset.reward}`;
    }
    document.querySelectorAll('.project-filter').forEach((button) => {
      const label = button.querySelector('.project-filter-label')?.textContent.trim() || button.textContent.trim();
      const count = button.dataset.projectCount || '0';
      button.setAttribute('aria-label', language === 'bn'
        ? `${label}: ${count}টি প্রকল্প`
        : `${label}: ${count} projects`);
    });
    const projectFilters = document.querySelector('.project-filters');
    projectFilters?.setAttribute('aria-label', language === 'bn' ? 'প্রকল্প ফিল্টার করুন' : 'Filter projects');
    hamburger?.setAttribute('aria-label', language === 'bn' ? 'নেভিগেশন খুলুন বা বন্ধ করুন' : 'Toggle navigation');
  }

  const savedLanguage = localStorage.getItem('portfolio-language') === 'bn' ? 'bn' : 'en';
  applyLanguage(savedLanguage);
  toggle.addEventListener('click', () => {
    const nextLanguage = document.documentElement.lang === 'bn' ? 'en' : 'bn';
    localStorage.setItem('portfolio-language', nextLanguage);
    applyLanguage(nextLanguage);
  });
})();