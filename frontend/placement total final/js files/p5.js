/* ═══ CareerNest — User Oversight Module ═══ */

let currentTab = 'candidates';

document.addEventListener('DOMContentLoaded', () => {
    initUserBadge();
    renderUsers();
});

function initUserBadge() {
    const badge = document.getElementById('bellBadge');
    if(badge && MOCK.notifications) {
        badge.innerText = MOCK.notifications.filter(n => !n.read).length || 0;
    }
}

function switchUserTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    let title = 'Manage Candidates';
    if(tab === 'alumni') title = 'Alumni & Referrals';
    if(tab === 'recruiters') title = 'Recruiters';
    document.getElementById('tableTitle').innerText = title;
    
    document.getElementById('userSearch').value = '';
    renderUsers();
}

function renderUsers(searchQuery = '') {
    const wrapper = document.getElementById('usersTableWrapper');
    let data = [];
    
    if (currentTab === 'candidates') {
        data = MOCK.users ? MOCK.users.filter(u => u.role === 'candidate') : [];
    } else if (currentTab === 'alumni') {
        data = MOCK.users ? MOCK.users.filter(u => u.role === 'alumni') : [];
    } else if (currentTab === 'recruiters') {
        data = MOCK.recruiters || [];
    }
    
    if(searchQuery) {
        data = data.filter(u => 
            (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    if (data.length === 0) {
        wrapper.innerHTML = '<div style="padding:2rem; text-align:center; color:#6b7280;">No users found.</div>';
        return;
    }

    let html = '<table style="width:100%; border-collapse:collapse; text-align:left;">';
    
    if (currentTab === 'candidates') {
        html += `<thead>
                    <tr style="border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:0.875rem;">
                        <th style="padding:1rem;">Candidate</th>
                        <th style="padding:1rem;">Roll No & Branch</th>
                        <th style="padding:1rem;">Academics</th>
                        <th style="padding:1rem;">Status</th>
                        <th style="padding:1rem; text-align:right;">Actions</th>
                    </tr>
                 </thead><tbody>`;
                 
        data.forEach(c => {
            const statusColor = c.status === 'active' ? '#10b981' : '#ef4444';
            html += `<tr style="border-bottom:1px solid #f3f4f6; transition:background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
                <td style="padding:1rem;">
                    <div style="font-weight:600; color:#1f2937;">${c.name}</div>
                    <div style="font-size:0.8rem; color:#6b7280;">${c.email}</div>
                </td>
                <td style="padding:1rem; color:#4b5563;">${c.roll || '-'}<br><span style="font-size:0.8rem; color:#6b7280;">${c.branch || '-'}</span></td>
                <td style="padding:1rem;">
                    <span style="color:${c.cgpa >= 7.0 ? '#10b981' : '#f59e0b'}; font-weight:600;">CGPA: ${c.cgpa}</span><br>
                    <span style="font-size:0.8rem; color:#6b7280;">Backlogs: ${c.backlogs}</span>
                </td>
                <td style="padding:1rem;">
                    <span style="padding:0.25rem 0.6rem; border-radius:12px; font-size:0.75rem; background:${statusColor}22; color:${statusColor}; font-weight:600; text-transform:capitalize;">${c.status}</span>
                </td>
                <td style="padding:1rem; text-align:right;">
                    <button onclick="editUser('${c.id}')" style="background:transparent; border:none; color:#7c3aed; cursor:pointer; font-weight:600; margin-right:10px;">Edit</button>
                    <button onclick="deleteUser('${c.id}')" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-weight:600;">Delete</button>
                </td>
            </tr>`;
        });
    } else if (currentTab === 'alumni') {
        html += `<thead>
                    <tr style="border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:0.875rem;">
                        <th style="padding:1rem;">Alumni</th>
                        <th style="padding:1rem;">Company & Role</th>
                        <th style="padding:1rem;">Batch</th>
                        <th style="padding:1rem;">Referrals Provided</th>
                        <th style="padding:1rem;">Status</th>
                        <th style="padding:1rem; text-align:right;">Actions</th>
                    </tr>
                 </thead><tbody>`;
                 
        data.forEach(a => {
            const statusColor = a.status === 'active' ? '#10b981' : '#ef4444';
            html += `<tr style="border-bottom:1px solid #f3f4f6; transition:background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
                <td style="padding:1rem;">
                    <div style="font-weight:600; color:#1f2937;">${a.name}</div>
                    <div style="font-size:0.8rem; color:#6b7280;">${a.email}</div>
                </td>
                <td style="padding:1rem; color:#4b5563;">${a.company || '-'}<br><span style="font-size:0.8rem; color:#6b7280;">${a.role || '-'}</span></td>
                <td style="padding:1rem; color:#4b5563;">${a.batch || '-'}</td>
                <td style="padding:1rem;">
                    <div style="display:inline-block; padding:0.2rem 0.6rem; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:6px; color:#374151; font-weight:600; font-size:0.85rem;">${a.referrals || 0}</div>
                </td>
                <td style="padding:1rem;">
                    <span style="padding:0.25rem 0.6rem; border-radius:12px; font-size:0.75rem; background:${statusColor}22; color:${statusColor}; font-weight:600; text-transform:capitalize;">${a.status}</span>
                </td>
                <td style="padding:1rem; text-align:right;">
                    <button onclick="editUser('${a.id}')" style="background:transparent; border:none; color:#7c3aed; cursor:pointer; font-weight:600; margin-right:10px;">Edit</button>
                    <button onclick="deleteUser('${a.id}')" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-weight:600;">Delete</button>
                </td>
            </tr>`;
        });
    } else {
        html += `<thead>
                    <tr style="border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:0.875rem;">
                        <th style="padding:1rem;">Recruiter</th>
                        <th style="padding:1rem;">Company</th>
                        <th style="padding:1rem;">Contact</th>
                        <th style="padding:1rem;">Status</th>
                        <th style="padding:1rem; text-align:right;">Actions</th>
                    </tr>
                 </thead><tbody>`;
                 
        data.forEach(r => {
            let statusColor = '#10b981';
            if(r.status === 'pending') statusColor = '#f59e0b';
            if(r.status === 'inactive') statusColor = '#ef4444';
            
            html += `<tr style="border-bottom:1px solid #f3f4f6; transition:background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
                <td style="padding:1rem;">
                    <div style="font-weight:600; color:#1f2937;">${r.name}</div>
                    <div style="font-size:0.8rem; color:#6b7280;">${r.role || 'Recruiter'}</div>
                </td>
                <td style="padding:1rem; color:#4b5563;">
                    <div style="font-weight:500;">${r.company || '-'}</div>
                </td>
                <td style="padding:1rem; color:#4b5563;">
                    <div style="font-size:13px;">${r.email}</div>
                    <div style="font-size:13px; color:#6b7280;">${r.phone || '-'}</div>
                </td>
                <td style="padding:1rem;">
                    <span style="padding:0.25rem 0.6rem; border-radius:12px; font-size:0.75rem; background:${statusColor}22; color:${statusColor}; font-weight:600; text-transform:capitalize;">${r.status}</span>
                </td>
                <td style="padding:1rem; text-align:right;">
                    <button onclick="editRecruiter('${r.email}')" style="background:transparent; border:none; color:#7c3aed; cursor:pointer; font-weight:600; margin-right:10px;">Edit</button>
                    <button onclick="deleteRecruiter('${r.email}')" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-weight:600;">Delete</button>
                </td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    wrapper.innerHTML = html;
}

function filterUsers() {
    const q = document.getElementById('userSearch').value;
    renderUsers(q);
}

function toggleModalFields() {
    document.getElementById('candidateFields').style.display = 'none';
    document.getElementById('alumniFields').style.display = 'none';
    document.getElementById('recruiterFields').style.display = 'none';
    
    if (currentTab === 'candidates') {
        document.getElementById('candidateFields').style.display = 'block';
    } else if (currentTab === 'alumni') {
        document.getElementById('alumniFields').style.display = 'block';
    } else if (currentTab === 'recruiters') {
        document.getElementById('recruiterFields').style.display = 'block';
    }
}

function openAddUserModal() {
    let typeName = 'Candidate';
    if(currentTab === 'alumni') typeName = 'Alumni';
    if(currentTab === 'recruiters') typeName = 'Recruiter';
    
    document.getElementById('modalTitle').innerText = 'Add ' + typeName;
    document.getElementById('editUserId').value = '';

    // reset fields
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userEmail').disabled = false;
    document.getElementById('userStatus').value = 'active';

    // remove previous errors (important)
    document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');

    document.getElementById('userRoll').value = '';
    document.getElementById('userBranch').value = '';
    document.getElementById('userCgpa').value = '';
    document.getElementById('userBacklogs').value = '';
    
    document.getElementById('userCompany').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('userBatch').value = '';
    document.getElementById('userReferrals').value = '';
    
    document.getElementById('recruiterCompany').value = '';
    document.getElementById('recruiterRole').value = '';
    document.getElementById('recruiterPhone').value = '';
    document.getElementById('recruiterLocation').value = '';
    
    toggleModalFields();

    document.getElementById('userModal').classList.add('open');
    document.getElementById('userModal').style.display = 'flex';
}

function editUser(id) {
    let list = MOCK.users ? MOCK.users : [];
    let user = list.find(u => u.id == id);

    if(user) {
        let typeName = currentTab === 'candidates' ? 'Candidate' : 'Alumni';

        document.getElementById('modalTitle').innerText = 'Edit ' + typeName;
        document.getElementById('editUserId').value = id;

        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userEmail').disabled = true;
        document.getElementById('userStatus').value = user.status;

        // clear previous errors
        document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');

        if (currentTab === 'candidates') {
            document.getElementById('userRoll').value = user.roll || '';
            document.getElementById('userBranch').value = user.branch || '';
            document.getElementById('userCgpa').value = user.cgpa || '';
            document.getElementById('userBacklogs').value = user.backlogs || 0;
        } else {
            document.getElementById('userCompany').value = user.company || '';
            document.getElementById('userRole').value = user.role || '';
            document.getElementById('userBatch').value = user.batch || '';
            document.getElementById('userReferrals').value = user.referrals || 0;
        }

        toggleModalFields();

        document.getElementById('userModal').classList.add('open');
        document.getElementById('userModal').style.display = 'flex';
    }
}

function editRecruiter(email) {
    let r = MOCK.recruiters.find(x => x.email === email);
    if(r) {
        document.getElementById('modalTitle').innerText = 'Edit Recruiter';
        document.getElementById('editUserId').value = email; // use email as ID
        document.getElementById('userName').value = r.name;
        document.getElementById('userEmail').value = r.email;
        document.getElementById('userEmail').disabled = true;
        document.getElementById('userStatus').value = r.status || 'active';
        
        document.getElementById('recruiterCompany').value = r.company || '';
        document.getElementById('recruiterRole').value = r.role || '';
        document.getElementById('recruiterPhone').value = r.phone || '';
        document.getElementById('recruiterLocation').value = r.location || '';
        
        toggleModalFields();
        document.getElementById('userModal').classList.add('open');
        document.getElementById('userModal').style.display = 'flex';
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('open');
    document.getElementById('userModal').style.display = 'none';
}

function saveUser() {
    if (!validateUserForm()) return;
    
    let id = document.getElementById('editUserId').value; // numeric for users, email for recruiters
    let newStatus = document.getElementById('userStatus').value;
    let newName = document.getElementById('userName').value.trim();
    let newEmail = document.getElementById('userEmail').value.trim();
    
    if(!newName) return alert("Please enter a valid Full Name.");
    if(document.getElementById('emailError')) document.getElementById('emailError').style.display = 'none';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        if(document.getElementById('emailError')) document.getElementById('emailError').style.display = 'block';
        return;
    }
    
    if (currentTab === 'recruiters') {
        let rComp = document.getElementById('recruiterCompany').value.trim();
        let rRole = document.getElementById('recruiterRole').value.trim();
        let rPhone = document.getElementById('recruiterPhone').value.trim();
        let rLoc = document.getElementById('recruiterLocation').value.trim();
        
        if(!rComp) return alert("Company is required.");
        
        if(id) {
            let idx = MOCK.recruiters.findIndex(x => x.email === id);
            if(idx > -1) {
                MOCK.recruiters[idx].name = newName;
                MOCK.recruiters[idx].status = newStatus;
                MOCK.recruiters[idx].company = rComp;
                MOCK.recruiters[idx].role = rRole;
                MOCK.recruiters[idx].phone = rPhone;
                MOCK.recruiters[idx].location = rLoc;
            }
        } else {
            MOCK.recruiters.unshift({
                name: newName, email: newEmail, status: newStatus,
                company: rComp, role: rRole, phone: rPhone, location: rLoc
            });
        }
    } else {
        if(!MOCK.users) MOCK.users = [];
        
        let roll='', branch='', cgpa=0, backlogs=0, company='', role='', batch='', referrals=0;
        
        if (currentTab === 'candidates') {
            roll = document.getElementById('userRoll').value.trim();
            branch = document.getElementById('userBranch').value;
            cgpa = parseFloat(document.getElementById('userCgpa').value) || 0;
            backlogs = parseInt(document.getElementById('userBacklogs').value) || 0;
        } else {
            company = document.getElementById('userCompany').value.trim();
            role = document.getElementById('userRole').value.trim();
            batch = document.getElementById('userBatch').value.trim();
            referrals = parseInt(document.getElementById('userReferrals').value) || 0;
        }
        
        if(id) {
            let idx = MOCK.users.findIndex(u => u.id == id);
            if(idx > -1) {
                MOCK.users[idx].name = newName;
                MOCK.users[idx].status = newStatus;
                if(currentTab === 'candidates') {
                    MOCK.users[idx].roll = roll; MOCK.users[idx].branch = branch;
                    MOCK.users[idx].cgpa = cgpa; MOCK.users[idx].backlogs = backlogs;
                } else {
                    MOCK.users[idx].company = company; MOCK.users[idx].role = role;
                    MOCK.users[idx].batch = batch; MOCK.users[idx].referrals = referrals;
                }
            }
        } else {
            MOCK.users.unshift({
                id: Math.floor(Math.random() * 100000),
                role: currentTab === 'candidates' ? 'candidate' : 'alumni',
                name: newName, email: newEmail, status: newStatus,
                roll, branch, cgpa, backlogs, company, batch, referrals
            });
        }
    }
    
    renderUsers();
    closeUserModal();
}

function deleteUser(id) {
    if(confirm('Are you sure you want to completely remove this user from the system?')) {
        MOCK.users = MOCK.users.filter(u => u.id != id);
        renderUsers();
    }
}
function deleteRecruiter(email) {
    if(confirm('Are you sure you want to completely remove this recruiter?')) {
        MOCK.recruiters = MOCK.recruiters.filter(r => r.email !== email);
        renderUsers();
    }
}

function validateUserForm() {
    let name = document.getElementById('userName').value.trim();
    let email = document.getElementById('userEmail').value.trim();

    if (!name) {
        alert("Full Name is required.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email format.");
        return false;
    }

    if (currentTab === 'candidates') {
        let roll = document.getElementById('userRoll').value.trim();
        let branch = document.getElementById('userBranch').value;
        let cgpa = parseFloat(document.getElementById('userCgpa').value);
        let backlogs = parseInt(document.getElementById('userBacklogs').value);

        if (!/^[A-Za-z]\d{2}[A-Za-z]{2}\d{3}$/.test(roll)) {
            alert("Invalid Roll Number (e.g., B22CS012)");
            return false;
        }

        if (!branch) {
            alert("Branch is required.");
            return false;
        }

        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            alert("CGPA must be between 0 and 10.");
            return false;
        }

        if (isNaN(backlogs) || backlogs < 0) {
            alert("Backlogs must be >= 0.");
            return false;
        }

    } else {
        let company = document.getElementById('userCompany').value.trim();
        let role = document.getElementById('userRole').value.trim();
        let batch = document.getElementById('userBatch').value.trim();
        let referrals = parseInt(document.getElementById('userReferrals').value);

        if (!company || !/^[A-Za-z\s\.,&'-]+$/.test(company)) {
            alert("Invalid Company name.");
            return false;
        }

        if (!role || !/^[A-Za-z\s\.,&'-]+$/.test(role)) {
            alert("Invalid Role.");
            return false;
        }

        if (!/^\d{4}$/.test(batch)) {
            alert("Batch must be 4 digits (e.g., 2022).");
            return false;
        }

        if (isNaN(referrals) || referrals < 0) {
            alert("Referrals must be >= 0.");
            return false;
        }
    }

    return true;
}
