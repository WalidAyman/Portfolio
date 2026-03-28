// ============================================================
// script.js — Walid Ayman Portfolio
// ============================================================

// ===== 1. تحميل البيانات من data.json =====
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderProjects(data.projects);
    renderCertificates(data.certificates);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('projects-grid').innerHTML = `
      <div class="loading-placeholder">
        <i class="fas fa-exclamation-circle"></i>
        <p>Make sure data.json is in the same folder.</p>
      </div>`;
  }
}

// ===== 2. عرض المشاريع =====
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center">No projects yet.</p>';
    return;
  }
  grid.innerHTML = '';
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    const imageHTML = project.image
      ? `<img src="${project.image}" alt="${project.name}" class="project-img" onerror="this.parentElement.innerHTML='<div class=\\'project-img-placeholder\\'><i class=\\'fas fa-chart-bar\\'></i></div>'">`
      : `<div class="project-img-placeholder"><i class="fas fa-chart-bar"></i></div>`;
    const tagsHTML = project.tags ? project.tags.map(t => `<span class="project-tag-item">${t}</span>`).join('') : '';
    const linkHTML = project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>` : '';
    card.innerHTML = `
      ${imageHTML}
      <div class="project-body">
        <div class="project-tags">${tagsHTML}</div>
        <h3 class="project-title">${project.name}</h3>
        <p class="project-desc">${project.description}</p>
        ${linkHTML}
      </div>`;
    grid.appendChild(card);
  });
  observeElements();
}

// ===== 3. عرض الشهادات =====
function renderCertificates(certificates) {
  const grid = document.getElementById('certs-grid');
  if (!certificates || certificates.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center">No certificates yet.</p>';
    return;
  }
  grid.innerHTML = '';
  certificates.forEach(cert => {
    const tag = cert.link ? 'a' : 'div';
    const card = document.createElement(tag);
    card.className = 'cert-card reveal';
    if (cert.link) { card.href = cert.link; card.target = '_blank'; }
    card.innerHTML = `
      <div class="cert-icon"><i class="${cert.icon || 'fas fa-certificate'}"></i></div>
      <div class="cert-info">
        <div class="cert-name">${cert.name}</div>
        <div class="cert-org">${cert.organization}</div>
        <div class="cert-date">${cert.date}</div>
      </div>`;
    grid.appendChild(card);
  });
  observeElements();
}

// ===== 4. أنيميشن الظهور عند التمرير =====
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== 5. Navbar عند التمرير =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(10,15,30,0.98)'
    : 'rgba(10,15,30,0.85)';
});

// ===== 6. قائمة الموبايل =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== 7. تمييز الرابط الحالي =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

// ===== 8. Contact Form — الإرسال على الإيميل =====
const form = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // تغيير الزرار أثناء الإرسال
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // نجح الإرسال
        form.reset();
        formSuccess.classList.add('show');
        sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        setTimeout(() => {
          formSuccess.classList.remove('show');
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 5000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      alert('Something went wrong. Please try again or contact me directly via email.');
    }
  });
}

// ===== 9. تشغيل كل شيء =====
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  observeElements();
});