import { getStore, initGlobalNotifications, updateStore, renderUserNav } from './store.js';

// DOM Elements
const profilePicture = document.getElementById('profile-picture');
const profileBanner = document.getElementById('profile-banner');
const profileName = document.getElementById('profile-name');
const profileHeadline = document.getElementById('profile-headline');
const profileLocation = document.getElementById('profile-location');
const profileUniversity = document.getElementById('profile-university');
const profileEmail = document.getElementById('profile-email');
const profilePhone = document.getElementById('profile-phone');
const profileAbout = document.getElementById('profile-about');
const profileSocials = document.getElementById('profile-socials');

// Containers
const expContainer = document.getElementById('experience-container');
const eduContainer = document.getElementById('education-container');
const projContainer = document.getElementById('projects-container');
const codingContainer = document.getElementById('coding-profiles-container');
const certContainer = document.getElementById('certifications-container');
const extraContainer = document.getElementById('extracurricular-container');
const skillsContainer = document.getElementById('skills-container');
const langContainer = document.getElementById('languages-container');
const docsContainer = document.getElementById('docs-container');

// Master render function
window.renderLayout = function() {
    renderUserNav();
    const store = getStore();
    const user = store.currentUser;
    const data = store.profileResumeData;

    if (profileBanner) {
        if (user.bannerImage) {
            profileBanner.style.backgroundImage = `url(${user.bannerImage})`;
            profileBanner.style.backgroundSize = "cover";
            profileBanner.style.backgroundPosition = "center";
        } else {
            profileBanner.style.backgroundImage = "";
            profileBanner.style.backgroundSize = "";
            profileBanner.style.backgroundPosition = "";
        }
    }

    // 1. Header Binding
    if (profileName) profileName.textContent = user.name || "Name";
    if (profileHeadline) profileHeadline.textContent = user.headline || "";
    if (profileLocation) profileLocation.textContent = user.location || "";
    if (profileUniversity) profileUniversity.textContent = user.university || "";
    if (profileEmail) {
        profileEmail.textContent = user.email || "";
        profileEmail.href = `mailto:${user.email}`;
    }
    if (profilePhone) profilePhone.textContent = user.phone || "";
    if (profileAbout) profileAbout.textContent = user.about || "Add a summary about yourself...";

    // Social Links
    if (profileSocials && user.socialLinks) {
        let socialsHtml = '';
        if (user.socialLinks.linkedin) socialsHtml += `<span><i class='bx bxl-linkedin-square'></i> <a href="${user.socialLinks.linkedin}" target="_blank">LinkedIn</a></span>`;
        if (user.socialLinks.github) socialsHtml += `<span><i class='bx bxl-github'></i> <a href="${user.socialLinks.github}" target="_blank">GitHub</a></span>`;
        if (user.socialLinks.portfolio) socialsHtml += `<span><i class='bx bx-link-external'></i> <a href="${user.socialLinks.portfolio}" target="_blank">Portfolio</a></span>`;
        profileSocials.innerHTML = socialsHtml;
    }

    // 2. Timeline Arrays
    renderTimeline(data.experience, expContainer, 'experience', 'bx-briefcase', '#f1f5f9', 'var(--brand-primary)');
    renderTimeline(data.education, eduContainer, 'education', 'bxs-graduation', '#f5e6ff', '#9333ea');
    renderProjects(data.projects, projContainer);
    renderTimeline(data.certifications, certContainer, 'certifications', 'bx-certification', '#e6f0ff', '#2563eb', true);
    renderTimeline(data.extracurricular, extraContainer, 'extracurricular', 'bx-group', '#e6ffed', '#16a34a');
    renderCoding(data.codingProfiles, codingContainer);

    // 3. Pills Arrays
    renderPills(data.skills, skillsContainer);
    renderLanguages(data.languages, langContainer);
    renderDocs(data.additionalDocs, docsContainer);

    // Default Resume Bind
    const resumeFilename = document.getElementById('resume-filename');
    const resumeMeta = document.getElementById('resume-meta');
    if (resumeFilename && data.uploadedResume) {
        resumeFilename.textContent = data.uploadedResume.name;
        resumeMeta.textContent = `${data.uploadedResume.size} · Uploaded ${data.uploadedResume.date}`;
    }
}

function renderTimeline(list, container, type, iconCls, bg, color, short=false) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">No items added yet.</p>';
        return;
    }

    list.forEach((item, index) => {
        const issuerOrCompany = item.company || item.institution || item.issuer || item.tags || "";
        const dateStr = item.duration || item.date || "";
        const descRow = item.desc ? `<p class="desc">${item.desc}</p>` : '';
        const imgRow = item.image ? `<img src="${item.image}" class="timeline-image" alt="Evidence">` : '';
        
        container.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-icon" style="background-color: ${bg}; color: ${color};"><i class='bx ${iconCls}'></i></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4>${item.title || item.degree}</h4>
                        <button title="Delete" onclick="deleteProfileRecord('${type}', ${index})" class="delete-icon-btn"><i class='bx bx-trash'></i></button>
                    </div>
                    <p class="company">${issuerOrCompany}</p>
                    <p class="duration">${dateStr}</p>
                    ${!short ? descRow : ''}
                    ${imgRow}
                </div>
            </div>
        `;
    });
}

function renderProjects(list, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">No projects added yet.</p>';
        return;
    }
    list.forEach((item, index) => {
        const linkHtml = item.github ? `<a href="${item.github}" target="_blank" style="color: #64748b; margin-left:12px; font-size: 20px;" title="View Source"><i class='bx bxl-github'></i></a>` : '';
        container.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-icon" style="background-color: var(--purple-light); color: var(--purple-dark);"><i class='bx bx-code-alt'></i></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4 style="display:flex; align-items:center;">${item.title} ${linkHtml}</h4>
                        <button title="Delete Project" onclick="deleteProfileRecord('projects', ${index})" class="delete-icon-btn"><i class='bx bx-trash'></i></button>
                    </div>
                    <p class="duration" style="color: var(--text-secondary); font-weight:500; font-size:13px; margin-top:2px;">${item.tags || ''}</p>
                    <p class="desc" style="margin-top: 8px;">${item.description || item.desc}</p>
                </div>
            </div>
        `;
    });
}

function renderCoding(list, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">No coding profiles added.</p>';
        return;
    }
    list.forEach((item, index) => {
        const iconDict = { 'leetcode': 'bx-code-curly', 'hackerrank': 'bx-code-block', 'codeforces': 'bx-stats' };
        let iconMatch = 'bx-link';
        const searchStr = item.platform.toLowerCase();
        for(let key in iconDict) if(searchStr.includes(key)) iconMatch = iconDict[key];
        
        container.innerHTML += `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; border: 1px solid #e2e8f0; border-radius: var(--radius-md); transition: all 0.2s; background:white;">
                <a href="${item.url}" target="_blank" class="coding-profile-item" style="border:none; margin-bottom:0; flex:1;">
                    <i class='bx ${iconMatch} coding-icon'></i>
                    <div>
                        <h5 style="font-size:15px; margin-bottom:2px;">${item.platform}</h5>
                        <p style="font-size:13px; color:#64748b; margin:0;">${item.handle || 'View Profile'}</p>
                    </div>
                </a>
                <div style="padding-right: 12px;">
                    <button title="Delete" onclick="deleteProfileRecord('codingProfiles', ${index})" class="delete-icon-btn"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        `;
    });
}

function renderLanguages(list, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">None added.</p>';
        return;
    }
    list.forEach((lang, index) => {
        container.innerHTML += `
            <div class="lang-pill" style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; min-width: 140px; padding: 12px 16px;">
                <div>
                    <span class="lang-name" style="display:block;">${lang.name}</span>
                    <span class="lang-level" style="display:block;">${lang.level}</span>
                </div>
                <button title="Delete" onclick="deleteProfileRecord('languages', ${index})" class="delete-icon-btn" style="margin-left:8px;"><i class='bx bx-trash'></i></button>
            </div>
        `;
    });
}

function renderPills(list, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:14px;">No skills added.</p>';
        return;
    }
    list.forEach((item, index) => { 
        container.innerHTML += `<div class="skill-pill" style="display:flex; align-items:center; gap:6px;">
            ${item} 
            <i class='bx bx-x' onclick="deleteProfileRecord('skills', ${index})" style="cursor:pointer; font-size:18px; color:#94a3b8; padding: 2px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'" title="Delete Skill"></i>
        </div>`; 
    });
}

function renderDocs(list, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) return;
    list.forEach((doc, index) => {
        container.innerHTML += `
            <div class="file-upload-row" style="padding: 12px; background: #f8fafc; border: 1px dashed #cbd5e1;">
                <div style="display:flex; gap:12px; align-items:center;">
                    <div class="file-icon" style="color: var(--blue-dark); font-size: 20px;"><i class='bx bx-file'></i></div>
                    <div class="file-details">
                        <h5 style="font-size: 13px;">${doc.name}</h5>
                        <p style="font-size: 11px;">${doc.type} · ${doc.size}</p>
                    </div>
                </div>
                <div class="file-actions"><i class='bx bx-trash' onclick="deleteProfileRecord('additionalDocs', ${index});" style="cursor:pointer;" class="delete-btn-hover"></i></div>
            </div>
        `;
    });
}

let pendingDeleteType = null;
let pendingDeleteIndex = null;

window.deleteProfileRecord = function(type, index) {
    pendingDeleteType = type;
    pendingDeleteIndex = index;
    document.getElementById('modal-confirm-delete').showModal();
};

window.executeDeleteRecord = function() {
    updateStore(store => {
        if (store.profileResumeData[pendingDeleteType]) {
            store.profileResumeData[pendingDeleteType].splice(pendingDeleteIndex, 1);
        }
        store.notificationsData.unshift({
            title: "Record Deleted",
            message: "Item removed successfully from your profile.",
            isRead: false
        });
    });
    document.getElementById('modal-confirm-delete').close();
    renderLayout();
    import('./store.js').then(mod => mod.renderGlobalNotifList());
};

// ======================= MODAL LOGIC =======================

window.openModal = function(type) {
    const store = getStore();
    const user = store.currentUser;
    const data = store.profileResumeData;

    try {
        if (type === 'intro') {
            document.getElementById('inp-name').value = user.name || "";
            document.getElementById('inp-headline').value = user.headline || "";
            document.getElementById('inp-location').value = user.location || "";
            document.getElementById('inp-phone').value = user.phone || "";
            document.getElementById('inp-github').value = user.socialLinks?.github || "";
            document.getElementById('inp-linkedin').value = user.socialLinks?.linkedin || "";
            document.getElementById('inp-portfolio').value = user.socialLinks?.portfolio || "";
            document.getElementById('modal-intro').showModal();
        } 
        else if (type === 'about') {
            document.getElementById('inp-about').value = user.about || "";
            document.getElementById('modal-about').showModal();
        }
        else if (type === 'skills') {
            document.getElementById('inp-skills-items').value = '';
            document.getElementById('modal-skills').showModal();
        }
        else if (type === 'languages') {
            document.getElementById('form-languages').reset();
            document.getElementById('modal-languages').showModal();
        }
        else if (type === 'codingProfiles') {
            document.getElementById('form-coding').reset();
            document.getElementById('modal-codingProfiles').showModal();
        }
        else {
            // General record modal
            document.getElementById('inp-rec-type').value = type;
            document.getElementById('form-record').reset();
            document.getElementById('inp-rec-image-base64').value = ""; // clear hidden data
            
            const titleLbl = document.getElementById('lbl-rec-title');
            const subLbl = document.getElementById('lbl-rec-subtitle');
            document.getElementById('grp-rec-duration').style.display = 'flex';
            document.getElementById('grp-rec-desc').style.display = 'flex';
            document.getElementById('grp-rec-link').style.display = 'none';
            document.getElementById('grp-rec-img').style.display = 'block'; // Ensure it's reset

            if (type === 'projects') {
                titleLbl.textContent = "Project Name";
                subLbl.textContent = "Technologies Used (e.g., React, Node)";
                document.getElementById('grp-rec-duration').style.display = 'none';
                document.getElementById('grp-rec-img').style.display = 'none'; // No img for project
                document.getElementById('grp-rec-link').style.display = 'block';
            } else if (type === 'education') {
                titleLbl.textContent = "Degree";
                subLbl.textContent = "Institution";
                document.getElementById('grp-rec-img').style.display = 'none'; 
            } else if (type === 'certifications') {
                titleLbl.textContent = "Certification Name";
                subLbl.textContent = "Issuer";
                document.getElementById('grp-rec-desc').style.display = 'none';
            } else {
                titleLbl.textContent = "Title / Role";
                subLbl.textContent = "Organization / Company";
            }
            
            document.getElementById('modal-record').showModal();
        }
    } catch(err) {
        console.error("Modal open error:", err);
    }
};

window.closeModal = function(id) {
    const dialog = document.getElementById(`modal-${id}`);
    if (dialog) dialog.close();
};

window.saveProfileData = function(formType) {
    updateStore(store => {
        if (formType === 'intro') {
            store.currentUser.name = document.getElementById('inp-name').value;
            store.currentUser.headline = document.getElementById('inp-headline').value;
            store.currentUser.location = document.getElementById('inp-location').value;
            store.currentUser.phone = document.getElementById('inp-phone').value;
            store.currentUser.socialLinks = {
                github: document.getElementById('inp-github').value,
                linkedin: document.getElementById('inp-linkedin').value,
                portfolio: document.getElementById('inp-portfolio').value
            };
            const parts = store.currentUser.name.split(' ');
            store.currentUser.avatar = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];

        } else if (formType === 'about') {
            store.currentUser.about = document.getElementById('inp-about').value;
        } else if (formType === 'skills') {
            if(!store.profileResumeData.skills) store.profileResumeData.skills = [];
            const newSkill = document.getElementById('inp-skills-items').value.trim();
            if (newSkill) store.profileResumeData.skills.push(newSkill);
        } else if (formType === 'languages') {
            if(!store.profileResumeData.languages) store.profileResumeData.languages = [];
            store.profileResumeData.languages.push({
                name: document.getElementById('inp-lang-name').value,
                level: document.getElementById('inp-lang-level').value
            });
        } else if (formType === 'codingProfiles') {
            if(!store.profileResumeData.codingProfiles) store.profileResumeData.codingProfiles = [];
            store.profileResumeData.codingProfiles.push({
                platform: document.getElementById('inp-coding-platform').value,
                url: document.getElementById('inp-coding-url').value,
                handle: document.getElementById('inp-coding-handle').value
            });
        }
    });

    closeModal(formType);
    renderLayout(); // Instantly update view
};

function formatMonthYear(dateString) {
    if(!dateString) return "";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

window.saveProfileRecord = function() {
    const type = document.getElementById('inp-rec-type').value;
    
    updateStore(store => {
        if (!store.profileResumeData[type]) store.profileResumeData[type] = [];
        
        const startRaw = document.getElementById('inp-rec-start').value;
        const endRaw = document.getElementById('inp-rec-end').value;
        const startStr = formatMonthYear(startRaw);
        const endStr = endRaw ? formatMonthYear(endRaw) : "Present";
        const durationCombo = startStr ? `${startStr} - ${endStr}` : '';
        const base64Img = document.getElementById('inp-rec-image-base64').value; // from standard attach process

        let newRecord = {};
        
        if (type === 'projects') {
            newRecord = {
                title: document.getElementById('inp-rec-title').value,
                tags: document.getElementById('inp-rec-subtitle').value,
                github: document.getElementById('inp-rec-link').value,
                description: document.getElementById('inp-rec-desc').value
            };
        } else if (type === 'education') {
            newRecord = {
                degree: document.getElementById('inp-rec-title').value,
                institution: document.getElementById('inp-rec-subtitle').value,
                duration: durationCombo,
                desc: document.getElementById('inp-rec-desc').value
            };
        } else if (type === 'certifications') {
             newRecord = {
                title: document.getElementById('inp-rec-title').value,
                issuer: document.getElementById('inp-rec-subtitle').value,
                date: startStr, // Single date preferred here typically
                image: base64Img
            };
        } else {
            newRecord = {
                title: document.getElementById('inp-rec-title').value,
                company: document.getElementById('inp-rec-subtitle').value,
                duration: durationCombo,
                desc: document.getElementById('inp-rec-desc').value,
                image: base64Img
            };
        }
        
        store.profileResumeData[type].push(newRecord);
    });

    closeModal('record');
    renderLayout();
};


// Image Attachment Sync for Record Modal
const recordImgInp = document.getElementById('inp-rec-image-file');
if (recordImgInp) {
    recordImgInp.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { document.getElementById('inp-rec-image-base64').value = ev.target.result; };
        reader.readAsDataURL(file);
    });
}

// Global Profile Banner & Avatar Uploader
// ======================= IMAGE UPLOAD OPTIONS & LOGIC =======================
let currentUploadTarget = null; // 'banner' or 'avatar'

window.openImageOptions = function(targetType) {
    currentUploadTarget = targetType;
    document.getElementById('image-options-title').textContent = targetType === 'banner' ? 'Update Background' : 'Update Profile Picture';
    document.getElementById('modal-image-options').showModal();
};

window.triggerImageUpload = function(method) {
    document.getElementById('modal-image-options').close();
    const inputId = method === 'camera' ? 'upload-generic-camera' : 'upload-generic-storage';
    const fileInput = document.getElementById(inputId);
    fileInput.onchange = (e) => handleImageUpload(e, currentUploadTarget);
    fileInput.click();
};

window.triggerImageDelete = function() {
    document.getElementById('modal-image-options').close();
    updateStore(store => {
        store.currentUser[currentUploadTarget] = ""; // Clear specific base-64
        store.notificationsData.unshift({
            title: "Image Deleted",
            message: "Media successfully removed from your profile.",
            isRead: false
        });
    });
    renderLayout();
    import('./store.js').then(mod => mod.renderGlobalNotifList());
};

window.handleImageUpload = function(event, targetType) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        updateStore(store => {
            if (targetType === 'banner') store.currentUser.bannerImage = e.target.result;
            if (targetType === 'avatar') store.currentUser.avatarImage = e.target.result;
        });
        renderLayout();
    };
    reader.readAsDataURL(file);
};

// Documents Upload Sync
const fileUploadInp = document.getElementById('file-upload-input');
if (fileUploadInp) {
    fileUploadInp.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            updateStore(store => {
                if (!store.profileResumeData.additionalDocs) store.profileResumeData.additionalDocs = [];
                store.profileResumeData.additionalDocs.push({
                    name: file.name,
                    type: "Document",
                    size: (file.size / 1024).toFixed(0) + ' KB'
                });
                store.notificationsData.unshift({
                    title: "Document Uploaded",
                    message: `Successfully uploaded ${file.name}.`,
                    isRead: false
                });
            });
            renderLayout();
            import('./store.js').then(mod => mod.renderGlobalNotifList());
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGlobalNotifications();
    renderLayout();
});
