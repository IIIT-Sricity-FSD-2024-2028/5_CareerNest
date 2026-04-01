const R = MOCK.recruiters;
const RS = MOCK.recruiterStats;

const bellBadge4 = document.getElementById('bellBadge');
if (bellBadge4) bellBadge4.textContent = RS.pending;

const ico = (d,
    c = '#9810fa') => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const mailIco = ico('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>');

const phoneIco = ico('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>');

const locIco = ico('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>');

const calIco = ico('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>');

const statIcons = ['<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'];

const statLabels = ['Total Recruiters', 'Active Recruiters', 'Pending Verification',
    'Declined Recruiters'];
const statKeys = ['total', 'active', 'pending', 'declined'];

function renderStats() {
    document.getElementById('statsRow').innerHTML = statKeys.map((k,
        j) => `<div class="stat-card"><div class="stat-data"><div class="stat-label">${statLabels[j]}</div><div class="stat-value" id="stat-${k}">${RS[k]}</div></div>         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${statIcons[j]}</svg></div>`).join('');
}
function refreshStats() {
    statKeys.forEach(k => {
        const el = document.getElementById('stat-' + k); if (el) el.textContent = RS[k];
    });

    const alertEl = document.getElementById('alertText');
    if (alertEl) alertEl.innerHTML = RS.pending > 0 ? `<strong>${RS.pending} recruiter${RS.pending > 1 ? 's' : ''}</strong> awaiting verification. Review and approve pending recruiters to activate them on the portal.` : `<strong>All recruiters verified!</strong> No pending verifications.`;
}
renderStats();
refreshStats();

function buildRows(data) {
    return data.map((r, i) => {
        const init = r.name[0];
        const isPending = r.status === 'pending';
        const badgeCls = isPending ? 'badge-pending' : 'badge-active';
        const badgeTxt = isPending ? 'Pending' : 'Active';
        const verifyBtn = isPending ? `<button class="btn-verify" data-i="${i}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Verify</button>` : '';


        return `<tr class="rec-row" data-i="${i}">             <td><div class="rec-name"><div class="rec-avatar">${init}</div><span>${r.name}</span></div></td>             <td>${r.company}</td><td>${r.role}</td><td>${r.opps} opportunity</td>             <td><span class="badge-status ${badgeCls}">${badgeTxt}</span></td>             <td><div class="action-btns"><button class="btn-profile" data-i="${i}">View Profile <span class="chev">▼</span></button>${verifyBtn}</div></td>         </tr>         <tr class="profile-panel" data-i="${i}"><td colspan="6"><div class="profile-inner"><h4>Profile Details</h4>             <div class="profile-grid">                 <div class="profile-col">                     <div class="profile-item">${mailIco}<div><div class="profile-lbl">Email</div><div class="profile-val">${r.email}</div></div></div>                     <div class="profile-item">${phoneIco}<div><div class="profile-lbl">Phone</div><div class="profile-val">${r.phone}</div></div></div>                     <div class="profile-item">${locIco}<div><div class="profile-lbl">Location</div><div class="profile-val">${r.location}</div></div></div>                     <div class="profile-item">${calIco}<div><div class="profile-lbl">Join Date</div><div class="profile-val">${r.joined}</div></div></div>                 </div>                 <div class="profile-bio"><div class="profile-bio-lbl">Bio</div><p>${r.bio}</p></div>             </div>         </div></td></tr>` + (isPending ? `<tr class="verify-panel" data-i="${i}"><td colspan="6"><div class="verify-inner">             <div class="verify-head"><h4><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Verify Recruiter</h4><button class="close-btn" data-close="verify" data-i="${i}">&times;</button></div>             <div class="verify-grid">                 <div class="verify-left">                     <div class="cred-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>                         <div><div class="cred-title">Login Credentials Ready</div><div class="cred-desc">Credentials will be sent to <strong>${r.email}</strong> upon approval.</div></div></div>                     <div class="verify-person"><div class="rec-avatar">${init}</div><div><div class="verify-person-name">${r.name}</div><div class="verify-person-role">${r.role} at ${r.company}</div></div></div>                 </div>                 <div class="verify-right">                     <p class="verify-desc">Review the recruiter's application and decide whether to approve or decline their access to the placement portal.</p>                     <div class="verify-note"><strong>Note:</strong> Approving will grant full recruiter access and send login credentials immediately.</div>                     <div class="verify-actions"><button class="btn-approve" data-i="${i}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Approve &amp; Send Credentials</button>                     <button class="btn-decline" data-i="${i}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Decline</button></div>                 </div>             </div>         </div></td></tr>         <tr class="decline-panel" data-i="${i}"><td colspan="6"><div class="decline-inner">             <div class="decline-head"><h4><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Decline Application</h4><button class="close-btn" data-close="decline" data-i="${i}">&times;</button></div>             <div class="decline-warn"><strong>Warning:</strong> You are about to decline <strong>${r.name}</strong>'s application.</div>             <label class="decline-label">Remarks / Reason for Decline <span class="decline-req">*</span> <span style="font-weight:normal;font-size:12px;color:#6b7280;">(at least 10 words)</span></label>             <textarea class="decline-textarea" placeholder="Enter reason for declining..."></textarea>             <div class="decline-error" style="color:#ef4444; font-size:12px; margin-top:-10px; margin-bottom:14px; display:none;">Remarks / Reason for Decline must be at least 10 words.</div>             <div class="decline-btns"><button class="decline-cancel-btn" data-i="${i}">Cancel</button><button class="decline-confirm-btn" data-i="${i}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Confirm Decline</button></div>         </div></td></tr>` : '');
    }).join('');
}

const tbody = document.getElementById('recBody');
tbody.innerHTML = buildRows(R);

const closeAll = (exceptIdx,
    exceptType) => {
    document.querySelectorAll('.profile-panel, .verify-panel, .decline-panel').forEach(p => {
        if (p.dataset.i != exceptIdx || !p.classList.contains(exceptType + '-panel'))
            p.classList.remove('open');
    });
    document.querySelectorAll('.btn-profile .chev').forEach(c => c.style.transform = '');
};

tbody.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const i = btn.dataset.i;

    if (btn.classList.contains('btn-profile')) {
        closeAll(i, 'profile');
        const panel = tbody.querySelector(`.profile-panel[data-i="${i}"]`);
        panel.classList.toggle('open');
        btn.querySelector('.chev').style.transform = panel.classList.contains('open') ? 'rotate(180deg)' : '';
    }
    else if (btn.classList.contains('btn-verify')) {
        closeAll(i, 'verify');
        tbody.querySelector(`.verify-panel[data-i="${i}"]`)?.classList.toggle('open');
    }
    else if (btn.classList.contains('btn-approve')) {
        const row = tbody.querySelector(`.rec-row[data-i="${i}"]`);

        const badge = row.querySelector('.badge-status');
        badge.className = 'badge-status badge-active'; badge.textContent = 'Active';
        row.querySelector('.btn-verify')?.remove();
        tbody.querySelector(`.verify-panel[data-i="${i}"]`)?.remove();
        tbody.querySelector(`.decline-panel[data-i="${i}"]`)?.remove();
        RS.pending--; RS.active++;
        refreshStats();
    }
    else if (btn.classList.contains('btn-decline')) {
        tbody.querySelector(`.verify-panel[data-i="${i}"]`)?.classList.remove('open');

        tbody.querySelector(`.decline-panel[data-i="${i}"]`)?.classList.add('open');
    }
    else if (btn.dataset.close === 'verify') {
        tbody.querySelector(`.verify-panel[data-i="${i}"]`)?.classList.remove('open');
    }
    else if (btn.dataset.close === 'decline' || btn.classList.contains('decline-cancel-btn')) {
        tbody.querySelector(`.decline-panel[data-i="${i}"]`)?.classList.remove('open');
    }
    else if (btn.classList.contains('decline-confirm-btn')) {
        const declinePanel = tbody.querySelector(`.decline-panel[data-i="${i}"]`);
        const textarea = declinePanel.querySelector('.decline-textarea');
        const remarks = textarea.value.trim();
        const wordCount = remarks.split(/\s+/).filter(w => w.length > 0).length;
        
        if (wordCount < 10) {
            textarea.style.borderColor = '#ef4444';
            const err = declinePanel.querySelector('.decline-error');
            if (err) err.style.display = 'block';
            return;
        }
        const err = declinePanel.querySelector('.decline-error');
        if (err) err.style.display = 'none';
        textarea.style.borderColor = '#d1d5db';

        const row = tbody.querySelector(`.rec-row[data-i="${i}"]`);

        RS.pending--; RS.total--; RS.declined++;
        refreshStats();
        [row,
            ...tbody.querySelectorAll(`[data-i="${i}"]:not(.rec-row)`)].forEach(el => {
                el.style.transition = 'opacity .4s'; el.style.opacity = '0';
                setTimeout(() => el.remove(), 400);
            });
    }
});

document.getElementById('searchInput').addEventListener('input',
    function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.rec-row').forEach(row => {
            const match = row.textContent.toLowerCase().includes(q);
            row.style.display = match ? '' : 'none';
            const i = row.dataset.i;
            document.querySelectorAll(`[data-i="${i}"]:not(.rec-row)`).forEach(p => p.style.display = match ? '' : 'none');
        });
    });

document.getElementById('viewRecruitersBtn').addEventListener('click',
    () => document.getElementById('recruiterTable').scrollIntoView({
        behavior: 'smooth'
    }));


function initGlobalSearch() {
    const header = document.getElementById('header');
    if (!header) return;

    const searchIconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

    const clearIconSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    const noResultsSVG = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;


    const existingTitle = header.querySelector('.header-title');
    const existingBell = header.querySelector('.header-bell');
    const existingProfile = header.querySelector('.header-profile');

    const titleHTML = existingTitle ? existingTitle.outerHTML : '';
    const bellHTML = existingBell ? existingBell.outerHTML : '';
    const profileHTML = existingProfile ? existingProfile.outerHTML : '';

    header.innerHTML = `         ${titleHTML}         <div class="header-actions">             <div class="header-search" id="globalSearch">                 <input class="header-search-input" id="globalSearchInput" type="text"                        placeholder="Search opportunities, recruiters, pages..."                        autocomplete="off" spellcheck="false">                 <div class="header-search-icon">${searchIconSVG}</div>                 <button class="header-search-clear" id="globalSearchClear" title="Clear search">${clearIconSVG}</button>                 <div class="search-results" id="searchResults"></div>             </div>             ${bellHTML}             ${profileHTML}         </div>`;


    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClear');
    const resultsPanel = document.getElementById('searchResults');

    let activeIndex = -1;
    let currentResults = [];
    let debounceTimer = null;

    function getSearchableItems() {
        const items = [];

        if (MOCK.submissions) {
            MOCK.submissions.forEach((sub,
                i) => {
                    items.push({
                        type: 'opportunity', title: sub.title,
                        subtitle: `${sub.company} • ${sub.location} • ${sub.pkg}`,
                        avatar: sub.avatar, avatarBg: sub.avatarBg, status: sub.status,
                        href: 'p2.html', matchKey: sub.title,
                        // used to find the element on the target page
                        matchIndex: i,
                        searchText: `${sub.title} ${sub.company} ${sub.location} ${sub.type} ${sub.status} ${sub.submitter}`.toLowerCase()
                    });
            });
        }

        if (MOCK.recruiters) {
            MOCK.recruiters.forEach((rec,
                i) => {
                    items.push({
                        type: 'recruiter', title: rec.name,
                        subtitle: `${rec.company} • ${rec.role}`, avatar: rec.name[0],
                        avatarBg: '#9810fa', status: rec.status, href: 'p4.html',
                        matchKey: rec.name, matchIndex: i,
                        searchText: `${rec.name} ${rec.company} ${rec.role} ${rec.status} ${rec.location} ${rec.email}`.toLowerCase()
                    });
            });
        }

        if (MOCK.nav) {
            const pageLetters = ['D', 'O', 'S', 'R']; const pageBgs = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b'];
            MOCK.nav.forEach((page, i) => {
                items.push({
                    type: 'page', title: page.label,
                    subtitle: `Navigate to ${page.label}`, avatar: pageLetters[i] || 'P',
                    avatarBg: pageBgs[i] || '#10b981', isEmoji: false, href: page.href,
                    matchKey: page.label, matchIndex: i,
                    searchText: `${page.label} page navigate`.toLowerCase()
                });
            });
        }

        if (MOCK.drives) {
            MOCK.drives.forEach((d, i) => {
                items.push({
                    type: 'drive',
                    title: `${d.company} — ${d.role}`, subtitle: d.badge, avatar: d.company[0],
                    avatarBg: '#7c3aed', href: 'p1.html', matchKey: d.company,
                    matchIndex: i,
                    searchText: `${d.company} ${d.role} ${d.badge} drive`.toLowerCase()
                });
            });
        }

        return items;
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
            'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

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
            resultsPanel.innerHTML = `                 <div class="search-no-results">                     ${noResultsSVG}                     <div>No results found for "<strong>${highlightMatch(query, query)}</strong>"</div>                     <div style="font-size:12px;margin-top:4px;">Try searching for opportunities, recruiters, or pages</div>                 </div>`;

            resultsPanel.classList.add('visible');
            return;
        }

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

                const avatarContent = item.isEmoji ? `<div class="search-result-avatar" style="background:#f0fdf4;font-size:18px;">${item.avatar}</div>` : `<div class="search-result-avatar" style="background:${item.avatarBg}">${item.avatar}</div>`;


                const badgeType = item.type === 'drive' ? 'opportunity' : item.type;

                html += `                     <div class="search-result-item" data-idx="${idx}" data-href="${item.href}">                         ${avatarContent}                         <div class="search-result-info">                             <div class="search-result-title">${highlightMatch(item.title, query)}</div>                             <div class="search-result-sub">${highlightMatch(item.subtitle, query)}</div>                         </div>                         <span class="search-result-badge ${badgeType}">${badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}</span>                     </div>`;
            });
        });

        currentResults = orderedResults;
        resultsPanel.innerHTML = html;
        resultsPanel.classList.add('visible');
    }

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

        const params = new URLSearchParams();
        params.set('highlight', item.matchKey || item.title);
        params.set('type', item.type);
        params.set('idx', item.matchIndex != null ? item.matchIndex : '');

        if (currentPage === targetPage) {
            resultsPanel.classList.remove('visible');
            input.blur();
            highlightOnCurrentPage(item.type, item.matchKey || item.title,
                item.matchIndex);
            history.replaceState(null, '', `${targetPage}?${params.toString()}`);
        } else { window.location.href = `${targetPage}?${params.toString()}`; }
    }

    function updateActiveItem() {
        resultsPanel.querySelectorAll('.search-result-item').forEach((el,
            i) => {
                el.classList.toggle('active', i === activeIndex);
            if (i === activeIndex) { el.scrollIntoView({ block: 'nearest' }); }
        });
    }

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const val = input.value;
        clearBtn.classList.toggle('visible', val.length > 0);
        debounceTimer = setTimeout(() => renderResults(val), 150);
    });

    input.addEventListener('keydown',
        e => {
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

    resultsPanel.addEventListener('click',
        e => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                const idx = parseInt(item.dataset.idx, 10);
                navigateToResult(idx);
            }
        });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('visible');
        resultsPanel.classList.remove('visible');
        currentResults = [];
        activeIndex = -1;
        input.focus();
    });

    document.addEventListener('click',
        e => {
            const searchEl = document.getElementById('globalSearch');
            if (searchEl && !searchEl.contains(e.target)) {
                resultsPanel.classList.remove('visible');
            }
        });

    document.addEventListener('keydown',
        e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }
        });

    input.addEventListener('focus',
        () => { if (input.value.trim()) { renderResults(input.value); } });

    const urlParams = new URLSearchParams(window.location.search);
    const highlightKey = urlParams.get('highlight');
    const highlightType = urlParams.get('type');
    const highlightIdx = urlParams.get('idx');

    if (highlightKey) {
        input.value = highlightKey;
        clearBtn.classList.add('visible');

        setTimeout(() => {
            highlightOnCurrentPage(highlightType, highlightKey,
                highlightIdx !== '' ? parseInt(highlightIdx, 10) : null);
        }, 300);
    }
}

function highlightOnCurrentPage(type, key,
    idx) {
    const currentPage = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) || 'p1.html';


    let targetEl = null;

    if (currentPage === 'p2.html' && (type === 'opportunity')) {
        const cards = document.querySelectorAll('.opp-card');

        if (idx != null && cards[idx]) {
            targetEl = cards[idx];
        } else {
            cards.forEach(card => {
                const title = card.querySelector('.opp-title');
                if (title && title.textContent.includes(key)) { targetEl = card; }
            });
        }
        if (targetEl) {
            if (!targetEl.classList.contains('open')) {
                targetEl.classList.add('open');
            }
        }
    }

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
            const i = targetEl.dataset.i;
            const profilePanel = document.querySelector(`.profile-panel[data-i="${i}"]`);
            if (profilePanel && !profilePanel.classList.contains('open')) {
                profilePanel.classList.add('open');

                const chev = targetEl.querySelector('.btn-profile .chev');
                if (chev) chev.style.transform = 'rotate(180deg)';
            }
        }
    }

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
            const allRows = document.querySelectorAll('.list-row, .drive-row, .stake-row, .interview-row');

            allRows.forEach(row => {
                if (row.textContent.includes(key)) targetEl = row;
            });
        }
    }

    else if (currentPage === 'p3.html') {
        const tableRows = document.querySelectorAll('.summary-table tbody tr');

        tableRows.forEach(row => { if (row.textContent.includes(key)) targetEl = row; });
        if (!targetEl) {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                if (card.textContent.includes(key)) targetEl = card;
            });
        }
    }

    if (type === 'page') {
        const main = document.getElementById('mainContent');
        if (main) { main.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        return;
    }

    if (targetEl) {
        setTimeout(() => {
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);

        setTimeout(() => {
            targetEl.classList.add('search-highlight');
            setTimeout(() => { targetEl.classList.remove('search-highlight'); }, 2800);
        },
            400);
    }
}

(function injectHighlightCSS() {
    const style = document.createElement('style');
    style.textContent = `         @keyframes searchHighlightPulse {             0%   { box-shadow: 0 0 0 0 rgba(152, 16, 250, 0.5); }             25%  { box-shadow: 0 0 0 8px rgba(152, 16, 250, 0.25); }             50%  { box-shadow: 0 0 0 4px rgba(152, 16, 250, 0.35); }             75%  { box-shadow: 0 0 0 8px rgba(152, 16, 250, 0.15); }             100% { box-shadow: 0 0 0 0 rgba(152, 16, 250, 0); }         }         .search-highlight {             animation: searchHighlightPulse 1.4s ease-in-out 2;             outline: 2.5px solid #9810fa;             outline-offset: 4px;             border-radius: 12px;             position: relative;             z-index: 2;             transition: outline-color 0.3s;         }         .search-highlight::after {             content: '';             position: absolute;             inset: -6px;             border-radius: 16px;             background: rgba(152, 16, 250, 0.04);             pointer-events: none;             z-index: -1;         }     `;

    document.head.appendChild(style);
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',
        () => setTimeout(initGlobalSearch, 0));
} else { setTimeout(initGlobalSearch, 0); }

function initNotifications() {
    const header = document.getElementById('header');
    if (!header) return;

    const bell = header.querySelector('.header-bell');
    if (!bell) return;

    const notifications = MOCK.notifications;
    if (!notifications) return;

    const typeIcons = {
        warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        recruiter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9810fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`
    };


    const typeBgColors = {
        warning: '#fef3c7', success: '#dcfce7', info: '#dbeafe',
        recruiter: '#f3e8ff'
    };

    const wrapper = document.createElement('div');
    wrapper.className = 'notif-wrapper';
    wrapper.id = 'notifWrapper';
    bell.parentNode.insertBefore(wrapper, bell);
    wrapper.appendChild(bell);

    const panel = document.createElement('div');
    panel.className = 'notif-panel';
    panel.id = 'notifPanel';
    wrapper.appendChild(panel);

    function getUnreadCount() { return notifications.filter(n => !n.read).length; }

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
        } else if (badge) { badge.style.display = 'none'; }
    }

    function renderPanel() {
        const unread = notifications.filter(n => !n.read);
        const read = notifications.filter(n => n.read);
        const unreadCount = unread.length;

        let html = `             <div class="notif-header">                 <h3>Notifications</h3>                 <div class="notif-header-actions">                     ${unreadCount > 0 ? `<button class="notif-mark-all" id="markAllRead">Mark all read</button>` : ''}                 </div>             </div>             <div class="notif-body">`;

        if (notifications.length === 0) {
            html += `                 <div class="notif-empty">                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>                     <p>No notifications</p>                 </div>`;
        } else {
            if (unread.length > 0) {
                html += `<div class="notif-section-label">New</div>`;

                unread.forEach(n => { html += renderNotifItem(n); });
            }
            if (read.length > 0) {
                html += `<div class="notif-section-label">Earlier</div>`;

                read.forEach(n => { html += renderNotifItem(n); });
            }
        }

        html += `</div>`;
        panel.innerHTML = html;

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
        return `             <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}" data-href="${n.href}">                 <div class="notif-icon" style="background:${bg}">${icon}</div>                 <div class="notif-content">                     <div class="notif-title">${n.title}</div>                     <div class="notif-message">${n.message}</div>                     <div class="notif-time">${n.time}</div>                 </div>                 ${!n.read ? '<div class="notif-dot"></div>' : ''}             </div>`;
    }

    bell.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('visible');
        const searchResults = document.getElementById('searchResults');
        if (searchResults) searchResults.classList.remove('visible');

        if (isOpen) { panel.classList.remove('visible'); } else {
            renderPanel();
            panel.classList.add('visible');
        }
    });

    panel.addEventListener('click', e => {
        const item = e.target.closest('.notif-item');
        if (!item) return;

        const id = parseInt(item.dataset.id, 10);
        const href = item.dataset.href;

        const notif = notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        updateBadge();

        if (href && notif) {
            const params = new URLSearchParams();
            if (notif.highlight) params.set('highlight', notif.highlight);
            if (notif.highlightType) params.set('type', notif.highlightType);
            if (notif.highlightIdx != null) params.set('idx', notif.highlightIdx);

            const currentPage = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) || 'p1.html';


            if (currentPage === href && notif.highlight) {
                panel.classList.remove('visible');

                if (typeof highlightOnCurrentPage === 'function') {
                    highlightOnCurrentPage(notif.highlightType,
                        notif.highlight, notif.highlightIdx);
                }
                history.replaceState(null, '', `${href}?${params.toString()}`);
            } else {
                const paramStr = params.toString();
                window.location.href = paramStr ? `${href}?${paramStr}` : href;
            }
        }
    });

    document.addEventListener('click',
        e => { if (!wrapper.contains(e.target)) { panel.classList.remove('visible'); } });

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('focus',
            () => { panel.classList.remove('visible'); });
    }

    updateBadge();
}

(function injectNotifCSS() {
    const style = document.createElement('style');
    style.textContent = `         .notif-wrapper {             position: relative;         }         .notif-panel {             position: absolute;             top: calc(100% + 12px);             right: 0;             width: 400px;             background: #fff;             border: 1px solid #e5e7eb;             border-radius: 16px;             box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);             z-index: 200;             opacity: 0;             visibility: hidden;             transform: translateY(-10px) scale(0.97);             transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);             overflow: hidden;         }         .notif-panel.visible {             opacity: 1;             visibility: visible;             transform: translateY(0) scale(1);         }         .notif-header {             display: flex;             align-items: center;             justify-content: space-between;             padding: 18px 20px 14px;             border-bottom: 1px solid #f3f4f6;         }         .notif-header h3 {             font-weight: 600;             font-size: 16px;             color: #1e2939;             margin: 0;         }         .notif-header-actions {             display: flex;             gap: 8px;         }         .notif-mark-all {             all: unset;             font-family: 'Inter', sans-serif;             font-size: 12px;             font-weight: 500;             color: #9810fa;             cursor: pointer;             padding: 4px 10px;             border-radius: 6px;             transition: background 0.15s;         }         .notif-mark-all:hover {             background: #f3e8ff;         }         .notif-body {             max-height: 420px;             overflow-y: auto;         }         .notif-body::-webkit-scrollbar { width: 5px; }         .notif-body::-webkit-scrollbar-track { background: transparent; }         .notif-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }         .notif-body::-webkit-scrollbar-thumb:hover { background: #d1d5db; }         .notif-section-label {             padding: 10px 20px 6px;             font-size: 11px;             font-weight: 600;             color: #6b7280;             text-transform: uppercase;             letter-spacing: 0.5px;             background: #f9fafb;             border-bottom: 1px solid #f3f4f6;             position: sticky;             top: 0;             z-index: 1;         }         .notif-item {             display: flex;             align-items: flex-start;             gap: 12px;             padding: 14px 20px;             cursor: pointer;             transition: background 0.15s;             border-bottom: 1px solid #f9fafb;             position: relative;         }         .notif-item:last-child { border-bottom: none; }         .notif-item:hover { background: #f9fafb; }         .notif-item.unread { background: #faf5ff; }         .notif-item.unread:hover { background: #f3e8ff; }         .notif-icon {             width: 38px;             height: 38px;             border-radius: 10px;             display: flex;             align-items: center;             justify-content: center;             flex-shrink: 0;         }         .notif-content {             flex: 1;             min-width: 0;         }         .notif-title {             font-weight: 600;             font-size: 13px;             color: #1e2939;             line-height: 1.3;         }         .notif-item.read .notif-title {             font-weight: 500;             color: #4a5565;         }         .notif-message {             font-size: 12.5px;             color: #6b7280;             line-height: 1.4;             margin-top: 2px;             display: -webkit-box;             -webkit-line-clamp: 2;             -webkit-box-orient: vertical;             overflow: hidden;         }         .notif-time {             font-size: 11px;             color: #9ca3af;             margin-top: 4px;             font-weight: 500;         }         .notif-dot {             width: 8px;             height: 8px;             background: #9810fa;             border-radius: 50%;             flex-shrink: 0;             margin-top: 6px;             box-shadow: 0 0 0 3px rgba(152, 16, 250, 0.15);         }         .notif-empty {             padding: 40px 20px;             text-align: center;         }         .notif-empty svg {             display: block;             margin: 0 auto 12px;         }         .notif-empty p {             color: #9ca3af;             font-size: 14px;             margin: 0;         }         .header-bell {             transition: transform 0.2s;         }         .header-bell:hover {             transform: scale(1.1);         }         .header-bell:active {             transform: scale(0.95);         }     `;

    document.head.appendChild(style);
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',
        () => setTimeout(initNotifications, 10));
} else {
    setTimeout(initNotifications, 10);
}

function toggleProfileDropdown(e) {
    e.stopPropagation();
    const dd = document.getElementById('profileDropdown');
    if (!dd) return;
    dd.classList.toggle('open');
}

document.addEventListener('click',
    function (e) {
        const dd = document.getElementById('profileDropdown');
        const profile = document.getElementById('headerProfile');
        if (!dd || !profile) return;
        if (!profile.contains(e.target) && !e.target.closest('.sidebar-user')) {
            dd.classList.remove('open');
        }
    });

document.addEventListener('keydown',
    function (e) {
        if (e.key === 'Escape') {
            const dd = document.getElementById('profileDropdown');

            if (dd) dd.classList.remove('open');
        }
    });

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

    const eduHTML = (u.education || []).map(ed => `         <div class="pm-edu-item">             <div class="pm-edu-dot"></div>             <div>                 <div class="pm-edu-degree">${ed.degree}</div>                 <div class="pm-edu-inst">${ed.institution} · ${ed.year}</div>             </div>         </div>`).join('');


    const skillsHTML = (u.skills || []).map(s => `<span class="pm-skill">${s}</span>`).join('');


    const achieveHTML = (u.achievements || []).map(a => `         <div class="pm-achieve-card">             <div class="pm-achieve-icon">${achieveIcons[a.icon] || achieveIcons.trophy}</div>             <div>                 <div class="pm-achieve-title">${a.title}</div>                 <div class="pm-achieve-desc">${a.desc}</div>             </div>         </div>`).join('');


    const act = u.activity || {};
    const actItems = [{
        label: 'Drives Managed', value: act.drivesManaged,
        color: '#7c3aed'
    },
    { label: 'Students Placed', value: act.studentsPlaced, color: '#10b981' },
    {
        label: 'Recruiters Onboarded', value: act.recruitersOnboarded,
        color: '#3b82f6'
    },
    { label: 'Workshops', value: act.workshopsConducted, color: '#f59e0b' },
    {
        label: 'Avg Response', value: act.avgResponseTime,
        color: '#ec4899'
    },
    {
        label: 'Satisfaction', value: act.satisfactionScore,
        color: '#06b6d4'
    }];
    const actHTML = actItems.map(a => `         <div class="pm-stat-item">             <div class="pm-stat-value" style="color:${a.color}">${a.value}</div>             <div class="pm-stat-label">${a.label}</div>         </div>`).join('');


    container.innerHTML = `         <div class="hero-card" style="margin-bottom: 24px;">             <div class="pm-header fade-in">                 <div class="pm-avatar">${u.initials || 'RN'}</div>                 <div class="pm-header-info">                     <h2 class="pm-name">${u.name || 'Dr. Rajesh Nair'}</h2>                     <div class="pm-role-badge">                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>                         ${u.role || 'Placement Officer'}                     </div>                 </div>             </div>             <div class="pm-bio fade-in" style="animation-delay: 0.1s;">${u.bio || ''}</div>         </div>         <div class="panels-row fade-in" style="animation-delay: 0.2s;">             <div class="panel">                 <div class="panel-header"><h3>Personal Information</h3></div>                 <div class="panel-body">                     <div class="pm-info-grid">                         <div class="pm-info-item"><div class="pm-info-label">Email</div><div class="pm-info-value">${u.email || ''}</div></div>                         <div class="pm-info-item"><div class="pm-info-label">Phone</div><div class="pm-info-value">${u.phone || ''}</div></div>                         <div class="pm-info-item"><div class="pm-info-label">Institution</div><div class="pm-info-value">${u.institution || ''}</div></div>                         <div class="pm-info-item"><div class="pm-info-label">Department</div><div class="pm-info-value">${u.department || ''}</div></div>                         <div class="pm-info-item"><div class="pm-info-label">Location</div><div class="pm-info-value">${u.location || ''}</div></div>                         <div class="pm-info-item"><div class="pm-info-label">Employee ID</div><div class="pm-info-value">${u.employeeId || ''}</div></div>                     </div>                 </div>             </div>                         <div class="panel">                 <div class="panel-header"><h3>Activity Overview</h3></div>                 <div class="panel-body">                     <div class="pm-stats-grid">${actHTML}</div>                 </div>             </div>         </div>         <div class="panels-row fade-in" style="animation-delay: 0.3s;">             <div class="panel" style="flex: 2;">                 <div class="panel-header"><h3>Education</h3></div>                 <div class="panel-body">                     <div class="pm-edu-timeline">${eduHTML}</div>                 </div>                 <div class="panel-header" style="border-top: 1px solid #f3f4f6; padding-top: 20px;"><h3>Achievements</h3></div>                 <div class="panel-body">                     <div class="pm-achieve-list">${achieveHTML}</div>                 </div>             </div>             <div class="panel" style="flex: 1;">                 <div class="panel-header"><h3>Skills & Expertise</h3></div>                 <div class="panel-body">                     <div class="pm-skills-wrap">${skillsHTML}</div>                 </div>                 ${u.social ? `                 <div class="panel-header" style="border-top: 1px solid #f3f4f6; padding-top: 20px;"><h3>Links</h3></div>                 <div class="panel-body">                     <div class="pm-social-row" style="flex-direction: column;">                         <a class="pm-social-link" href="https://${u.social.linkedin}" target="_blank">LinkedIn</a>                         <a class="pm-social-link" href="https://${u.social.website}" target="_blank">Website</a>                     </div>                 </div>` : ''}             </div>         </div>     `;

    injectProfilePageCSS();
    isProfileRendered = true;
}

function toggleProfileView(showProfile) {
    const mainContent = document.getElementById('mainContent');

    const profileContent = document.getElementById('profileContent');

    if (!profileContent) return; // Feature not initialized correctly

    if (showProfile) {
        if (!isProfileRendered) renderProfilePage();
        document.querySelector('.header-title').textContent = 'My Profile';
        if (mainContent) mainContent.style.display = 'none';
        profileContent.style.display = 'block';

        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
    } else {
        const pageTitle = {
            'p1.html': 'Dashboard',
            'p2.html': 'Review Opportunities', 'p3.html': 'Statistics',
            'p4.html': 'Recruiter Management'
        }[window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'p1.html'] || 'Dashboard';


        document.querySelector('.header-title').textContent = pageTitle;
        if (mainContent) mainContent.style.display = 'block';
        profileContent.style.display = 'none';
    }
}

function injectProfilePageCSS() {
    if (document.getElementById('profilePageCSS')) return;
    const style = document.createElement('style');
    style.id = 'profilePageCSS';
    style.textContent = `     .fade-in {         opacity: 0;         animation: fadeIn 0.4s ease forwards;     }     @keyframes fadeIn {         to { opacity: 1; }     }         .pm-header { display: flex; align-items: center; gap: 20px; }     .pm-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; font-weight: 700; font-size: 26px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 3px solid #e9d5ff; box-shadow: 0 4px 16px rgba(124,58,237,0.25); }     .pm-header-info { flex: 1; }     .pm-name { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }     .pm-role-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; padding: 4px 12px; background: #f5f3ff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #7c3aed; }     .pm-bio { font-size: 15px; line-height: 1.7; color: #4b5563; padding: 18px 24px; background: #f9fafb; border-radius: 12px; border-left: 3px solid #7c3aed; margin-top: 24px; }         .pm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }     .pm-info-item { padding: 12px 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #f3f4f6; }     .pm-info-label { font-size: 11px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }     .pm-info-value { font-size: 14px; font-weight: 500; color: #1f2937; }         .pm-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }     .pm-stat-item { text-align: center; padding: 16px 10px; background: #faf5ff; border-radius: 12px; border: 1px solid #f3e8ff; }     .pm-stat-value { font-size: 22px; font-weight: 700; }     .pm-stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; font-weight: 500; }         .pm-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }     .pm-skill { display: inline-flex; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; background: #f5f3ff; color: #7c3aed; border: 1px solid #e9d5ff; transition: all 0.2s; }     .pm-skill:hover { background: #ede9fe; transform: translateY(-1px); }         .pm-edu-timeline { display: flex; flex-direction: column; gap: 0; padding-left: 12px; border-left: 2px solid #e9d5ff; }     .pm-edu-item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; position: relative; }     .pm-edu-dot { width: 12px; height: 12px; border-radius: 50%; background: #7c3aed; border: 2px solid #fff; box-shadow: 0 0 0 2px #e9d5ff; flex-shrink: 0; margin-top: 4px; margin-left: -19px; }     .pm-edu-degree { font-size: 14px; font-weight: 600; color: #1f2937; }     .pm-edu-inst { font-size: 13px; color: #6b7280; margin-top: 2px; }         .pm-achieve-list { display: flex; flex-direction: column; gap: 10px; }     .pm-achieve-card { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6; transition: all 0.2s; }     .pm-achieve-card:hover { border-color: #e9d5ff; background: #faf5ff; }     .pm-achieve-icon { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #f3f4f6; }     .pm-achieve-title { font-size: 14px; font-weight: 600; color: #1f2937; }     .pm-achieve-desc { font-size: 13px; color: #6b7280; margin-top: 2px; line-height: 1.5; }         .pm-social-row { display: flex; gap: 12px; }     .pm-social-link { display: inline-flex; justify-content: center; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; color: #7c3aed; background: #f5f3ff; border: 1px solid #e9d5ff; text-decoration: none; transition: all 0.2s; }     .pm-social-link:hover { background: #ede9fe; transform: translateY(-1px); }     `;

    document.head.appendChild(style);
}

function wireProfileLinks() {
    document.querySelectorAll('.profile-dd-item').forEach(item => {
        if (item.textContent.trim().startsWith('My Profile')) {
            item.style.cursor = 'pointer';
            item.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleProfileView(true);
                const dd = document.getElementById('profileDropdown');
                if (dd) dd.classList.remove('open');
            };
        }
    });
}

function wireSidebarLinksForSPA() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            const targetMatch = onclickAttr.match(/location\.href='([^']+)'/);
            if (targetMatch && targetMatch[1]) {
                item.setAttribute('data-target',
                    targetMatch[1]);
                item.removeAttribute('onclick');
            }
        }

        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetFile = this.getAttribute('data-target');
            if (!targetFile) return;

            const currentFile = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'p1.html';


            if (targetFile === currentFile) {
                toggleProfileView(false);
                document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));

                this.classList.add('active');
            } else {
                window.location.href = targetFile;
            }
        });
    });
}

const headerEl = document.getElementById('header');
if (headerEl) {
    const obs = new MutationObserver(() => { wireProfileLinks(); });
    obs.observe(headerEl, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',
        () => {
            setTimeout(wireProfileLinks, 100);
            setTimeout(wireSidebarLinksForSPA, 100);
        });
} else {
    setTimeout(wireProfileLinks,
        100);
    setTimeout(wireSidebarLinksForSPA, 100);
}

