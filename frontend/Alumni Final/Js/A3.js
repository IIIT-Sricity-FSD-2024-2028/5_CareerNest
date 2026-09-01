document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("profile-content");
    const alumni = MOCK_DATA.alumni;
    const counts = MOCK_DATA.getCounts();

    // Build recent activity from referral data
    const activityItems = MOCK_DATA.referrals
        .filter(r => r.status !== 'pending')
        .map(r => {
            const action = r.status === 'approved' ? 'Approved' : 'Declined';
            const dotClass = `profile-activity-dot--${r.status}`;
            const icon = r.status === 'approved'
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
            return `
                <div class="profile-activity-item">
                    <div class="profile-activity-dot ${dotClass}">${icon}</div>
                    <div class="profile-activity-info">
                        <div class="profile-activity-text"><strong>${action}</strong> ${r.name}'s referral for <strong>${r.role}</strong></div>
                        <div class="profile-activity-time">${r.company} • ${r.department}</div>
                    </div>
                </div>`;
        }).join('');

    // Pending activity
    const pendingItems = MOCK_DATA.referrals
        .filter(r => r.status === 'pending')
        .map(r => `
            <div class="profile-activity-item">
                <div class="profile-activity-dot profile-activity-dot--pending">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="profile-activity-info">
                    <div class="profile-activity-text"><strong>Pending</strong> review for ${r.name} — <strong>${r.role}</strong></div>
                    <div class="profile-activity-time">${r.company} • ${r.department}</div>
                </div>
            </div>`).join('');

    container.innerHTML = `
        <!-- Hero Card -->
        <div class="profile-hero">
            <div class="profile-hero-avatar">${alumni.initials}</div>
            <div class="profile-hero-info">
                <div class="profile-hero-name">${alumni.name}</div>
                <div class="profile-hero-role">Software Engineer at ${alumni.company}</div>
                <div class="profile-hero-email">${alumni.email}</div>
                <div class="profile-hero-tags">
                    <span class="profile-hero-tag">🎓 Batch ${alumni.batch}</span>
                    <span class="profile-hero-tag">🏢 ${alumni.company}</span>
                    <span class="profile-hero-tag">👤 ${alumni.role}</span>
                </div>
            </div>
        </div>

        <!-- Stats Row -->
        <div class="profile-stats-row">
            <div class="profile-stat-card profile-stat-card--blue">
                <div class="profile-stat-number">${counts.all}</div>
                <div class="profile-stat-label">Total Requests</div>
            </div>
            <div class="profile-stat-card profile-stat-card--orange">
                <div class="profile-stat-number">${counts.pending}</div>
                <div class="profile-stat-label">Pending</div>
            </div>
            <div class="profile-stat-card profile-stat-card--green">
                <div class="profile-stat-number">${counts.approved}</div>
                <div class="profile-stat-label">Approved</div>
            </div>
            <div class="profile-stat-card profile-stat-card--red">
                <div class="profile-stat-number">${counts.declined}</div>
                <div class="profile-stat-label">Declined</div>
            </div>
        </div>

        <!-- Two-Column Grid -->
        <div class="profile-grid">

            <!-- Personal Information -->
            <div class="profile-section">
                <div class="profile-section-title">
                    <div class="profile-section-icon profile-section-icon--orange">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e76a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    Personal Information
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Full Name
                    </span>
                    <span class="profile-info-value">${alumni.name}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Email
                    </span>
                    <span class="profile-info-value">${alumni.email}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        Company
                    </span>
                    <span class="profile-info-value">${alumni.company}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg>
                        Graduation Batch
                    </span>
                    <span class="profile-info-value">${alumni.batch}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Role
                    </span>
                    <span class="profile-info-value">Software Engineer</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        Location
                    </span>
                    <span class="profile-info-value">Hyderabad, India</span>
                </div>
            </div>

            <!-- Skills & Expertise -->
            <div class="profile-section">
                <div class="profile-section-title">
                    <div class="profile-section-icon profile-section-icon--purple">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    Skills & Expertise
                </div>
                <div class="profile-skills">
                    <span class="profile-skill-tag">JavaScript</span>
                    <span class="profile-skill-tag">Python</span>
                    <span class="profile-skill-tag">React</span>
                    <span class="profile-skill-tag">Node.js</span>
                    <span class="profile-skill-tag">System Design</span>
                    <span class="profile-skill-tag">Cloud (GCP)</span>
                    <span class="profile-skill-tag">Machine Learning</span>
                    <span class="profile-skill-tag">SQL</span>
                    <span class="profile-skill-tag">TypeScript</span>
                    <span class="profile-skill-tag">Go</span>
                    <span class="profile-skill-tag">Docker</span>
                    <span class="profile-skill-tag">Kubernetes</span>
                </div>

                <div class="profile-section-title" style="margin-top: 12px;">
                    <div class="profile-section-icon profile-section-icon--blue">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </div>
                    Social Links
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">LinkedIn</span>
                    <a href="https://linkedin.com/in/sneha-reeddy" target="_blank" rel="noopener noreferrer" class="profile-info-value" style="color:#2563eb; text-decoration:none; transition:text-decoration 0.2s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">linkedin.com/in/sneha-reddy</a>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">GitHub</span>
                    <a href="https://github.com/snehareeddy" target="_blank" rel="noopener noreferrer" class="profile-info-value" style="color:#2563eb; text-decoration:none; transition:text-decoration 0.2s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">github.com/snehareddy</a>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">Portfolio</span>
                    <a href="https://snehareddy.dev" target="_blank" rel="noopener noreferrer" class="profile-info-value" style="color:#2563eb; text-decoration:none; transition:text-decoration 0.2s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">snehareddy.dev</a>
                </div>
            </div>

            <!-- Recent Activity (Full Width) -->
            <div class="profile-section profile-full-width">
                <div class="profile-section-title">
                    <div class="profile-section-icon profile-section-icon--green">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    Recent Activity
                </div>
                <div class="profile-activity">
                    ${activityItems}
                    ${pendingItems}
                </div>
            </div>

        </div>
    `;
});
