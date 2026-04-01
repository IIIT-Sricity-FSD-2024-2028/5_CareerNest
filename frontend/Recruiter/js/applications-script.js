import { recruiterData, applications as initialApplications } from '../data/applications-mockdata.js';

const ICONS = {
    dashboard: `<svg viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z"/></svg>`,
    post: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>`,
    applications: `<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.89-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.89 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
    assessments: `<svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    signout: `<svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
    more: `<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/></svg>`,
    file: `<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.89-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.89 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
    // Session State
    let currentApplications = [...initialApplications];
    let filterReferred = false;
    let searchTerm = '';
    const statusFlow = ['Applied', 'Shortlisted', 'Assessment', 'Interview', 'Offered', 'Rejected'];

    // Initialize UI
    injectIcons();
    const recruiterAvatar = document.getElementById('recruiter-avatar');
    const recruiterName = document.getElementById('recruiter-name');
    const recruiterEmail = document.getElementById('recruiter-email');

    if (recruiterAvatar) recruiterAvatar.textContent = recruiterData.avatar;
    if (recruiterName) recruiterName.textContent = recruiterData.name;
    if (recruiterEmail) recruiterEmail.textContent = recruiterData.email;

    // DOM Elements
    const container = document.getElementById('applications-container');
    const searchInput = document.getElementById('candidate-search');
    const appCountText = document.getElementById('app-count-text');
    const filterBtn = document.querySelector('.btn-filter');
    const modal = document.getElementById('candidate-modal');
    const modalContent = modal.querySelector('.modal-content');

    function injectIcons() {
        document.querySelectorAll('[data-icon]').forEach(el => {
            const iconName = el.getAttribute('data-icon');
            const placeholder = el.querySelector('.icon-placeholder');
            if (placeholder && ICONS[iconName]) placeholder.innerHTML = ICONS[iconName];
        });
        const searchPlaceholder = document.querySelector('.search-icon-placeholder');
        if (searchPlaceholder) searchPlaceholder.innerHTML = ICONS.search;
    }

    function renderApplications() {
        if (!container) return;

        const filtered = currentApplications.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchTerm) ||
                app.branch.toLowerCase().includes(searchTerm) ||
                app.role.toLowerCase().includes(searchTerm);
            const matchesFilter = !filterReferred || app.isReferred;
            return matchesSearch && matchesFilter;
        });

        container.innerHTML = '';
        appCountText.textContent = `${filtered.length} applications`;

        filtered.forEach((app, index) => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.style.animationDelay = `${index * 0.05}s`;
            card.onclick = () => openDetailView(app.id);

            card.innerHTML = `
                <div class="app-info">
                    <div class="user-avatar">${app.initials}</div>
                    <div class="app-details">
                        <h3>${app.name} ${app.isReferred ? '<span class="tag-referred" style="font-size: 0.8rem;">⭐ Referred</span>' : ''}</h3>
                        <p class="app-metadata">${app.branch} • CGPA: ${app.cgpa} • ${app.role}</p>
                    </div>
                </div>
                <div class="status-dropdown">
                    <button class="btn-status status-${app.status}">
                        ${app.status} ${ICONS.chevronDown}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function openDetailView(id) {
        const app = currentApplications.find(a => a.id === id);
        if (!app) return;

        modalContent.innerHTML = `
            <div class="detail-header">
                <div class="detail-user-id">
                    <div class="user-avatar" style="width: 56px; height: 56px; font-size: 1.25rem;">${app.initials}</div>
                    <div>
                        <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${app.name} ${app.isReferred ? '<span class="tag-referred" style="font-size: 0.8rem;">⭐ Referred</span>' : ''}</h2>
                        <p class="app-metadata" style="font-size: 0.95rem;">${app.branch} • CGPA: ${app.cgpa} • ${app.role}</p>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn-status status-${app.status}" style="margin-right: 0.5rem; padding: 0.6rem 1.5rem;">${app.status}</button>
                    <button class="btn-icon">${ICONS.more}</button>
                </div>
            </div>

            <h3 class="section-title">Update Application Status</h3>
            <div class="status-update-grid">
                ${statusFlow.map(status => `
                    <button class="btn-status-chip ${app.status === status ? 'active' : ''}" onclick="updateAppStatus(${app.id}, '${status}')">
                        ${status}
                    </button>
                `).join('')}
            </div>

            <h3 class="section-title">Round-by-Round Results</h3>
            <div class="round-results-list">
                ${renderRoundRow(app, 1, 'Resume Screening', 'resume')}
                ${renderRoundRow(app, 2, 'Online Assessment', 'assessment')}
                ${renderRoundRow(app, 3, 'Technical Interview', 'technical')}
                ${renderRoundRow(app, 4, 'HR Interview', 'hr')}
            </div>

            <div class="modal-footer">
                <span>Applied: ${app.appliedDate}</span>
                <a href="../resume.pdf" target="_blank" class="resume-link">
                    <span style="display: flex; align-items: center; width: 16px; height: 16px; margin-right: 5px;">${ICONS.file}</span>
                    Resume: ${app.resumeFile}
                </a>
            </div>
        `;

        modal.classList.add('active');
    }

    function renderRoundRow(app, num, label, key) {
        const currentVal = app.rounds[key];
        return `
            <div class="round-row">
                <div class="round-info">
                    <span class="round-num">${num}</span>
                    <span>${label}</span>
                </div>
                <div class="round-options">
                    ${['Pass', 'Fail', 'Scheduled'].map(opt => `
                        <button class="btn-round-opt ${currentVal === opt ? 'active' : ''}" 
                                data-id="${app.id}" data-key="${key}" data-val="${opt}"
                                onclick="updateRoundStatus(${app.id}, '${key}', '${opt}')">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Global toggle functions for buttons in modal (exposed via window)
    window.updateAppStatus = (id, newStatus) => {
        const appIndex = currentApplications.findIndex(a => a.id === id);
        if (appIndex !== -1) {
            currentApplications[appIndex].status = newStatus;
            renderApplications();
            openDetailView(id);
        }
    };

    window.updateRoundStatus = (id, key, newVal) => {
        const appIndex = currentApplications.findIndex(a => a.id === id);
        if (appIndex !== -1) {
            const app = currentApplications[appIndex];
            app.rounds[key] = newVal;

            if (newVal === 'Fail') {
                app.status = 'Rejected';
            } else {
                if (app.rounds.hr === 'Pass') {
                    app.status = 'Offered';
                } else if (app.rounds.technical === 'Pass') {
                    app.status = 'Interview';
                } else if (app.rounds.assessment === 'Pass') {
                    app.status = 'Assessment';
                } else if (app.rounds.resume === 'Pass') {
                    app.status = 'Shortlisted';
                } else {
                    app.status = 'Applied';
                }
            }

            renderApplications();
            openDetailView(id);
        }
    };

    // Modal Close Logic
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Initial Render
    renderApplications();

    // Search & Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderApplications();
        });
    }

    if (filterBtn) {
        filterBtn.addEventListener('change', (e) => {
            filterReferred = (e.target.value === 'referred');
            renderApplications();
        });
    }
});
