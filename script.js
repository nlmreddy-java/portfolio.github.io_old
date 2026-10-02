import { withDefaults, fileUrl, DEFAULT_PHOTO, DEFAULT_RESUME } from './defaults.js';

// Invite, recovery and confirmation emails link to the site root; send them to the admin page.
if (/(invite|recovery|confirmation|email_change)_token=/.test(window.location.hash)) {
  window.location.replace(`/admin/${window.location.hash}`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function card(...children) {
  const el = document.createElement('div');
  el.className = 'card';
  el.append(...children);
  return el;
}

function element(tag, text, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

function renderSkills(skills) {
  document.getElementById('skillsGrid').replaceChildren(...skills.map((skill) => {
    const chips = document.createElement('div');
    chips.className = 'chips';
    chips.append(...skill.items.map((item) => element('span', item, 'chip')));
    return card(element('h3', skill.title), chips);
  }));
}

function renderProjects(projects) {
  document.getElementById('projectsGrid').replaceChildren(...projects.map((project) =>
    card(element('h3', project.title), element('p', project.description, 'card-text'))
  ));
}

function renderCertifications(certifications) {
  document.getElementById('certificationsGrid').replaceChildren(...certifications.map((item) =>
    card(element('h3', item.title), element('p', item.detail, 'card-text'))
  ));
}

function populate(content) {
  ['heroEyebrow', 'heroName', 'heroTitle', 'heroIntro', 'heroAvailability', 'heroPanelText',
    'aboutSummary', 'aboutDetails', 'aboutCertifications', 'aboutDomains'].forEach((key) => setText(key, content[key]));

  document.getElementById('avatarImg').src = fileUrl('photo', content.photo) || DEFAULT_PHOTO;
  document.getElementById('resumeLink').href = fileUrl('resume', content.resume) || DEFAULT_RESUME;

  const { email, mobile, linkedin, linkedinUrl } = content.contact;
  document.querySelector('[data-contact="email"]').textContent = email;
  document.querySelector('[data-contact="mobile"]').textContent = mobile;
  document.querySelector('[data-contact="linkedin"]').textContent = linkedin;
  document.getElementById('contactEmail').href = `mailto:${email}`;
  document.getElementById('contactMobile').href = `tel:${mobile.replace(/[^\d+]/g, '')}`;
  if (/^https?:\/\//i.test(linkedinUrl)) document.getElementById('contactLinkedin').href = linkedinUrl;

  renderSkills(content.skills);
  renderProjects(content.projects);
  renderCertifications(content.certifications);
}

async function loadContent() {
  try {
    const res = await fetch('/api/content');
    if (res.ok) return withDefaults(await res.json());
  } catch (error) {
    // Fall back to the built-in content when the API is unavailable.
  }
  return withDefaults();
}

populate(withDefaults());
loadContent().then(populate);
