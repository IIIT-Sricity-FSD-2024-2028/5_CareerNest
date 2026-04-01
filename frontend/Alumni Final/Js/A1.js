document.addEventListener("DOMContentLoaded", () => {
  const alumni = MOCK_DATA.alumni;
  const counts = MOCK_DATA.getCounts();
  const pending = MOCK_DATA.getPending();

  // --- Welcome Banner ---
  document.getElementById('welcome-banner').innerHTML = `
    <h2 class="welcome-title">Welcome back, ${alumni.name.split(' ')[0]}! 👋</h2>
    <p class="welcome-sub">${alumni.company} • Class of ${alumni.batch}</p>
    <p class="welcome-desc">Your referrals make a real difference to students' careers. Review pending requests and help deserving candidates get noticed by recruiters.</p>
    <a href="A2.html" class="welcome-btn">Review Referral Requests →</a>
  `;

  // --- Stats Row ---
  const statsConfig = [
    { filter: 'pending', label: 'Pending Requests', count: counts.pending, iconClass: 'stat-icon--pending', color: '#d97706', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    { filter: 'approved', label: 'Approved', count: counts.approved, iconClass: 'stat-icon--approved', color: '#059669', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
    { filter: 'all', label: 'Total Requests', count: counts.all, iconClass: 'stat-icon--total', color: '#3b82f6', icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>' },
    { filter: 'declined', label: 'Declined', count: counts.declined, iconClass: 'stat-icon--declined', color: '#dc2626', icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' },
  ];

  document.getElementById('stats-row').innerHTML = statsConfig.map(s => `
    <a href="A2.html?filter=${s.filter}" class="stat-card">
      <div class="stat-icon ${s.iconClass}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${s.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>
      </div>
      <div class="stat-number">${s.count}</div>
      <div class="stat-label">${s.label}</div>
    </a>
  `).join('');

  // --- Pending Mini Cards ---
  const dashPending = document.getElementById('dash-pending');
  if (pending.length === 0) {
    dashPending.innerHTML = `
      <div class="dash-section-head">
        <h3 class="dash-section-title">Pending Requests</h3>
        <span class="dash-count-badge">0</span>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="empty-state-title">You're all caught up!</div>
        <div class="empty-state-desc">There are no pending referral requests at the moment.</div>
      </div>
    `;
  } else {
    dashPending.innerHTML = `
      <div class="dash-section-head">
        <h3 class="dash-section-title">Pending Requests</h3>
        <span class="dash-count-badge">${pending.length}</span>
      </div>
      ${pending.map(r => `
        <a href="A2.html#${r.id}" class="mini-card" data-candidate="${r.id}">
          <div class="mini-card-top">
            <div class="mini-card-left">
              <div class="avatar avatar--mini">${r.initials}</div>
              <div>
                <div class="mini-name">${r.name}</div>
                <div class="mini-detail">${r.department} • CGPA: ${r.cgpa}</div>
              </div>
            </div>
            <span class="badge badge--pending badge--sm">Pending</span>
          </div>
          <div class="mini-for">Requesting referral for <strong>${r.role}</strong></div>
          <div class="mini-msg">"${r.message.substring(0, 100)}${r.message.length > 100 ? '...' : ''}"</div>
          <div class="mini-actions">
            <span class="mini-btn mini-btn--approve">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Approve
            </span>
            <span class="mini-btn mini-btn--review">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Review Full Request
            </span>
          </div>
        </a>
      `).join('')}
    `;
  }

  // --- Alumni Profile + Impact ---
  document.getElementById('dash-profile-col').innerHTML = `
    <div class="alumni-card">
      <h3 class="dash-section-title" style="margin-bottom:16px;">Alumni Profile</h3>
      <div class="alumni-card-body">
        <div class="avatar avatar--lg">${alumni.initials}</div>
        <div class="alumni-name">${alumni.name}</div>
        <div class="alumni-company">${alumni.company}</div>
        <div class="alumni-tags">
          <span class="alumni-tag alumni-tag--orange">${alumni.role}</span>
          <span class="alumni-tag alumni-tag--gray">Batch ${alumni.batch}</span>
        </div>
        <div class="alumni-stats">
          <div class="alumni-stat-row">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
              Total Referrals
            </span>
            <strong>${alumni.totalReferrals}</strong>
          </div>
          <div class="alumni-stat-row">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Approved
            </span>
            <strong>${counts.approved}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="impact-card">
      <div class="impact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e76a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div>
        <div class="impact-title">Your Impact</div>
        <div class="impact-desc">Your referrals have helped <strong>${counts.approved} students</strong> get noticed by recruiters. Keep supporting your juniors!</div>
      </div>
    </div>
  `;

  // --- Approve button handlers ---
  document.querySelectorAll('.mini-btn--approve').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.mini-card');
      const candidateId = card?.dataset.candidate;
      if (!candidateId) return;

      // Store in localStorage for h1.html to pick up
      let approvals = [];
      try {
        approvals = JSON.parse(localStorage.getItem('dashboardApprovals') || '[]');
        if (!Array.isArray(approvals)) approvals = [];
      } catch (e) {
        approvals = [];
      }
      if (!approvals.includes(candidateId)) {
        approvals.push(candidateId);
        try { localStorage.setItem('dashboardApprovals', JSON.stringify(approvals)); } catch (e) {}
      }

      // Update badge
      const badge = card.querySelector('.badge');
      if (badge) { badge.className = 'badge badge--approved badge--sm'; badge.textContent = 'Approved'; }

      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Approved`;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';

      // Fade out card
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          card.remove();
          const remaining = document.querySelectorAll('.mini-card').length;
          const countBadge = document.querySelector('.dash-count-badge');
          if (countBadge) countBadge.textContent = remaining;
          const statNums = document.querySelectorAll('.stat-number');
          if (statNums[0]) statNums[0].textContent = remaining;
          if (statNums[1]) statNums[1].textContent = parseInt(statNums[1].textContent) + 1;
        }, 400);
      }, 600);
    });
  });
});
