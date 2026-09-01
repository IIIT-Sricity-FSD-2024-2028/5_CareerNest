import { getStore, updateStore, initGlobalNotifications, renderUserNav } from './store.js';

// DOM Elements
const jobsListContainer = document.getElementById('jobs-list-container');
const jobDetailsContainer = document.getElementById('job-details-container');
const jobCountText = document.getElementById('job-count');
const searchInput = document.querySelector('.search-container input');

// State tracking
let activeJobId = null;
let oppTypeFilter = 'All';

function renderLayout() {
    renderUserNav();
    const store = getStore();

    const urlParams = new URLSearchParams(window.location.search);
    const passedJobId = urlParams.get('jobId');

    if (passedJobId) {
        activeJobId = parseInt(passedJobId);
    } else if(store.recruiterJobs.length > 0) {
        activeJobId = store.recruiterJobs[0].id;
    }

    setupFilters();
    setupSearch();
    updateJobCountText();
    renderJobsList();
    renderSelectedJob();
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if(!filterBtns) return;
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            oppTypeFilter = e.target.textContent.trim();
            handleListUpdate();
        });
    });
}

function setupSearch() {
    if(searchInput) {
        searchInput.addEventListener('input', () => {
            handleListUpdate();
        });
    }
}

function getFilteredJobs() {
    const store = getStore();
    let jobs = store.recruiterJobs;
    const query = searchInput && searchInput.value ? searchInput.value.toLowerCase().trim() : '';

    if (!query) {
        jobs = jobs.filter(j => j.appliedStatus !== 'Applied' && j.appliedStatus !== 'Shortlisted' && j.appliedStatus !== 'Interview');
    }

    if (oppTypeFilter === 'Full-time') jobs = jobs.filter(j => j.type.includes('Full-Time') || j.type.includes('Full-time'));
    else if (oppTypeFilter === 'Internship') jobs = jobs.filter(j => j.type.includes('Internship'));
    
    if (query !== '') {
        jobs = jobs.filter(j => 
            j.title.toLowerCase().includes(query) || 
            j.company.toLowerCase().includes(query) ||
            (j.tags && j.tags.some(t => t.toLowerCase().includes(query)))
        );
    }
    return jobs;
}

function handleListUpdate() {
    const filtered = getFilteredJobs();
    updateJobCountText();
    
    if (filtered.length > 0) {
        const exists = filtered.find(j => j.id === activeJobId);
        if (!exists) activeJobId = filtered[0].id;
        renderJobsList();
        renderSelectedJob();
    } else {
        jobsListContainer.innerHTML = '';
        jobDetailsContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: #94a3b8;">No opportunities match your search.</div>';
    }
}

function updateJobCountText() {
    const countEl = document.getElementById('job-count');
    if(countEl) countEl.textContent = getFilteredJobs().length;
}

window.selectJob = function(jobId) {
    activeJobId = jobId;
    renderJobsList();
    renderSelectedJob();
};

window.applyJob = function(jobId) {
    updateStore(store => {
        const job = store.recruiterJobs.find(j => j.id === jobId);
        if (job) {
            job.appliedStatus = "Applied";
            
            const newAppId = store.myApplications.length ? Math.max(...store.myApplications.map(a=>a.id)) + 1 : 1;
            const today = new Date().toISOString().split('T')[0];

            store.myApplications.unshift({
                id: newAppId,
                title: job.title,
                company: job.company,
                type: job.type,
                status: "Applied",
                appliedDate: today,
                hasReferral: false,
                currentStageIndex: 0,
                timeline: [ { stage: "Applied", date: today, desc: "Application manually submitted via portal.", status: "completed" } ]
            });
            store.dashboardStats.applications += 1;
            
            // Generate notification
            store.notificationsData.unshift({
                title: "Application Submitted",
                message: `You successfully applied for ${job.title} at ${job.company}.`,
                isRead: false
            });
        }
    });

    renderJobsList();
    renderSelectedJob();
    import('./store.js').then(mod => mod.renderGlobalNotifList());
};

window.checkEligibility = function(jobId) {
    import('./store.js').then(mod => {
        const store = mod.getStore();
        const job = store.recruiterJobs.find(j => j.id === jobId);
        if(!job) return;

        const userCgpa = parseFloat(store.currentUser.cgpa);
        const reqCgpa = parseFloat(job.cgpa);
        const cgpaPass = userCgpa >= reqCgpa;
        
        // Department Mapping
        const userDept = store.currentUser.department || "";
        let mappedDept = userDept;
        if (userDept === "Computer Science") mappedDept = "CSE";
        else if (userDept === "Information Technology") mappedDept = "IT";
        else if (userDept === "Electronics") mappedDept = "ECE";
        
        const branchPass = job.branches.includes(mappedDept) || job.branches.includes("Any");
        const isEligible = cgpaPass && branchPass;

        const passIcon = `<i class='bx bx-check-circle' style="color:#10b981; font-size:20px;"></i>`;
        const failIcon = `<i class='bx bx-x-circle' style="color:#ef4444; font-size:20px;"></i>`;

        const contentHtml = `
            <div style="margin-bottom: 24px; text-align: center;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: ${isEligible ? '#dcfce7' : '#fee2e2'}; color: ${isEligible ? '#16a34a' : '#dc2626'}; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px auto;">
                    <i class='bx ${isEligible ? 'bx-check' : 'bx-x'}'></i>
                </div>
                <h3 style="font-size: 20px; color: var(--text-primary); margin-bottom: 8px;">${isEligible ? 'You are Eligible!' : 'Not Eligible'}</h3>
                <p style="color: var(--text-secondary); font-size: 14px;">${job.title} at ${job.company}</p>
            </div>

            <div style="border: 1px solid #e2e8f0; border-radius: var(--radius-md); overflow: hidden;">
                <div style="display: flex; background: #f8fafc; padding: 12px 16px; font-weight: 600; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">
                    <div style="flex: 2;">Criteria</div>
                    <div style="flex: 1; text-align: center;">Required</div>
                    <div style="flex: 1; text-align: center;">Your Profile</div>
                    <div style="width: 40px;"></div>
                </div>
                
                <div style="display: flex; padding: 16px; align-items: center; border-bottom: 1px solid #e2e8f0;">
                    <div style="flex: 2; font-weight: 500; font-size: 14px;">Minimum CGPA</div>
                    <div style="flex: 1; text-align: center; font-size: 14px;">${reqCgpa.toFixed(1)}</div>
                    <div style="flex: 1; text-align: center; font-size: 14px; color: ${cgpaPass ? 'inherit' : '#ef4444'};">${userCgpa.toFixed(1)}</div>
                    <div style="width: 40px; text-align: center;">${cgpaPass ? passIcon : failIcon}</div>
                </div>
                
                <div style="display: flex; padding: 16px; align-items: center;">
                    <div style="flex: 2; font-weight: 500; font-size: 14px;">Branch</div>
                    <div style="flex: 1; text-align: center; font-size: 14px;">${job.branches.join(', ')}</div>
                    <div style="flex: 1; text-align: center; font-size: 14px; color: ${branchPass ? 'inherit' : '#ef4444'};">${mappedDept}</div>
                    <div style="width: 40px; text-align: center;">${branchPass ? passIcon : failIcon}</div>
                </div>
            </div>

            <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px;">
                <button class="btn-secondary" onclick="document.getElementById('modal-eligibility').close()">Close</button>
                ${isEligible ? `<button class="btn-primary" onclick="confirmEligibilityApply(${jobId})">Apply Now</button>` : `<button class="btn-primary" style="opacity: 0.5; cursor: not-allowed;" disabled>Apply Now</button>`}
            </div>
        `;

        document.getElementById('eligibility-content').innerHTML = contentHtml;
        document.getElementById('modal-eligibility').showModal();
        
        // Quietly set checked flag in bg for UI
        mod.updateStore(s => {
            const innerJob = s.recruiterJobs.find(j => j.id === jobId);
            if(innerJob) innerJob.eligibilityChecked = true;
        });
        renderSelectedJob();
    });
};

window.confirmEligibilityApply = function(jobId) {
    document.getElementById('modal-eligibility').close();
    
    // Reset terms
    document.getElementById('chk-terms').checked = false;
    document.getElementById('btn-final-apply').disabled = true;
    document.getElementById('btn-final-apply').style.opacity = '0.5';
    
    // Bind final click
    document.getElementById('btn-final-apply').onclick = function() {
        document.getElementById('modal-terms').close();
        
        // Actually execute apply
        window.applyJob(jobId);
        
        // Let state update DOM quietly, but immediately pop Success!
        setTimeout(() => {
            document.getElementById('modal-success').showModal();
        }, 300);
    };
    
    document.getElementById('modal-terms').showModal();
};

function renderJobsList() {
    if(!jobsListContainer) return;
    jobsListContainer.innerHTML = '';
    const jobs = getFilteredJobs();
    
    jobs.forEach(job => {
        const isJob = job.type.includes('Full-Time') || job.type.includes('Full-time');
        const typeBadgeClass = isJob ? 'type-job' : 'type-intern';
        const typeBadgeText = isJob ? 'Job' : 'Intern';
        
        let statusHtml = '';
        if (job.appliedStatus === 'Applied') {
            statusHtml = `<span class="status-indicator text-applied"><i class='bx bx-check'></i> Applied</span>`;
        } else if (job.eligibilityChecked && 8.7 < job.cgpa) { 
            /* Hardcoding check vs dummy data just for list view or leaving it empty if not applied. Let's just leave it empty if not applied. */ 
        }

        const previewTags = job.tags ? job.tags.slice(0, 2).map(tag => `<span class="tag-small">${tag}</span>`).join('') : '';
        const isActive = job.id === activeJobId ? 'active-card' : '';

        jobsListContainer.innerHTML += `
            <div class="job-item-card ${isActive}" onclick="selectJob(${job.id})">
                <div class="job-item-header">
                    <h4>${job.title}</h4>
                    <span class="type-badge ${typeBadgeClass}">${typeBadgeText}</span>
                </div>
                <div class="job-item-company">${job.company}</div>
                <div class="job-item-meta">
                    <span><i class='bx bx-map'></i> ${job.location.split(',')[0]}</span>
                    <span><strong>${job.salary}</strong></span>
                </div>
                <div class="job-item-footer">
                    <div class="tag-list">
                        ${previewTags}
                    </div>
                    ${statusHtml}
                </div>
            </div>
        `;
    });
}

function renderSelectedJob() {
    if(!jobDetailsContainer) return;
    const store = getStore();
    const job = store.recruiterJobs.find(j => j.id === activeJobId);
    if (!job) return;

    const isJob = job.type.includes('Full-Time') || job.type.includes('Full-time');
    const badgeClass = isJob ? 'type-job' : 'type-intern';
    const badgeText = isJob ? 'Full-time Job' : 'Intern';
    
    let actionButtonHtml = '';
    let warningHtml = '';
    
    const userDept = store.currentUser.department || "";
    let mappedDept = userDept;
    if (userDept === "Computer Science") mappedDept = "CSE";
    else if (userDept === "Information Technology") mappedDept = "IT";
    else if (userDept === "Electronics") mappedDept = "ECE";
    
    const branchPass = job.branches.includes(mappedDept) || job.branches.includes("Any");
    const cgpaPass = store.currentUser.cgpa >= job.cgpa;

    if (job.appliedStatus === 'Applied') {
        actionButtonHtml = `<button class="btn-applied-state" onclick="window.location.href='applications.html'" style="width: 100%; border-radius: var(--radius-md); padding: 16px; font-weight:600; background: #e2e8f0; color: #475569; border:none; margin-bottom: 20px;"><i class='bx bx-check'></i> Tracking in My Applications</button>`;
        warningHtml = `<div class="cgpa-warning" style="color:#64748b; font-size: 13px;">You have already submitted an application for this role.</div>`;
    } else if (job.eligibilityChecked) {
        if (cgpaPass && branchPass) {
            actionButtonHtml = `<button class="btn-primary" onclick="applyJob(${job.id})" style="width: 100%; border-radius: var(--radius-md); padding: 16px; font-weight:600; background-color:#16a34a; border:none; margin-bottom: 20px; transition: background 0.2s;">Apply Now</button>`;
            warningHtml = `<div class="cgpa-warning" style="color:#16a34a; font-weight:600; font-size: 14px;"><i class='bx bx-check'></i> You are eligible to apply!</div>`;
        } else {
            actionButtonHtml = `<button class="btn-ineligible-state" style="width: 100%; border-radius: var(--radius-md); padding: 16px; font-weight:600; background-color: #fee2e2; color: #ef4444; border:none; margin-bottom: 20px; cursor:not-allowed;">Ineligible (${!cgpaPass ? 'CGPA' : 'Branch'})</button>`;
            warningHtml = `<div class="cgpa-warning" style="color:#ef4444; font-size: 13px;"><i class='bx bx-error'></i> You do not meet the minimum eligibility criteria.</div>`;
        }
    } else {
        actionButtonHtml = `<button class="btn-primary" onclick="checkEligibility(${job.id})" style="width: 100%; border-radius: var(--radius-md); padding: 16px; font-weight:600; border:none; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(57, 52, 160, 0.2);">Check Eligibility</button>`;
        warningHtml = ``;
    }

    const branchesHtml = job.branches ? job.branches.map(b => `<span class="tag-small" style="background:#f1f5f9; color:#64748b;">${b}</span>`).join(' ') : '';
    const tagsHtml = job.tags ? job.tags.map(t => `<span class="tag">${t}</span>`).join('') : '';
    const compensationLabel = isJob ? 'CTC' : 'Stipend';

    jobDetailsContainer.innerHTML = `
        <div class="details-card">
            <div class="details-header-row">
                <h2>${job.title}</h2>
                <span class="type-badge ${badgeClass}" style="padding: 6px 14px; font-size: 13px;">${badgeText}</span>
            </div>
            <div class="details-company">${job.company}</div>
            
            <div class="details-grid-meta">
                <div class="meta-block">
                    <label>Location</label>
                    <span>${job.location}</span>
                </div>
                <div class="meta-block">
                    <label>${compensationLabel}</label>
                    <span>${job.salary}</span>
                </div>
                <div class="meta-block">
                    <label>Openings</label>
                    <span>${job.openings}</span>
                </div>
                <div class="meta-block">
                    <label>Deadline</label>
                    <span>${job.deadline}</span>
                </div>
                <div class="meta-block" style="grid-column: span 3;">
                    <label>Applications</label>
                    <span>${job.applications || 0}</span>
                </div>
            </div>

            ${actionButtonHtml}
            ${warningHtml}
        </div>

        <div class="details-card">
            <h3 class="section-title">Eligibility Criteria</h3>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); overflow: hidden;">
                <div class="eligibility-row" style="padding: 16px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                    <span class="eligibility-label" style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Minimum CGPA</span>
                    <span class="badge-check" style="background-color: #dcfce7; color: #16a34a; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">✓ ${job.cgpa}</span>
                </div>
                <div class="eligibility-row" style="padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                    <span class="eligibility-label" style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Eligible Branches</span>
                    <div style="text-align: right;">${branchesHtml}</div>
                </div>
            </div>
        </div>

        <div class="details-card">
            <h3 class="section-title">Job Description</h3>
            <p class="description-text">${job.description}</p>
        </div>

        <div class="details-card">
            <h3 class="section-title">Required Skills</h3>
            <div class="details-skills">
                ${tagsHtml}
            </div>
        </div>

        <div style="text-align: center; padding: 10px 0 30px 0;">
            <button class="btn-secondary" onclick="window.openAskQueryModal(event)" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 12px 24px; border-radius: var(--radius-md); font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">
                <i class='bx bx-message-rounded-dots'></i> Ask Query
            </button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    initGlobalNotifications();
    renderLayout();
});
