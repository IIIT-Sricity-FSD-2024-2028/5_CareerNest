/**
 * CareerNest Subscription Utility
 * ================================
 * Shared module used by ALL actor dashboards.
 *
 * Key exports:
 *   loadSubscription(collegeId, role)   → fetch/cache plan from backend
 *   renderPlanBanner(sub, name, email)  → inject sticky plan badge into page
 *   renderRoleFeaturePanel(sub, role, containerId) → full plan feature panel
 *   isAllowed(featureKey, sub)          → boolean feature check
 *   lockFeature(el, featureKey, sub)    → blur + overlay a locked element
 *   lockedFeatureCardHTML(lockInfo)     → HTML for a locked feature card
 *   clearSubscriptionCache(collegeId)   → clear sessionStorage cache
 */

import { api } from './api.js';

/* ─── Tier Display Config ─────────────────────────────────────────────────── */
const TIER_CONFIG = {
  basic:    { color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7', emoji: '🎓', label: 'BASIC',    barBg: 'linear-gradient(90deg,#10b981,#34d399)' },
  standard: { color: '#0ea5e9', bg: '#eff6ff', border: '#93c5fd', emoji: '⭐', label: 'STANDARD', barBg: 'linear-gradient(90deg,#0ea5e9,#38bdf8)' },
  premium:  { color: '#7c3aed', bg: '#faf5ff', border: '#c4b5fd', emoji: '👑', label: 'PREMIUM',  barBg: 'linear-gradient(90deg,#7c3aed,#a78bfa)' },
};

/* ─── Per-Role Feature Definitions ───────────────────────────────────────── */
/*
 * Each role has features at 3 tiers.
 * 'tier' = minimum tier needed. 'basic' = available on all.
 * Each feature: { key, label, desc, icon, tier }
 */
const ROLE_FEATURES = {

  /* ── CANDIDATE ─────────────────────────────────────────────────────────── */
  candidate: [
    // Basic (core)
    { key: 'browse_opportunities',   label: 'Browse Opportunities',       desc: 'Search and view placement drives posted for your college.',            icon: '🔍', tier: 'basic'    },
    { key: 'apply_drives',           label: 'Apply to Drives',            desc: 'Submit applications to eligible placement opportunities.',              icon: '📝', tier: 'basic'    },
    { key: 'application_tracking',   label: 'Application Tracking',       desc: 'Track status of your applications in real time.',                      icon: '📋', tier: 'basic'    },
    { key: 'basic_profile',          label: 'Profile Management',         desc: 'Maintain your resume, CGPA, skills and academic details.',             icon: '👤', tier: 'basic'    },
    { key: 'eligibility_check',      label: 'Eligibility Check',          desc: 'See which drives you are eligible for based on your academic profile.', icon: '✅', tier: 'basic'    },
    { key: 'status_notifications',   label: 'Status Notifications',       desc: 'Receive updates on shortlisting, interview calls and offers.',         icon: '🔔', tier: 'basic'    },
    { key: 'referral_requests',      label: 'Referral Requests',          desc: 'Request referrals from alumni in your college network.',               icon: '🤝', tier: 'basic'    },
    // Standard (advanced)
    { key: 'advanced_filtering',     label: 'Advanced Job Filtering',     desc: 'Filter opportunities by package, role, skills, location and more.',    icon: '🎯', tier: 'standard' },
    { key: 'placement_analytics',    label: 'Placement Analytics',        desc: 'View your college\'s historical placement rates and company trends.',   icon: '📊', tier: 'standard' },
    { key: 'career_progress',        label: 'Career Progress Tracker',    desc: 'Visual dashboard showing your application funnel and progress.',        icon: '📈', tier: 'standard' },
    { key: 'smart_search',           label: 'Smart Company Search',       desc: 'Discover companies visiting your campus with richer filters.',          icon: '🔎', tier: 'standard' },
    { key: 'priority_alerts',        label: 'Priority Status Alerts',     desc: 'Instant push-style alerts for interview schedules and results.',        icon: '⚡', tier: 'standard' },
    { key: 'comparative_stats',      label: 'Peer Comparison Stats',      desc: 'Compare your profile against the placement benchmark in your batch.',   icon: '⚖️', tier: 'standard' },
    // Premium
    { key: 'skill_job_matching',     label: 'Profile & Skill Matching',   desc: 'Match your skill profile against detailed drive prerequisites.',        icon: '🎯', tier: 'premium'  },
    { key: 'salary_benchmarks',      label: 'Salary Benchmarks',          desc: 'See industry salary ranges and package benchmarks for roles.',          icon: '💰', tier: 'premium'  },
    { key: 'interview_prep',         label: 'Interview Question Vault',   desc: 'Company-specific interview guides, syllabus and preparation topics.',   icon: '📚', tier: 'premium'  },
    { key: 'career_path_insights',   label: 'Career Path Insights',       desc: 'Department-specific career pathways and role trajectory guidance.',     icon: '🗺️', tier: 'premium'  },
  ],

  /* ── RECRUITER ─────────────────────────────────────────────────────────── */
  recruiter: [
    // Basic
    { key: 'post_opportunities',     label: 'Post Opportunities',         desc: 'Submit job/internship opportunities to the college placement cell.',    icon: '📢', tier: 'basic'    },
    { key: 'view_applications',      label: 'View Applications',          desc: 'Browse and review candidate applications for your postings.',           icon: '📄', tier: 'basic'    },
    { key: 'basic_profiles',         label: 'Candidate Profiles',         desc: 'Access basic candidate information — name, CGPA, department.',          icon: '👥', tier: 'basic'    },
    { key: 'manage_assessments',     label: 'Manage Assessments',         desc: 'Create and assign assessments for screening candidates.',               icon: '📝', tier: 'basic'    },
    { key: 'status_updates',         label: 'Application Status Updates', desc: 'Accept/reject applications and communicate decisions.',                 icon: '🔄', tier: 'basic'    },
    { key: 'basic_shortlisting',     label: 'Basic Shortlisting',         desc: 'Manually shortlist candidates from your application pool.',             icon: '✂️', tier: 'basic'    },
    // Standard
    { key: 'advanced_filtering',     label: 'Advanced Candidate Filters', desc: 'Filter candidates by CGPA, branch, skills, backlogs and more.',        icon: '🎯', tier: 'standard' },
    { key: 'bulk_actions',           label: 'Bulk Application Review',    desc: 'Accept, reject or move multiple candidates at once.',                   icon: '⚡', tier: 'standard' },
    { key: 'shortlist_analytics',    label: 'Shortlisting Analytics',     desc: 'Track funnel metrics from applicant to offer across your drives.',      icon: '📊', tier: 'standard' },
    { key: 'candidate_comparison',   label: 'Candidate Comparison',       desc: 'Side-by-side comparison of candidate profiles and assessments.',        icon: '⚖️', tier: 'standard' },
    { key: 'campus_analytics',       label: 'Campus Drive Analytics',     desc: 'Insights on drive performance, yield and acceptance rates.',            icon: '📈', tier: 'standard' },
    // Premium
    { key: 'pipeline_analytics',     label: 'Hiring Pipeline Analytics',  desc: 'Full funnel analytics from application to onboarding.',                icon: '🔭', tier: 'premium'  },
    { key: 'talent_pool',            label: 'Talent Pool Intelligence',   desc: 'Discover top candidates across batches for future hiring.',             icon: '💡', tier: 'premium'  },
    { key: 'yield_analysis',         label: 'Offer Yield & Conversion',   desc: 'Analytics on offer acceptance rates and recruitment bottlenecks.',      icon: '📊', tier: 'premium'  },
    { key: 'workflow_automation',    label: 'Automated Scheduling',       desc: 'Batch interview scheduling, calendar coordination and follow-ups.',    icon: '⚙️', tier: 'premium'  },
  ],

  /* ── PLACEMENT OFFICER ─────────────────────────────────────────────────── */
  placement_officer: [
    // Basic
    { key: 'manage_drives',          label: 'Manage Placement Drives',    desc: 'Create, edit and track placement drives end to end.',                  icon: '🗂️', tier: 'basic'    },
    { key: 'review_opportunities',   label: 'Review Opportunities',       desc: 'Approve or reject recruiter-submitted placement opportunities.',        icon: '✔️', tier: 'basic'    },
    { key: 'recruiter_oversight',    label: 'Recruiter Oversight',        desc: 'Monitor recruiter activity and approve new recruiter registrations.',   icon: '👔', tier: 'basic'    },
    { key: 'user_management',        label: 'User Management',            desc: 'View and manage candidate, alumni and recruiter accounts.',             icon: '👥', tier: 'basic'    },
    { key: 'application_tracking',   label: 'Application Tracking',       desc: 'Track all applications and their statuses across drives.',              icon: '📋', tier: 'basic'    },
    { key: 'basic_reports',          label: 'Basic Placement Reports',    desc: 'Export simple placement summary reports for your college.',             icon: '📄', tier: 'basic'    },
    // Standard
    { key: 'advanced_analytics',     label: 'Advanced Analytics',         desc: 'Detailed placement statistics with charts, trends and drill-downs.',    icon: '📊', tier: 'standard' },
    { key: 'bulk_notifications',     label: 'Bulk Notifications',         desc: 'Send broadcast notifications to students, alumni or recruiters.',       icon: '📣', tier: 'standard' },
    { key: 'interview_scheduling',   label: 'Interview Scheduling',       desc: 'Manage and schedule interviews with slot booking and reminders.',       icon: '📅', tier: 'standard' },
    { key: 'dept_analytics',         label: 'Department-wise Analytics',  desc: 'Breakdown of placement performance across departments.',                icon: '🏫', tier: 'standard' },
    { key: 'detailed_reports',       label: 'Detailed Reports',           desc: 'Rich placement reports with filtering, export and comparison.',         icon: '📑', tier: 'standard' },
    // Premium
    { key: 'target_tracking',        label: 'Placement Target Tracking',  desc: 'Track departmental placement goals vs actual achievements.',            icon: '🎯', tier: 'premium'  },
    { key: 'custom_reports',         label: 'Custom Report Builder',      desc: 'Build custom reports with any combination of placement metrics.',       icon: '🛠️', tier: 'premium'  },
    { key: 'multi_officer',          label: 'Multi-officer Coordination', desc: 'Manage teams of placement officers with role assignments.',             icon: '👨‍💼', tier: 'premium' },
    { key: 'realtime_dashboard',     label: 'Real-time Live Dashboard',   desc: 'Live updating dashboard with instant metrics as drives happen.',        icon: '⚡', tier: 'premium'  },
  ],

  /* ── ALUMNI ────────────────────────────────────────────────────────────── */
  alumni: [
    // Basic
    { key: 'alumni_profile',         label: 'Alumni Profile',             desc: 'Maintain your professional profile, company and career history.',       icon: '👤', tier: 'basic'    },
    { key: 'referral_submissions',   label: 'Referral Submissions',       desc: 'Submit referrals for candidates from your alma mater.',                icon: '🤝', tier: 'basic'    },
    { key: 'view_opportunities',     label: 'View Opportunities',         desc: 'Browse active placement drives at your college.',                       icon: '👀', tier: 'basic'    },
    { key: 'basic_networking',       label: 'Basic Alumni Networking',    desc: 'Connect with fellow alumni and stay updated on college activities.',    icon: '🌐', tier: 'basic'    },
    { key: 'referral_status',        label: 'Referral Status Tracking',   desc: 'Track the status of referrals you have submitted.',                    icon: '📋', tier: 'basic'    },
    // Standard
    { key: 'mentoring_programs',     label: 'Mentoring Hub',              desc: 'Volunteer as a mentor and guide current students in their careers.',    icon: '🎓', tier: 'standard' },
    { key: 'referral_analytics',     label: 'Advanced Referral Analytics',desc: 'Detailed stats on your referral impact, conversion rates and more.',   icon: '📊', tier: 'standard' },
    { key: 'alumni_events',          label: 'Alumni & College Events',    desc: 'Access and register for alumni networking events and reunions.',        icon: '🎉', tier: 'standard' },
    { key: 'impact_reports',         label: 'My Impact Reports',          desc: 'View your personal impact on placements, referrals and mentoring.',     icon: '📈', tier: 'standard' },
    { key: 'network_insights',       label: 'Network Insights',           desc: 'Discover alumni working at companies of interest to current students.', icon: '💡', tier: 'standard' },
    // Premium
    { key: 'alumni_intelligence',    label: 'Alumni Network Dashboard',   desc: 'Comprehensive directory analytics across batches and companies.',       icon: '🔭', tier: 'premium'  },
    { key: 'career_matching',        label: 'Domain Career Matching',     desc: 'Direct mentorship matching based on department and role preferences.',  icon: '🎯', tier: 'premium'  },
    { key: 'mentee_tracking',        label: 'Active Mentee Tracking',     desc: 'Track ongoing mentorship engagements and mentee milestones.',           icon: '👥', tier: 'premium'  },
    { key: 'engagement_metrics',     label: 'Alumni Engagement Metrics',  desc: 'Contribution score and metrics for alumni assisting college placement.',icon: '🏆', tier: 'premium'  },
  ],

  /* ── COLLEGE ADMIN ──────────────────────────────────────────────────────── */
  college_admin: [
    { key: 'student_management',     label: 'Student Management',         desc: 'Add, view and manage all students in your college.',                    icon: '🎓', tier: 'basic'    },
    { key: 'officer_management',     label: 'Placement Officers',         desc: 'Manage placement officers and their access.',                           icon: '🛡️', tier: 'basic'    },
    { key: 'recruiter_management',   label: 'Recruiter Management',       desc: 'View and approve recruiter registrations.',                             icon: '👔', tier: 'basic'    },
    { key: 'basic_portal',           label: 'Full Placement Portal',      desc: 'Access the full placement portal with drives and applications.',        icon: '🏫', tier: 'basic'    },
    { key: 'advanced_analytics',     label: 'Advanced Analytics',         desc: 'Department-wise analytics and placement statistics.',                   icon: '📊', tier: 'standard' },
    { key: 'bulk_notifications',     label: 'Bulk Notifications',         desc: 'Send bulk communications to all college stakeholders.',                 icon: '📣', tier: 'standard' },
    { key: 'detailed_reports',       label: 'Detailed Reports',           desc: 'Rich reports with filters, export and trend analysis.',                 icon: '📑', tier: 'standard' },
    { key: 'custom_reports',         label: 'Custom Report Builder',      desc: 'Build bespoke reports using any placement data dimension.',             icon: '🛠️', tier: 'premium'  },
    { key: 'multi_officer',          label: 'Multiple Placement Officers',desc: 'Assign and manage a team of placement officers.',                       icon: '👨‍💼', tier: 'premium' },
    { key: 'realtime_dashboard',     label: 'Real-time Dashboard',        desc: 'Live metrics dashboard updating as placement drives happen.',           icon: '⚡', tier: 'premium'  },
  ],
};

/* ─── Tier order for comparison ──────────────────────────────────────────── */
const TIER_ORDER = { basic: 0, standard: 1, premium: 2 };

/* ─── Fetch + cache subscription ─────────────────────────────────────────── */
export async function loadSubscription(collegeId, userRole) {
  if (!collegeId || collegeId === 'null') return null;
  const cacheKey = `sub_${collegeId}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) { try { return JSON.parse(cached); } catch {} }
  try {
    const sub = await api.get(`/colleges/${collegeId}/subscription`, userRole || 'candidate');
    sessionStorage.setItem(cacheKey, JSON.stringify(sub));
    return sub;
  } catch (e) { console.warn('Subscription load failed:', e.message); return null; }
}

export function clearSubscriptionCache(collegeId) {
  sessionStorage.removeItem(`sub_${collegeId}`);
}

/* ─── Feature helpers ────────────────────────────────────────────────────── */
export function isAllowed(featureKey, sub) {
  if (!sub) return true;
  return sub.allowed.some(f => f.key === featureKey);
}

export function getLockInfo(featureKey, sub) {
  if (!sub) return null;
  return sub.locked.find(f => f.key === featureKey) || null;
}

/* ─── Plan badge HTML (inline use) ──────────────────────────────────────── */
export function planBadgeHTML(sub) {
  if (!sub) return '';
  const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.basic;
  return `<span style="
    display:inline-flex;align-items:center;gap:5px;
    background:${cfg.bg};color:${cfg.color};
    border:1.5px solid ${cfg.border};border-radius:20px;
    padding:3px 12px;font-size:11px;font-weight:800;letter-spacing:.5px;
  ">${cfg.emoji} ${cfg.label} PLAN</span>`;
}

/* ─── Locked feature card HTML ───────────────────────────────────────────── */
export function lockedFeatureCardHTML(lockInfo, extraNote = '') {
  const tierColor = lockInfo.availableIn === 'standard' ? '#0ea5e9' : '#7c3aed';
  return `
    <div style="background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;
      padding:14px 16px;display:flex;align-items:flex-start;gap:12px;opacity:0.85;">
      <span style="font-size:20px;margin-top:2px;">🔒</span>
      <div>
        <div style="font-size:13px;font-weight:600;color:#334155">${lockInfo.label}</div>
        <div style="font-size:11px;color:#64748b;margin-top:3px;">
          Available in <span style="color:${tierColor};font-weight:700">${lockInfo.availableLabel}</span>
          ${extraNote ? ' — ' + extraNote : ''}
        </div>
      </div>
    </div>`;
}

/* ─── Sticky plan banner (top of page) ──────────────────────────────────── */
export function renderPlanBanner(sub, collegeName, actorEmail) {
  if (!sub) return;
  const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.basic;
  document.getElementById('cn-plan-banner')?.remove();
  const banner = document.createElement('div');
  banner.id = 'cn-plan-banner';
  banner.style.cssText = `
    background:linear-gradient(135deg,${cfg.color}18,${cfg.color}06);
    border:1px solid ${cfg.border};border-radius:10px;
    padding:12px 20px;margin-bottom:20px;
    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;
    font-family:inherit;
  `;
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <span style="font-size:22px;">${cfg.emoji}</span>
      <div>
        <div style="font-size:12px;color:#64748b;margin-bottom:2px;">
          ${collegeName ? `<strong style="color:#1e293b">${collegeName}</strong> · ` : ''}${actorEmail || ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="background:${cfg.bg};color:${cfg.color};border:1.5px solid ${cfg.border};
            border-radius:20px;padding:2px 10px;font-size:11px;font-weight:800;letter-spacing:.5px;">
            ${cfg.label} PLAN
          </span>
          <span style="font-size:12px;color:#64748b;">${sub.description}</span>
        </div>
      </div>
    </div>
    <div style="font-size:12px;color:#94a3b8;text-align:right;">
      ₹${Number(sub.monthlyFee).toLocaleString('en-IN')}/month
      ${sub.canUpgrade
        ? `<br><span style="color:${cfg.color};font-size:11px;font-weight:600;">Upgrade → ${sub.upgradeLabel} for more features</span>`
        : `<br><span style="color:#10b981;font-size:11px;">✓ Highest Plan</span>`}
    </div>`;
  const targets = ['main.content','main.main-content','.main-content','main','.content','.dash-content','.frame'];
  const target  = targets.map(s => document.querySelector(s)).find(Boolean);
  if (target) target.prepend(banner); else document.body.prepend(banner);
}

/* ─── Inject tier-aware sidebar navigation items ────────────────────────── */
export function renderSidebarNav(sub, role) {
  if (!sub || !role) return;
  const tierIdx = TIER_ORDER[sub.tier] ?? 0;
  const collegeName = sub.collegeName || 'Your College';

  if (role === 'candidate') {
    const navUl = document.querySelector('.sidebar-nav ul');
    if (!navUl) return;
    document.querySelectorAll('.cn-injected-nav').forEach(el => el.remove());

    const items = [
      { label: 'Advanced Search',    href: 'advanced-search.html',    icon: 'bx-search-alt',    minTier: 1, badge: '⭐' },
      { label: 'Saved Drives',       href: 'saved-drives.html',        icon: 'bx-bookmark',      minTier: 1, badge: '⭐' },
      { label: 'Application Tracker',href: 'application-tracking.html',icon: 'bx-git-branch',   minTier: 2, badge: '👑' },
      { label: 'Interview Calendar', href: 'interviews.html',           icon: 'bx-calendar-check',minTier: 2, badge: '👑' },
    ];

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item cn-injected-nav';
      const reqLabel = item.minTier === 1 ? 'STANDARD' : 'PREMIUM';
      if (tierIdx >= item.minTier) {
        li.innerHTML = `<a href="${item.href}"><i class='bx ${item.icon}'></i><span>${item.badge} ${item.label}</span></a>`;
      } else {
        li.innerHTML = `<a href="#" onclick="alert('🔒 ${item.label} requires the ${reqLabel} plan.\\n\\nContact your College Admin (${collegeName}) to upgrade.'); return false;" title="🔒 Locked — Requires ${reqLabel} plan" style="opacity:0.6;cursor:pointer;"><i class='bx ${item.icon}'></i><span>🔒 ${item.label}</span></a>`;
      }
      navUl.appendChild(li);
    });
  } else if (role === 'recruiter') {
    const navUl = document.querySelector('aside nav ul');
    if (!navUl) return;
    document.querySelectorAll('.cn-injected-nav').forEach(el => el.remove());

    const items = [
      { label: 'Filter Candidates', href: 'candidates-filter.html', icon: 'filter',       minTier: 1, badge: '⭐' },
      { label: 'Hiring Reports',    href: 'hiring-report.html',     icon: 'bar-chart-2',  minTier: 2, badge: '👑' },
    ];

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cn-injected-nav';
      const reqLabel = item.minTier === 1 ? 'STANDARD' : 'PREMIUM';
      if (tierIdx >= item.minTier) {
        li.innerHTML = `<a href="${item.href}" style="display:flex;align-items:center;gap:10px;"><i data-lucide="${item.icon}"></i>${item.badge} ${item.label}</a>`;
      } else {
        li.innerHTML = `<a href="#" onclick="alert('🔒 ${item.label} requires the ${reqLabel} plan.\\n\\nContact your College Admin (${collegeName}) to upgrade.'); return false;" style="display:flex;align-items:center;gap:10px;opacity:0.6;cursor:pointer;" title="🔒 Locked — Requires ${reqLabel} plan"><i data-lucide="${item.icon}"></i>🔒 ${item.label}</a>`;
      }
      navUl.appendChild(li);
    });
    if (window.lucide) window.lucide.createIcons();
  } else if (role === 'placement_officer') {
    const navUl = document.querySelector('.sidebar-nav');
    if (!navUl) return;
    document.querySelectorAll('.cn-injected-nav').forEach(el => el.remove());

    const items = [
      { label: 'Bulk Notifications', href: 'bulk-notify.html',       minTier: 1, badge: '⭐' },
      { label: 'Candidate Filter',   href: 'candidates-filter.html', minTier: 1, badge: '⭐' },
      { label: 'Dept Report',        href: 'dept-report.html',       minTier: 1, badge: '⭐' },
      { label: 'Placement Dashboard',href: 'placement-dashboard.html',minTier: 2, badge: '👑' },
    ];

    const signoutDiv = document.querySelector('.sidebar-signout');
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item cn-injected-nav';
      const reqLabel = item.minTier === 1 ? 'STANDARD' : 'PREMIUM';
      if (tierIdx >= item.minTier) {
        li.onclick = () => location.href = item.href;
        li.innerHTML = `<span>${item.badge} ${item.label}</span>`;
      } else {
        li.onclick = () => alert(`🔒 ${item.label} requires the ${reqLabel} plan.\n\nContact your College Admin (${collegeName}) to upgrade.`);
        li.style.cssText = 'opacity:0.6;cursor:pointer;';
        li.title = `🔒 Locked — Requires ${reqLabel} plan`;
        li.innerHTML = `<span>🔒 ${item.label}</span>`;
      }
      if (signoutDiv) navUl.parentNode.insertBefore(li, signoutDiv);
      else navUl.appendChild(li);
    });
  } else if (role === 'alumni') {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return;
    document.querySelectorAll('.cn-injected-nav').forEach(el => el.remove());

    const svgIcon = (path) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    const items = [
      {
        label: 'Mentorship Hub', href: 'mentorship.html', minTier: 1, badge: '⭐',
        svg: svgIcon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
      },
      {
        label: 'College Events', href: 'events.html', minTier: 1, badge: '⭐',
        svg: svgIcon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
      },
      {
        label: 'Alumni Directory', href: 'directory.html', minTier: 2, badge: '👑',
        svg: svgIcon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>'),
      },
    ];

    const signout = sidebarNav.querySelector('.signout');
    items.forEach(item => {
      const a = document.createElement('a');
      a.className = 'nav-btn cn-injected-nav';
      a.style.cssText = 'display:flex;align-items:center;gap:8px;';
      const reqLabel = item.minTier === 1 ? 'STANDARD' : 'PREMIUM';
      if (tierIdx >= item.minTier) {
        a.href = item.href;
        a.innerHTML = `${item.svg}${item.badge} ${item.label}`;
      } else {
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
          alert(`🔒 ${item.label} requires the ${reqLabel} plan.\n\nContact your College Admin (${collegeName}) to upgrade.`);
        };
        a.style.cssText = 'display:flex;align-items:center;gap:8px;opacity:0.6;cursor:pointer;';
        a.title = `🔒 Locked — Requires ${reqLabel} plan`;
        a.innerHTML = `${item.svg}🔒 ${item.label}`;
      }
      if (signout) sidebarNav.insertBefore(a, signout);
      else sidebarNav.appendChild(a);
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   renderRoleFeaturePanel
   ─────────────────────────────────────────────────────────────────────────
   Renders a full plan-specific feature panel for a given actor role.
   Shows:
     • A tier progress bar (Basic → Standard → Premium)
     • Available features in a card grid (active, with icon + description)
     • Locked features in a separate grid (grayed, 🔒, with unlock tier)
   ═══════════════════════════════════════════════════════════════════════════ */
export function renderRoleFeaturePanel(sub, role, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !sub) return;

  const cfg      = TIER_CONFIG[sub.tier] || TIER_CONFIG.basic;
  const features = ROLE_FEATURES[role] || [];
  const tierIdx  = TIER_ORDER[sub.tier] ?? 0;

  // Split features into available vs locked for this tier
  const available = features.filter(f => TIER_ORDER[f.tier] <= tierIdx);
  const locked    = features.filter(f => TIER_ORDER[f.tier] >  tierIdx);

  // Group available by their original tier (for display grouping)
  const basicFeatures    = available.filter(f => f.tier === 'basic');
  const standardFeatures = available.filter(f => f.tier === 'standard');
  const premiumFeatures  = available.filter(f => f.tier === 'premium');

  // Group locked by their required tier
  const lockedStandard   = locked.filter(f => f.tier === 'standard');
  const lockedPremium    = locked.filter(f => f.tier === 'premium');

  const featureCardHTML = (f, active = true) => `
    <div style="
      background:${active ? '#fff' : '#f8fafc'};
      border:1.5px solid ${active ? cfg.border : '#e2e8f0'};
      border-radius:10px;padding:16px;
      display:flex;flex-direction:column;gap:6px;
      ${active ? `box-shadow:0 1px 4px ${cfg.color}20;` : 'opacity:0.5;'}
    ">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${f.icon}</span>
        <div style="font-size:13px;font-weight:700;color:${active ? '#1e293b' : '#64748b'}">${f.label}</div>
        ${active ? `<span style="margin-left:auto;color:${cfg.color};font-size:14px;font-weight:700;">✓</span>` : ''}
      </div>
      <div style="font-size:12px;color:#64748b;line-height:1.5;">${f.desc}</div>
    </div>`;

  const lockedCardHTML = (f) => {
    const reqCfg = TIER_CONFIG[f.tier] || TIER_CONFIG.standard;
    return `
    <div style="
      background:#fafafa;border:1.5px dashed #d1d5db;
      border-radius:10px;padding:16px;
      display:flex;flex-direction:column;gap:6px;
    ">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;filter:grayscale(1);opacity:0.6;">${f.icon}</span>
        <div style="font-size:13px;font-weight:700;color:#94a3b8;">${f.label}</div>
        <span style="margin-left:auto;font-size:14px;">🔒</span>
      </div>
      <div style="font-size:12px;color:#94a3b8;line-height:1.5;">${f.desc}</div>
      <div style="margin-top:4px;">
        <span style="
          display:inline-block;background:${reqCfg.bg};color:${reqCfg.color};
          border:1px solid ${reqCfg.border};border-radius:12px;
          padding:2px 10px;font-size:10px;font-weight:700;
        ">${reqCfg.emoji} Available in ${reqCfg.label}</span>
      </div>
    </div>`;
  };

  // Build tier progress bar
  const tiers = [
    { t:'basic',    cfg: TIER_CONFIG.basic    },
    { t:'standard', cfg: TIER_CONFIG.standard },
    { t:'premium',  cfg: TIER_CONFIG.premium  },
  ];

  const tierBar = `
    <div style="display:flex;align-items:center;gap:0;margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      ${tiers.map((item, i) => {
        const active = TIER_ORDER[item.t] <= tierIdx;
        const isCurrent = item.t === sub.tier;
        return `<div style="
          flex:1;padding:10px 16px;
          background:${isCurrent ? item.cfg.barBg : active ? item.cfg.bg : '#f8fafc'};
          color:${isCurrent ? '#fff' : active ? item.cfg.color : '#94a3b8'};
          font-size:12px;font-weight:${isCurrent ? '800' : '600'};
          text-align:center;position:relative;
          border-right:${i < 2 ? '1px solid #e2e8f0' : 'none'};
        ">
          ${item.cfg.emoji} ${item.cfg.label}
          ${isCurrent ? '<div style="font-size:10px;opacity:0.85;margin-top:2px;">CURRENT</div>' : ''}
          ${active && !isCurrent ? '<div style="font-size:10px;opacity:0.7;margin-top:2px;">✓ Included</div>' : ''}
          ${!active ? '<div style="font-size:10px;opacity:0.6;margin-top:2px;">🔒 Locked</div>' : ''}
        </div>`;
      }).join('')}
    </div>`;

  // Section heading helper
  const sectionHead = (emoji, label, color, count) =>
    `<div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px;">
      <span style="font-size:16px;">${emoji}</span>
      <h3 style="font-size:14px;font-weight:700;color:${color};margin:0;">${label}</h3>
      <span style="background:${color}20;color:${color};border-radius:12px;padding:2px 9px;font-size:11px;font-weight:700;">${count}</span>
    </div>`;

  container.innerHTML = `
    <div style="font-family:inherit;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
        <h2 style="font-size:17px;font-weight:800;color:#1e293b;margin:0;">
          Your Plan Features &nbsp;${planBadgeHTML(sub)}
        </h2>
        <span style="font-size:12px;color:#94a3b8;">
          ${available.length} available · ${locked.length} locked
        </span>
      </div>

      ${tierBar}

      ${basicFeatures.length ? sectionHead('✅', 'Core Features (Basic)', '#10b981', basicFeatures.length) + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${basicFeatures.map(f => featureCardHTML(f, true)).join('')}</div>` : ''}

      ${standardFeatures.length ? sectionHead('⭐', 'Advanced Features (Standard)', '#0ea5e9', standardFeatures.length) + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${standardFeatures.map(f => featureCardHTML(f, true)).join('')}</div>` : ''}

      ${premiumFeatures.length ? sectionHead('👑', 'Premium Features', '#7c3aed', premiumFeatures.length) + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${premiumFeatures.map(f => featureCardHTML(f, true)).join('')}</div>` : ''}

      ${lockedStandard.length ? `
        <div style="margin-top:28px;">
          ${sectionHead('🔒', 'Locked — Upgrade to STANDARD', '#0ea5e9', lockedStandard.length)}
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${lockedStandard.map(f => lockedCardHTML(f)).join('')}</div>
        </div>` : ''}

      ${lockedPremium.length ? `
        <div style="margin-top:20px;">
          ${sectionHead('🔒', 'Locked — Upgrade to PREMIUM', '#7c3aed', lockedPremium.length)}
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${lockedPremium.map(f => lockedCardHTML(f)).join('')}</div>
        </div>` : ''}

      ${locked.length === 0 ? `
        <div style="margin-top:24px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;
          padding:20px;text-align:center;">
          <div style="font-size:24px;margin-bottom:8px;">👑</div>
          <div style="font-size:14px;font-weight:700;color:#7c3aed;">All features unlocked!</div>
          <div style="font-size:12px;color:#8b5cf6;margin-top:4px;">You are on the Premium plan — maximum access to all ${available.length} features.</div>
        </div>` : ''}

      ${sub.canUpgrade ? `
        <div style="margin-top:28px;background:#f0fdf4;border:1px solid #86efac;
          border-radius:10px;padding:16px 20px;display:flex;align-items:center;
          justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:#15803d;">
              Upgrade to ${sub.upgradeLabel} — unlock ${locked.filter(f => f.tier === sub.upgradeTo).length} more features
            </div>
            <div style="font-size:12px;color:#16a34a;margin-top:2px;">
              ₹${Number(sub.upgradePrice).toLocaleString('en-IN')}/month · Contact your Super Admin to upgrade
            </div>
          </div>
          <div style="font-size:30px;">${TIER_CONFIG[sub.upgradeTo]?.emoji || '⭐'}</div>
        </div>` : ''}
    </div>`;
}

/* ─── Lock UI element with blur + overlay ────────────────────────────────── */
export function lockFeature(elementOrId, featureKey, sub, options = {}) {
  const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!el) return false;
  const lockInfo = getLockInfo(featureKey, sub);
  if (!lockInfo) return false;
  if (options.hideCompletely) { el.style.display = 'none'; return true; }
  el.style.cssText += 'filter:blur(3px) grayscale(50%);pointer-events:none;user-select:none;';
  el.setAttribute('data-locked','true');
  const overlay = document.createElement('div');
  overlay.className = 'cn-lock-overlay';
  overlay.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,0.75);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:inherit;flex-direction:column;gap:8px;cursor:not-allowed;';
  overlay.innerHTML = `<div style="font-size:28px;">🔒</div><div style="font-size:13px;font-weight:700;color:#1e293b;text-align:center;">${lockInfo.label}</div><div style="font-size:11px;color:#64748b;text-align:center;">Available in <strong style="color:#7c3aed">${lockInfo.availableLabel}</strong></div>`;
  const parent = el.parentElement;
  if (parent) { if (window.getComputedStyle(parent).position === 'static') parent.style.position='relative'; parent.appendChild(overlay); }
  return true;
}

/* ─── Full subscription panel (college-admin/subscription.html) ──────────── */
export function renderSubscriptionPanel(sub, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !sub) return;
  const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.basic;
  const allTiers = sub.plans || [];
  const tierColors = { basic:'#10b981', standard:'#0ea5e9', premium:'#7c3aed' };

  container.innerHTML = `
    <div style="background:linear-gradient(135deg,${cfg.color}20,${cfg.color}06);border:2px solid ${cfg.border};border-radius:14px;padding:28px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#64748b;margin-bottom:6px;">CURRENT PLAN</div>
          <div style="font-size:28px;font-weight:800;color:${cfg.color};">${cfg.emoji} ${cfg.label}</div>
          <div style="font-size:14px;color:#475569;margin-top:4px;">${sub.description}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:32px;font-weight:800;color:${cfg.color}">₹${Number(sub.monthlyFee).toLocaleString('en-IN')}</div>
          <div style="font-size:12px;color:#64748b;">per month</div>
          <div style="margin-top:8px;"><span style="background:${sub.status==='active'?'#dcfce7':'#fef2f2'};color:${sub.status==='active'?'#16a34a':'#dc2626'};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">${sub.status?.toUpperCase()}</span></div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">
      <div>
        <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:14px;">✓ Included Features</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${sub.allowed.map(f => `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;"><span style="color:${cfg.color};font-weight:700;">✓</span>${f.label}</div>`).join('')}
        </div>
      </div>
      <div>
        <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:14px;">🔒 Locked Features</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${sub.locked.length === 0
            ? `<div style="color:#10b981;font-size:13px;font-weight:600;">✓ All features unlocked!</div>`
            : sub.locked.map(l => `<div style="display:flex;align-items:flex-start;gap:8px;"><span style="font-size:16px;">🔒</span><div><div style="font-size:13px;color:#475569;font-weight:500;">${l.label}</div><div style="font-size:11px;color:${tierColors[l.availableIn]||'#7c3aed'};">Available in ${l.availableLabel}</div></div></div>`).join('')}
        </div>
      </div>
    </div>

    <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:16px;">📊 Plan Comparison</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;">
      ${allTiers.map(plan => {
        const pc = TIER_CONFIG[plan.tier] || TIER_CONFIG.basic;
        return `<div style="border:2px solid ${plan.isCurrent ? pc.color : '#e2e8f0'};border-radius:12px;padding:20px;background:${plan.isCurrent ? pc.bg : '#fff'};position:relative;">
          ${plan.isCurrent ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:${pc.color};color:#fff;font-size:10px;font-weight:700;padding:2px 10px;border-radius:20px;white-space:nowrap;">CURRENT PLAN</div>` : ''}
          <div style="font-size:18px;text-align:center;margin-bottom:6px;">${pc.emoji}</div>
          <div style="font-size:14px;font-weight:800;color:${pc.color};text-align:center;">${plan.label}</div>
          <div style="font-size:22px;font-weight:800;color:#1e293b;text-align:center;margin:8px 0;">₹${Number(plan.price).toLocaleString('en-IN')}</div>
          <div style="font-size:10px;color:#94a3b8;text-align:center;margin-bottom:12px;">/month</div>
          <div style="font-size:11px;color:#64748b;text-align:center;line-height:1.5;">${plan.description}</div>
        </div>`;
      }).join('')}
    </div>

    ${sub.canUpgrade ? `
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:14px;font-weight:700;color:#15803d;">Upgrade to ${sub.upgradeLabel}</div>
          <div style="font-size:12px;color:#16a34a;margin-top:2px;">Unlock ${sub.locked.filter(l=>l.availableIn===sub.upgradeTo).length} more features · ₹${Number(sub.upgradePrice).toLocaleString('en-IN')}/month</div>
        </div>
        <div style="font-size:12px;color:#64748b;padding:12px 16px;background:#fff;border-radius:8px;border:1px solid #86efac;">📧 Contact Super Admin to upgrade</div>
      </div>` : `
      <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;padding:20px;text-align:center;">
        <div style="font-size:20px;margin-bottom:8px;">👑</div>
        <div style="font-size:14px;font-weight:700;color:#7c3aed;">You are on the Premium Plan</div>
        <div style="font-size:12px;color:#8b5cf6;margin-top:4px;">All features unlocked. Maximum access.</div>
      </div>`}`;
}
