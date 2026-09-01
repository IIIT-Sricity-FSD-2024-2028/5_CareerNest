/* â•â•â• p1.js — Dashboard Data Only (p1.html) â•â•â• */
document.addEventListener('DOMContentLoaded', () => {
    const s = MOCK.stats;
    const sh = MOCK.stakeholders;
    const subs = MOCK.submissions;
    const drives = MOCK.drives;
    const interviews = MOCK.interviews;

    /* ── Bell Badge ── */
    const bellBadge = document.getElementById('bellBadge');
    const unreadCount = (MOCK.notifications || []).filter(n => !n.read).length;
    if (bellBadge) bellBadge.textContent = unreadCount || '';

    /* ── Alert Bar ── */
    const alertText = document.getElementById('alertText');
    const alertBar = document.getElementById('alertBar');
    if (alertText && s.pending > 0) {
        alertText.innerHTML = `${s.pending} opportunity awaiting review. Review and approve or reject pending opportunities to keep the process moving.`;
    } else if (alertBar && s.pending === 0) {
        alertBar.style.display = 'none';
    }

    /* ── Stats Cards ── */
    const statsRow = document.getElementById('statsRow');
    if (statsRow) {
        const statItems = [
            { value: s.pending, label: 'Opportunities Pending', colorClass: 'yellow', icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', stroke: '#EAB308' },
            { value: s.published, label: 'Published', colorClass: 'green', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', stroke: '#22C55E' },
            { value: s.totalOpps, label: 'Total opportunities', colorClass: 'blue', icon: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', stroke: '#3B82F6' },
            { value: s.totalApplicants, label: 'Total applicants', colorClass: 'purple', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle>', stroke: '#A855F7' }
        ];
        statsRow.innerHTML = statItems.map(item => `
            <div class="stat-card">
                <div class="stat-icon ${item.colorClass}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${item.stroke}" stroke-width="2">${item.icon}</svg>
                </div>
                <div><strong>${item.value}</strong>
                    <div class="stat-label">${item.label}</div>
                </div>
            </div>`).join('');
    }

    /* ── Recent Submissions ── */
    const submissionsBody = document.getElementById('submissionsBody');
    if (submissionsBody) {
        const badgeMap = { published: 'green', approved: 'blue', pending: 'yellow', rejected: 'red' };
        submissionsBody.innerHTML = subs.map(sub => `
            <div class="list-row">
                <div>
                    <div class="row-title">${sub.title}</div>
                    <div class="row-sub">${sub.company}</div>
                </div>
                <span class="badge ${badgeMap[sub.status] || 'gray'}">${sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
            </div>`).join('');
    }

    /* ── Stakeholder Overview ── */
    const stakeholderBody = document.getElementById('stakeholderBody');
    if (stakeholderBody) {
        const stakeItems = [
            { label: 'Registered Candidates', sub: 'Active student profiles', value: sh.candidates, colorClass: 'blue-bg', stroke: '#3B82F6', icon: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 10 3 12 0v-5"></path>' },
            { label: 'Recruiter Partners', sub: 'Registered companies', value: sh.recruiters, colorClass: 'orange-bg', stroke: '#F97316', icon: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>' },
            { label: 'Active Placement Drives', sub: 'Currently running', value: sh.activeDrives, colorClass: 'green-bg', stroke: '#22C55E', icon: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>' },
            { label: 'Alumni\u00a0\u00a0Available', sub: 'Referring candidates', value: sh.alumni, colorClass: 'pink-bg', stroke: '#EC4899', icon: '<path d="M17 21v-2a4 4 0 0 0-3-3.87"></path><path d="M9 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>' }
        ];
        stakeholderBody.innerHTML = stakeItems.map(item => `
            <div class="stake-row">
                <div class="stake-left">
                    <div class="stake-icon ${item.colorClass}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${item.stroke}" stroke-width="2">${item.icon}</svg>
                    </div>
                    <div>
                        <div class="row-title">${item.label}</div>
                        <div class="row-sub">${item.sub}</div>
                    </div>
                </div>
                <strong class="stake-num">${item.value}</strong>
            </div>`).join('');
    }

    /* ── Active Placement Drives ── */
    const drivesBody = document.getElementById('drivesBody');
    if (drivesBody) {
        const driveBadgeMap = { green: 'green', blue: 'blue', purple: 'purple' };
        drivesBody.innerHTML = drives.map((d, i) => `
            <div class="drive-row${i < drives.length - 1 ? ' bordered' : ''}">
                <div>
                    <div class="drive-company">${d.company}</div>
                    <div class="row-sub">${d.role}</div>
                </div>
                <span class="badge ${driveBadgeMap[d.badgeClass] || d.badgeClass}">${d.badge}</span>
            </div>`).join('');
    }

    /* ── Upcoming Interviews ── */
    const interviewsBody = document.getElementById('interviewsBody');
    if (interviewsBody) {
        const calIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
        interviewsBody.innerHTML = interviews.map((iv, i) => `
            <div class="interview-row${i < interviews.length - 1 ? ' bordered' : ''}">
                ${calIcon}
                <div>
                    <div class="interview-company">${iv.company}</div>
                    <div class="row-sub">${iv.round}</div>
                    <div class="interview-time">${iv.time}</div>
                </div>
            </div>`).join('');
    }
});


/* ── Show profile from dropdown ── */
function showProfile() {
    const dd = document.getElementById('profileDropdown');
    if (dd) dd.classList.remove('open');
    toggleProfileView(true);
}

/* ── Handle ?view=profile URL param on load ── */
(function checkViewParam() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'profile') {
        // Clean URL and show profile after DOM and scripts are ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
                toggleProfileView(true);
                history.replaceState(null, '', window.location.pathname);
            }, 200));
        } else {
            setTimeout(() => {
                toggleProfileView(true);
                history.replaceState(null, '', window.location.pathname);
            }, 200);
        }
    }
})();

/* â•â•â• search.js — Global Search Bar (shared across all pages) â•â•â• */

/**
 * Builds and injects a global search bar into the header.
 * Searches across opportunities, recruiters, and navigation pages.
 * Clicking a result navigates to the correct page AND scrolls to /
 * highlights the matching item on that page.
 */
function initGlobalSearch() {
    const header = document.getElementById('header');
    if (!header) return;

    /* ── SVG icon strings ── */
    const searchIconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    const clearIconSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const noResultsSVG = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;

    /* ── Restructure header to include search ── */
    const existingTitle = header.querySelector('.header-title');
    const existingBell = header.querySelector('.header-bell');
    const existingProfile = header.querySelector('.header-profile');

    const titleHTML = existingTitle ? existingTitle.outerHTML : '';
    const bellHTML = existingBell ? existingBell.outerHTML : '';
    const profileHTML = existingProfile ? existingProfile.outerHTML : '';

    header.innerHTML = `
        ${titleHTML}
        <div class="header-actions">
            <div class="header-search" id="globalSearch">
                <input class="header-search-input" id="globalSearchInput" type="text"
                       placeholder="Search opportunities, recruiters, pages..."
                       autocomplete="off" spellcheck="false">
                <div class="header-search-icon">${searchIconSVG}</div>
                <button class="header-search-clear" id="globalSearchClear" title="Clear search">${clearIconSVG}</button>
                <div class="search-results" id="searchResults"></div>
            </div>
            ${bellHTML}
            ${profileHTML}
        </div>`;

    /* ── DOM references ── */
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClear');
    const resultsPanel = document.getElementById('searchResults');

    let activeIndex = -1;
    let currentResults = [];
    let debounceTimer = null;

    /* ── Build searchable data from MOCK ── */
    function getSearchableItems() {
        const items = [];

        /* Opportunities / Submissions */
        if (MOCK.submissions) {
            MOCK.submissions.forEach((sub, i) => {
                items.push({
                    type: 'opportunity',
                    title: sub.title,
                    subtitle: `${sub.company} • ${sub.location} • ${sub.pkg}`,
                    avatar: sub.avatar,
                    avatarBg: sub.avatarBg,
                    status: sub.status,
                    href: 'p2.html',
                    matchKey: sub.title,          // used to find the element on the target page
                    matchIndex: i,
                    searchText: `${sub.title} ${sub.company} ${sub.location} ${sub.type} ${sub.status} ${sub.submitter}`.toLowerCase()
                });
            });
        }

        /* Recruiters */
        if (MOCK.recruiters) {
            MOCK.recruiters.forEach((rec, i) => {
                items.push({
                    type: 'recruiter',
                    title: rec.name,
                    subtitle: `${rec.company} • ${rec.role}`,
                    avatar: rec.name[0],
                    avatarBg: '#9810fa',
                    status: rec.status,
                    href: 'p4.html',
                    matchKey: rec.name,
                    matchIndex: i,
                    searchText: `${rec.name} ${rec.company} ${rec.role} ${rec.status} ${rec.location} ${rec.email}`.toLowerCase()
                });
            });
        }

        /* Navigation pages */
        if (MOCK.nav) {
            const pageLetters = ['D', 'O', 'S', 'R'];
            const pageBgs = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b'];
            MOCK.nav.forEach((page, i) => {
                items.push({
                    type: 'page',
                    title: page.label,
                    subtitle: `Navigate to ${page.label}`,
                    avatar: pageLetters[i] || 'P',
                    avatarBg: pageBgs[i] || '#10b981',
                    isEmoji: false,
                    href: page.href,
                    matchKey: page.label,
                    matchIndex: i,
                    searchText: `${page.label} page navigate`.toLowerCase()
                });
            });
        }

        /* Placement drives */
        if (MOCK.drives) {
            MOCK.drives.forEach((d, i) => {
                items.push({
                    type: 'drive',
                    title: `${d.company} — ${d.role}`,
                    subtitle: d.badge,
                    avatar: d.company[0],
                    avatarBg: '#7c3aed',
                    href: 'p1.html',
                    matchKey: d.company,
                    matchIndex: i,
                    searchText: `${d.company} ${d.role} ${d.badge} drive`.toLowerCase()
                });
            });
        }

        return items;
    }

    /* ── Highlight matching text ── */
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /* ── Render search results ── */
    function renderResults(query) {
        const q = query.toLowerCase().trim();
        if (!q) {
            resultsPanel.classList.remove('visible');
            currentResults = [];
            activeIndex = -1;
            return;
        }

        const allItems = getSearchableItems();
        const matches = allItems.filter(item => item.searchText.includes(q));
        activeIndex = -1;

        if (matches.length === 0) {
            currentResults = [];
            resultsPanel.innerHTML = `
                <div class="search-no-results">
                    ${noResultsSVG}
                    <div>No results found for "<strong>${highlightMatch(query, query)}</strong>"</div>
                    <div style="font-size:12px;margin-top:4px;">Try searching for opportunities, recruiters, or pages</div>
                </div>`;
            resultsPanel.classList.add('visible');
            return;
        }

        /* Group by type — drives are grouped under 'opportunity' */
        const groups = {};
        matches.forEach(m => {
            const gType = m.type === 'drive' ? 'opportunity' : m.type;
            if (!groups[gType]) groups[gType] = [];
            groups[gType].push(m);
        });

        const groupLabels = {
            opportunity: 'ðŸ’¼ Opportunities',
            recruiter: 'ðŸ‘¤ Recruiters',
            page: 'ðŸ“„ Pages'
        };

        let html = '';
        const orderedResults = [];   // rebuild currentResults in render order
        const order = ['opportunity', 'recruiter', 'page'];

        order.forEach(type => {
            if (!groups[type]) return;
            html += `<div class="search-group-header">${groupLabels[type]}</div>`;
            groups[type].forEach(item => {
                const idx = orderedResults.length;
                orderedResults.push(item);

                const avatarContent = item.isEmoji
                    ? `<div class="search-result-avatar" style="background:#f0fdf4;font-size:18px;">${item.avatar}</div>`
                    : `<div class="search-result-avatar" style="background:${item.avatarBg}">${item.avatar}</div>`;

                const badgeType = item.type === 'drive' ? 'opportunity' : item.type;

                html += `
                    <div class="search-result-item" data-idx="${idx}" data-href="${item.href}">
                        ${avatarContent}
                        <div class="search-result-info">
                            <div class="search-result-title">${highlightMatch(item.title, query)}</div>
                            <div class="search-result-sub">${highlightMatch(item.subtitle, query)}</div>
                        </div>
                        <span class="search-result-badge ${badgeType}">${badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}</span>
                    </div>`;
            });
        });

        currentResults = orderedResults;
        resultsPanel.innerHTML = html;
        resultsPanel.classList.add('visible');
    }

    /* ─────────────────────────────────────────────
     *  NAVIGATE TO RESULT — with deep-link highlight
     * ───────────────────────────────────────────── */
    function getCurrentPage() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf('/') + 1) || 'p1.html';
        return file;
    }

    function navigateToResult(idx) {
        if (idx < 0 || idx >= currentResults.length) return;
        const item = currentResults[idx];
        const targetPage = item.href;
        const currentPage = getCurrentPage();

        // Build URL with highlight params
        const params = new URLSearchParams();
        params.set('highlight', item.matchKey || item.title);
        params.set('type', item.type);
        params.set('idx', item.matchIndex != null ? item.matchIndex : '');

        if (currentPage === targetPage) {
            // Same page — just scroll & highlight directly
            resultsPanel.classList.remove('visible');
            input.blur();
            highlightOnCurrentPage(item.type, item.matchKey || item.title, item.matchIndex);
            // Update URL without reload for bookmarkability
            history.replaceState(null, '', `${targetPage}?${params.toString()}`);
        } else {
            // Different page — navigate with params
            window.location.href = `${targetPage}?${params.toString()}`;
        }
    }

    /* ── Keyboard navigation ── */
    function updateActiveItem() {
        resultsPanel.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.classList.toggle('active', i === activeIndex);
            if (i === activeIndex) {
                el.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    /* ── Event: input with debounce ── */
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const val = input.value;
        clearBtn.classList.toggle('visible', val.length > 0);
        debounceTimer = setTimeout(() => renderResults(val), 150);
    });

    /* ── Event: keyboard navigation ── */
    input.addEventListener('keydown', e => {
        const items = resultsPanel.querySelectorAll('.search-result-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            updateActiveItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            updateActiveItem();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) {
                navigateToResult(activeIndex);
            } else if (items.length > 0) {
                navigateToResult(0);
            }
        } else if (e.key === 'Escape') {
            resultsPanel.classList.remove('visible');
            input.blur();
        }
    });

    /* ── Event: click on result ── */
    resultsPanel.addEventListener('click', e => {
        const item = e.target.closest('.search-result-item');
        if (item) {
            const idx = parseInt(item.dataset.idx, 10);
            navigateToResult(idx);
        }
    });

    /* ── Event: clear button ── */
    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('visible');
        resultsPanel.classList.remove('visible');
        currentResults = [];
        activeIndex = -1;
        input.focus();
    });

    /* ── Event: click outside to close ── */
    document.addEventListener('click', e => {
        const searchEl = document.getElementById('globalSearch');
        if (searchEl && !searchEl.contains(e.target)) {
            resultsPanel.classList.remove('visible');
        }
    });

    /* ── Event: Ctrl+K / Cmd+K shortcut to focus search ── */
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
            input.select();
        }
    });

    /* ── Event: focus shows results if there's a query ── */
    input.addEventListener('focus', () => {
        if (input.value.trim()) {
            renderResults(input.value);
        }
    });

    /* ─────────────────────────────────
     *  Check for ?highlight= on load
     * ───────────────────────────────── */
    const urlParams = new URLSearchParams(window.location.search);
    const highlightKey = urlParams.get('highlight');
    const highlightType = urlParams.get('type');
    const highlightIdx = urlParams.get('idx');

    if (highlightKey) {
        // Fill the search bar with the search term
        input.value = highlightKey;
        clearBtn.classList.add('visible');

        // Delay slightly to let the page render fully
        setTimeout(() => {
            highlightOnCurrentPage(highlightType, highlightKey, highlightIdx !== '' ? parseInt(highlightIdx, 10) : null);
        }, 300);
    }
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *  HIGHLIGHT ON CURRENT PAGE
 *  Finds the matching element, scrolls to it,
 *  opens it (if collapsible), and applies a
 *  pulsing highlight animation.
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function highlightOnCurrentPage(type, key, idx) {
    const currentPage = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) || 'p1.html';

    let targetEl = null;

    /* ── INDEX2: Opportunity Cards ── */
    if (currentPage === 'p2.html' && (type === 'opportunity')) {
        const cards = document.querySelectorAll('.opp-card');
        // Try to find by index first, then by title text
        if (idx != null && cards[idx]) {
            targetEl = cards[idx];
        } else {
            cards.forEach(card => {
                const title = card.querySelector('.opp-title');
                if (title && title.textContent.includes(key)) {
                    targetEl = card;
                }
            });
        }
        if (targetEl) {
            // Open the card so details are visible
            if (!targetEl.classList.contains('open')) {
                targetEl.classList.add('open');
            }
        }
    }

    /* ── INDEX4: Recruiter Rows ── */
    else if (currentPage === 'p4.html' && type === 'recruiter') {
        const rows = document.querySelectorAll('.rec-row');
        if (idx != null && rows[idx]) {
            targetEl = rows[idx];
        } else {
            rows.forEach(row => {
                if (row.textContent.includes(key)) {
                    targetEl = row;
                }
            });
        }
        if (targetEl) {
            // Also open the profile panel for this recruiter
            const i = targetEl.dataset.i;
            const profilePanel = document.querySelector(`.profile-panel[data-i="${i}"]`);
            if (profilePanel && !profilePanel.classList.contains('open')) {
                profilePanel.classList.add('open');
                // Rotate the chevron
                const chev = targetEl.querySelector('.btn-profile .chev');
                if (chev) chev.style.transform = 'rotate(180deg)';
            }
        }
    }

    /* ── INDEX1: Dashboard — drives, submissions, stakeholders ── */
    else if (currentPage === 'p1.html') {
        if (type === 'drive') {
            const driveRows = document.querySelectorAll('.drive-row');
            if (idx != null && driveRows[idx]) {
                targetEl = driveRows[idx];
            } else {
                driveRows.forEach(row => {
                    if (row.textContent.includes(key)) targetEl = row;
                });
            }
        } else {
            // Search in list rows (submissions) or anywhere on the page
            const allRows = document.querySelectorAll('.list-row, .drive-row, .stake-row, .interview-row');
            allRows.forEach(row => {
                if (row.textContent.includes(key)) targetEl = row;
            });
        }
    }

    /* ── INDEX3: Statistics — table rows, stat cards ── */
    else if (currentPage === 'p3.html') {
        const tableRows = document.querySelectorAll('.summary-table tbody tr');
        tableRows.forEach(row => {
            if (row.textContent.includes(key)) targetEl = row;
        });
        if (!targetEl) {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                if (card.textContent.includes(key)) targetEl = card;
            });
        }
    }

    /* ── PAGE type: just scroll to main content top ── */
    if (type === 'page') {
        const main = document.getElementById('mainContent');
        if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }

    /* ── SCROLL & HIGHLIGHT ── */
    if (targetEl) {
        // Scroll smoothly into view
        setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Apply the highlight pulse animation
        setTimeout(() => {
            targetEl.classList.add('search-highlight');
            // Remove after animation completes
            setTimeout(() => {
                targetEl.classList.remove('search-highlight');
            }, 2800);
        }, 400);
    }
}


/* ── Inject highlight animation CSS ── */
(function injectHighlightCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes searchHighlightPulse {
            0%   { box-shadow: 0 0 0 0 rgba(152, 16, 250, 0.5); }
            25%  { box-shadow: 0 0 0 8px rgba(152, 16, 250, 0.25); }
            50%  { box-shadow: 0 0 0 4px rgba(152, 16, 250, 0.35); }
            75%  { box-shadow: 0 0 0 8px rgba(152, 16, 250, 0.15); }
            100% { box-shadow: 0 0 0 0 rgba(152, 16, 250, 0); }
        }
        .search-highlight {
            animation: searchHighlightPulse 1.4s ease-in-out 2;
            outline: 2.5px solid #9810fa;
            outline-offset: 4px;
            border-radius: 12px;
            position: relative;
            z-index: 2;
            transition: outline-color 0.3s;
        }
        .search-highlight::after {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 16px;
            background: rgba(152, 16, 250, 0.04);
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
})();


/* ── Auto-initialize when DOM is ready ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initGlobalSearch, 0));
} else {
    setTimeout(initGlobalSearch, 0);
}

/* â•â•â• notifications.js — Global Notification Panel (shared across all pages) â•â•â• */

/**
 * Builds and injects a notification dropdown panel into the header bell icon.
 * Reads from MOCK.notifications, supports mark-as-read, mark-all-read,
 * and navigates to the relevant page on click.
 */
function initNotifications() {
    const header = document.getElementById('header');
    if (!header) return;

    const bell = header.querySelector('.header-bell');
    if (!bell) return;

    const notifications = MOCK.notifications;
    if (!notifications) return;

    /* ── SVG icons for notification types ── */
    const typeIcons = {
        warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        recruiter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9810fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`
    };

    const typeBgColors = {
        warning: '#fef3c7',
        success: '#dcfce7',
        info: '#dbeafe',
        recruiter: '#f3e8ff'
    };

    /* ── Wrap bell in a positioning container ── */
    const wrapper = document.createElement('div');
    wrapper.className = 'notif-wrapper';
    wrapper.id = 'notifWrapper';
    bell.parentNode.insertBefore(wrapper, bell);
    wrapper.appendChild(bell);

    /* ── Create notification panel ── */
    const panel = document.createElement('div');
    panel.className = 'notif-panel';
    panel.id = 'notifPanel';
    wrapper.appendChild(panel);

    /* ── Render notifications ── */
    function getUnreadCount() {
        return notifications.filter(n => !n.read).length;
    }

    function updateBadge() {
        const count = getUnreadCount();
        let badge = bell.querySelector('.bell-badge');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'bell-badge';
                bell.appendChild(badge);
            }
            badge.textContent = count;
            badge.style.display = 'flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    }

    function renderPanel() {
        const unread = notifications.filter(n => !n.read);
        const read = notifications.filter(n => n.read);
        const unreadCount = unread.length;

        let html = `
            <div class="notif-header">
                <h3>Notifications</h3>
                <div class="notif-header-actions">
                    ${unreadCount > 0 ? `<button class="notif-mark-all" id="markAllRead">Mark all read</button>` : ''}
                </div>
            </div>
            <div class="notif-body">`;

        if (notifications.length === 0) {
            html += `
                <div class="notif-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <p>No notifications</p>
                </div>`;
        } else {
            if (unread.length > 0) {
                html += `<div class="notif-section-label">New</div>`;
                unread.forEach(n => {
                    html += renderNotifItem(n);
                });
            }
            if (read.length > 0) {
                html += `<div class="notif-section-label">Earlier</div>`;
                read.forEach(n => {
                    html += renderNotifItem(n);
                });
            }
        }

        html += `</div>`;
        panel.innerHTML = html;

        /* Bind mark-all-read */
        const markAllBtn = document.getElementById('markAllRead');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', e => {
                e.stopPropagation();
                notifications.forEach(n => n.read = true);
                updateBadge();
                renderPanel();
            });
        }
    }

    function renderNotifItem(n) {
        const icon = typeIcons[n.type] || typeIcons.info;
        const bg = typeBgColors[n.type] || typeBgColors.info;
        return `
            <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}" data-href="${n.href}">
                <div class="notif-icon" style="background:${bg}">${icon}</div>
                <div class="notif-content">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-message">${n.message}</div>
                    <div class="notif-time">${n.time}</div>
                </div>
                ${!n.read ? '<div class="notif-dot"></div>' : ''}
            </div>`;
    }

    /* ── Toggle panel on bell click ── */
    bell.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('visible');
        /* Close search results if open */
        const searchResults = document.getElementById('searchResults');
        if (searchResults) searchResults.classList.remove('visible');

        if (isOpen) {
            panel.classList.remove('visible');
        } else {
            renderPanel();
            panel.classList.add('visible');
        }
    });

    /* ── Click on notification item ── */
    panel.addEventListener('click', e => {
        const item = e.target.closest('.notif-item');
        if (!item) return;

        const id = parseInt(item.dataset.id, 10);
        const href = item.dataset.href;

        /* Mark as read */
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        updateBadge();

        /* Build highlight URL params */
        if (href && notif) {
            const params = new URLSearchParams();
            if (notif.highlight) params.set('highlight', notif.highlight);
            if (notif.highlightType) params.set('type', notif.highlightType);
            if (notif.highlightIdx != null) params.set('idx', notif.highlightIdx);

            const currentPage = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) || 'p1.html';

            if (currentPage === href && notif.highlight) {
                /* Same page — close panel and highlight directly */
                panel.classList.remove('visible');
                if (typeof highlightOnCurrentPage === 'function') {
                    highlightOnCurrentPage(notif.highlightType, notif.highlight, notif.highlightIdx);
                }
                history.replaceState(null, '', `${href}?${params.toString()}`);
            } else {
                /* Different page — navigate with params */
                const paramStr = params.toString();
                window.location.href = paramStr ? `${href}?${paramStr}` : href;
            }
        }
    });

    /* ── Click outside to close ── */
    document.addEventListener('click', e => {
        if (!wrapper.contains(e.target)) {
            panel.classList.remove('visible');
        }
    });

    /* ── Close panel when search is focused ── */
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            panel.classList.remove('visible');
        });
    }

    /* ── Initial badge update ── */
    updateBadge();
}


/* ── Inject notification CSS ── */
(function injectNotifCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* ── Notification Wrapper ── */
        .notif-wrapper {
            position: relative;
        }

        /* ── Notification Panel ── */
        .notif-panel {
            position: absolute;
            top: calc(100% + 12px);
            right: 0;
            width: 400px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);
            z-index: 200;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px) scale(0.97);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
        }
        .notif-panel.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        /* ── Panel Header ── */
        .notif-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 20px 14px;
            border-bottom: 1px solid #f3f4f6;
        }
        .notif-header h3 {
            font-weight: 600;
            font-size: 16px;
            color: #1e2939;
            margin: 0;
        }
        .notif-header-actions {
            display: flex;
            gap: 8px;
        }
        .notif-mark-all {
            all: unset;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 500;
            color: #9810fa;
            cursor: pointer;
            padding: 4px 10px;
            border-radius: 6px;
            transition: background 0.15s;
        }
        .notif-mark-all:hover {
            background: #f3e8ff;
        }

        /* ── Panel Body ── */
        .notif-body {
            max-height: 420px;
            overflow-y: auto;
        }
        .notif-body::-webkit-scrollbar { width: 5px; }
        .notif-body::-webkit-scrollbar-track { background: transparent; }
        .notif-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        .notif-body::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

        /* ── Section Labels ── */
        .notif-section-label {
            padding: 10px 20px 6px;
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f9fafb;
            border-bottom: 1px solid #f3f4f6;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        /* ── Notification Item ── */
        .notif-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 20px;
            cursor: pointer;
            transition: background 0.15s;
            border-bottom: 1px solid #f9fafb;
            position: relative;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #f9fafb; }
        .notif-item.unread { background: #faf5ff; }
        .notif-item.unread:hover { background: #f3e8ff; }

        /* ── Icon ── */
        .notif-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        /* ── Content ── */
        .notif-content {
            flex: 1;
            min-width: 0;
        }
        .notif-title {
            font-weight: 600;
            font-size: 13px;
            color: #1e2939;
            line-height: 1.3;
        }
        .notif-item.read .notif-title {
            font-weight: 500;
            color: #4a5565;
        }
        .notif-message {
            font-size: 12.5px;
            color: #6b7280;
            line-height: 1.4;
            margin-top: 2px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .notif-time {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 4px;
            font-weight: 500;
        }

        /* ── Unread Dot ── */
        .notif-dot {
            width: 8px;
            height: 8px;
            background: #9810fa;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 6px;
            box-shadow: 0 0 0 3px rgba(152, 16, 250, 0.15);
        }

        /* ── Empty State ── */
        .notif-empty {
            padding: 40px 20px;
            text-align: center;
        }
        .notif-empty svg {
            display: block;
            margin: 0 auto 12px;
        }
        .notif-empty p {
            color: #9ca3af;
            font-size: 14px;
            margin: 0;
        }

        /* ── Bell hover effect ── */
        .header-bell {
            transition: transform 0.2s;
        }
        .header-bell:hover {
            transform: scale(1.1);
        }
        .header-bell:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
})();


/* ── Auto-initialize when DOM is ready ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initNotifications, 10));
} else {
    setTimeout(initNotifications, 10);
}




/* ═══ profile.js — SPA Profile View ═══ */

/* ── Toggle header dropdown ── */
function toggleProfileDropdown(e) {
    e.stopPropagation();
    const dd = document.getElementById('profileDropdown');
    if (!dd) return;
    dd.classList.toggle('open');
}

/* Close dropdown when clicking outside */
document.addEventListener('click', function (e) {
    const dd = document.getElementById('profileDropdown');
    const profile = document.getElementById('headerProfile');
    if (!dd || !profile) return;
    if (!profile.contains(e.target) && !e.target.closest('.sidebar-user')) {
        dd.classList.remove('open');
    }
});

/* Close dropdown on Escape */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const dd = document.getElementById('profileDropdown');
        if (dd) dd.classList.remove('open');
    }
});


/* ═══════════════════════════════════════════
 *  SPA PROFILE RENDERING
 * ═══════════════════════════════════════════ */

const achieveIcons = {
    trophy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V16.174a7.91 7.91 0 0 1-2.573-2.746A7.977 7.977 0 0 1 6 9V4h12v5a7.977 7.977 0 0 1-1.427 4.428A7.91 7.91 0 0 1 14 16.174V22"/></svg>`,
    chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    handshake: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    book: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
};

let isProfileRendered = false;

function renderProfilePage() {
    const container = document.getElementById('profileContent');
    if (!container || isProfileRendered) return;

    const u = (typeof MOCK !== 'undefined') ? MOCK.user : {};

    const eduHTML = (u.education || []).map(ed => `
        <div class="pm-edu-item">
            <div class="pm-edu-dot"></div>
            <div>
                <div class="pm-edu-degree">${ed.degree}</div>
                <div class="pm-edu-inst">${ed.institution} · ${ed.year}</div>
            </div>
        </div>`).join('');

    const skillsHTML = (u.skills || []).map(s => `<span class="pm-skill">${s}</span>`).join('');

    const achieveHTML = (u.achievements || []).map(a => `
        <div class="pm-achieve-card">
            <div class="pm-achieve-icon">${achieveIcons[a.icon] || achieveIcons.trophy}</div>
            <div>
                <div class="pm-achieve-title">${a.title}</div>
                <div class="pm-achieve-desc">${a.desc}</div>
            </div>
        </div>`).join('');

    const act = u.activity || {};
    const actItems = [
        { label: 'Drives Managed', value: act.drivesManaged, color: '#7c3aed' },
        { label: 'Students Placed', value: act.studentsPlaced, color: '#10b981' },
        { label: 'Recruiters Onboarded', value: act.recruitersOnboarded, color: '#3b82f6' },
        { label: 'Workshops', value: act.workshopsConducted, color: '#f59e0b' },
        { label: 'Avg Response', value: act.avgResponseTime, color: '#ec4899' },
        { label: 'Satisfaction', value: act.satisfactionScore, color: '#06b6d4' }
    ];
    const actHTML = actItems.map(a => `
        <div class="pm-stat-item">
            <div class="pm-stat-value" style="color:${a.color}">${a.value}</div>
            <div class="pm-stat-label">${a.label}</div>
        </div>`).join('');

    container.innerHTML = `
        <div class="hero-card" style="margin-bottom: 24px;">
            <div class="pm-header fade-in">
                <div class="pm-avatar">${u.initials || 'RN'}</div>
                <div class="pm-header-info">
                    <h2 class="pm-name">${u.name || 'Dr. Rajesh Nair'}</h2>
                    <div class="pm-role-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        ${u.role || 'Placement Officer'}
                    </div>
                </div>
            </div>
            <div class="pm-bio fade-in" style="animation-delay: 0.1s;">${u.bio || ''}</div>
        </div>

        <div class="panels-row fade-in" style="animation-delay: 0.2s;">
            <div class="panel">
                <div class="panel-header"><h3>Personal Information</h3></div>
                <div class="panel-body">
                    <div class="pm-info-grid">
                        <div class="pm-info-item"><div class="pm-info-label">Email</div><div class="pm-info-value">${u.email || ''}</div></div>
                        <div class="pm-info-item"><div class="pm-info-label">Phone</div><div class="pm-info-value">${u.phone || ''}</div></div>
                        <div class="pm-info-item"><div class="pm-info-label">Institution</div><div class="pm-info-value">${u.institution || ''}</div></div>
                        <div class="pm-info-item"><div class="pm-info-label">Department</div><div class="pm-info-value">${u.department || ''}</div></div>
                        <div class="pm-info-item"><div class="pm-info-label">Location</div><div class="pm-info-value">${u.location || ''}</div></div>
                        <div class="pm-info-item"><div class="pm-info-label">Employee ID</div><div class="pm-info-value">${u.employeeId || ''}</div></div>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="panel-header"><h3>Activity Overview</h3></div>
                <div class="panel-body">
                    <div class="pm-stats-grid">${actHTML}</div>
                </div>
            </div>
        </div>

        <div class="panels-row fade-in" style="animation-delay: 0.3s;">
            <div class="panel" style="flex: 2;">
                <div class="panel-header"><h3>Education</h3></div>
                <div class="panel-body">
                    <div class="pm-edu-timeline">${eduHTML}</div>
                </div>
                <div class="panel-header" style="border-top: 1px solid #f3f4f6; padding-top: 20px;"><h3>Achievements</h3></div>
                <div class="panel-body">
                    <div class="pm-achieve-list">${achieveHTML}</div>
                </div>
            </div>

            <div class="panel" style="flex: 1;">
                <div class="panel-header"><h3>Skills & Expertise</h3></div>
                <div class="panel-body">
                    <div class="pm-skills-wrap">${skillsHTML}</div>
                </div>
                ${u.social ? `
                <div class="panel-header" style="border-top: 1px solid #f3f4f6; padding-top: 20px;"><h3>Links</h3></div>
                <div class="panel-body">
                    <div class="pm-social-row" style="flex-direction: column;">
                        <a class="pm-social-link" href="https://${u.social.linkedin}" target="_blank">LinkedIn</a>
                        <a class="pm-social-link" href="https://${u.social.website}" target="_blank">Website</a>
                    </div>
                </div>` : ''}
            </div>
        </div>
    `;

    injectProfilePageCSS();
    isProfileRendered = true;
}

function toggleProfileView(showProfile) {
    const mainContent = document.getElementById('mainContent');
    const profileContent = document.getElementById('profileContent');
    
    if (!profileContent) return; // Feature not initialized correctly

    if (showProfile) {
        if (typeof isProfileRendered !== 'undefined' && !isProfileRendered && typeof renderProfilePage === 'function') { renderProfilePage(); }
        document.querySelector('.header-title').textContent = 'My Profile';
        if (mainContent) mainContent.style.display = 'none';
        profileContent.style.display = 'block';
        
        // Deselect sidebar nav items
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
    } else {
        // Find default page title logic based on file name roughly
        const pageTitle = {
            'p1.html': 'Dashboard',
            'p2.html': 'Review Opportunities',
            'p3.html': 'Statistics',
            'p4.html': 'Recruiter Management'
        }[window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'p1.html'] || 'Dashboard';
        
        document.querySelector('.header-title').textContent = pageTitle;
        if (mainContent) mainContent.style.display = 'block';
        profileContent.style.display = 'none';
    }
}


/* ═══════════════════════════════════════════
 *  INJECT PROFILE PAGE CSS
 * ═══════════════════════════════════════════ */
function injectProfilePageCSS() {
    if (document.getElementById('profilePageCSS')) return;
    const style = document.createElement('style');
    style.id = 'profilePageCSS';
    style.textContent = `
    .fade-in {
        opacity: 0;
        animation: fadeIn 0.4s ease forwards;
    }
    @keyframes fadeIn {
        to { opacity: 1; }
    }
    
    .pm-header { display: flex; align-items: center; gap: 20px; }
    .pm-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; font-weight: 700; font-size: 26px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 3px solid #e9d5ff; box-shadow: 0 4px 16px rgba(124,58,237,0.25); }
    .pm-header-info { flex: 1; }
    .pm-name { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }
    .pm-role-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; padding: 4px 12px; background: #f5f3ff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #7c3aed; }
    .pm-bio { font-size: 15px; line-height: 1.7; color: #4b5563; padding: 18px 24px; background: #f9fafb; border-radius: 12px; border-left: 3px solid #7c3aed; margin-top: 24px; }
    
    .pm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .pm-info-item { padding: 12px 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #f3f4f6; }
    .pm-info-label { font-size: 11px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }
    .pm-info-value { font-size: 14px; font-weight: 500; color: #1f2937; }
    
    .pm-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .pm-stat-item { text-align: center; padding: 16px 10px; background: #faf5ff; border-radius: 12px; border: 1px solid #f3e8ff; }
    .pm-stat-value { font-size: 22px; font-weight: 700; }
    .pm-stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; font-weight: 500; }
    
    .pm-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .pm-skill { display: inline-flex; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; background: #f5f3ff; color: #7c3aed; border: 1px solid #e9d5ff; transition: all 0.2s; }
    .pm-skill:hover { background: #ede9fe; transform: translateY(-1px); }
    
    .pm-edu-timeline { display: flex; flex-direction: column; gap: 0; padding-left: 12px; border-left: 2px solid #e9d5ff; }
    .pm-edu-item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; position: relative; }
    .pm-edu-dot { width: 12px; height: 12px; border-radius: 50%; background: #7c3aed; border: 2px solid #fff; box-shadow: 0 0 0 2px #e9d5ff; flex-shrink: 0; margin-top: 4px; margin-left: -19px; }
    .pm-edu-degree { font-size: 14px; font-weight: 600; color: #1f2937; }
    .pm-edu-inst { font-size: 13px; color: #6b7280; margin-top: 2px; }
    
    .pm-achieve-list { display: flex; flex-direction: column; gap: 10px; }
    .pm-achieve-card { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6; transition: all 0.2s; }
    .pm-achieve-card:hover { border-color: #e9d5ff; background: #faf5ff; }
    .pm-achieve-icon { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #f3f4f6; }
    .pm-achieve-title { font-size: 14px; font-weight: 600; color: #1f2937; }
    .pm-achieve-desc { font-size: 13px; color: #6b7280; margin-top: 2px; line-height: 1.5; }
    
    .pm-social-row { display: flex; gap: 12px; }
    .pm-social-link { display: inline-flex; justify-content: center; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; color: #7c3aed; background: #f5f3ff; border: 1px solid #e9d5ff; text-decoration: none; transition: all 0.2s; }
    .pm-social-link:hover { background: #ede9fe; transform: translateY(-1px); }
    `;
    document.head.appendChild(style);
}

/* ═══════════════════════════════════════════
 *  WIRE UP "My Profile" CLICK
 * ═══════════════════════════════════════════ */
function wireProfileLinks() {
    document.querySelectorAll('.profile-dd-item').forEach(item => {
        if (item.textContent.trim().startsWith('My Profile')) {
            item.style.cursor = 'pointer';
            item.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleProfileView(true);
                // Also close the dropdown
                const dd = document.getElementById('profileDropdown');
                if (dd) dd.classList.remove('open');
            };
        }
    });
}

// Ensure clicking sidebar links switches back to main content if we stay on same page
function wireSidebarLinksForSPA() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        // Remove hardcoded onclick to avoid page reload conflict
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            const targetMatch = onclickAttr.match(/location\.href='([^']+)'/);
            if (targetMatch && targetMatch[1]) {
                item.setAttribute('data-target', targetMatch[1]);
                item.removeAttribute('onclick');
            }
        }
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetFile = this.getAttribute('data-target');
            if (!targetFile) return;
            
            const currentFile = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'p1.html';
            
            if (targetFile === currentFile) {
                // Return to Dashboard View instantly without reloading
                toggleProfileView(false);
                document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            } else {
                // Navigate to the different page
                window.location.href = targetFile;
            }
        });
    });
}

const headerEl = document.getElementById('header');
if (headerEl) {
    const obs = new MutationObserver(() => {
        wireProfileLinks();
    });
    obs.observe(headerEl, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(wireProfileLinks, 100);
        setTimeout(wireSidebarLinksForSPA, 100);
    });
} else {
    setTimeout(wireProfileLinks, 100);
    setTimeout(wireSidebarLinksForSPA, 100);
}

