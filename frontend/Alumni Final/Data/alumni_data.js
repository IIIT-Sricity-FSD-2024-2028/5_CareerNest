// ============================================
// PlaceConnect — Mock Data
// ============================================
// This file contains all mock data used across
// dashboard.html and h1.html (Referral Requests).
// Both script_dashboard.js and script_h1.js
// read from this shared data source.
// ============================================

const MOCK_DATA = {

  // --- Alumni (logged-in user) ---
  alumni: {
    initials: "SR",
    name: "Sneha Reddy",
    email: "sneha@google.com",
    company: "Google",
    batch: 2021,
    role: "Alumni",
    totalReferrals: 6,
    approved: 2,
  },

  // --- Referral Requests ---
  referrals: [
    {
      id: "arjun-sharma",
      initials: "AS",
      name: "Arjun Sharma",
      status: "approved",
      department: "Computer Science",
      cgpa: 8.7,
      batch: 2025,
      role: "Software Engineer",
      company: "Google",
      salary: "₹12 LPA",
      location: "Bangalore",
      skills: ["Java", "Spring Boot", "SQL", "Problem Solving"],
      message: "Hi Sneha, I am applying for the Software Engineer role at Google. I have strong Java and problem-solving skills. Could you please refer me?",
      alumniNote: "Arjun is a strong candidate with excellent coding skills. Happy to refer him.",
    },
    {
      id: "rahul-verma",
      initials: "RV",
      name: "Rahul Verma",
      status: "pending",
      department: "Electronics Engineering",
      cgpa: 8.5,
      batch: 2025,
      role: "Frontend Developer",
      company: "Google",
      salary: "₹18 LPA",
      location: "Hyderabad",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      message: "Hi Sneha, I noticed you work at Google and I am very interested in the Frontend Developer position. I have strong React and TypeScript skills and would be grateful for your referral.",
      alumniNote: null,
    },
    {
      id: "priya-patel",
      initials: "PP",
      name: "Priya Patel",
      status: "declined",
      department: "Data Science",
      cgpa: 8.9,
      batch: 2025,
      role: "Data Analyst",
      company: "Google",
      salary: "₹10 LPA",
      location: "Pune",
      skills: ["Python", "Machine Learning", "Tableau", "Statistics"],
      message: "Hello Sneha, I would like to apply for a Data Analyst position at Google. I have strong experience in Python and data visualization. Would appreciate your referral!",
      alumniNote: "This role is not in my area of expertise. I suggest reaching out to someone in data analytics.",
    },
    {
      id: "neha-gupta",
      initials: "NG",
      name: "Neha Gupta",
      status: "approved",
      department: "Information Technology",
      cgpa: 9.1,
      batch: 2024,
      role: "Backend Developer",
      company: "Google",
      salary: "₹28 LPA",
      location: "Hyderabad / Redmond (Remote Optional)",
      skills: ["C# / .NET", "Azure Cloud", "Microservices", "System Design"],
      message: "Hi Sneha, I am a 2024 IT graduate with a strong foundation in distributed systems and cloud architecture. I have previously interned at a high-growth startup where I optimized backend APIs, reducing latency by 30%. Microsoft has always been my dream company due to its scale and impact, and I believe my technical skills in C# and Azure align perfectly with the Backend Developer role. I would be honored if you could review my profile for a referral!",
      alumniNote: "Neha has an exceptional academic record and hands-on experience with scalable systems. Her background in Information Technology and her project work on cloud-native applications make her an ideal fit for Microsoft's engineering culture.",
    },
    {
      id: "karan-singh",
      initials: "KS",
      name: "Karan Singh",
      status: "pending",
      department: "Mechanical Engineering",
      cgpa: 8.2,
      batch: 2025,
      role: "Product Engineer",
      company: "Google",
      salary: "₹22 LPA",
      location: "Remote / Giga Texas",
      skills: ["AutoCAD", "SolidWorks", "MATLAB", "Python"],
      message: "Hi Sneha, I am a Mechanical Engineering student with a deep interest in sustainable energy and EV architecture. I have led my university's Formula Student team in designing an aerodynamic chassis and believe my hands-on experience with CAD and thermal systems makes me a great fit for the Product Engineering role at Tesla. I would greatly appreciate a referral!",
      alumniNote: null,
    },
    {
      id: "aisha-khan",
      initials: "AK",
      name: "Aisha Khan",
      status: "declined",
      department: "Computer Science",
      cgpa: 7.9,
      batch: 2025,
      role: "QA Automation Engineer",
      company: "Google",
      salary: "₹14 LPA",
      location: "Bangalore / Chennai",
      skills: ["Selenium", "Java", "TestNG", "API Testing (Postman)"],
      message: "Hi Sneha, I am a final-year Computer Science student with a strong interest in Software Testing and Automation. I have completed a certification in Selenium with Java and have worked on a project automating a sample e-commerce site. I would appreciate it if you could refer me for the QA Automation role at Amazon.",
      alumniNote: "While Aisha has a good foundational understanding of automation, Amazon typically looks for candidates with more robust experience in framework development or a slightly higher CGPA for their entry-level SDET/QA roles. I've encouraged her to strengthen her portfolio with more complex automation projects and re-apply in six months.",
    },
  ],

  // --- Helper Methods ---

  /** Get counts by status */
  getCounts() {
    const counts = { all: 0, pending: 0, approved: 0, declined: 0 };
    this.referrals.forEach(r => { counts.all++; counts[r.status]++; });
    return counts;
  },

  /** Get referrals filtered by status */
  getByStatus(status) {
    if (status === "all") return this.referrals;
    return this.referrals.filter(r => r.status === status);
  },

  /** Get a single referral by id */
  getById(id) {
    return this.referrals.find(r => r.id === id) || null;
  },

  /** Get only pending referrals */
  getPending() {
    return this.referrals.filter(r => r.status === "pending");
  },

  /** Update a referral's status */
  updateStatus(id, newStatus, note) {
    const ref = this.getById(id);
    if (ref) {
      ref.status = newStatus;
      if (note !== undefined) ref.alumniNote = note;
    }
    return ref;
  },
};
