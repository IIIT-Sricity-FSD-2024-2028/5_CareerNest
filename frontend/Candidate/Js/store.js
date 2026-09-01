import * as InitialData from './mockData/mockdata.js';

const STORE_KEY = 'careernest_store_v4';

export function getStore() {
    let store = localStorage.getItem(STORE_KEY);
    if (!store) {
        // Deep stringify initializes object
        store = JSON.stringify(InitialData);
        localStorage.setItem(STORE_KEY, store);
    }

    let parsedStore = JSON.parse(store);
    


    // Auto-migrate new mock properties if they don't exist in the current cached session.
    let needsSave = false;
    if (!parsedStore.announcementsData || parsedStore.announcementsData.length < 6) {
        parsedStore.announcementsData = InitialData.announcementsData;
        needsSave = true;
    }
    
    // Auto-migrate the mock password fix if they still have the old password caching
    if (!parsedStore.currentUser.password || parsedStore.currentUser.password === 'password123') {
        parsedStore.currentUser.password = InitialData.currentUser.password;
        needsSave = true;
    }
    
    // Auto-migrate heavy mockdata expansions for array sizes
    if (!parsedStore.myApplications || parsedStore.myApplications.length < 20) {
        parsedStore.myApplications = InitialData.myApplications;
        needsSave = true;
    }
    
    // Auto-migrate relocated event records
    if (!parsedStore.upcomingEvents || parsedStore.upcomingEvents.length < 4) {
        parsedStore.upcomingEvents = InitialData.upcomingEvents;
        needsSave = true;
    }
    
    // Auto-migrate override specifically checking for that old Workshop string mismatch
    if (parsedStore.announcementsData && parsedStore.announcementsData[4] && parsedStore.announcementsData[4].title === "Resume Building Workshop") {
        parsedStore.announcementsData = InitialData.announcementsData;
        needsSave = true;
    }
    
    if (needsSave) {
        localStorage.setItem(STORE_KEY, JSON.stringify(parsedStore));
    }

    return parsedStore;
}

export function saveStore(storeObj) {
    localStorage.setItem(STORE_KEY, JSON.stringify(storeObj));
}

export function updateStore(updaterFn) {
    const store = getStore();
    updaterFn(store);
    saveStore(store);
}

export function resetStore() {
    localStorage.removeItem(STORE_KEY);
    window.location.reload();
}

/**
 * Initializes Global Notifications Hooking
 * Can be called indiscriminately on any page
 */
export function initGlobalNotifications() {
    const btn = document.getElementById('notif-btn');
    const drop = document.getElementById('notif-dropdown');
    
    // Inject global modals right away
    initGlobalModals();

    if (!btn || !drop) return;

    // Toggle on bell click
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drop.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!drop.contains(e.target) && !btn.contains(e.target)) {
            drop.classList.remove('show');
        }
    });

    // Mark all read listener
    const markReadBtn = document.getElementById('mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            updateStore(store => {
                store.notificationsData.forEach(n => n.isRead = true);
            });
            renderGlobalNotifList();
        });
    }

    renderGlobalNotifList();
}

/**
 * Universally handles rendering User Sidebar & Navigation Profile attributes
 */
export function renderUserNav() {
    const store = getStore();
    const user = store.currentUser;
    
    // Fallback initials generator
    let initials = user.avatar;
    if (!initials && user.name) {
        const parts = user.name.split(' ');
        initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    }

    const setAvatar = (elementId) => {
        const el = document.getElementById(elementId);
        if(!el) return;
        if (user.avatarImage) {
            el.style.backgroundImage = `url(${user.avatarImage})`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.textContent = "";
        } else {
            el.style.backgroundImage = "";
            el.style.backgroundSize = "";
            el.style.backgroundPosition = "";
            el.textContent = initials;
        }
    };

    setAvatar('sidebar-avatar');
    setAvatar('top-avatar');
    setAvatar('profile-picture'); // For profile page

    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    if (sidebarName) sidebarName.textContent = user.name || "Name";
    if (sidebarRole) sidebarRole.textContent = user.role || "Role";
}


export function renderGlobalNotifList() {
    const container = document.getElementById('notif-list-container');
    const badge = document.getElementById('notif-count');
    if (!container || !badge) return;

    container.innerHTML = "";
    const store = getStore();

    let unreadCount = 0;
    store.notificationsData.forEach((notif, idx) => {
        if (!notif.isRead) unreadCount++;
        const cls = notif.isRead ? 'notif-item' : 'notif-item unread';
        
        // Define navigation targets based on dummy text reasoning
        let targetRoute = '#';
        if (notif.title.includes('Application') || notif.title.includes('Interview')) {
            targetRoute = 'applications.html';
        } else if (notif.title.includes('Referral')) {
            targetRoute = 'referrals.html';
        }

        container.innerHTML += `
            <div class="${cls}" onclick="window.readAndNavigate(${idx}, '${targetRoute}')">
                <h6>${notif.title}</h6>
                <p>${notif.message}</p>
            </div>
        `;
    });

    if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount;
    } else {
        badge.style.display = 'none';
    }
}

// Global click handler to read & route
window.readAndNavigate = function(notifIndex, route) {
    updateStore(store => {
        store.notificationsData[notifIndex].isRead = true;
    });
    window.location.href = route;
};

// ============================================
// GLOBAL MODALS UI (Success & Ask Query)
// ============================================
export function initGlobalModals() {
    if (document.getElementById('modal-global-success')) return;

    const modalHTML = `
<!-- Success Modal -->
<dialog id="modal-global-success" class="profile-modal" style="width: 400px; text-align: center; padding:0; border:none; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <div style="padding: 40px 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 48px; margin: 0 auto 24px auto;">
            <i class='bx bx-check'></i>
        </div>
        <h2 id="global-success-title" style="font-size: 24px; color: #0f172a; margin-bottom: 12px;">Success!</h2>
        <p id="global-success-msg" style="color: #64748b; margin-bottom: 32px; font-size: 15px;">Operation completed.</p>
        <button class="btn-primary" style="width: 100%; padding: 12px;" onclick="document.getElementById('modal-global-success').close();">Close</button>
    </div>
</dialog>

<!-- Ask Query Modal -->
<dialog id="modal-ask-query" class="profile-modal" style="width: 450px; padding:0; border:none; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; padding:16px 24px; border-bottom:1px solid #e2e8f0;">
        <h3 style="margin:0;">Ask a Query</h3>
        <button class="modal-close" style="background:none; border:none; font-size:24px; cursor:pointer;" onclick="document.getElementById('modal-ask-query').close()"><i class='bx bx-x'></i></button>
    </div>
    <form onsubmit="event.preventDefault(); window.submitQuery();" style="padding: 24px;">
        <p style="color: #64748b; margin-bottom: 20px; font-size: 14px;">If you have any questions regarding this opportunity, send a message to the placement cell.</p>
        <div class="modal-form-group" style="margin-bottom:20px; text-align:left;">
            <label style="display:block; margin-bottom:8px; font-size:14px; font-weight:500;">Your Message</label>
            <textarea id="inp-query-msg" required rows="5" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box; font-family:inherit; resize:vertical;"></textarea>
        </div>
        <div class="modal-actions" style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" class="btn-secondary" onclick="document.getElementById('modal-ask-query').close()">Cancel</button>
            <button type="submit" class="btn-primary" style="width: auto; padding: 12px 24px;"><i class='bx bx-send' style="margin-right:6px;"></i> Send Message</button>
        </div>
    </form>
</dialog>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    // Ask Query Logic
    window.openAskQueryModal = function(e) {
        if (e) e.preventDefault();
        document.getElementById('modal-ask-query').showModal();
    };

    window.submitQuery = function() {
        document.getElementById('modal-ask-query').close();
        document.getElementById('inp-query-msg').value = '';
        document.getElementById('global-success-title').textContent = 'Query Sent';
        document.getElementById('global-success-msg').textContent = 'Your query was sent successfully. We will get back to you shortly.';
        document.getElementById('modal-global-success').showModal();
    };
}
