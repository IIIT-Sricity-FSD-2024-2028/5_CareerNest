let requiredSkills = [];

document.addEventListener("DOMContentLoaded", () => {

  // TOGGLE JOB TYPE
  const fullBtn = document.getElementById("fulltime");
  const internBtn = document.getElementById("internship");

  fullBtn.addEventListener("click", () => {
    fullBtn.classList.add("active");
    internBtn.classList.remove("active");
  });

  internBtn.addEventListener("click", () => {
    internBtn.classList.add("active");
    fullBtn.classList.remove("active");
  });

  // BRANCH SELECTION
  const branches = document.querySelectorAll(".branches span");

  branches.forEach(branch => {
    branch.addEventListener("click", () => {
      branch.classList.toggle("selected");
    });
  });

  // SKILLS HANDLING
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const skillTags = document.getElementById('skillTags');

  function addSkill() {
    const val = skillInput.value.trim();
    if (val && !requiredSkills.includes(val)) {
      requiredSkills.push(val);
      renderSkills();
    }
    skillInput.value = '';
  }

  if (addSkillBtn && skillInput) {
    addSkillBtn.addEventListener('click', addSkill);
    skillInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkill();
      }
    });
  }

  window.removeSkill = function(skill) {
    requiredSkills = requiredSkills.filter(s => s !== skill);
    renderSkills();
  }

  function renderSkills() {
    if (!skillTags) return;
    skillTags.innerHTML = requiredSkills.map(s => 
      `<span style="background: #F3F4F6; padding: 4px 10px; border-radius: 100px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
        ${s} <button type="button" onclick="removeSkill('${s}')" style="background:none; border:none; cursor:pointer; color:#9CA3AF; padding:0; font-size:16px;">&times;</button>
      </span>`
    ).join('');
  }

});

function addOpportunity(event) {
  event.preventDefault();

  const title = document.getElementById("jobTitle").value.trim();
  const loc = document.getElementById("location").value.trim();
  const openings = document.getElementById("openings").value;
  const deadline = document.getElementById("deadline").value;
  const cgpa = document.getElementById("cgpa").value;
  const description = document.getElementById("description").value;
  const ctc = document.getElementById("ctc").value.trim();

  const type = document.getElementById("fulltime").classList.contains("active")
    ? "Full-Time"
    : "Internship";

  const selectedBranches = [...document.querySelectorAll(".branches span.selected")]
    .map(b => b.innerText);

  // VALIDATION
  if (!title || !loc || !deadline) {
    alert("Please fill all required fields");
    return;
  }

  if (selectedBranches.length === 0) {
    alert("Select at least one branch");
    return;
  }

  // CREATE OBJECT
  const newOpportunity = {
    title,
    location: loc,
    ctc,
    openings,
    deadline,
    cgpa,
    description,
    type,
    branches: selectedBranches,
    skills: requiredSkills,
    applications: 0,
    status: "Published"
  };

  // STORE DATA
  opportunitiesData.push(newOpportunity);
  localStorage.setItem("opportunities", JSON.stringify(opportunitiesData));

  // SHOW MODAL
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.add("show");
    setTimeout(() => {
      modal.classList.remove("show");
      window.location.reload();
    }, 2500);
  }
}
