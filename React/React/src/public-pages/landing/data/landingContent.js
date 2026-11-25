import { featureData } from './featureData.js';

export const landingContent = {
  featureData,
  coreFeatures: [
    {
      icon: "🔍",
      title: "Opportunity Discovery",
      description:
        "Browse approved job and internship listings with detailed eligibility criteria, role descriptions, and company info.",
      gradient:
        "linear-gradient(135deg, #4f6ef7, #38bdf8)",
    },
    {
      icon: "🗺️",
      title: "Application Tracking",
      description:
        "Real-time visibility into your application status across every recruitment stage — from applied to placed.",
      gradient:
        "linear-gradient(135deg, #8b5cf6, #a855f7)",
    },
    {
      icon: "🤝",
      title: "Alumni Referrals",
      description:
        "Request referrals from alumni, track approval status, and showcase endorsements to recruiters.",
      gradient:
        "linear-gradient(135deg, #10b981, #34d399)",
    },
    {
      icon: "📅",
      title: "Smart Scheduling",
      description:
        "Recruiters can schedule assessments and interviews; candidates get instant notifications and calendar syncs.",
      gradient:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    },
    {
      icon: "✅",
      title: "Automated Eligibility",
      description:
        "System-enforced eligibility rules ensure only qualified candidates can apply — no manual checking needed.",
      gradient:
        "linear-gradient(135deg, #3b82f6, #60a5fa)",
    },
    {
      icon: "📊",
      title: "Placement Analytics",
      description:
        "Comprehensive dashboards showing placement statistics, outcomes, and trends for institutional decision-making.",
      gradient:
        "linear-gradient(135deg, #06b6d4, #22d3ee)",
    },
  ],
  faqs: [
    {
      question: "Who can use CareerNest?",
      answer: [
        { text: "CareerNest is designed for four key stakeholders in the campus placement ecosystem:" },
        { text: " Candidates", bold: true },
        { text: " (students seeking jobs/internships), " },
        { text: "Recruiters", bold: true },
        { text: " (companies hiring through campus), " },
        { text: "Alumni", bold: true },
        { text: " (graduates who can provide referrals), and " },
        { text: "Senior Placement Officers", bold: true },
        { text: " (who manage and oversee the process)." },
      ],
    },
  
    {
      question: "How does the eligibility system work?",
      answer:
        "When recruiters post opportunities, they define eligibility criteria such as minimum CGPA, branch, graduation year, and other requirements. The system automatically validates each candidate's profile against these criteria and only allows eligible students to apply, eliminating manual eligibility checking errors.",
    },
  
    {
      question: "How do alumni referrals work?",
      answer:
        "Students can request referrals from alumni who are currently working in companies they've applied to. Alumni receive the request, review the candidate's profile and resume, and can choose to approve or decline. Approved referrals appear as indicators on the candidate's application.",
    },
  
    {
      question: "Can recruiters see referral information?",
      answer:
        "Yes. When reviewing candidate applications, recruiters can see referral indicators showing whether a candidate has been endorsed by an alumnus.",
    },
  
    {
      question:
        "What role does the Senior Placement Officer play?",
      answer:
        "The Senior Placement Officer acts as the gatekeeper of the placement process. They review and approve job opportunities before they're published to students, enforce institutional placement rules and policies, monitor overall recruitment activity, manage recruiter relationships, and access comprehensive placement statistics and reports.",
    },
  
    {
      question: "Is CareerNest free for students?",
      answer:
        "Yes! CareerNest is completely free for students. The platform is typically adopted by institutions who manage the system through their placement cell. Students simply sign up, complete their profile, and start exploring approved opportunities — all at no cost.",
    },
  ],
  heroImages: [
    "https://img.collegepravesh.com/2023/03/IIIT-Sri-City.jpg",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80",
  ],
  featureRoles: [
    {
      id: "candidate",
      icon: "🎓",
      label: "Candidates",
    },
    {
      id: "recruiter",
      icon: "💼",
      label: "Recruiters",
    },
    {
      id: "alumni",
      icon: "🤝",
      label: "Alumni",
    },
    {
      id: "officer",
      icon: "🛡️",
      label: "Placement Officer",
    },
  ],
  problems: [
    {
      icon: "🚫",
      title: "Lack of Transparency",
      description:
        "Candidates have no visibility into their application status or where they stand in the process.",
    },
    {
      icon: "⚠️",
      title: "Manual Errors",
      description:
        "Eligibility checking and application tracking through spreadsheets leads to frequent mistakes.",
    },
    {
      icon: "⏰",
      title: "Communication Delays",
      description:
        "Important updates get lost in email threads and messaging apps, causing missed opportunities.",
    },
    {
      icon: "📋",
      title: "Coordination Overhead",
      description:
        "Placement officers spend excessive time on administrative tasks instead of strategic initiatives.",
    },
  ],
  processSteps: [
    {
      number: "01",
      icon: "✈️",
      title: "Opportunity Submission",
      description:
        "Recruiters submit job and internship opportunities with defined eligibility criteria. Placement officers review and approve them for publication.",
    },
    {
      number: "02",
      icon: "🖱️",
      title: "Apply & Validate",
      description:
        "Students discover matching opportunities and apply with one click. The system automatically validates eligibility requirements in real-time.",
    },
    {
      number: "03",
      icon: "🤝",
      title: "Alumni Referrals",
      description:
        "Students request referrals from alumni. Alumni review candidate profiles, provide endorsements, and boost their chances of getting hired.",
    },
    {
      number: "04",
      icon: "🏆",
      title: "Track to Success",
      description:
        "All stakeholders track progress in real-time. Recruiters update stages, students monitor status, and officers oversee the entire pipeline.",
    },
  ],
  roles: [
    {
      role: "candidate",
      icon: "🎓",
      title: "Candidate",
      description:
        "Browse opportunities, apply for jobs & internships, track your applications, and request alumni referrals.",
      gradientClass: "candidate-gradient",
    },
    {
      role: "alumni",
      icon: "🤝",
      title: "Alumni",
      description:
        "Share internship reports, provide professional endorsements, and help juniors through referral support.",
      gradientClass: "alumni-gradient",
    },
    {
      role: "officer",
      icon: "🛡️",
      title: "Placement Officer",
      description:
        "Approve opportunities, enforce placement policies, monitor stats, and manage recruiter relationships.",
      gradientClass: "officer-gradient",
    },
    {
      role: "recruiter",
      icon: "💼",
      title: "Recruiter",
      description:
        "Post opportunities, screen candidates, schedule interviews, and manage your entire hiring pipeline.",
      gradientClass: "recruiter-gradient",
    },
    {
      role: "college_admin",
      icon: "🏫",
      title: "College Admin",
      description:
        "Manage placement officers, monitor student placement progress, and oversee all college-level activity.",
      customGradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    },
    {
      role: "super_admin",
      icon: "👑",
      title: "Super Admin",
      description:
        "Onboard colleges, manage subscriptions, monitor platform-wide revenue and placement statistics.",
      customGradient: "linear-gradient(135deg, #7c3aed, #5b21b6)",
    },
  ],
  stats: [
    {
      icon: "🏛️",
      target: 500,
      suffix: "+",
      label: "Colleges",
    },
    {
      icon: "🎓",
      target: 10000,
      suffix: "+",
      label: "Students Placed",
    },
    {
      icon: "🏢",
      target: 200,
      suffix: "+",
      label: "Recruiters",
    },
    {
      icon: "📈",
      target: 98,
      suffix: "%",
      label: "Placement Rate",
    },
  ],
  testimonials: [
    {
      rating: "★★★★★",
      text:
        "The placement portal made the entire process transparent and stress-free. I could easily track my application status and know exactly which stage I was in. Requesting referrals from alumni directly through the portal really improved my chances.",
      initials: "SG",
      name: "Sai Ganesh",
      role: "B.Tech CSE, 2026 · Final Year Student",
      gradient:
        "linear-gradient(135deg, #7c3aed, #a855f7)",
    },
    {
      rating: "★★★★★",
      text:
        "Managing placements used to involve significant manual coordination. This system centralizes everything — from opportunity approvals to recruitment tracking — making the process far more organized and transparent.",
      initials: "SI",
      name: "Dr. S. Iyer",
      role: "Senior Placement Officer",
      gradient:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
      featured: true,
    },
    {
      rating: "★★★★★",
      text:
        "The platform simplified our campus recruitment process. We could define eligibility criteria, review applications, and schedule interviews efficiently. The structured workflow helped us focus on selecting the right candidates.",
      initials: "PS",
      name: "Priya Sharma",
      role: "Hiring Manager · TechCorp",
      gradient:
        "linear-gradient(135deg, #ec4899, #f472b6)",
    },
    {
      rating: "★★★★½",
      text:
        "Being able to help juniors through the referral system is a great initiative. The portal makes it easy to review candidate profiles and provide referrals where appropriate. A real game-changer.",
      initials: "RV",
      name: "Rahul Verma",
      role: "Software Engineer · Microsoft · 2024 Graduate",
      gradient:
        "linear-gradient(135deg, #f97316, #fb923c)",
    },
  ],
};
