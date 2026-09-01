/* ===== CareerNest Referrals Page - JavaScript ===== */

/**
 * Referrals Module
 * Handles tabs, alumni browsing, referral requests, modal, and CRUD operations.
 */
const Referrals = (function () {
    'use strict';

    /* ==============================
       Mock Data for Referrals
       ============================== */
    const referralData = {
        stats: {
            approved: 1,
            totalRequests: 2,
            pending: 1
        },

        myRequests: [
            {
                id: 'REF001',
                alumniName: 'Sai Ganesh',
                alumniInitials: 'SG',
                avatarColor: 'gold',
                company: 'Google',
                batch: '2021 Batch',
                department: 'Computer Science',
                forRole: 'Software Engineer',
                forCompany: 'TechCorp Solutions',
                requestedDate: '2026-02-16',
                status: 'approved',
                statusLabel: 'Approved',
                message: 'Hi Sneha, I am applying for the Software Engineer role at TechCorp. I have strong Java and problem-solving skills. Could you please refer me?',
                response: 'Arjun is a strong candidate with excellent coding skills. Happy to refer him.'
            },
            {
                id: 'REF002',
                alumniName: 'Amit Kumar',
                alumniInitials: 'AK',
                avatarColor: 'purple',
                company: 'Amazon',
                batch: '2020 Batch',
                department: 'Computer Science',
                forRole: 'SDE-1',
                forCompany: 'Infosys',
                requestedDate: '2026-03-10',
                status: 'pending',
                statusLabel: 'Pending',
                message: 'Hello Amit, I am a final year CS student with strong skills in DSA and web development. I would really appreciate a referral for the SDE-1 position at Infosys.',
                response: null
            }
        ],

        alumni: [
            {
                id: 'ALM001',
                name: 'Sai Ganesh',
                initials: 'SG',
                avatarColor: 'gold',
                company: 'Google',
                batch: '2021 Batch',
                department: 'Computer Science',
                requestStatus: 'requested'
            },
            {
                id: 'ALM002',
                name: 'Amit Kumar',
                initials: 'AK',
                avatarColor: 'purple',
                company: 'Amazon',
                batch: '2020 Batch',
                department: 'Computer Science',
                requestStatus: 'requested'
            },
            {
                id: 'ALM003',
                name: 'Priya Nair',
                initials: 'PN',
                avatarColor: 'blue',
                company: 'Microsoft',
                batch: '2022 Batch',
                department: 'Information Technology',
                requestStatus: 'none'
            },
            {
                id: 'ALM004',
                name: 'Rahul Gupta',
                initials: 'RG',
                avatarColor: 'rose',
                company: 'Meta',
                batch: '2019 Batch',
                department: 'Computer Science',
                requestStatus: 'none'
            }
        ]
    };

    /* ---- DOM Cache ---- */
    const DOM = {};

    function cacheDom() {
        DOM.statsApproved = document.getElementById('stat-approved');
        DOM.statsTotal = document.getElementById('stat-total');
        DOM.statsPending = document.getElementById('stat-pending');
        DOM.tabButtons = document.querySelectorAll('.referral-tab');
        DOM.tabMyRequests = document.getElementById('tab-my-requests');
        DOM.tabBrowseAlumni = document.getElementById('tab-browse-alumni');
        DOM.requestsList = document.getElementById('requests-list');
        DOM.alumniList = document.getElementById('alumni-list');
        DOM.alumniSearch = document.getElementById('alumni-search');
        DOM.modalOverlay = document.getElementById('modal-overlay');
        DOM.modalAlumniAvatar = document.getElementById('modal-alumni-avatar');
        DOM.modalAlumniName = document.getElementById('modal-alumni-name');
        DOM.modalAlumniDetails = document.getElementById('modal-alumni-details');
        DOM.modalApplyingFor = document.getElementById('modal-applying-for');
        DOM.modalTextarea = document.getElementById('modal-message');
        DOM.modalCharCount = document.getElementById('char-count');
        DOM.modalError = document.getElementById('modal-error');
        DOM.modalSendBtn = document.getElementById('modal-send-btn');
        DOM.modalCloseBtn = document.getElementById('modal-close-btn');
        DOM.modalCancelBtn = document.getElementById('modal-cancel-btn');
        DOM.bannerRequestBtn = document.getElementById('banner-request-btn');
        DOM.menuToggle = document.getElementById('menu-toggle');
        DOM.sidebar = document.getElementById('sidebar');
        DOM.sidebarOverlay = document.getElementById('sidebar-overlay');
        DOM.toast = document.getElementById('toast');
    }

    /* ---- SVG Icons ---- */
    const Icons = {
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
        chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
        search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
    };

    /* ---- State ---- */
    let currentModalAlumni = null;
    const MAX_CHARS = 500;

    /* ---- Render Functions ---- */

    function renderStats() {
        DOM.statsApproved.textContent = referralData.stats.approved;
        DOM.statsTotal.textContent = referralData.stats.totalRequests;
        DOM.statsPending.textContent = referralData.stats.pending;

        /* Update tab count */
        const tabBtn = document.querySelector('[data-tab="my-requests"]');
        if (tabBtn) {
            tabBtn.textContent = `My Referral Requests (${referralData.stats.totalRequests})`;
        }
    }

    function renderMyRequests() {
        if (referralData.myRequests.length === 0) {
            DOM.requestsList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No referral requests yet. Browse alumni to get started!</p>
                </div>`;
            return;
        }

        DOM.requestsList.innerHTML = referralData.myRequests.map(req => `
            <div class="referral-request-card" data-id="${req.id}">
                <div class="request-header" onclick="Referrals.toggleDetails('${req.id}')">
                    <div class="request-header__left">
                        <div class="request-avatar request-avatar--${req.avatarColor}">${req.alumniInitials}</div>
                        <div class="request-info">
                            <h4>${req.alumniName}</h4>
                            <p>${req.company} • ${req.batch}</p>
                            <p class="request-for">For: <strong>${req.forRole}</strong> at ${req.forCompany}</p>
                            <p class="request-date">Requested: ${req.requestedDate}</p>
                        </div>
                    </div>
                    <div class="request-header__right">
                        <span class="request-status request-status--${req.status}">
                            ${req.status === 'approved' ? Icons.check : Icons.clock}
                            ${req.statusLabel}
                        </span>
                        <div class="request-toggle" id="toggle-${req.id}">
                            ${Icons.chevronDown}
                        </div>
                    </div>
                </div>
                <div class="request-details" id="details-${req.id}">
                    <div class="message-block">
                        <div class="message-block__label">Your message:</div>
                        <div class="message-block__content">${req.message}</div>
                    </div>
                    ${req.response ? `
                    <div class="message-block message-block--response">
                        <div class="message-block__label">Alumni's response:</div>
                        <div class="message-block__content">${req.response}</div>
                    </div>
                    ` : `
                    <div class="message-block">
                        <div class="message-block__label" style="color: var(--text-muted); font-style: italic;">Awaiting response from alumni...</div>
                    </div>
                    `}
                </div>
            </div>
        `).join('');
    }

    function renderAlumni(filter) {
        let alumni = referralData.alumni;

        if (filter && filter.trim() !== '') {
            const query = filter.toLowerCase();
            alumni = alumni.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.company.toLowerCase().includes(query) ||
                a.department.toLowerCase().includes(query) ||
                a.batch.toLowerCase().includes(query)
            );
        }

        if (alumni.length === 0) {
            DOM.alumniList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <p>No alumni found matching your search.</p>
                </div>`;
            return;
        }

        DOM.alumniList.innerHTML = alumni.map(alum => `
            <div class="alumni-card" data-id="${alum.id}">
                <div class="alumni-card__left">
                    <div class="alumni-avatar request-avatar--${alum.avatarColor}">${alum.initials}</div>
                    <div class="alumni-card__info">
                        <h4>${alum.name}</h4>
                        <p>${alum.company} • ${alum.batch} • ${alum.department}</p>
                    </div>
                </div>
                ${alum.requestStatus === 'requested' ? `
                    <button class="btn--request btn--requested" disabled>
                        ${Icons.clock}
                        Requested
                    </button>
                ` : `
                    <button class="btn--request btn--request-active" onclick="Referrals.openModal('${alum.id}')">
                        ${Icons.send}
                        Request
                    </button>
                `}
            </div>
        `).join('');
    }

    /* ---- Tab Switching ---- */

    function switchTab(tabName) {
        DOM.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        DOM.tabMyRequests.classList.toggle('active', tabName === 'my-requests');
        DOM.tabBrowseAlumni.classList.toggle('active', tabName === 'browse-alumni');
    }

    /* ---- Toggle Request Details ---- */

    function toggleDetails(requestId) {
        const details = document.getElementById(`details-${requestId}`);
        const toggle = document.getElementById(`toggle-${requestId}`);

        if (details && toggle) {
            details.classList.toggle('open');
            toggle.classList.toggle('open');
        }
    }

    /* ---- Modal Functions ---- */

    function openModal(alumniId) {
        const alumni = referralData.alumni.find(a => a.id === alumniId);
        if (!alumni) return;

        currentModalAlumni = alumni;

        /* Populate modal */
        DOM.modalAlumniAvatar.className = `modal__alumni-avatar request-avatar--${alumni.avatarColor}`;
        DOM.modalAlumniAvatar.textContent = alumni.initials;
        DOM.modalAlumniName.textContent = alumni.name;
        DOM.modalAlumniDetails.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${alumni.company} • 🎓 ${alumni.batch}
        `;
        DOM.modalApplyingFor.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
            Applying for: <strong>SDE-1 at Infosys</strong>
        `;

        /* Reset form */
        DOM.modalTextarea.value = '';
        updateCharCount();
        hideError();

        /* Show modal */
        DOM.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        /* Focus textarea */
        setTimeout(() => DOM.modalTextarea.focus(), 300);
    }

    function closeModal() {
        DOM.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentModalAlumni = null;
    }

    function updateCharCount() {
        const len = DOM.modalTextarea.value.length;
        DOM.modalCharCount.textContent = `${len}/${MAX_CHARS}`;

        DOM.modalCharCount.classList.remove('warning', 'error');
        if (len > MAX_CHARS) {
            DOM.modalCharCount.classList.add('error');
        } else if (len > MAX_CHARS * 0.8) {
            DOM.modalCharCount.classList.add('warning');
        }
    }

    function showError(message) {
        DOM.modalError.textContent = message;
        DOM.modalError.classList.add('visible');
    }

    function hideError() {
        DOM.modalError.classList.remove('visible');
    }

    function validateAndSend() {
        const message = DOM.modalTextarea.value.trim();

        /* Validation */
        if (!message) {
            showError('Please write a message to the alumni.');
            DOM.modalTextarea.focus();
            return;
        }

        if (message.length < 20) {
            showError('Your message should be at least 20 characters long.');
            DOM.modalTextarea.focus();
            return;
        }

        if (message.length > MAX_CHARS) {
            showError(`Message must not exceed ${MAX_CHARS} characters.`);
            DOM.modalTextarea.focus();
            return;
        }

        hideError();

        if (!currentModalAlumni) return;

        /* Create new referral request */
        const newRequest = {
            id: 'REF' + String(referralData.myRequests.length + 1).padStart(3, '0'),
            alumniName: currentModalAlumni.name,
            alumniInitials: currentModalAlumni.initials,
            avatarColor: currentModalAlumni.avatarColor,
            company: currentModalAlumni.company,
            batch: currentModalAlumni.batch,
            department: currentModalAlumni.department,
            forRole: 'SDE-1',
            forCompany: 'Infosys',
            requestedDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            statusLabel: 'Pending',
            message: message,
            response: null
        };

        /* Add to mock data */
        referralData.myRequests.push(newRequest);

        /* Update alumni request status */
        const alumIndex = referralData.alumni.findIndex(a => a.id === currentModalAlumni.id);
        if (alumIndex !== -1) {
            referralData.alumni[alumIndex].requestStatus = 'requested';
        }

        /* Update stats */
        referralData.stats.totalRequests++;
        referralData.stats.pending++;

        /* Re-render everything */
        renderStats();
        renderMyRequests();
        renderAlumni(DOM.alumniSearch ? DOM.alumniSearch.value : '');

        /* Close modal */
        closeModal();

        /* Show success toast */
        showToast('success', 'Referral request sent successfully!');
    }

    /* ---- Toast Notification ---- */

    function showToast(type, message) {
        const toastEl = DOM.toast;
        toastEl.className = `toast toast--${type}`;

        const iconMap = {
            success: Icons.check,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
        };

        toastEl.innerHTML = `${iconMap[type] || ''} ${message}`;

        /* Show */
        setTimeout(() => toastEl.classList.add('show'), 50);

        /* Auto hide */
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    }

    /* ---- Sidebar Toggle (Mobile) ---- */

    function toggleSidebar() {
        DOM.sidebar.classList.toggle('open');
        DOM.sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = DOM.sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeSidebar() {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ---- Sign Out ---- */

    function handleSignOut() {
        if (confirm('Are you sure you want to sign out?')) {
            sessionStorage.clear();
            localStorage.removeItem('careerNest_session');
            showToast('info', 'You have been signed out.');
        }
    }

    /* ---- Event Binding ---- */

    function bindEvents() {
        /* Tab switching */
        DOM.tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                switchTab(this.dataset.tab);
            });
        });

        /* Alumni search */
        if (DOM.alumniSearch) {
            DOM.alumniSearch.addEventListener('input', function () {
                renderAlumni(this.value);
            });
        }

        /* Modal close */
        DOM.modalCloseBtn.addEventListener('click', closeModal);
        DOM.modalCancelBtn.addEventListener('click', closeModal);
        DOM.modalOverlay.addEventListener('click', function (e) {
            if (e.target === DOM.modalOverlay) closeModal();
        });

        /* Modal send */
        DOM.modalSendBtn.addEventListener('click', validateAndSend);

        /* Textarea char count */
        DOM.modalTextarea.addEventListener('input', function () {
            updateCharCount();
            hideError();
        });

        /* Banner request button */
        if (DOM.bannerRequestBtn) {
            DOM.bannerRequestBtn.addEventListener('click', function () {
                /* Switch to Browse Alumni tab and open modal for first available alumni */
                switchTab('browse-alumni');
                const available = referralData.alumni.find(a => a.requestStatus === 'none');
                if (available) {
                    openModal(available.id);
                } else {
                    showToast('info', 'You have already requested referrals from all available alumni.');
                }
            });
        }

        /* Mobile sidebar */
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', toggleSidebar);
        }
        if (DOM.sidebarOverlay) {
            DOM.sidebarOverlay.addEventListener('click', closeSidebar);
        }

        /* Sign out */
        const signOutBtn = document.getElementById('sign-out-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', handleSignOut);
        }

        /* Sidebar nav */
        document.querySelectorAll('.sidebar__nav-item').forEach(item => {
            item.addEventListener('click', function (e) {
                document.querySelectorAll('.sidebar__nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });

        /* Keyboard: Escape to close modal */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && DOM.modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ---- Initialize ---- */

    function init() {
        cacheDom();
        renderStats();
        renderMyRequests();
        renderAlumni('');
        bindEvents();
        console.log('CareerNest Referrals page initialized.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ---- Public API ---- */
    return {
        init: init,
        toggleDetails: toggleDetails,
        openModal: openModal,
        closeModal: closeModal
    };
})();