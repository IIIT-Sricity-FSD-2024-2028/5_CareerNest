/**
 * placement-api-init.js
 *
 * Loads live data from the NestJS backend and populates the global
 * MOCK object that all p1–p6 page scripts depend on.
 *
 * Include this script BEFORE any p*.js scripts in the HTML pages.
 */

const BASE_URL = 'http://localhost:3000';

// ─── Synchronous default MOCK ──────────────────────────────────────────────
// Set immediately so page scripts (like p3.js) that read MOCK at top-level
// don't crash before the async API fetch completes. Real data overwrites this.
window.MOCK = {
  stats: {
    pending: 0, published: 0, totalOpps: 0, totalApplicants: 0,
    totalCandidates: 0, placementRate: 0, highestPkg: 0, avgPkg: 0,
    companiesVisited: 0, totalApps: 0, offersAccepted: 0, internships: 0,
  },
  branches: [],
  trend: { labels: [], fullTime: [], internships: [] },
  submissions: [],
  stakeholders: { candidates: 0, recruiters: 0, activeDrives: 0, alumni: 0 },
  drives: [], interviews: [], opportunities: [], recruiters: [], applications: [],
  users: [], candidates: [], alumni: [], notifications: [], nav: [],
  recruiterStats: { total: 0, active: 0, pending: 0, declined: 0 },
  _rawOpps: [], _rawApps: [], _rawRecruiters: [],
};

// Expose a global flag so page scripts can await data
window.__placementDataReady = false;
window.__placementDataPromise = null;

async function _fetchPlacementData() {
  const headers = { 'Content-Type': 'application/json', 'x-role': 'placement_officer' };

  const [opps, apps, recruiters, users] = await Promise.all([
    fetch(`${BASE_URL}/opportunities`, { headers }).then(r => r.json()),
    fetch(`${BASE_URL}/applications`, { headers }).then(r => r.json()),
    fetch(`${BASE_URL}/recruiters`, { headers }).then(r => r.json()),
    fetch(`${BASE_URL}/users`, { headers }).then(r => r.json()),
  ]);

  const candidates = users.filter(u => u.role === 'candidate');
  const alumni     = users.filter(u => u.role === 'alumni');

  const published = opps.filter(o => o.status === 'Published');
  const pending   = opps.filter(o => o.status === 'pending');

  // Build MOCK.stats
  const stats = {
    pending:        pending.length,
    published:      published.length,
    totalOpps:      opps.length,
    totalApplicants: apps.length,
  };

  // Build MOCK.submissions (all opportunities as submission rows)
  const submissions = opps.map(o => ({
    title:     o.title,
    company:   o.company,
    location:  o.location || '',
    pkg:       o.salary || '',
    type:      o.type || 'Full-Time',
    status:    o.status === 'Published' ? 'published' : (o.status === 'pending' ? 'pending' : o.status.toLowerCase()),
    submitter: o.submittedBy || 'Recruiter',
    avatar:    o.avatar || (o.company ? o.company[0] : 'C'),
    avatarBg:  o.avatarBg || '#7c3aed',
    id:        o.id,
  }));

  // Build MOCK.stakeholders
  const stakeholders = {
    candidates:  candidates.length,
    recruiters:  recruiters.filter(r => r.status === 'active').length,
    activeDrives: published.length,
    alumni:      alumni.length,
  };

  // Build MOCK.drives (published opportunities as active drives)
  const drives = published.slice(0, 4).map((o, i) => ({
    company:    o.company,
    role:       o.title,
    badge:      `${o.applications || 0} applicants`,
    badgeClass: ['green','blue','purple','orange'][i % 4],
  }));

  // Build MOCK.interviews from applications with Interview status
  const interviews = apps
    .filter(a => a.status === 'Interview')
    .slice(0, 4)
    .map(a => ({
      company: a.company,
      round:   a.title,
      time:    a.interviewDate || 'TBD',
    }));

  // Build MOCK.opportunities (for p2 – manage opportunities)
  const opportunities = opps.map(o => ({
    id:          o.id,
    title:       o.title,
    company:     o.company,
    location:    o.location || '',
    type:        o.type || 'Full-Time',
    salary:      o.salary || '',
    branches:    o.branches || [],
    cgpa:        o.cgpa || 0,
    openings:    o.openings || 1,
    deadline:    o.deadline || '',
    applications: o.applications || 0,
    status:      o.status,
    submittedBy: o.submittedBy || '',
    tags:        o.tags || [],
    description: o.description || '',
    avatar:      o.avatar || (o.company ? o.company[0] : 'C'),
    avatarBg:    o.avatarBg || '#7c3aed',
  }));

  // Build MOCK.recruiters (for p4 – manage recruiters)
  // Merge: official recruiters from /recruiters endpoint + any user added with role='recruiter'
  const recList = recruiters.map(r => ({
    id:       r.id,
    name:     r.name,
    company:  r.company,
    role:     r.role,
    email:    r.email,
    phone:    r.phone || '',
    location: r.location || '',
    status:   r.status,
    opps:     r.opps || 0,
    joined:   r.joined || '',
    bio:      r.bio || '',
    avatar:   r.avatar || r.name[0],
  }));

  // Include users with role='recruiter' that were added via POST /users (p5 Add User)
  const recruiterUsers = users.filter(u => u.role === 'recruiter');
  const existingRecEmails = new Set(recList.map(r => r.email.toLowerCase()));
  recruiterUsers.forEach(u => {
    if (!existingRecEmails.has(u.email.toLowerCase())) {
      recList.push({
        id:       u.id,
        name:     u.name,
        company:  u.company || '',
        role:     u.headline || 'Recruiter',
        email:    u.email,
        phone:    u.phone || '',
        location: u.location || '',
        status:   u.status || 'active',
        opps:     0,
        joined:   '',
        bio:      '',
        avatar:   u.avatar || u.name[0],
      });
    }
  });


  // Build MOCK.applications (for p6 – kanban tracking)
  const appList = apps.map(a => ({
    id:            a.id,
    candidate:     a.candidateName || 'Unknown',
    role:          a.title || '',
    company:       a.company || '',
    status:        a.status === 'Offered' ? 'Selected' : a.status,
    date:          a.appliedDate || '',
    interviewDate: a.interviewDate || null,
    hasReferral:   a.hasReferral || false,
    branch:        a.branch || '',
    cgpa:          a.cgpa || '',
  }));

  // Build MOCK.users/candidates (for p3 – student stats)
  const candidateList = candidates.map(u => ({
    id:       u.id,
    name:     u.name,
    email:    u.email || '',
    role:     'candidate',              // needed by p5.js filter
    roll:     u.rollNumber || '',       // p5.js expects 'roll'
    branch:   u.department || '',       // p5.js expects 'branch'
    cgpa:     u.cgpa || 0,
    backlogs: u.backlogs || 0,
    status:   u.status || 'active',
    avatar:   u.avatar || (u.name ? u.name.slice(0, 2).toUpperCase() : 'CN'),
    placed:   apps.some(a => a.candidateId === u.id && (a.status === 'Offered' || a.status === 'Offer')),
  }));

  // Build alumni list for p5.js (merged into MOCK.users)
  const alumniList = alumni.map(u => ({
    id:        u.id,
    name:      u.name,
    email:     u.email || '',
    role:      'alumni',               // filter key: p5.js does filter(u => u.role === 'alumni')
    jobRole:   u.headline || '',       // display: job title column in alumni table
    company:   u.company || '',
    batch:     u.batch || '',
    referrals: u.referrals || 0,
    status:    u.status || 'active',
  }));

  // Build MOCK.notifications (static for placement officer)
  const notifications = [
    { id: 1, type: 'warning', title: `${pending.length} Opportunities Pending Review`, message: 'Review and approve or reject pending opportunity submissions.', time: 'Just now', read: false, href: 'p2.html' },
    { id: 2, type: 'recruiter', title: 'New Recruiter Registration', message: `${recruiters.filter(r=>r.status==='pending').length} recruiter(s) waiting for approval.`, time: '2 hours ago', read: false, href: 'p4.html' },
    { id: 3, type: 'success', title: 'Placement Drive Active', message: `${published.length} opportunities currently live for students.`, time: '1 day ago', read: true, href: 'p1.html' },
    { id: 4, type: 'info', title: 'Applications Received', message: `${apps.length} total applications across all drives.`, time: '2 days ago', read: true, href: 'p6.html' },
  ];

  // Build MOCK.nav
  const nav = [
    { label: 'Dashboard',     href: 'p1.html' },
    { label: 'Opportunities', href: 'p2.html' },
    { label: 'Statistics',    href: 'p3.html' },
    { label: 'Recruiters',    href: 'p4.html' },
  ];

  // ── Extended stats for p3.js ────────────────────────────────────────────
  const offersAccepted  = apps.filter(a => a.status === 'Offered' || a.status === 'offer').length;
  const internshipOpps  = published.filter(o => o.type === 'Internship').length;
  const companiesVisited = new Set(published.map(o => o.company)).size;

  // Parse salary: "12 LPA" → 12, "₹25,000/month" → 3.0 LPA (annualized)
  const salNums = published.map(o => {
    const sal = (o.salary || '').trim();
    const lpa = sal.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*LPA/i);
    if (lpa) return parseFloat(lpa[1]);
    const monthly = sal.replace(/[₹,]/g, '').match(/(\d+(?:\.\d+)?)\s*\/?\s*month/i);
    if (monthly) return Math.round(parseFloat(monthly[1]) * 12 / 100000 * 10) / 10;
    return 0;
  }).filter(n => n > 0);
  const highestPkg = salNums.length > 0 ? Math.max(...salNums) : 0;
  const avgPkg     = salNums.length > 0 ? Math.round(salNums.reduce((a, b) => a + b, 0) / salNums.length) : 0;

  const placedCandidates = candidates.filter(c =>
    apps.some(a => a.candidateId === c.id && (a.status === 'Offered' || a.status === 'offer'))
  );
  const placementRate = candidates.length > 0
    ? Math.round((placedCandidates.length / candidates.length) * 100)
    : 0;

  // Extend stats with p3-specific fields
  stats.totalCandidates  = candidates.length;
  stats.placementRate    = placementRate;
  stats.highestPkg       = highestPkg;
  stats.avgPkg           = avgPkg;
  stats.companiesVisited = companiesVisited;
  stats.totalApps        = apps.length;
  stats.offersAccepted   = offersAccepted;
  stats.internships      = internshipOpps;

  // ── Branch-wise placement stats ─────────────────────────────────────────
  const BRANCH_COLORS = {
    'CSE':'#00c950','ECE':'#10b981','ME':'#f0b100',
    'CIV':'#ef4444','EEE':'#f59e0b','IT':'#8b5cf6',
  };
  const BRANCH_CLS = {
    'CSE':'green','ECE':'teal','ME':'orange','CIV':'red','EEE':'amber','IT':'purple',
  };
  const branchMap = {};
  candidates.forEach(c => {
    const dept = (c.department || 'Other').split(' ')[0]; // use first word e.g. "CSE"
    if (!branchMap[dept]) {
      branchMap[dept] = { name: dept, total: 0, placed: 0,
        color: BRANCH_COLORS[dept] || '#7c3aed',
        colorClass: BRANCH_CLS[dept] || 'purple' };
    }
    branchMap[dept].total++;
    const isPlaced = apps.some(a =>
      a.candidateId === c.id && (a.status === 'Offered' || a.status === 'offer')
    );
    if (isPlaced) branchMap[dept].placed++;
  });
  const branches = Object.values(branchMap);

  // ── Monthly trend (last 8 months) ───────────────────────────────────────
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ftByMonth  = Array(12).fill(0);
  const intByMonth = Array(12).fill(0);
  apps.forEach(a => {
    if (a.appliedDate) {
      const d = new Date(a.appliedDate);
      if (!isNaN(d)) {
        const mi = d.getMonth();
        const opp = opps.find(o => o.id === a.opportunityId);
        if (opp && opp.type === 'Internship') intByMonth[mi]++;
        else ftByMonth[mi]++;
      }
    }
  });
  const now = new Date();
  const trendLabels = [], trendFT = [], trendInt = [];
  for (let i = 7; i >= 0; i--) {
    const mi = (now.getMonth() - i + 12) % 12;
    trendLabels.push(MONTH_NAMES[mi]);
    trendFT.push(ftByMonth[mi]);
    trendInt.push(intByMonth[mi]);
  }
  const trend = { labels: trendLabels, fullTime: trendFT, internships: trendInt };

  // Assign to global MOCK (what all page scripts reference)
  window.MOCK = {
    stats,
    branches,
    trend,
    submissions,
    stakeholders,
    drives,
    interviews,
    opportunities,
    recruiters: recList,
    applications: appList,
    users: [...candidateList, ...alumniList],  // p5.js filters by u.role
    candidates: candidateList,
    alumni,
    notifications,
    nav,
    // Helper methods that page scripts call
    _rawOpps: opps,
    _rawApps: apps,
    _rawRecruiters: recruiters,
  };

  window.__placementDataReady = true;
}

// Start fetching immediately and expose the promise
window.__placementDataPromise = _fetchPlacementData().catch(err => {
  console.error('[placement-api-init] Failed to load from API:', err);
  // Fall back to empty MOCK so pages don't crash
  window.MOCK = window.MOCK || {
    stats: { pending: 0, published: 0, totalOpps: 0, totalApplicants: 0 },
    submissions: [], stakeholders: { candidates: 0, recruiters: 0, activeDrives: 0, alumni: 0 },
    drives: [], interviews: [], opportunities: [], recruiters: [], applications: [],
    users: [], candidates: [], alumni: [], notifications: [], nav: [],
  };
  window.__placementDataReady = true;
});

/**
 * Helper – call this at the start of each page's DOMContentLoaded
 * to ensure API data is ready before rendering.
 *
 * Usage:
 *   document.addEventListener('DOMContentLoaded', async () => {
 *     await waitForPlacementData();
 *     // ... render with MOCK ...
 *   });
 */
window.waitForPlacementData = function() {
  return window.__placementDataPromise;
};
