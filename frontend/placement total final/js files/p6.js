/* ═══ CareerNest — Application Tracking Module ═══ */

let searchQuery = '';
const columns = [
    { name: 'Applied', color: '#6b7280', bg: '#f3f4f6' },
    { name: 'Shortlisted', color: '#3b82f6', bg: '#eff6ff' },
    { name: 'Interview', color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Selected', color: '#10b981', bg: '#ecfdf5' },
    { name: 'Rejected', color: '#ef4444', bg: '#fef2f2' }
];

document.addEventListener('DOMContentLoaded', () => {
    initAppBadge();
    renderKanban();
});

function initAppBadge() {
    const badge = document.getElementById('bellBadge');
    if(badge && MOCK.notifications) badge.innerText = MOCK.notifications.filter(n => !n.read).length || 0;
}

function searchApps(query) {
    searchQuery = query.toLowerCase().trim();
    renderKanban();
}

function renderKanban() {
    const board = document.getElementById('kanbanBoard');
    board.innerHTML = '';
    
    let apps = MOCK.applications || [];
    if (searchQuery) {
        apps = apps.filter(a => 
            (a.company && a.company.toLowerCase().includes(searchQuery)) ||
            (a.candidate && a.candidate.toLowerCase().includes(searchQuery)) ||
            (a.role && a.role.toLowerCase().includes(searchQuery))
        );
    }
    
    columns.forEach(col => {
        const colApps = apps.filter(a => a.status === col.name);
        
        let colHtml = `
        <div class="kanban-col" style="border-top: 4px solid ${col.color};">
            <div class="kanban-header">
                <span style="color: ${col.color}; font-size:15px;">${col.name}</span>
                <span class="kanban-badge" style="background: ${col.bg}; color: ${col.color};">${colApps.length}</span>
            </div>
            <div class="kanban-cards-wrapper" style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">`;
            
        if (colApps.length === 0) {
            colHtml += `<div style="text-align:center; padding: 20px 0; color:#9ca3af; font-size:13px;">No applications</div>`;
        } else {
            colApps.forEach(app => {
                colHtml += `
                <div class="app-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                        <div class="app-candidate">${app.candidate}</div>
                        <div style="width:24px; height:24px; border-radius:12px; background:${col.bg}; color:${col.color}; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">
                            ${app.candidate.charAt(0)}
                        </div>
                    </div>
                    <div class="app-role" style="font-weight:500; color:#374151; margin-bottom:4px;">${app.role}</div>
                    
                    <div class="app-company" style="margin-bottom:8px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 10h6"></path><path d="M9 14h6"></path></svg>
                        <span style="font-weight:500; color:#4b5563;">${app.company}</span>
                    </div>
                    
                    <div style="height:1px; background:#f3f4f6; margin: 8px 0;"></div>
                    
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${app.interviewDate ? `
                        <div class="app-date" style="color:#d97706; background:#fef3c7; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:6px; width:fit-content; border:1px solid #fde68a;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span style="font-weight:600;">Interview: ${app.interviewDate}</span>
                        </div>` : ''}
                        
                        <div class="app-date" style="color:#6b7280; display:flex; align-items:center; gap:6px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Applied: ${app.date}
                        </div>
                    </div>
                </div>`;
            });
        }
        
        colHtml += `</div></div>`;
        board.innerHTML += colHtml;
    });
}
