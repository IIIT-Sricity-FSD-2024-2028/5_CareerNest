import { getStore, initGlobalNotifications, renderUserNav } from './store.js';

const statShortlisted = document.getElementById('stat-shortlisted');
const statInterviews = document.getElementById('stat-interviews');
const statOffers = document.getElementById('stat-offers');
const statRejected = document.getElementById('stat-rejected');

const appListContainer = document.getElementById('applications-container');
const searchInput = document.getElementById('app-search-input');
let currentFilter = 'All';
let searchQuery = '';

const urlParams = new URLSearchParams(window.location.search);
const focusAppId = parseInt(urlParams.get('appId'));

function renderDashboard() {
    renderUserNav();
    const store = getStore();

    statShortlisted.textContent = store.applicationStats.shortlisted;
    statInterviews.textContent = store.applicationStats.interviews;
    statOffers.textContent = store.applicationStats.offers;
    statRejected.textContent = store.applicationStats.rejected;

    setupFilters();
    setupSearch();
    renderApplicationsList();
}

function setupSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderApplicationsList();
        });
    }
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-pill');
    filterBtns.forEach(btn => {
        const type = btn.textContent.split(' ')[0];
        const store = getStore();
        
        let count = 0;
        if(type === 'All') {
            count = store.myApplications.length;
        } else {
            count = store.myApplications.filter(a => a.status === type).length;
        }
        btn.textContent = `${type} (${count})`;
            
            btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = type;
            renderApplicationsList();
        });
    });
}

window.toggleAppExpand = function(headerElem, focusId = null) {
    const card = headerElem.closest('.app-row-card');
    const isExpanded = card.classList.contains('expanded');
    
    document.querySelectorAll('.app-row-card').forEach(c => c.classList.remove('expanded'));
    document.querySelectorAll('.app-chevron').forEach(i => i.classList.replace('bx-chevron-up', 'bx-chevron-down'));
    
    if (!isExpanded || focusId !== null) {
        card.classList.add('expanded');
        card.querySelector('.app-chevron').classList.replace('bx-chevron-down', 'bx-chevron-up');
        if(focusId !== null) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function renderApplicationsList() {
    const store = getStore();
    appListContainer.innerHTML = '';

    let appsToRender = store.myApplications;
    if (currentFilter !== 'All') {
        appsToRender = appsToRender.filter(app => app.status === currentFilter);
    }
    
    if (searchQuery) {
        appsToRender = appsToRender.filter(app => 
            app.title.toLowerCase().includes(searchQuery) ||
            app.company.toLowerCase().includes(searchQuery) ||
            app.status.toLowerCase().includes(searchQuery)
        );
    }

    if(appsToRender.length === 0) {
        appListContainer.innerHTML = '<div style="padding:40px; text-align:center; color:#94a3b8;">No applications found in this category. Apply for Jobs!</div>';
        return;
    }

    appsToRender.forEach(app => {
        let statusBadge = '';
        if (app.status === 'Applied') statusBadge = `<span class="badge" style="background:#e0e7ff; color:#4338ca;">Applied</span>`;
        else if (app.status === 'Shortlisted') statusBadge = `<span class="badge" style="background:#fef3c7; color:#d97706;">Shortlisted</span>`;
        else if (app.status === 'Interview') statusBadge = `<span class="badge" style="background:#fce7f3; color:#db2777;">Interview</span>`;
        else if (app.status === 'Withdrawn') statusBadge = `<span class="badge" style="background:#f1f5f9; color:#64748b; border: 1px solid #cbd5e1;">Withdrawn</span>`;
        else statusBadge = `<span class="badge" style="background:#f1f5f9; color:#475569;">${app.status}</span>`;

        const refHtml = app.hasReferral ? `<span class="referral-badge">✨ Referral Attached</span>` : '';
        
        // Build Action Footer for Cancellation & Query
        let actionFooterHtml = `
            <div style="margin-top: 24px; text-align: right; border-top: 1px solid #f1f5f9; padding-top: 16px; display: flex; justify-content: flex-end; gap: 12px;">
                <button class="btn-secondary" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 500; display: inline-flex; align-items: center; gap: 6px;" onclick="window.openAskQueryModal(event)">
                    <i class='bx bx-message-rounded-dots'></i> Ask Query
                </button>
        `;
        if (app.status === 'Applied' || app.status === 'Shortlisted' || app.status === 'Interview') {
            actionFooterHtml += `
                <button class="btn-secondary" style="background: none; color: #ef4444; border: 1px solid #fca5a5; padding: 8px 16px;" onclick="window.cancelApplication(${app.id})">Cancel Application</button>
            `;
        }
        actionFooterHtml += `</div>`;

        let trackerHtml = '';
        if (app.timeline && app.timeline.length > 0) {
            const stagesDef = ["Applied", "Shortlisted", "Assessment", "Interview", "Offered"];
            let stepHtml = '';
            
            stagesDef.forEach((stageName, index) => {
                const stageNum = index + 1;
                const isCompleted = index < app.currentStageIndex;
                const isActive = index === app.currentStageIndex;
                
                let circleClass = 'future';
                if (isCompleted) circleClass = 'completed';
                else if (isActive) circleClass = 'active';

                let iconHtml = stageNum;
                if (isCompleted) iconHtml = `<i class='bx bx-check'></i>`;

                stepHtml += `
                    <div class="tracker-step">
                        <div class="tracker-circle ${circleClass}">${iconHtml}</div>
                        <span class="tracker-label">${stageName}</span>
                    </div>
                `;

                if (index < stagesDef.length - 1) {
                    const lineClass = isCompleted ? 'completed' : 'future';
                    stepHtml += `<div class="tracker-line ${lineClass}"></div>`;
                }
            });

            let activityList = '';
            const reversedTimeline = [...app.timeline].reverse();
            
            reversedTimeline.forEach((tEvent, tIdx) => {
                const isLast = tIdx === reversedTimeline.length - 1;
                const dotClass = tIdx === 0 ? 'active' : 'completed';
                const lineClass = isLast ? 'hidden' : '';

                activityList += `
                    <div class="activity-item">
                        <div class="activity-timeline">
                            <div class="activity-dot ${dotClass}"></div>
                            <div class="activity-line ${lineClass}"></div>
                        </div>
                        <div class="activity-content">
                            <div class="activity-bubble" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                                <h6 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                                    ${tEvent.stage} 
                                    <span class="activity-date" style="font-weight: 400; font-size: 12px; color: #94a3b8;">${tEvent.date}</span>
                                </h6>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">${tEvent.desc}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            trackerHtml = `
            <div class="app-row-body">
                <div class="tracker-wrapper">
                    ${stepHtml}
                </div>
                <div class="activity-log-container">
                    <h5 class="activity-header">ACTIVITY LOG</h5>
                    ${activityList}
                </div>
                ${actionFooterHtml}
            </div>
            `;
        }

        const isTargetFocus = (app.id === focusAppId);
        const focusClass = isTargetFocus ? 'expanded' : '';
        const focusChevron = isTargetFocus ? 'bx-chevron-up' : 'bx-chevron-down';

        appListContainer.innerHTML += `
            <div class="app-row-card ${focusClass}" id="app-card-${app.id}">
                <div class="app-row-header" onclick="toggleAppExpand(this)">
                    <div class="app-row-left">
                        <div class="app-icon-box"><i class='bx bx-building-house'></i></div>
                        <div class="app-info">
                            <h4>${app.title} ${refHtml}</h4>
                            <p>${app.company} · Applied: ${app.appliedDate}</p>
                        </div>
                    </div>
                    <div class="app-row-right">
                        ${statusBadge}
                        <i class='bx ${focusChevron} app-chevron'></i>
                    </div>
                </div>
                ${trackerHtml}
            </div>
        `;
    });

    if(focusAppId) {
        setTimeout(() => {
            const el = document.getElementById(`app-card-${focusAppId}`);
            if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

window.cancelApplication = function(appId) {
    if (confirm("Are you sure you want to withdraw this application? This action cannot be reversed.")) {
        updateStore(store => {
            const app = store.myApplications.find(a => a.id === appId);
            if (app) {
                app.status = 'Withdrawn';
                app.timeline.push({
                    stage: "Withdrawn",
                    date: new Date().toISOString().split('T')[0],
                    desc: "You have voluntarily withdrawn this application.",
                    status: "completed"
                });
            }
        });
        renderDashboard();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initGlobalNotifications();
    renderDashboard();
});
