/**
 * loginscript.js — CareerNest Login
 *
 * Flow:
 *   1. User selects a role tab and enters email + password
 *   2. POST /users/login → backend validates against users repository
 *   3. On success: store user in localStorage, redirect based on role
 *   4. On failure: show error message
 *
 * Default password for ALL demo users: 123
 *
 * Demo accounts:
 *   c@gmail.com          / 123  → Candidate portal
 *   a@gmail.com          / 123  → Alumni portal
 *   r@gmail.com          / 123  → Recruiter portal
 *   p@gmail.com          / 123  → Placement Officer portal
 *   ca@sricity.edu       / 123  → College Admin portal
 *   admin@careernest.com / 123  → Super Admin portal
 */

const BASE_URL = 'http://localhost:3000';

let currentRole = 'candidate';

const actors    = document.querySelectorAll('.actor-card');
const body      = document.body;
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const displayMsg    = document.getElementById('msg-display');
const demoHint      = document.getElementById('demo-hint');

/* ── Role → portal redirect URL ────────────────────────────────────────── */
const ROLE_REDIRECT = {
  candidate:          'Candidate/html/index.html',
  alumni:             'Alumni Final/pages/A1.html',
  recruiter:          'Recruiter/pages/index.html',
  placement_officer:  'placement total final/pages/p1.html',
  college_admin:      'college-admin/index.html',
  super_admin:        'super-admin/index.html',
};

/* ── UI card key → backend role ────────────────────────────────────────── */
const CARD_ROLE_MAP = {
  candidate:     'candidate',
  alumni:        'alumni',
  recruiter:     'recruiter',
  officer:       'placement_officer',
  college_admin: 'college_admin',
  super_admin:   'super_admin',
};

/* ── Demo hint per role ─────────────────────────────────────────────────── */
const DEMO_HINTS = {
  candidate:          'Demo: c@gmail.com / 123 (Premium) | student@basiccollege.in / 123 (Basic) | student@standardcollege.in / 123 (Standard)',
  alumni:             'Demo: a@gmail.com / 123 (Premium) | alumni@basiccollege.in / 123 (Basic) | alumni@premiumcollege.in / 123 (Premium)',
  recruiter:          'Demo: r@gmail.com / 123 (Premium) | recruiter@basiccollege.in / 123 (Basic) | recruiter@standardcollege.in / 123 (Standard)',
  placement_officer:  'Demo: p@gmail.com / 123 (Premium) | officer@basiccollege.in / 123 (Basic) | officer@standardcollege.in / 123 (Standard)',
  college_admin:      'Demo: admin@basiccollege.in / 123 (Basic🎓) | admin@standardcollege.in / 123 (Standard⭐) | admin@premiumcollege.in / 123 (Premium👑)',
  super_admin:        'Demo: admin@careernest.com / 123',
};

/* ── Background class per role ──────────────────────────────────────────── */
function updateBackground(cardRole) {
  body.className = '';
  const bgMap = {
    candidate:     'candidate-bg',
    alumni:        'alumni-bg',
    recruiter:     'recruiter-bg',
    officer:       'officer-bg',
    college_admin: 'officer-bg',
    super_admin:   'officer-bg',
  };
  body.classList.add(bgMap[cardRole] || 'candidate-bg');
}

/* ── Pre-select role from URL param  e.g. login.html?role=super_admin ───── */
const params = new URLSearchParams(window.location.search);
const roleFromURL = params.get('role');
if (roleFromURL && CARD_ROLE_MAP[roleFromURL]) {
  currentRole = CARD_ROLE_MAP[roleFromURL];
  actors.forEach(card => {
    card.classList.toggle('active', card.dataset.role === roleFromURL);
  });
  updateBackground(roleFromURL);
  if (demoHint) demoHint.textContent = DEMO_HINTS[currentRole] || '';
}

/* ── Tab card click ─────────────────────────────────────────────────────── */
actors.forEach(card => {
  card.addEventListener('click', () => {
    actors.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    currentRole = CARD_ROLE_MAP[card.dataset.role] || card.dataset.role;
    updateBackground(card.dataset.role);
    clearInputs();
    clearMessage();
    if (demoHint) demoHint.textContent = DEMO_HINTS[currentRole] || '';
  });
});

/* ── Password visibility toggle ─────────────────────────────────────────── */
const toggleBtn = document.getElementById('togglePassword');
toggleBtn.addEventListener('click', () => {
  const icon = toggleBtn.querySelector('i');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
});

passwordInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') login();
});

/* ── Main login function ─────────────────────────────────────────────────── */
async function login() {
  const email = emailInput.value.trim();
  const pass  = passwordInput.value.trim();

  clearMessage();

  if (!email || !pass) {
    displayMessage('Please enter your email and password.', 'red');
    return;
  }

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = 'Logging in…'; }

  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    if (res.ok) {
      const user = await res.json();

      // Persist session info — all dashboard pages read from localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('userRole',     user.role);
      localStorage.setItem('userName',     user.name);
      localStorage.setItem('userEmail',    user.email);
      localStorage.setItem('userId',       String(user.id));
      // collegeId is null for super_admin, numeric for all other roles
      localStorage.setItem('collegeId', user.collegeId != null ? String(user.collegeId) : 'null');

      // Recruiter-specific extras
      if (user.role === 'recruiter') {
        localStorage.setItem('recruiterEmail',   user.email);
        localStorage.setItem('recruiterName',    user.name);
        localStorage.setItem('recruiterCompany', user.company || '');
      }

      const redirectUrl = ROLE_REDIRECT[user.role];
      if (!redirectUrl) {
        displayMessage(`Unknown role: ${user.role}`, 'red');
        return;
      }

      displayMessage('Login successful! Redirecting…', 'green');
      setTimeout(() => {
        clearInputs();
        window.location.href = redirectUrl;
      }, 800);

    } else {
      let msg = 'Invalid email or password.';
      try { const err = await res.json(); msg = Array.isArray(err.message) ? err.message.join(', ') : (err.message || msg); } catch (_) {}
      displayMessage(msg, 'red');
    }

  } catch (err) {
    console.error('[login] Network error:', err);
    displayMessage('Cannot reach login server. Make sure the backend is running on port 3000.', 'red');
  } finally {
    if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = 'Login'; }
  }
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function displayMessage(text, color) {
  displayMsg.textContent = text;
  displayMsg.style.color = color;
}
function clearInputs()  { emailInput.value = ''; passwordInput.value = ''; }
function clearMessage() { displayMsg.textContent = ''; }

// Apply initial background
updateBackground('candidate');
if (demoHint) demoHint.textContent = DEMO_HINTS['candidate'];