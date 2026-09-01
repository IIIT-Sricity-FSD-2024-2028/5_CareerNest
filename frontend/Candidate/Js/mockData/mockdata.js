// mockdata.js

// 1. User Profile Data
export const currentUser = {
    name: "Shameer Basha Shaik",
    headline: "Computer Science Student | Aspiring Software Engineer",
    role: "Student",
    avatar: "SB",
    avatarImage: "", // For base64 uploads
    bannerImage: "", // For base64 uploads
    department: "Computer Science",
    cgpa: "8.7",
    batch: "Placement Season 2025–26",
    location: "Bangalore, India",
    university: "CareerNest University",
    email: "shameer@college.in",
    phone: "+91 9876543210",
    password: "123456789", // Simulated password for change password flow
    about: "I am a passionate computer science student with a strong foundation in data structures, algorithms, and web development. Active member of the college coding club. Seeking a software engineering internship to apply my technical skills and learn from experienced professionals.",
    socialLinks: {
        github: "https://github.com/shameerbasha",
        linkedin: "https://linkedin.com/in/shameerbasha",
        portfolio: "https://shameerbasha.dev"
    }
};

// 2. Dashboard Stats Data
export const dashboardStats = {
    applications: 3,
    availableJobs: 15,
    internships: 8,
    interviews: 2
};

// 3. Recommended Opportunities 
export const recruiterJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp Solutions",
    location: "Bangalore, Karnataka",
    deadline: "2026-03-25",
    applications: 78,
    salary: "12 LPA",
    openings: 15,
    cgpa: 7.5,
    branches: ["CSE", "ECE", "IT"],
    type: "Full-Time",
    status: "Published",
    tags: ["JavaScript", "Node.js", "AWS", "SQL", "React"],
    appliedStatus: null,
    description: "Join our dynamic engineering team to build scalable cloud-native applications. You will work on backend services using Node.js and Python, and collaborate with cross-functional teams."
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "Analytics Hub",
    location: "Hyderabad",
    deadline: "2026-03-25",
    applications: 155,
    salary: "25,000/month",
    openings: 30,
    cgpa: 7.5,
    branches: ["CSE", "ECE", "IT"],
    type: "Internship",
    status: "Published",
    tags: ["Python", "SQL", "Power BI"],
    appliedStatus: null,
    description: "Work closely with our data science team to analyze large datasets. You will write complex SQL queries, build dashboards in Power BI, and create predictive models."
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Pune, Maharashtra",
    deadline: "2026-04-15",
    applications: 230,
    salary: "10 LPA",
    openings: 10,
    cgpa: 8.0,
    branches: ["CSE"],
    type: "Full-Time",
    status: "Published",
    tags: ["React", "Node.js"],
    appliedStatus: null,
    description: "End-to-end responsibility for the web platform. Build responsive UIs with React and robust APIs using Node.js and Express."
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    company: "AI Dynamics",
    location: "Chennai, Tamil Nadu",
    deadline: "2026-05-01",
    applications: 45,
    salary: "15 LPA",
    openings: 2,
    cgpa: 8.5,
    branches: ["CSE", "ECE"],
    type: "Full-Time",
    status: "Published",
    tags: ["Python", "TensorFlow"],
    appliedStatus: null,
    description: "Design and deploy scalable machine learning models. Optimize neural networks for edge devices and cloud environments."
  },
  {
    id: 5,
    title: "DevOps Intern",
    company: "CloudBase Inc",
    location: "Remote",
    deadline: "2026-05-20",
    applications: 120,
    salary: "₹20,000/month",
    openings: 4,
    cgpa: 9.0,
    branches: ["CSE", "IT"],
    type: "Internship",
    status: "Published",
    tags: ["Linux", "Docker"],
    appliedStatus: null,
    description: "Automate delivery pipelines. Experience containerizing applications with Docker and deploying to AWS infrastructure."
  },
  {
    id: 6,
    title: "UI/UX Designer",
    company: "Creative Studios",
    location: "Mumbai",
    deadline: "2026-06-15",
    applications: 85,
    salary: "8 LPA",
    openings: 5,
    cgpa: 7.0,
    branches: ["CSE", "IT", "Design"],
    type: "Full-Time",
    status: "Published",
    tags: ["Figma", "Adobe XD", "Prototyping"],
    appliedStatus: null,
    description: "Design intuitive interfaces for our consumer-facing applications. Collaborate with PMs and engineers to build user-centric solutions."
  },
  {
    id: 7,
    title: "Cybersecurity Analyst Intern",
    company: "SecureNet",
    location: "Bangalore",
    deadline: "2026-05-10",
    applications: 60,
    salary: "₹30,000/month",
    openings: 8,
    cgpa: 8.0,
    branches: ["CSE", "IT"],
    type: "Internship",
    status: "Published",
    tags: ["Network Security", "Pen Testing", "Python"],
    appliedStatus: null,
    description: "Perform vulnerability assessments and penetrate testing on web applications. Assist in designing secure network architectures."
  },
  {
    id: 8,
    title: "Frontend Developer",
    company: "WebFlow Media",
    location: "Remote",
    deadline: "2026-04-30",
    applications: 310,
    salary: "14 LPA",
    openings: 6,
    cgpa: 7.5,
    branches: ["CSE", "ECE", "IT"],
    type: "Full-Time",
    status: "Published",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    appliedStatus: null,
    description: "Build robust and scalable frontend architectures. Advocate for modern UI/UX practices and performance optimization."
  },
  {
    id: 9,
    title: "Backend Engineer",
    company: "FinTech Corp",
    location: "Gurgaon",
    deadline: "2026-05-25",
    applications: 145,
    salary: "18 LPA",
    openings: 4,
    cgpa: 8.2,
    branches: ["CSE", "IT"],
    type: "Full-Time",
    status: "Published",
    tags: ["Java", "Spring Boot", "Microservices"],
    appliedStatus: null,
    description: "Develop scalable and high-performance microservices for financial transactions. Ensure 99.99% uptime for core banking APIs."
  },
  {
    id: 10,
    title: "Product Management Intern",
    company: "Growth Hackers",
    location: "Remote",
    deadline: "2026-06-05",
    applications: 210,
    salary: "₹25,000/month",
    openings: 3,
    cgpa: 7.0,
    branches: ["Any"],
    type: "Internship",
    status: "Published",
    tags: ["Agile", "Jira", "Market Research"],
    appliedStatus: null,
    description: "Assist product managers in writing PRDs, conducting user research, and analyzing product metrics."
  },
  {
    id: 11,
    title: "Cloud Architect",
    company: "Skyline Cloud",
    location: "Hyderabad",
    deadline: "2026-07-01",
    applications: 40,
    salary: "22 LPA",
    openings: 2,
    cgpa: 8.5,
    branches: ["CSE"],
    type: "Full-Time",
    status: "Published",
    tags: ["AWS", "Azure", "Kubernetes"],
    appliedStatus: null,
    description: "Design and implement enterprise cloud strategies. Migrate heavily coupled legacy systems to serverless architectures."
  },
  {
    id: 12,
    title: "Data Scientist",
    company: "DataMinds",
    location: "Pune",
    deadline: "2026-05-15",
    applications: 110,
    salary: "16 LPA",
    openings: 5,
    cgpa: 8.0,
    branches: ["CSE", "Stats"],
    type: "Full-Time",
    status: "Published",
    tags: ["Python", "R", "Machine Learning"],
    appliedStatus: null,
    description: "Build predictive models and recommendation engines to enhance user personalization and content discovery."
  },
  {
    id: 13,
    title: "Hardware Engineering Intern",
    company: "Silicon Devices",
    location: "Bangalore",
    deadline: "2026-04-20",
    applications: 75,
    salary: "₹35,000/month",
    openings: 10,
    cgpa: 8.0,
    branches: ["ECE", "EEE"],
    type: "Internship",
    status: "Published",
    tags: ["Verilog", "VHDL", "Embedded Systems"],
    appliedStatus: null,
    description: "Assist in designing and verifying digital logic circuits. Work extensively with FPGAs and microcontrollers."
  },
  {
    id: 14,
    title: "HR Trainee",
    company: "PeopleFirst",
    location: "Mumbai",
    deadline: "2026-05-10",
    applications: 320,
    salary: "6 LPA",
    openings: 20,
    cgpa: 6.5,
    branches: ["Any"],
    type: "Full-Time",
    status: "Published",
    tags: ["Recruitment", "Communication"],
    appliedStatus: null,
    description: "Support HR generalist activities, coordinate technical interviews, and assist with campus placement drives."
  },
  {
    id: 15,
    title: "Game Developer Intern",
    company: "Pixel Play",
    location: "Remote",
    deadline: "2026-06-30",
    applications: 180,
    salary: "₹15,000/month",
    openings: 5,
    cgpa: 7.5,
    branches: ["CSE", "IT"],
    type: "Internship",
    status: "Published",
    tags: ["Unity", "C#", "3D Modeling"],
    appliedStatus: null,
    description: "Develop interactive 2D and 3D gameplay features. Collaborate with artists to integrate character models and animations."
  }
];

// 4. My Applications Data
export const applicationStats = {
    shortlisted: 3,
    interviews: 2,
    offers: 1,
    rejected: 1
};

export const myApplications = [
    // --- INTERVIEW (5 ITEMS) ---
    { id: 1, title: "Software Engineer", company: "TechCorp Solutions", type: "Full-time", status: "Interview", appliedDate: "2026-02-15", hasReferral: true, currentStageIndex: 4, timeline: [{ stage: "Applied", date: "2026-02-15", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-02-20", desc: "Reviewed", status: "completed" }, { stage: "Assessment", date: "2026-02-24", desc: "Score: 85/100", status: "completed" }, { stage: "Interview", date: "2026-02-28", desc: "Round 1 scheduled", status: "active" }] },
    { id: 6, title: "Backend Developer", company: "Amazon", type: "Full-Time", status: "Interview", appliedDate: "2026-03-01", hasReferral: false, currentStageIndex: 3, timeline: [{ stage: "Applied", date: "2026-03-01", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-05", desc: "Reviewed", status: "completed" }, { stage: "Interview", date: "2026-03-10", desc: "Technical HR scheduled", status: "active" }] },
    { id: 11, title: "AI Engineer", company: "Meta", type: "Full-Time", status: "Interview", appliedDate: "2026-03-05", hasReferral: true, currentStageIndex: 3, timeline: [{ stage: "Applied", date: "2026-03-05", desc: "Submitted", status: "completed" }, { stage: "Assessment", date: "2026-03-08", desc: "Coding Passed", status: "completed" }, { stage: "Interview", date: "2026-03-15", desc: "Hiring Manager scheduled", status: "active" }] },
    { id: 16, title: "Data Scientist", company: "Netflix", type: "Internship", status: "Interview", appliedDate: "2026-03-10", hasReferral: false, currentStageIndex: 3, timeline: [{ stage: "Applied", date: "2026-03-10", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-12", desc: "Data Challenge Passed", status: "completed" }, { stage: "Interview", date: "2026-03-20", desc: "System Design", status: "active" }] },
    { id: 21, title: "Security Analyst", company: "CrowdStrike", type: "Full-Time", status: "Interview", appliedDate: "2026-03-12", hasReferral: true, currentStageIndex: 3, timeline: [{ stage: "Applied", date: "2026-03-12", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-18", desc: "Reviewed", status: "completed" }, { stage: "Interview", date: "2026-03-25", desc: "Technical Interview", status: "active" }] },

    // --- SHORTLISTED (5 ITEMS) ---
    { id: 2, title: "Data Analyst Intern", company: "Analytics Hub", type: "Internship", status: "Shortlisted", appliedDate: "2026-02-18", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-18", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-02-25", desc: "Matched", status: "completed" }, { stage: "Assessment", date: "2026-03-01", desc: "Pending link", status: "active" }] },
    { id: 7, title: "Cloud Architect", company: "Google", type: "Full-Time", status: "Shortlisted", appliedDate: "2026-03-02", hasReferral: true, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-03-02", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-08", desc: "Resume Selected", status: "completed" }, { stage: "Assessment", date: "2026-03-15", desc: "Awaiting Assessment", status: "active" }] },
    { id: 12, title: "DevOps Engineer", company: "Adobe", type: "Full-Time", status: "Shortlisted", appliedDate: "2026-03-18", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-03-18", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-22", desc: "Selected", status: "completed" }, { stage: "Interview", date: "-", desc: "Pending schedule", status: "active" }] },
    { id: 17, title: "Product Manager", company: "Atlassian", type: "Full-Time", status: "Shortlisted", appliedDate: "2026-03-20", hasReferral: true, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-03-20", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-25", desc: "Selected", status: "completed" }, { stage: "Interview", date: "-", desc: "Pending schedule", status: "active" }] },
    { id: 22, title: "UI/UX Designer", company: "Figma", type: "Internship", status: "Shortlisted", appliedDate: "2026-03-22", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-03-22", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-03-28", desc: "Portfolio Approved", status: "completed" }, { stage: "Interview", date: "-", desc: "Pending round", status: "active" }] },

    // --- APPLIED (5 ITEMS) ---
    { id: 5, title: "Frontend Developer", company: "WebFlow Media", type: "Full-Time", status: "Applied", appliedDate: "2026-03-10", hasReferral: false, currentStageIndex: 1, timeline: [{ stage: "Applied", date: "2026-03-10", desc: "Submitted", status: "completed" }, { stage: "Reviewing", date: "-", desc: "Pending", status: "active" }] },
    { id: 8, title: "SRE Engineer", company: "Twitter", type: "Full-Time", status: "Applied", appliedDate: "2026-03-25", hasReferral: false, currentStageIndex: 1, timeline: [{ stage: "Applied", date: "2026-03-25", desc: "Submitted", status: "completed" }, { stage: "Reviewing", date: "-", desc: "Pending", status: "active" }] },
    { id: 13, title: "Game Developer", company: "Epic Games", type: "Internship", status: "Applied", appliedDate: "2026-03-28", hasReferral: true, currentStageIndex: 1, timeline: [{ stage: "Applied", date: "2026-03-28", desc: "Submitted", status: "completed" }, { stage: "Reviewing", date: "-", desc: "Pending", status: "active" }] },
    { id: 18, title: "Hardware Engineer", company: "Intel", type: "Full-Time", status: "Applied", appliedDate: "2026-03-29", hasReferral: false, currentStageIndex: 1, timeline: [{ stage: "Applied", date: "2026-03-29", desc: "Submitted", status: "completed" }, { stage: "Reviewing", date: "-", desc: "Pending", status: "active" }] },
    { id: 23, title: "QA Analyst", company: "Salesforce", type: "Internship", status: "Applied", appliedDate: "2026-04-01", hasReferral: false, currentStageIndex: 1, timeline: [{ stage: "Applied", date: "2026-04-01", desc: "Submitted", status: "completed" }, { stage: "Reviewing", date: "-", desc: "Pending", status: "active" }] },

    // --- REJECTED (5 ITEMS) ---
    { id: 3, title: "Full Stack Developer", company: "InnovateTech", type: "Full-Time", status: "Rejected", appliedDate: "2026-01-10", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-01-10", desc: "Submitted", status: "completed" }, { stage: "Rejected", date: "2026-01-25", desc: "Moving forward with others", status: "completed" }] },
    { id: 9, title: "Android Engineer", company: "Spotify", type: "Full-Time", status: "Rejected", appliedDate: "2026-01-15", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-01-15", desc: "Submitted", status: "completed" }, { stage: "Rejected", date: "2026-02-10", desc: "Position closed", status: "completed" }] },
    { id: 14, title: "iOS Developer", company: "Apple", type: "Internship", status: "Rejected", appliedDate: "2026-02-05", hasReferral: true, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-05", desc: "Submitted", status: "completed" }, { stage: "Rejected", date: "2026-02-28", desc: "Did not clear assessment", status: "completed" }] },
    { id: 19, title: "Database Admin", company: "Oracle", type: "Full-Time", status: "Rejected", appliedDate: "2026-01-20", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-01-20", desc: "Submitted", status: "completed" }, { stage: "Rejected", date: "2026-02-15", desc: "Requirements not met", status: "completed" }] },
    { id: 24, title: "Network Intern", company: "Cisco", type: "Internship", status: "Rejected", appliedDate: "2026-02-10", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-10", desc: "Submitted", status: "completed" }, { stage: "Rejected", date: "2026-03-01", desc: "Resume not selected", status: "completed" }] },

    // --- WITHDRAWN (5 ITEMS) ---
    { id: 10, title: "Machine Learning Intern", company: "OpenAI", type: "Internship", status: "Withdrawn", appliedDate: "2026-02-20", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-20", desc: "Submitted", status: "completed" }, { stage: "Withdrawn", date: "2026-03-05", desc: "Self withdrawn", status: "completed" }] },
    { id: 15, title: "Research Intern", company: "IBM", type: "Internship", status: "Withdrawn", appliedDate: "2026-01-12", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-01-12", desc: "Submitted", status: "completed" }, { stage: "Withdrawn", date: "2026-01-30", desc: "Accepted other offer", status: "completed" }] },
    { id: 20, title: "Software Engineer", company: "TCS", type: "Full-Time", status: "Withdrawn", appliedDate: "2026-02-25", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-25", desc: "Submitted", status: "completed" }, { stage: "Withdrawn", date: "2026-03-10", desc: "Location mismatch", status: "completed" }] },
    { id: 25, title: "System Analyst", company: "Wipro", type: "Full-Time", status: "Withdrawn", appliedDate: "2026-02-28", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-02-28", desc: "Submitted", status: "completed" }, { stage: "Withdrawn", date: "2026-03-15", desc: "Self withdrawn", status: "completed" }] },
    { id: 26, title: "Web Developer", company: "Cognizant", type: "Full-Time", status: "Withdrawn", appliedDate: "2026-03-05", hasReferral: false, currentStageIndex: 2, timeline: [{ stage: "Applied", date: "2026-03-05", desc: "Submitted", status: "completed" }, { stage: "Withdrawn", date: "2026-03-20", desc: "Self withdrawn", status: "completed" }] },
    
    // --- OFFER (1 ITEM FOR COMPLETENESS) ---
    { id: 4, title: "Backend Engineer Intern", company: "CloudBase Inc", type: "Internship", status: "Offer", appliedDate: "2026-01-05", hasReferral: true, currentStageIndex: 4, timeline: [{ stage: "Applied", date: "2026-01-05", desc: "Submitted", status: "completed" }, { stage: "Shortlisted", date: "2026-01-15", desc: "Selected directly", status: "completed" }, { stage: "Interview", date: "2026-01-28", desc: "Cleared", status: "completed" }, { stage: "Offer", date: "2026-02-05", desc: "Accept by Feb 15th", status: "completed" }] }
];

// 5. Resume and Profile Data 
export const profileResumeData = {
    uploadedResume: {
        name: "Shameer_Basha_Shaik_Resume_2026.pdf",
        size: "342 KB",
        date: "2026-02-10"
    },
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git", "MongoDB", "Express.js"],
    languages: [
        { name: "English", level: "Professional" },
        { name: "Hindi", level: "Native" },
        { name: "Telugu", level: "Fluent" }
    ],
    codingProfiles: [
        { platform: "LeetCode", url: "https://leetcode.com/shameerbasha", handle: "@shameerbasha" },
        { platform: "HackerRank", url: "https://hackerrank.com/shameerbasha", handle: "@shameerbasha" },
        { platform: "Codeforces", url: "https://codeforces.com/profile/shameerbasha", handle: "@shameerbasha" }
    ],
    experience: [
        {
            title: "Summer Intern",
            company: "TechWave Solutions",
            duration: "May 2025 - Jul 2025 · 3 mos",
            desc: "Assisted in developing front-end features for their main e-commerce platform using React.js. Participated in daily stand-ups and code reviews. Improved load times by 15% through lazy loading."
        },
        {
            title: "Web Developer (Freelance)",
            company: "Local Businesses",
            duration: "Jan 2024 - Present",
            desc: "Designed and built responsive websites for local clients using HTML, CSS, JavaScript, and Node.js. Successfully delivered 5 operational websites handling daily customer traffic."
        }
    ],
    education: [
        {
            institution: "CareerNest University",
            degree: "Bachelor of Technology in Computer Science",
            duration: "2022 - 2026",
            desc: "CGPA: 8.7 / 10.0\nRelevant Coursework: Data Structures, Algorithms, Operating Systems, Database Management Systems, Web Technologies, Computer Networks."
        },
        {
            institution: "Narayana Junior College",
            degree: "Higher Secondary Education",
            duration: "2020 - 2022",
            desc: "Percentage: 96%\nFocused heavily on Mathematics, Physics, and Chemistry (MPC)."
        }
    ],
    projects: [
        {
            title: "Placement Dashboard",
            tags: "HTML, CSS, Vanilla JS",
            github: "https://github.com/shameerbasha/careernest",
            description: "A student portal to track applications, jobs, and referrals seamlessly. Simulates full CRUD operations using state management architectures and modularized styling."
        },
        {
            title: "Weather App",
            tags: "React, OpenWeather API",
            github: "https://github.com/shameerbasha/weatherapp",
            description: "Dynamic weather forecasting application leveraging rapid API pinging with location-based detecting and historical tracking."
        },
        {
            title: "Task Management API",
            tags: "Node.js, Express, MongoDB",
            github: "https://github.com/shameerbasha/task-manager-api",
            description: "Built a robust REST API equipped with user authentication, secure JWT hashing, and full database persistence."
        }
    ],
    certifications: [
        {
            title: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2025-08"
        },
        {
            title: "Google Professional Data Engineer",
            issuer: "Google Cloud",
            date: "2025-11"
        },
        {
            title: "Complete Web Developer Bootcamp",
            issuer: "Udemy",
            date: "2024-05"
        }
    ],
    extracurricular: [
        {
            title: "President, Coding Club",
            duration: "2024 - Present",
            desc: "Organized exactly 10+ college-wide hackathons and coding competitions impacting over 500+ student participants."
        },
        {
            title: "Volunteer, Tech for Good",
            duration: "2023 - 2024",
            desc: "Taught basic programming to underprivileged elementary students and helped setup digital literacy camps across Bangalore."
        }
    ],
    additionalDocs: [
        {
            name: "Semester_6_Marksheet.pdf",
            type: "Marksheet",
            size: "1.2 MB"
        },
        {
            name: "AWS_Certificate.pdf",
            type: "Certification Proof",
            size: "800 KB"
        },
        {
            name: "Recommendation_Letter_TechWave.pdf",
            type: "Letter of Recommendation",
            size: "150 KB"
        }
    ]
};

// 6. Notifications Data
export const notificationsData = [
    {
        title: "Offer Extended!",
        message: "Congratulations! CloudBase Inc has extended an internship offer to you.",
        isRead: false
    },
    {
        title: "Application Shortlisted",
        message: "You have been shortlisted for the Technical Assessment at Analytics Hub.",
        isRead: false
    },
    {
        title: "Interview Scheduled",
        message: "Your Technical Interview for TechCorp Solutions is scheduled on March 6th, 2026",
        isRead: true
    }
];

// 7. Upcoming Events Data
export const upcomingEvents = [
    {
        id: 1,
        title: "Technical Interview",
        company: "TechCorp Solutions",
        role: "Software Engineer",
        date: "6-03-2026",
        type: "Interview"
    },
    {
        id: 2,
        title: "Onboarding Session",
        company: "CloudBase Inc",
        role: "Backend Engineer Intern",
        date: "20-03-2026",
        type: "Event"
    },
    {
        id: 3,
        title: "Pre-Placement Talk",
        company: "TechCorp Solutions",
        role: "All Branches",
        date: "10-04-2026",
        type: "Event"
    },
    {
        id: 4,
        title: "Resume Building Workshop",
        company: "CareerNest Hub",
        role: "Open to All",
        date: "15-04-2026",
        type: "Workshop"
    }
];

// ----- REFERRALS PAGE DATA -----
export const referralStats = {
    total: 3,
    approved: 1,
    pending: 1,
    rejected: 1
};

export const activeReferralBanner = {
    message: "You have 2 active application(s) without a referral. Alumni referrals improve your visibility to recruiters by 40%.",
    targetCompany: "Infosys"
};

export const referralRequests = [
    {
        id: 1,
        alumniName: "Sneha Reddy",
        alumniInitials: "SR",
        alumniAvatarColor: "#d97706",
        alumniCompany: "Google",
        alumniBatch: "2021 Batch",
        status: "Approved",
        appliedRole: "Software Engineer",
        appliedCompany: "TechCorp Solutions",
        requestedDate: "2026-02-16",
        userMessage: "Hi Sneha, I am Shameer from the CS department. I have closely followed your work at TechCorp and would love a referral for the SE position. Thank you!",
        alumniResponse: "Shameer is a remarkably strong candidate. I've reviewed his React projects and his competitive programming profiles—he's definitely a great fit for the role. Referral submitted!"
    },
    {
        id: 2,
        alumniName: "Karan Verma",
        alumniInitials: "KV",
        alumniAvatarColor: "#3b82f6",
        alumniCompany: "Analytics Hub",
        alumniBatch: "2023 Batch",
        status: "Pending",
        appliedRole: "Data Analyst Intern",
        appliedCompany: "Analytics Hub",
        requestedDate: "2026-02-19",
        userMessage: "Hello Karan, I’m Shameer from CareerNest University. I'm targeting the data analyst internship at your firm and would greatly appreciate a referral if you find my profile suitable.",
        alumniResponse: null
    },
    {
        id: 3,
        alumniName: "Priya Sharma",
        alumniInitials: "PS",
        alumniAvatarColor: "#ef4444",
        alumniCompany: "InnovateTech",
        alumniBatch: "2020 Batch",
        status: "Rejected",
        appliedRole: "Full Stack Developer",
        appliedCompany: "InnovateTech",
        requestedDate: "2026-01-08",
        userMessage: "Hi Priya! Could you please refer me for the Full Stack position? I have experience in Node and React.",
        alumniResponse: "Hi Shameer, unfortunately, our team has already filled our quota for referrals this quarter. Keep up the good work though!"
    }
];

// ----- ANNOUNCEMENTS DATA -----
export const announcementsData = [
    {
        id: 1,
        title: "Eligibility Criteria Updated",
        date: "Today",
        priority: "high",
        message: "The eligibility criteria for the TechCorp Solutions drive has been revised. Electronics (ECE) students are now eligible to apply.",
        link: "opportunities.html?jobId=101"
    },
    {
        id: 2,
        title: "New Opportunity Released",
        date: "Today",
        priority: "high",
        message: "Analytics Hub has just released a new opening for the Data Analyst Intern role. Click here to view details and apply.",
        link: "opportunities.html?jobId=102"
    },
    {
        id: 3,
        title: "Placement Registration Ending",
        date: "Yesterday",
        priority: "medium",
        message: "Registration for the 2026 Placement Drive closes in 48 hours. Ensure your profile and resume are fully updated.",
        link: "profile.html"
    },
    {
        id: 4,
        title: "InnovateTech Assessment Link",
        date: "2 Days ago",
        priority: "medium",
        message: "For all candidates who applied to InnovateTech, the Phase 1 assessment links have been emailed. Check your inbox.",
        link: "applications.html"
    },
    {
        id: 5,
        title: "TCS Off-Campus Drive",
        date: "3 Days ago",
        priority: "normal",
        message: "TCS is conducting an off-campus drive for the 2026 batch. Interested candidates must register on the NextStep portal directly.",
        link: "opportunities.html"
    },
    {
        id: 6,
        title: "New Mock Assessments",
        date: "Last Week",
        priority: "normal",
        message: "3 new quantitative aptitude mock tests have been uploaded completely free. Ensure you attempt them before upcoming drives.",
        link: "#"
    }
];
