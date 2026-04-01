import { getStore, initGlobalNotifications, renderUserNav } from '../Js/store.js';

// DOM Elements - Profile & Banner
const bannerGreeting = document.getElementById('banner-greeting');
const bannerDetails = document.getElementById('banner-details');

// DOM Elements - Stats
const statApps = document.getElementById('stat-apps');
const statJobs = document.getElementById('stat-jobs');
const statInternships = document.getElementById('stat-internships');
const statInterviews = document.getElementById('stat-interviews');

// DOM Elements - Lists & Grids
const applicationsList = document.getElementById('applications-list');
const eventsList = document.getElementById('events-list');
const announcementsList = document.getElementById('announcements-list');
const jobsGrid = document.getElementById('jobs-grid');

function renderDashboard() {
    renderUserNav();
    const store = getStore();
    const { currentUser, dashboardStats, recruiterJobs, myApplications, upcomingEvents, announcementsData } = store;
    
    // 1. Render User Profile Banner
    const firstName = currentUser.name.split(' ')[0];

    bannerGreeting.innerHTML = `Welcome back, ${firstName}! 👋`;
    bannerDetails.textContent = `${currentUser.department} · CGPA: ${currentUser.cgpa} · ${currentUser.batch}`;

    // 2. Render Analytics Stats
    statApps.textContent = dashboardStats.applications;
    statJobs.textContent = dashboardStats.availableJobs;
    statInternships.textContent = dashboardStats.internships;
    statInterviews.textContent = dashboardStats.interviews;

    // 3. Render My Applications List
    applicationsList.innerHTML = '';
    myApplications.slice(0, 6).forEach(app => {
        let statusClass = 'status-applied';
        let icon = 'bx-time';
        
        if (app.status === 'Interview') {
            statusClass = 'status-interview';
            icon = 'bx-group';
        } else if (app.status === 'Shortlisted') {
            statusClass = 'status-shortlisted';
            icon = 'bx-trending-up';
        }

        // Deep linking hook here! Clicks route to specific ID accordion.
        applicationsList.innerHTML += `
            <div class="list-item" style="cursor:pointer; transition:0.2s;" onclick="window.location.href='applications.html?appId=${app.id}'" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <div class="item-details">
                    <h4>${app.title}</h4>
                    <p>${app.company} · ${app.type}</p>
                </div>
                <div class="item-status ${statusClass}">
                    <i class='bx ${icon}'></i> ${app.status}
                </div>
            </div>
        `;
    });

    // 4. Render Upcoming Events
    eventsList.innerHTML = '';
    upcomingEvents.forEach(event => {
        let statusClass = 'status-applied';
        let iconHtml = '';
        
        if (event.type === 'Interview') {
            statusClass = 'status-interview';
            iconHtml = `<i class='bx bx-time-five'></i>`;
        }

        eventsList.innerHTML += `
            <div class="list-item" style="cursor:pointer;" onclick="window.location.href='opportunities.html'">
                <div class="item-details">
                    <h4>${event.title}</h4>
                    <p>${event.company} · ${event.role}</p>
                </div>
                <div class="item-date ${statusClass}">
                    ${iconHtml} ${event.date}
                </div>
            </div>
        `;
    });

    // 4.5 Render Announcements
    if (announcementsList) {
        announcementsList.innerHTML = '';
        if (announcementsData && announcementsData.length > 0) {
            announcementsData.forEach(ann => {
                let badgeColor = '#3b82f6';
                if (ann.priority === 'high') badgeColor = '#ef4444';
                if (ann.priority === 'medium') badgeColor = '#f59e0b';
                
                announcementsList.innerHTML += `
                    <div class="list-item" style="align-items:flex-start;">
                        <div class="item-details" style="flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <h4 style="margin:0; font-size:14px;">${ann.title}</h4>
                                <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:${badgeColor}20; color:${badgeColor}; font-weight:600;">${ann.priority.toUpperCase()}</span>
                            </div>
                            <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${ann.message}</p>
                            <span style="font-size:11px; color:#94a3b8; margin-top:6px; display:inline-block;">${ann.date}</span>
                        </div>
                    </div>
                `;
            });
        }
    }

    // 5. Render Jobs Grid
    jobsGrid.innerHTML = '';
    const unappliedJobs = recruiterJobs.filter(j => j.appliedStatus !== 'Applied' && j.appliedStatus !== 'Shortlisted' && j.appliedStatus !== 'Interview');
    
    if (unappliedJobs.length === 0) {
        jobsGrid.innerHTML = '<div style="padding: 20px; color: #94a3b8; width: 100%; text-align: center;">You have applied to all recommended opportunities! Browse to find more.</div>';
    }
    
    unappliedJobs.slice(0, 3).forEach(job => {
        // Evaluate logic for type badges
        const badgeClass = job.type.includes('Full-Time') || job.type.includes('Full-time') 
                           ? 'type-fulltime' : 'type-internship';
        
        // Render tags efficiently
        const tagsHTML = job.tags ? job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        const actionBtn = `<button class="btn-primary" onclick="window.location.href='opportunities.html?jobId=${job.id}'">View details</button>`;

        jobsGrid.innerHTML += `
            <div class="job-card">
                <div class="job-header">
                    <div class="job-title-wrapper">
                        <h4>${job.title}</h4>
                        <span class="badge ${badgeClass}">${job.type}</span>
                    </div>
                    <p class="company">${job.company}</p>
                    <p class="location">${job.location}</p>
                    <p class="package">${job.salary}</p>
                </div>
                <div class="job-tags">
                    ${tagsHTML}
                </div>
                ${actionBtn}
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    initGlobalNotifications();
});
