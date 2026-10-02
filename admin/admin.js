import {
  login,
  logout,
  getUser,
  handleAuthCallback,
  acceptInvite,
  updateUser,
  requestPasswordRecovery,
  AuthError,
  MissingIdentityError
} from 'https://esm.sh/@netlify/identity@2.0.0';
import { defaults, withDefaults, fileUrl, DEFAULT_PHOTO, DEFAULT_RESUME } from '/defaults.js';

const views = ['loginView', 'passwordView', 'noAccessView', 'editorView'];
const editor = document.getElementById('editorView');

const LISTS = {
  skills: {
    container: 'skillsList',
    blank: { title: 'New skill group', items: [] },
    fields: [
      { key: 'title', label: 'Group name' },
      { key: 'items', label: 'Items (comma-separated)', list: true }
    ]
  },
  projects: {
    container: 'projectsList',
    blank: { title: 'New project', description: '' },
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true }
    ]
  },
  certifications: {
    container: 'certificationsList',
    blank: { title: 'New entry', detail: '' },
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'detail', label: 'Details' }
    ]
  }
};

let content = withDefaults();
let pendingInviteToken = null;

function show(view) {
  views.forEach((id) => { document.getElementById(id).hidden = id !== view; });
}

function setStatus(message, type = 'info') {
  const el = document.getElementById('status');
  el.hidden = !message;
  el.textContent = message || '';
  el.dataset.type = type;
}

function authMessage(error) {
  if (error instanceof MissingIdentityError) return 'Login is not available: Netlify Identity is not enabled on this site.';
  if (error instanceof AuthError) {
    if (error.status === 401) return 'Invalid email or password.';
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...options });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(res.status === 401 ? 'Your session expired. Please sign in again.' : text || `Request failed (${res.status})`);
  }
  return res.json();
}

// ---- Editor rendering ----

function renderList(name) {
  const { container, fields } = LISTS[name];
  const items = content[name] || [];
  document.getElementById(container).replaceChildren(...items.map((item, index) => {
    const row = document.createElement('div');
    row.className = 'list-item';
    fields.forEach((field) => {
      const label = document.createElement('label');
      label.textContent = field.label;
      const input = document.createElement(field.multiline ? 'textarea' : 'input');
      if (field.multiline) input.rows = 2;
      input.dataset.field = field.key;
      input.value = field.list ? (item[field.key] || []).join(', ') : item[field.key] || '';
      label.append(input);
      row.append(label);
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-item';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      collectLists();
      content[name].splice(index, 1);
      renderList(name);
    });
    row.append(remove);
    return row;
  }));
}

function collectLists() {
  Object.entries(LISTS).forEach(([name, { container, fields }]) => {
    content[name] = Array.from(document.getElementById(container).children).map((row) => {
      const item = {};
      fields.forEach((field) => {
        const value = row.querySelector(`[data-field="${field.key}"]`).value.trim();
        item[field.key] = field.list ? value.split(',').map((v) => v.trim()).filter(Boolean) : value;
      });
      return item;
    });
  });
}

function renderFiles() {
  document.getElementById('photoPreview').src = fileUrl('photo', content.photo) || `/${DEFAULT_PHOTO}`;
  const resume = document.getElementById('resumeCurrent');
  resume.href = fileUrl('resume', content.resume) || `/${DEFAULT_RESUME}`;
  resume.textContent = content.resume?.filename || DEFAULT_RESUME;
}

function renderEditor() {
  editor.querySelectorAll('[name]').forEach((input) => {
    const [group, key] = input.name.split('.');
    input.value = (key ? content[group]?.[key] : content[group]) ?? '';
  });
  Object.keys(LISTS).forEach(renderList);
  renderFiles();
}

function collectEditor() {
  editor.querySelectorAll('[name]').forEach((input) => {
    const [group, key] = input.name.split('.');
    const value = input.value.trim() || (key ? defaults[group][key] : defaults[group]);
    if (key) content[group] = { ...content[group], [key]: value };
    else content[group] = value;
  });
  collectLists();
}

// ---- Auth flow ----

async function openEditor() {
  const user = await getUser();
  if (!user) {
    show('loginView');
    return;
  }
  document.getElementById('logoutLink').hidden = false;
  if (!user.roles?.includes('admin')) {
    document.getElementById('noAccessEmail').textContent = user.email || '';
    show('noAccessView');
    return;
  }
  try {
    content = withDefaults(await api('/api/content'));
  } catch (error) {
    setStatus(`Could not load saved content: ${error.message}`, 'error');
  }
  renderEditor();
  show('editorView');
}

async function init() {
  try {
    const result = await handleAuthCallback();
    if (result?.type === 'invite') {
      pendingInviteToken = result.token;
      document.getElementById('passwordTitle').textContent = 'Accept invite – choose a password';
      show('passwordView');
      return;
    }
    if (result?.type === 'recovery') {
      document.getElementById('passwordTitle').textContent = 'Choose a new password';
      show('passwordView');
      return;
    }
    if (result?.type === 'confirmation') setStatus('Email confirmed. You are signed in.', 'success');
  } catch (error) {
    setStatus(authMessage(error), 'error');
  }
  await openEditor();
}

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setStatus('Signing in…');
  try {
    await login(form.email.value.trim(), form.password.value);
    setStatus('');
    await openEditor();
  } catch (error) {
    setStatus(authMessage(error), 'error');
  }
});

document.getElementById('forgotLink').addEventListener('click', async () => {
  const email = document.getElementById('loginForm').email.value.trim();
  if (!email) {
    setStatus('Enter your email address first, then click "Forgot password?".', 'error');
    return;
  }
  try {
    await requestPasswordRecovery(email);
    setStatus('Check your email for a password reset link.', 'success');
  } catch (error) {
    setStatus(authMessage(error), 'error');
  }
});

document.getElementById('passwordForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = event.currentTarget.password.value;
  try {
    if (pendingInviteToken) {
      await acceptInvite(pendingInviteToken, password);
      pendingInviteToken = null;
    } else {
      await updateUser({ password });
    }
    setStatus('Password saved.', 'success');
    await openEditor();
  } catch (error) {
    setStatus(authMessage(error), 'error');
  }
});

document.getElementById('logoutLink').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    await logout();
  } finally {
    document.getElementById('logoutLink').hidden = true;
    setStatus('Signed out.');
    show('loginView');
  }
});

// ---- Editing actions ----

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.add;
    collectLists();
    content[name] = [...(content[name] || []), structuredClone(LISTS[name].blank)];
    renderList(name);
    document.getElementById(LISTS[name].container).lastElementChild?.querySelector('input, textarea')?.focus();
  });
});

editor.addEventListener('submit', async (event) => {
  event.preventDefault();
  const saveBtn = document.getElementById('saveBtn');
  collectEditor();
  saveBtn.disabled = true;
  setStatus('Saving…');
  try {
    content = withDefaults(await api('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    }));
    renderEditor();
    setStatus('Changes saved. They are now live on the site.', 'success');
  } catch (error) {
    setStatus(`Save failed: ${error.message}`, 'error');
  } finally {
    saveBtn.disabled = false;
  }
});

async function upload(kind, input) {
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    setStatus('That file is larger than 4 MB. Please choose a smaller file.', 'error');
    return;
  }
  const body = new FormData();
  body.append('file', file);
  setStatus(`Uploading ${file.name}…`);
  try {
    content[kind] = await api(`/api/upload/${kind}`, { method: 'POST', body });
    renderFiles();
    setStatus(`${kind === 'photo' ? 'Photo' : 'Resume'} uploaded and live on the site.`, 'success');
  } catch (error) {
    setStatus(`Upload failed: ${error.message}`, 'error');
  }
}

document.getElementById('photoInput').addEventListener('change', (e) => upload('photo', e.target));
document.getElementById('resumeInput').addEventListener('change', (e) => upload('resume', e.target));

init();
