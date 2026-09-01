// ---------- STATS ----------
document.getElementById("opportunities").innerText = dashboardData.opportunities;
document.getElementById("applications").innerText = dashboardData.applications;
document.getElementById("shortlisted").innerText = dashboardData.shortlisted;
document.getElementById("referred").innerText = dashboardData.referred;


// ---------- APPLICATIONS ----------
function renderApplications() {
  let container = document.getElementById("applicationsList");
  container.innerHTML = "";

  applicationsData.forEach(app => {

    let initials = app.name
      .split(" ")
      .map(w => w[0])
      .join("");

    let badges = app.status.map(s => {
      return `<span class="badge ${s}">${capitalize(s)}</span>`;
    }).join("");

    container.innerHTML += `
      <div class="app-item">

        <div class="left">
          <div class="circle">${initials}</div>
          <div>
            <p class="name">${app.name}</p>
            <p class="sub">${app.branch} · CGPA: ${app.cgpa}</p>
          </div>
        </div>

        <div class="right">
          ${badges}
        </div>

      </div>
    `;
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

renderApplications();


function renderOpportunities() {
  let container = document.getElementById("opportunitiesList");
  container.innerHTML = "";

  opportunitiesData.forEach(op => {

    container.innerHTML += `
      <div class="job">
        <p class="title">${op.title}</p>
        <p class="sub">${op.applications} applications · Deadline: ${op.deadline}</p>
        <span class="badge ref">${capitalize(op.status)}</span>
      </div>
    `;
  });
}

renderOpportunities();
