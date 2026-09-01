// mockdata-assessments.js

let assessmentsData = [];

// Initialize if empty
if (!localStorage.getItem("assessments")) {
  assessmentsData = [
    {
      id: 1,
      title: "Coding Assessment — Round 1",
      role: "Software Engineer",
      date: "2026-03-05",
      time: "10:00 AM",
      duration: "90 minutes min",
      candidates: 12,
      platform: "HackerRank",
      link: "https://hackerrank.com/test/x",
      type: "Online Test",
      isDraft: false
    },
    {
      id: 2,
      title: "Technical Interview — Round 2",
      role: "Software Engineer",
      date: "2026-03-12",
      time: "2:00 PM",
      duration: "60 minutes min",
      candidates: 5,
      platform: "Google Meet",
      link: "https://meet.google.com/x/y",
      type: "Technical Interview",
      isDraft: false
    },
    {
      id: 3,
      title: "HR Interview — Final Round",
      role: "Software Engineer",
      date: "2026-03-18",
      time: "11:00 AM",
      duration: "45 minutes min",
      candidates: 3,
      platform: "Zoom",
      link: "https://zoom.us/j/xy",
      type: "HR Interview",
      isDraft: true
    }
  ];
  localStorage.setItem("assessments", JSON.stringify(assessmentsData));
} else {
  assessmentsData = JSON.parse(localStorage.getItem("assessments"));
}
