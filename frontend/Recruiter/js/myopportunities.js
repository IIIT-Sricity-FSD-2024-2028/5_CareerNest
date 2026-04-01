document.addEventListener("DOMContentLoaded", () => {
  renderMyOpportunities();
});

function renderMyOpportunities() {
  const listEl = document.getElementById("opp-list");
  if (!listEl) return;
  
  listEl.innerHTML = "";

  if (!opportunitiesData || opportunitiesData.length === 0) {
    listEl.innerHTML = "<p>No opportunities posted yet.</p>";
    return;
  }

  opportunitiesData.forEach((item, index) => {
    // Generate Branches HTML
    let branchesHTML = "";
    if (item.branches && Array.isArray(item.branches)) {
      item.branches.forEach(b => {
        branchesHTML += `<span class="tag tag-gray" style="padding: 2px 6px; font-size: 11px;">${b}</span>`;
      });
    } else {
      branchesHTML = `<span class="tag tag-gray" style="padding: 2px 6px; font-size: 11px;">All</span>`;
    }

    const card = document.createElement("div");
    card.className = "opp-card";
    
    card.innerHTML = `
      <div class="opp-header">
        <h3 class="opp-title">${item.title}</h3>
        <div class="tags">
          <span class="tag tag-blue">${item.type || "Full-Time"}</span>
          <span class="tag tag-green">${item.status || "Published"}</span>
        </div>
      </div>
      
      <div class="opp-meta">
        <div class="meta-item">
          <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> ${item.location || "Not Specified"}
        </div>
        <div class="meta-item">
          <i data-lucide="calendar" style="width: 14px; height: 14px;"></i> Deadline: ${item.deadline || "N/A"}, ${item.applications || 0} applicants
        </div>
      </div>
      
      <div class="opp-grid">
        <div class="grid-col">
          <h4>Compensation</h4>
          <div>${item.ctc || "Unspecified"}</div>
        </div>
        <div class="grid-col">
          <h4>Openings</h4>
          <div>${item.openings || 1}</div>
        </div>
        <div class="grid-col">
          <h4>Min CGPA</h4>
          <div>${item.cgpa || 0}</div>
        </div>
        <div class="grid-col">
          <h4>Eligible Branches</h4>
          <div class="branch-tags">
            ${branchesHTML}
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button class="btn-view-app" onclick="window.location.href='applications.html?opp=${index}'">View Applications (${item.applications || 0})</button>
        <button class="btn-view-app" style="color: #DC2626; background: #FEE2E2;" onclick="deleteOpportunity(${index})">Delete</button>
      </div>
    `;

    listEl.appendChild(card);
  });

  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

window.deleteOpportunity = function(index) {
  if (confirm("Are you sure you want to delete this opportunity?")) {
    if (typeof opportunitiesData !== 'undefined') {
      opportunitiesData.splice(index, 1);
      localStorage.setItem("opportunities", JSON.stringify(opportunitiesData));
      renderMyOpportunities();
    }
  }
}
