const defaults = {
  heroName: 'LingaMoorthy Reddy Nandyala',
  heroTitle: 'Senior Java Developer | Tech Lead | Cloud-Native Architect',
  heroIntro: 'I build secure, scalable enterprise applications and cloud-native platforms with Java, Spring, and modern DevOps practices.',
  aboutSummary: 'I’m a Senior Java Developer & Tech Lead with 11+ years of experience in building scalable enterprise applications, microservices, and cloud-native solutions.',
  aboutDetails: 'My work spans finance, credit analytics, and banking environments, where reliability, security, and business value are critical.',
  aboutCertifications: ['GCP Associate Cloud Engineer', 'Google Generative AI Leader'],
  aboutDomains: 'Finance, Credit Analytics, Banking',
  avatar: '',
  contact: {
    email: 'nlmreddy.java2021@gmail.com',
    mobile: '+91-7799041264',
    linkedin: 'LingaMoorthy Reddy Nandyala'
  },
  skills: [
    { title: 'Languages', items: ['Java (8/17/21)', 'SQL', 'JavaScript'] },
    { title: 'Frameworks', items: ['Spring Boot', 'Spring Security', 'Spring Cloud', 'Hibernate'] },
    { title: 'Cloud', items: ['AWS', 'GCP', 'APIGEE'] },
    { title: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra'] },
    { title: 'Tools', items: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub', 'Bitbucket'] },
    { title: 'Testing', items: ['JUnit', 'Mockito'] }
  ],
  projects: [
    { title: 'Your Credit & Identity (Equifax)', description: 'APIs for secure credit reports and scoring.' },
    { title: 'Customer Account Lookup API (Capgemini)', description: 'SMS-based fraud reduction system.' },
    { title: 'ATM EJ Pulling Tool (C-Edge)', description: 'Centralized ATM management and reconciliation.' },
    { title: 'RuPay Card Enquiry (Green & Wise)', description: 'Call center tool for card inquiries and disputes.' }
  ],
  certifications: [
    { title: 'B.Tech – Electrical & Electronics Engineering', detail: 'JNTU Hyderabad, 2012' },
    { title: 'GCP Associate Cloud Engineer', detail: 'Cloud certification focused on core GCP services and architecture principles.' },
    { title: 'Google - Generative AI Leader', detail: 'Cloud certification focused on core GCP services and architecture principles.' }
  ]
};

function loadState() {
  try {
    const stored = localStorage.getItem('portfolio-content-v1');
    return stored ? JSON.parse(stored) : defaults;
  } catch (error) {
    return defaults;
  }
}

function saveState() {
  try {
    localStorage.setItem('portfolio-content-v1', JSON.stringify(state));
  } catch (error) {
    // Ignore storage failures in local preview environments.
  }
}

const state = loadState();
let editMode = false;

function populate() {
  document.getElementById('heroName').textContent = state.heroName;
  document.getElementById('heroTitle').textContent = state.heroTitle;
  document.getElementById('heroIntro').textContent = state.heroIntro;
  document.getElementById('aboutSummary').textContent = state.aboutSummary;
  document.getElementById('aboutDetails').textContent = state.aboutDetails;
  document.getElementById('aboutCertifications').textContent = state.aboutCertifications;
  document.getElementById('aboutDomains').textContent = state.aboutDomains;

  const avatarImg = document.getElementById('avatarImg');
  if (avatarImg) {
    avatarImg.src = state.avatar || 'assets/Photo.jpg';
  }

  document.querySelectorAll('.editable-inline').forEach((el) => {
    const key = el.dataset.contact;
    el.textContent = state.contact[key] || '';
  });

  renderSkills();
  renderProjects();
  renderCertifications();
  attachEditableText();
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';
  state.skills.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="editable-field" contenteditable="${editMode}" data-skill-title="${index}"></div>
      <div class="chips"></div>
      <button class="remove-btn" type="button" data-remove-skill="${index}">Remove</button>
    `;
    card.querySelector('.editable-field').textContent = skill.title;
    const chips = card.querySelector('.chips');
    skill.items.forEach((item, itemIndex) => {
      const chip = document.createElement('span');
      chip.className = 'editable-field';
      chip.setAttribute('contenteditable', editMode);
      chip.dataset.skillItem = `${index}-${itemIndex}`;
      chip.textContent = item;
      chips.appendChild(chip);
    });
    grid.appendChild(card);
  });
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  state.projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="editable-field" contenteditable="${editMode}" data-project-title="${index}"></div>
      <div class="editable-field" contenteditable="${editMode}" data-project-desc="${index}"></div>
      <button class="remove-btn" type="button" data-remove-project="${index}">Remove</button>
    `;
    card.querySelector('[data-project-title]').textContent = project.title;
    card.querySelector('[data-project-desc]').textContent = project.description;
    grid.appendChild(card);
  });
}

function renderCertifications() {
  const grid = document.getElementById('certificationsGrid');
  grid.innerHTML = '';
  state.certifications.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="editable-field" contenteditable="${editMode}" data-cert-title="${index}"></div>
      <div class="editable-field" contenteditable="${editMode}" data-cert-detail="${index}"></div>
      <button class="remove-btn" type="button" data-remove-cert="${index}">Remove</button>
    `;
    card.querySelector('[data-cert-title]').textContent = item.title;
    card.querySelector('[data-cert-detail]').textContent = item.detail;
    grid.appendChild(card);
  });
}

function attachEditableText() {
  document.querySelectorAll('.editable-text, .editable-field, .editable-inline').forEach((el) => {
    el.contentEditable = false;
    el.classList.remove('editing');
  });
}

function saveContent() {
  const heroName = document.getElementById('heroName').textContent.trim();
  state.heroName = heroName || defaults.heroName;
  state.heroTitle = document.getElementById('heroTitle').textContent.trim() || defaults.heroTitle;
  state.heroIntro = document.getElementById('heroIntro').textContent.trim() || defaults.heroIntro;
  state.aboutSummary = document.getElementById('aboutSummary').textContent.trim() || defaults.aboutSummary;
  state.aboutDetails = document.getElementById('aboutDetails').textContent.trim() || defaults.aboutDetails;
  state.aboutCertifications = document.getElementById('aboutCertifications').textContent.trim() || defaults.aboutCertifications;
  state.aboutDomains = document.getElementById('aboutDomains').textContent.trim() || defaults.aboutDomains;
  state.avatar = document.getElementById('avatarImg')?.src || state.avatar || 'assets/avatar.svg';

  document.querySelectorAll('.editable-inline').forEach((el) => {
    const key = el.dataset.contact;
    state.contact[key] = el.textContent.trim();
  });

  state.skills = [];
  document.querySelectorAll('#skillsGrid .card').forEach((card) => {
    const title = card.querySelector('[data-skill-title]')?.textContent.trim() || 'Skill';
    const items = Array.from(card.querySelectorAll('[data-skill-item]'))
      .map((item) => item.textContent.trim())
      .filter(Boolean);
    state.skills.push({ title, items });
  });

  state.projects = [];
  document.querySelectorAll('#projectsGrid .card').forEach((card) => {
    const title = card.querySelector('[data-project-title]')?.textContent.trim() || 'Project';
    const description = card.querySelector('[data-project-desc]')?.textContent.trim() || '';
    state.projects.push({ title, description });
  });

  state.certifications = [];
  document.querySelectorAll('#certificationsGrid .card').forEach((card) => {
    const title = card.querySelector('[data-cert-title]')?.textContent.trim() || 'Certification';
    const detail = card.querySelector('[data-cert-detail]')?.textContent.trim() || '';
    state.certifications.push({ title, detail });
  });

  saveState();
}

function addSkill() {
  state.skills.push({ title: 'New Skill', items: ['New item'] });
  saveState();
  renderSkills();
  attachEditableText();
}

function addProject() {
  state.projects.push({ title: 'New Project', description: 'Add your project summary here.' });
  saveState();
  renderProjects();
  attachEditableText();
}

function addCertification() {
  state.certifications.push({ title: 'New Certification', detail: 'Add details here.' });
  saveState();
  renderCertifications();
  attachEditableText();
}

function handleRemove(e) {
  const target = e.target;
  if (target.dataset.removeSkill !== undefined) {
    state.skills.splice(Number(target.dataset.removeSkill), 1);
    saveState();
    renderSkills();
  }
  if (target.dataset.removeProject !== undefined) {
    state.projects.splice(Number(target.dataset.removeProject), 1);
    saveState();
    renderProjects();
  }
  if (target.dataset.removeCert !== undefined) {
    state.certifications.splice(Number(target.dataset.removeCert), 1);
    saveState();
    renderCertifications();
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const avatar = document.getElementById('avatarImg');
    avatar.src = e.target.result;
    state.avatar = e.target.result;
    saveState();
  };
  reader.readAsDataURL(file);
}

function bindEvents() {
  document.addEventListener('click', handleRemove);
}

populate();
bindEvents();
