let currentRole = "candidate";

const actors = document.querySelectorAll(".actor-card");
const body = document.body;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const displayMsg = document.getElementById("msg-display");

const users = {
    candidate: { email: "c@gmail.com", password: "123" },
    alumni: { email: "a@gmail.com", password: "123" },
    recruiter: { email: "r@gmail.com", password: "123" },
    officer: { email: "p@gmail.com", password: "123" }
};

// Get role from URL
const params = new URLSearchParams(window.location.search);
const roleFromURL = params.get("role");

if (roleFromURL && users[roleFromURL]) {
    currentRole = roleFromURL;

    // highlight correct card
    actors.forEach(card => {
        card.classList.remove("active");

        if (card.dataset.role === currentRole) {
            card.classList.add("active");
        }
    });

    updateBackground(currentRole);
}

actors.forEach(card => {
    card.addEventListener("click", () => {
        actors.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        currentRole = card.dataset.role;
        updateBackground(currentRole);

        clearInputs();
        clearMessage();
    });
});

function updateBackground(role) {
    body.classList.remove("candidate-bg", "alumni-bg", "recruiter-bg", "officer-bg");
    body.classList.add(role + "-bg");
}

const toggleBtn = document.getElementById("togglePassword");

toggleBtn.addEventListener("click", () => {
    const icon = toggleBtn.querySelector("i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});
passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        login();
    }
});
function login() {
    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();

    clearMessage();

    if (!email || !pass) {
        displayMessage("Details not entered", "red");
        return;
    }

    const validUser = users[currentRole];

    if (email === validUser.email && pass === validUser.password) {
        displayMessage("Login successful", "green");

        setTimeout(() => {
            clearInputs();

            
            if (currentRole === "candidate") {
                window.location.href = "../Candidate/html/index.html";
            } else if (currentRole === "alumni") {
                window.location.href = "../Alumni Final/pages/A1.html";
            } else if (currentRole === "recruiter") {
                window.location.href = "../Recruiter/pages/index.html";
            } else if (currentRole === "officer") {
                window.location.href = "../placement total final/pages/p1.html";
            }

        }, 1000);

    } else {
        displayMessage("Details entered are wrong", "red");
    }
}

function displayMessage(text, color) {
    displayMsg.textContent = text;
    displayMsg.style.color = color;
}

function clearInputs() {
    emailInput.value = "";
    passwordInput.value = "";
}

function clearMessage() {
    displayMsg.textContent = "";
}

updateBackground(currentRole);