

// ============================
// THEME TOGGLE (Dark / Light)
// ============================
var themeToggle = document.getElementById('theme-toggle');
var themeIcon = document.getElementById('theme-icon');

// Load saved theme from localStorage
var savedTheme = localStorage.getItem('careernest-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') {
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', function () {
  var currentTheme = document.documentElement.getAttribute('data-theme');
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Switch icon
  themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';

  // Apply theme
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('careernest-theme', newTheme);
});


// ============================
// NAVBAR SCROLL EFFECT
// ============================
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});



// ============================
// HERO BACKGROUND SLIDER
// ============================
var heroImages = [
  "https://img.collegepravesh.com/2023/03/IIIT-Sri-City.jpg",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
];

var currentImageIndex = 0;
var heroBgSlider = document.getElementById('hero-bg-slider');

// Preload images so transitions are smooth
function preloadImages() {
  for (var i = 0; i < heroImages.length; i++) {
    var img = new Image();
    img.src = heroImages[i];
  }
}

// Crossfade to next background image
function changeHeroBackground() {
  heroBgSlider.style.opacity = '0';

  setTimeout(function () {
    heroBgSlider.style.backgroundImage = 'url(' + heroImages[currentImageIndex] + ')';
    heroBgSlider.style.backgroundSize = 'cover';
    heroBgSlider.style.backgroundPosition = 'center';
    heroBgSlider.style.opacity = '1';
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
  }, 500);
}

preloadImages();
changeHeroBackground();
setInterval(changeHeroBackground, 5000);


// ============================
// FLOATING PARTICLES
// ============================
var particlesContainer = document.getElementById('particles');

function createParticles() {
  for (var i = 0; i < 30; i++) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    var size = (Math.random() * 4 + 2) + 'px';
    particle.style.width = size;
    particle.style.height = size;
    particle.style.animationDelay = (Math.random() * 6) + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    particlesContainer.appendChild(particle);
  }
}

createParticles();


// ============================
// SCROLL ANIMATIONS
// Uses IntersectionObserver to animate
// elements when they enter the viewport
// ============================
var observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

var scrollObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Stagger animation for sibling elements
      var parent = entry.target.parentElement;
      var siblings = parent.querySelectorAll('.animate-on-scroll');
      var idx = Array.from(siblings).indexOf(entry.target);

      setTimeout(function () {
        entry.target.classList.add('visible');
      }, idx * 100);

      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements that should animate on scroll
var animatedElements = document.querySelectorAll('.animate-on-scroll');
for (var i = 0; i < animatedElements.length; i++) {
  scrollObserver.observe(animatedElements[i]);
}


// ============================
// ANIMATED COUNTERS
// Counts up from 0 to target
// with an ease-out animation
// ============================
function animateCounter(element) {
  var target = parseInt(element.dataset.target);
  var duration = 2000; // 2 seconds
  var start = performance.now();

  function update(currentTime) {
    var elapsed = currentTime - start;
    var progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for smooth deceleration
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(eased * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Trigger counters when stats section is visible
var statsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var counters = entry.target.querySelectorAll('.stat-number');
      for (var i = 0; i < counters.length; i++) {
        (function (index) {
          setTimeout(function () {
            animateCounter(counters[index]);
          }, index * 200);
        })(i);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

var statsSection = document.getElementById('stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}


// ============================
// FEATURE TABS
// Switches feature content based
// on the selected role tab
// ============================
var tabs = document.querySelectorAll('.tab');
var featureList = document.getElementById('feature-list');
var roleTitle = document.getElementById('role-title');
var featureBoxIcon = document.getElementById('feature-box-icon');

// Feature data for each role
var featureData = {
  candidate: {
    title: "Candidates",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #4f6ef7, #38bdf8)",
    features: [
      "View approved job and internship opportunities",
      "Apply for opportunities with one click",
      "Track application status in real-time",
      "Request alumni referrals for applied opportunities",
      "Check eligibility requirements instantly",
      "Upload and manage multiple resume versions",
      "View interview and assessment schedules",
      "Receive instant notifications for updates"
    ]
  },
  recruiter: {
    title: "Recruiters",
    icon: "💼",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    features: [
      "Submit job and internship opportunities",
      "View and filter candidate applications",
      "Screen and shortlist candidates efficiently",
      "Update recruitment round outcomes",
      "Define custom eligibility criteria",
      "See alumni referral indicators",
      "Schedule assessments and interviews",
      "Communicate decisions through the portal"
    ]
  },
  alumni: {
    title: "Alumni",
    icon: "🤝",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    features: [
      "View referral requests from students",
      "Approve or decline referral requests",
      "Receive notifications for new requests",
      "Review candidate profiles and resumes",
      "Provide professional endorsements",
      "Track referral success rates"
    ]
  },
  officer: {
    title: "Placement Officers",
    icon: "🛡️",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    features: [
      "Review and approve job opportunities",
      "Publish approved opportunities to students",
      "Monitor recruitment activity in real-time",
      "Manage recruiter relationships",
      "Reject opportunities with feedback",
      "Enforce placement rules and policies",
      "View comprehensive placement statistics",
      "View detailed placement reports"
    ]
  }
};

// Update the feature list display
function updateFeatures(role) {
  var selected = featureData[role];
  if (!selected) return;

  // Update header
  roleTitle.textContent = selected.title;
  featureBoxIcon.textContent = selected.icon;
  featureBoxIcon.style.background = selected.gradient;

  // Fade out
  featureList.style.opacity = '0';
  featureList.style.transform = 'translateY(10px)';

  setTimeout(function () {
    // Build feature items HTML
    var html = '';
    for (var i = 0; i < selected.features.length; i++) {
      html += '<div class="feature-item">';
      html += '  <div class="feature-check" style="background: ' + selected.gradient + '">✓</div>';
      html += '  <p>' + selected.features[i] + '</p>';
      html += '</div>';
    }
    featureList.innerHTML = html;

    // Fade in
    featureList.style.opacity = '1';
    featureList.style.transform = 'translateY(0)';
  }, 250);
}

// Set transition for smooth fade
featureList.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

// Add click handlers to all tabs
for (var i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener('click', function () {
    // Remove active class from all tabs
    for (var j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove('active');
    }
    // Add active to clicked tab
    this.classList.add('active');
    updateFeatures(this.dataset.role);
  });
}

// Show candidate features by default
updateFeatures('candidate');


// ============================
// CTA & BUTTON INTERACTIONS
// ============================
var ctaButton = document.getElementById('cta-get-started');

if (ctaButton) {
  ctaButton.addEventListener('click', function () {
    window.location.href = "./login.html"
  });
}


// ============================
// SUBSCRIBE BUTTON
// ============================
var subscribeBtn = document.getElementById('subscribe-btn');
var emailInput = document.getElementById('email-input');

if (subscribeBtn) {
  subscribeBtn.addEventListener('click', function () {
    var email = emailInput.value.trim();
    if (email && email.indexOf('@') !== -1) {
      alert('You will Get Portal Updates from CareerNest!');
      emailInput.value = '';
    } else {
      alert('Please enter a valid email address.');
    }
  });
}


// ============================
// SMOOTH SCROLL FOR NAV LINKS
// ============================
var anchors = document.querySelectorAll('a[href^="#"]');

for (var i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener('click', function (e) {
    var href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    var target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });

      // Close mobile nav if open
      navLinks.classList.remove('active');
      var spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}


// ============================
// LOGIN BUTTON
// ============================
var loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', function () {
    window.location.href = 'login.html';
  });
}


// ============================
// FAQ
// ============================
var faqItems = document.querySelectorAll('.faq-item');

for (var i = 0; i < faqItems.length; i++) {
  (function (item) {
    var question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Close all other items
      for (var j = 0; j < faqItems.length; j++) {
        faqItems[j].classList.remove('active');
        faqItems[j].querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  })(faqItems[i]);
}


// ============================
// TESTIMONIAL CARD HOVER
// ============================
var testimonialCards = document.querySelectorAll('.testimonial-card');

for (var i = 0; i < testimonialCards.length; i++) {
  testimonialCards[i].addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-6px)';
  });
  testimonialCards[i].addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
  });
}
