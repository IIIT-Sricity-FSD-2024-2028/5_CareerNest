let dashboardData = {
  opportunities: 1,
  applications: 5,
  shortlisted: 3,
  referred: 2
};

let applicationsData = [
  {
    name: "Arjun Sharma",
    branch: "CSE",
    cgpa: "8.7",
    status: ["ref", "interview"]
  },
  {
    name: "Sneha Patel",
    branch: "ECE",
    cgpa: "8.2",
    status: ["shortlisted"]
  },
  {
    name: "Vikram Nair",
    branch: "CSE",
    cgpa: "9.1",
    status: ["ref", "assessment"]
  },
  {
    name: "Pooja Rao",
    branch: "IT",
    cgpa: "7.9",
    status: ["rejected"]
  }
];

if(!localStorage.getItem("opportunities")) {
  localStorage.setItem("opportunities", JSON.stringify([
    {
      title: "Software Engineer",
      location: "Bangalore, Karnataka",
      ctc: "12 LPA",
      openings: "15",
      cgpa: "7.5",
      type: "Full-Time",
      branches: ["CSE", "ECE", "IT"],
      applications: 4,
      deadline: "2026-03-25",
      status: "Published"
    },
    {
      title: "Frontend Developer",
      location: "Bangalore, Karnataka",
      ctc: "8 LPA",
      openings: "15",
      cgpa: "7.5",
      type: "Full-Time",
      branches: ["CSE", "ECE", "IT"],
      applications: 4,
      deadline: "2026-03-25",
      status: "Published"
    }
  ]));
}
let opportunitiesData = JSON.parse(localStorage.getItem("opportunities"));
