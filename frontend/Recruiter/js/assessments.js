document.addEventListener("DOMContentLoaded", () => {
  renderAssessments();
});

// Render List
function renderAssessments() {
  const listEl = document.getElementById("assessmentsList");
  if (!listEl) return;
  
  listEl.innerHTML = ""; // Clear existing

  if (assessmentsData.length === 0) {
    listEl.innerHTML = "<p>No assessments scheduled.</p>";
    return;
  }

  assessmentsData.forEach(item => {
    let badgeClass = "gray";
    if (item.type === "Online Test") badgeClass = "blue";
    if (item.type === "Technical Interview") badgeClass = "pink";
    if (item.type === "HR Interview") badgeClass = "green";

    let tagsHTML = `<span class="badge ${badgeClass}">${item.type}</span>`;
    if (item.isDraft) {
      tagsHTML += ` <span class="badge gray">Draft</span>`;
    }

    const card = document.createElement("div");
    card.className = "assessment-card";
    
    card.innerHTML = `
      <div class="assessment-card-header">
        <div class="card-title-area">
          <div style="margin-bottom: 8px;">${tagsHTML}</div>
          <h3>${item.title}</h3>
          <p>${item.role}</p>
        </div>
      </div>
      
      <div class="details-row">
        <div class="detail-item">
          <i data-lucide="calendar"></i> ${item.date}
        </div>
        <div class="detail-item">
          <i data-lucide="clock"></i> ${item.time} &middot; ${item.duration}
        </div>
        <div class="detail-item">
          <i data-lucide="users"></i> ${item.candidates} candidates
        </div>
        <div class="detail-item" style="margin-left: auto;">
          Platform: <strong>${item.platform}</strong>
        </div>
      </div>
      
      <div class="link-row">
        Link: <a href="${item.link}" target="_blank">${item.link}</a>
      </div>
      
      <div class="card-actions">
        <button class="btn-outline" style="color: #DC2626; border-color: #FECACA;" onclick="deleteAssessment(${item.id})">Delete</button>
      </div>
    `;

    listEl.appendChild(card);
  });

  // Re-initialize icons since DOM changed
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}


// Form Operations
function openScheduleModal() {
  document.getElementById("scheduleModal").classList.add("show");
}

function closeScheduleModal() {
  document.getElementById("scheduleModal").classList.remove("show");
  document.getElementById("scheduleForm").reset();
}

function handleScheduleSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("m_title").value.trim();
  const role = document.getElementById("m_role").value.trim();
  const dateStr = document.getElementById("m_date").value;
  const timeStr = document.getElementById("m_time").value;
  const platform = document.getElementById("m_platform").value.trim();
  const type = document.getElementById("m_type").value;
  const link = document.getElementById("m_link").value.trim();

  // Basic validation
  if (!title || !role || !dateStr || !timeStr || !platform || !link) {
    alert("Please fill in all required fields.");
    return;
  }

  // Format Time (e.g. 14:00 -> 2:00 PM)
  let formattedTime = timeStr;
  try {
    const [h, m] = timeStr.split(':');
    let dateObj = new Date();
    dateObj.setHours(h);
    dateObj.setMinutes(m);
    formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch (err) {}

  const newItem = {
    id: Date.now(),
    title,
    role,
    date: dateStr,
    time: formattedTime,
    duration: "60 minutes",
    candidates: 0,
    platform,
    link,
    type,
    isDraft: false
  };

  // Prepend to array
  assessmentsData.unshift(newItem);
  localStorage.setItem("assessments", JSON.stringify(assessmentsData));

  // Close schedule modal
  closeScheduleModal();
  
  // Re-render
  renderAssessments();

  // Show Success Modal
  const successModal = document.getElementById("successModal");
  if (successModal) {
    successModal.classList.add("show");
    setTimeout(() => {
      successModal.classList.remove("show");
    }, 2500);
  }
}

function deleteAssessment(id) {
  if (confirm("Are you sure you want to delete this scheduled round?")) {
    assessmentsData = assessmentsData.filter(item => item.id !== id);
    localStorage.setItem("assessments", JSON.stringify(assessmentsData));
    renderAssessments();
  }
}
