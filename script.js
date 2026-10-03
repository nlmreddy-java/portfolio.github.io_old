import { withDefaults, fileUrl, DEFAULT_PHOTO, DEFAULT_RESUME } from './defaults.js';

let cancelIntroTyping = null;
let cancelBrandCaptionTyping = null;
let lastIntroText = null;

// Invite, recovery and confirmation emails link to the site root; send them to the admin page.
if (/(invite|recovery|confirmation|email_change)_token=/.test(window.location.hash)) {
  window.location.replace(`/admin/${window.location.hash}`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function startTypingLoop(visualText, text, typeDelay = 30) {
  const characters = Array.from(text);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || characters.length === 0) {
    visualText.textContent = text;
    visualText.classList.remove('is-typing');
    return null;
  }

  visualText.textContent = '';
  visualText.classList.add('is-typing');
  let visibleCount = 0;
  let deleting = false;
  let timer = null;
  const tick = () => {
    visibleCount += deleting ? -1 : 1;
    visualText.textContent = characters.slice(0, visibleCount).join('');

    if (!deleting && visibleCount === characters.length) {
      deleting = true;
      timer = window.setTimeout(tick, 1600);
      return;
    }
    if (deleting && visibleCount === 0) {
      deleting = false;
      timer = window.setTimeout(tick, 450);
      return;
    }

    timer = window.setTimeout(tick, deleting ? 18 : typeDelay);
  };
  tick();
  return () => window.clearTimeout(timer);
}

function animateHeroIntro(text) {
  const accessibleText = document.getElementById('heroIntroAccessible');
  const visualText = document.getElementById('heroIntroVisual');
  if (!accessibleText || !visualText) return;

  accessibleText.textContent = text;
  if (text === lastIntroText) return;
  lastIntroText = text;

  cancelIntroTyping?.();
  cancelIntroTyping = startTypingLoop(visualText, text);
}

function animateBrandCaption() {
  const accessibleText = document.querySelector('.brand-caption .visually-hidden');
  const visualText = document.getElementById('brandCaptionVisual');
  if (!accessibleText || !visualText) return;
  cancelBrandCaptionTyping = startTypingLoop(visualText, accessibleText.textContent, 45);
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

function renderAbout(paragraphs) {
  const container = document.getElementById('aboutParagraphs');
  container.replaceChildren(...paragraphs.map(({ text }) => {
    const paragraph = document.createElement('p');
    text.split(/(\*\*.+?\*\*)/g).forEach((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        paragraph.append(element('strong', part.slice(2, -2)));
      } else {
        paragraph.append(document.createTextNode(part));
      }
    });
    return paragraph;
  }));
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

function renderExperience(experience) {
  document.getElementById('experienceList').replaceChildren(...experience.map((item) => {
    const entry = document.createElement('li');
    const current = /\bpresent\b/i.test(item.date);
    entry.className = `experience-entry${current ? ' is-current' : ''}`;

    const heading = document.createElement('div');
    heading.className = 'experience-entry-heading';
    heading.append(element('h3', item.title));
    if (current) heading.append(element('span', 'Current', 'experience-current'));

    const meta = document.createElement('p');
    meta.className = 'experience-meta';
    meta.append(element('span', item.company, 'experience-company'));
    meta.append(element('span', item.date, 'experience-date'));

    entry.append(heading, meta, element('p', item.description, 'experience-description'));
    return entry;
  }));
}

function renderCertifications(certifications) {
  document.getElementById('certificationsGrid').replaceChildren(...certifications.map((item) =>
    card(element('h3', item.title), element('p', item.detail, 'card-text'))
  ));
}

function populate(content) {
  ['heroName', 'heroTitle', 'heroAvailability', 'heroPanelText',
    'aboutCertifications', 'aboutDomains'].forEach((key) => setText(key, content[key]));
  renderAbout(content.aboutParagraphs || []);
  animateHeroIntro(content.heroIntro);

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
  renderExperience(content.experience || []);
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
animateBrandCaption();
loadContent().then(populate);
