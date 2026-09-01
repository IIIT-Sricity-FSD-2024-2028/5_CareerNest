document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.getElementById("cards");
    const tabsContainer = document.getElementById("filter-tabs");

    // --- Apply dashboard approvals from localStorage ---
    let dashApprovals = [];
    try {
        dashApprovals = JSON.parse(localStorage.getItem('dashboardApprovals') || '[]');
        if (!Array.isArray(dashApprovals)) dashApprovals = [];
    } catch(e) { dashApprovals = []; }
    
    dashApprovals.forEach(id => MOCK_DATA.updateStatus(id, 'approved', 'Referral approved from dashboard.'));
    if (dashApprovals.length > 0) { try { localStorage.removeItem('dashboardApprovals'); } catch(e){} }

    const searchInput = document.getElementById("search-input");
    let currentFilter = 'all';
    let searchQuery = '';

    // --- Search functionality ---
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    function applyFilters() {
        let visibleCount = 0;
        document.querySelectorAll('.card').forEach(card => {
            const status = card.dataset.status;
            const cardName = card.querySelector('.card-name').textContent.toLowerCase();
            const cardDetail = card.querySelector('.card-detail').textContent.toLowerCase();
            
            // Matches tab filter
            const matchesTab = (currentFilter === 'all' || status === currentFilter);
            
            // Search name, year (batch), department, cgpa
            // cardDetail already contains dept, cgpa, and batch (year)
            const matchesSearch = !searchQuery || 
                                cardName.includes(searchQuery) || 
                                cardDetail.includes(searchQuery);

            const isVisible = matchesTab && matchesSearch;
            card.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });

        // Handle empty state
        const existingEmpty = document.getElementById('filter-empty-state');
        if (visibleCount === 0) {
            if (!existingEmpty) {
                cardsContainer.insertAdjacentHTML('beforeend', `
                    <div id="filter-empty-state" class="empty-state">
                        <div class="empty-state-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <div class="empty-state-title">No referrals found</div>
                        <div class="empty-state-desc">We couldn't find any referral requests matching your current filters or search query.</div>
                    </div>
                `);
            }
        } else {
            if (existingEmpty) existingEmpty.remove();
        }
    }

    // --- Render Tabs from MOCK_DATA ---
    function renderTabs(activeFilter) {
        currentFilter = activeFilter;
        const counts = MOCK_DATA.getCounts();
        tabsContainer.innerHTML = '';
        ['all', 'pending', 'approved', 'declined'].forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'tab' + (f === activeFilter ? ' tab--active' : '');
            btn.dataset.filter = f;
            btn.textContent = `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
                btn.classList.add('tab--active');
                currentFilter = f;
                applyFilters();
            });
            tabsContainer.appendChild(btn);
        });
    }

    // --- Build a single card HTML from referral data ---
    function buildCard(r) {
        const isPending = r.status === 'pending';
        const noteClass = r.status === 'approved' ? 'alumni-note--approved' : 'alumni-note--declined';
        const noteTitle = r.status === 'declined' ? 'Alumni Note (Reason for Decline)' : 'Alumni Note';

        let bottomSection = '';
        if (isPending) {
            bottomSection = `
                <h3 class="section-title">Message to Candidate</h3>
                <textarea class="reply-box" placeholder="Write a message.."></textarea>
                <h3 class="section-title">Actions</h3>
                <div class="actions-row">
                    <button class="accept-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Accept &amp; Refer</button>
                    <button class="decline-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Decline</button>
                </div>`;
        } else if (r.alumniNote) {
            bottomSection = `
                <h3 class="section-title">${noteTitle}</h3>
                <div class="alumni-note ${noteClass}">${r.alumniNote}</div>`;
        }

        return `
        <div class="card" data-status="${r.status}" id="${r.id}">
            <div class="card-header">
                <div class="card-left">
                    <div class="avatar">${r.initials}</div>
                    <div class="card-info">
                        <div class="card-name">${r.name}</div>
                        <p class="card-detail">${r.department} • CGPA: ${r.cgpa} • Batch ${r.batch}</p>
                        <p class="card-for"><span class="label">For: </span><span class="value">${r.role} at ${r.company}</span></p>
                    </div>
                </div>
                <div class="card-right">
                    <span class="badge badge--${r.status}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                    <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>
            <div class="dropdown-content">
                <hr class="divider"/>
                <h3 class="section-title">Candidate Details</h3>
                <div class="details-grid">
                    <div class="detail-box"><div class="detail-label">Department</div><div class="detail-value">${r.department}</div></div>
                    <div class="detail-box"><div class="detail-label">CGPA</div><div class="detail-value">${r.cgpa}</div></div>
                    <div class="detail-box"><div class="detail-label">Graduation Batch</div><div class="detail-value">${r.batch}</div></div>
                </div>
                <h3 class="section-title">Applied For</h3>
                <div class="applied-grid">
                    <div class="applied-col">
                        <div class="applied-line"><span class="applied-label">Role:</span> ${r.role}</div>
                        <div class="applied-line"><span class="applied-label">Salary:</span> ${r.salary}</div>
                        <div class="tags-row">${r.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
                    </div>
                    <div class="applied-col">
                        <div class="applied-line"><span class="applied-label">Company:</span> ${r.company}</div>
                        <div class="applied-line"><span class="applied-label">Location:</span> ${r.location}</div>
                    </div>
                </div>
                <h3 class="section-title">Candidate Message</h3>
                <div class="message-box">${r.message}</div>
                <button class="resume-btn" onclick="event.stopPropagation(); document.getElementById('resume-modal').style.display='flex'">View Resume / Profile</button>
                ${bottomSection}
            </div>
        </div>`;
    }

    // --- Render all cards ---
    function renderCards() {
        cardsContainer.innerHTML = MOCK_DATA.referrals.map(buildCard).join('');
        attachCardListeners();
    }

    // --- Attach event listeners to rendered cards ---
    function attachCardListeners() {
        document.querySelectorAll('.card').forEach(card => {
            const header = card.querySelector('.card-header');
            const dropdown = card.querySelector('.dropdown-content');
            if (!header) return;

            header.addEventListener('click', () => {
                if (!dropdown) return;
                dropdown.classList.toggle('open');
                const chev = card.querySelector('.chevron');
                if (chev) chev.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : '';
            });

            if (!dropdown) return;
            dropdown.addEventListener('click', e => e.stopPropagation());

            const acceptBtn = dropdown.querySelector('.accept-btn');
            if (acceptBtn) acceptBtn.addEventListener('click', e => {
                e.stopPropagation();
                const id = card.id;
                const textarea = dropdown.querySelector('.reply-box');
                const note = textarea?.value?.trim() || 'Referral approved.';
                MOCK_DATA.updateStatus(id, 'approved', note);
                card.dataset.status = 'approved';
                const badge = card.querySelector('.badge');
                badge.className = 'badge badge--approved';
                badge.textContent = 'Approved';
                replaceActions(dropdown, 'accepted', note);
                renderTabs(currentFilter);
                applyFilters();
            });

            const declineBtn = dropdown.querySelector('.decline-btn');
            if (declineBtn) declineBtn.addEventListener('click', e => {
                e.stopPropagation();
                const name = card.querySelector('.card-name')?.textContent || 'this candidate';
                showDeclineModal(name, (reason) => {
                    const id = card.id;
                    MOCK_DATA.updateStatus(id, 'declined', reason);
                    card.dataset.status = 'declined';
                    const badge = card.querySelector('.badge');
                    badge.className = 'badge badge--declined';
                    badge.textContent = 'Declined';
                    replaceActions(dropdown, 'declined', reason);
                    renderTabs(currentFilter);
                    applyFilters();
                });
            });
        });
    }

    // --- Replace actions with Alumni Note ---
    function replaceActions(dropdown, type, reason) {
        const isAccepted = type === 'accepted';
        const alumniMessage = reason || (isAccepted ? 'Referral approved.' : 'Application declined.');

        const titles = dropdown.querySelectorAll('.section-title');
        Array.from(titles).forEach(t => {
            const text = t.textContent.trim();
            if (text === 'Message to Candidate' || text === 'Actions') t.remove();
        });
        dropdown.querySelector('.reply-box')?.remove();
        dropdown.querySelector('.actions-row')?.remove();

        const noteTitle = isAccepted ? 'Alumni Note' : 'Alumni Note (Reason for Decline)';
        const noteClass = isAccepted ? 'alumni-note--approved' : 'alumni-note--declined';
        dropdown.insertAdjacentHTML('beforeend', `
            <h3 class="section-title">${noteTitle}</h3>
            <div class="alumni-note ${noteClass}">${alumniMessage}</div>
        `);
    }

    // --- Decline Modal ---
    function showDeclineModal(name, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'decline-modal-overlay';
        overlay.innerHTML = `
        <div class="decline-modal">
            <div class="decline-modal-header">
                <div class="decline-modal-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e60000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Decline Application
                </div>
                <button class="decline-modal-close">&times;</button>
            </div>
            <div class="decline-warning"><strong>Warning:</strong> You are about to decline <strong>${name}</strong>'s application. Please provide a reason for the rejection.</div>
            <div class="decline-label">Remarks / Reason for Decline <span style="color:#e60000">*</span></div>
            <textarea class="decline-textarea" placeholder="Enter the reason for declining this recruiter's application..."></textarea>
            <div class="decline-modal-actions">
                <button class="decline-cancel-btn">Cancel</button>
                <button class="decline-confirm-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Confirm Decline
                </button>
            </div>
        </div>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('.decline-modal-close').addEventListener('click', close);
        overlay.querySelector('.decline-cancel-btn').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        overlay.querySelector('.decline-confirm-btn').addEventListener('click', () => {
            const textarea = overlay.querySelector('.decline-textarea');
            const reason = textarea.value;
            const words = reason.trim().split(/\s+/).filter(Boolean);
            const wordCount = words.length;
            if (wordCount < 10) {
                textarea.style.borderColor = '#e60000';
                textarea.style.boxShadow = '0 0 0 3px rgba(230,0,0,0.15)';
                let err = overlay.querySelector('.decline-error');
                if (!err) {
                    err = document.createElement('div');
                    err.className = 'decline-error';
                    textarea.parentNode.insertBefore(err, textarea.nextSibling);
                }
                err.textContent = `Reason must be at least 10 words. (${wordCount}/10)`;
                textarea.focus();
                return;
            }
            onConfirm(reason);
            close();
        });
    }

    // --- Initialize ---
    renderCards();
    renderTabs('all');
    applyFilters();

    // Auto-filter from URL param
    const urlFilter = new URLSearchParams(window.location.search).get('filter');
    if (urlFilter) {
        const target = document.querySelector(`.tab[data-filter="${urlFilter}"]`);
        if (target) target.click();
    }

    // Auto-open card from URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetCard = document.getElementById(hash);
        if (targetCard) {
            const dropdown = targetCard.querySelector('.dropdown-content');
            const chev = targetCard.querySelector('.chevron');
            if (dropdown) { dropdown.classList.add('open'); if (chev) chev.style.transform = 'rotate(180deg)'; }
            setTimeout(() => targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }
});
