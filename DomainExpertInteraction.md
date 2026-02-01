# DomainExpertInteraction.md

## Summary of the Interaction

### Basic Information
- **Domain:** College Placement and Internship Management  (EdTech)
- **Problem Statement:** Centralized Placement & Internship Portal  
- **Date of Interaction:** 31-01-2026 
- **Mode of Interaction:** Online video call  
- **Duration (in minutes):** 55(1st) + 40(2nd)  
- **Publicly Accessible Video Link:** https://drive.google.com/drive/u/1/folders/1KkniwMFQjMS4IQwbkaFDSowlNNGbnO9u

---

## Domain Expert Details
- **Role / Designation:** Placement Coordinator  and Software development Intern
- **Experience in the Domain:**  
  Have hands-on experience supporting campus placement and internship
  activities, coordinating with recruiters, assisting students during different
  stages of the recruitment process, and managing placement-related information.
  In addition, the expert has industry exposure through a software development
  internship, providing practical insight into real-world hiring workflows,
  recruitment expectations, and candidate evaluation processes.

- **Nature of Work:** Administrative and Managerial  

---

## Domain Context and Terminology

- **How would you describe the overall purpose of this problem statement in your daily work?**  
  The main purpose is to manage placements smoothly by coordinating students, companies, and internal stakeholders while ensuring rules are followed and communication is clear.

- **What are the primary goals or outcomes of this problem statement?**  
  To ensure students get fair placement opportunities, recruiters receive suitable candidates on time, and the placement cell can track and manage the entire process efficiently.

### Key Domain Terms

| Term | Meaning as explained by the expert |
|---|---|
| Opportunity | A job or internship role shared by a company with the college for student hiring |
| EligibilityCriteria | Conditions such as CGPA, branch, and academic year that decide whether a student can apply |
| Application | A student’s formal submission for an opportunity through the placement process |
| ApplicationStatus | The current stage of a student’s application in the recruitment process |
| RecruitmentRound | A specific stage in hiring, such as an online test or interview |
| Referral | A recommendation provided by an alumni to support a student’s application |
| PlacementCell | The college body responsible for approving opportunities and managing placements |
| Recruiter | A company representative involved in evaluating candidates and making hiring decisions |
| Student | A currently enrolled college student participating in placements or internships |
| Alumni | A former student who may support current students through referrals |
| Faculty | A teaching staff member involved in placement guidance and monitoring |
| Notification | A message sent to inform users about placement-related updates |
| PlacementStatistics | Aggregated information showing placement participation and outcomes |
---

## Actors and Responsibilities

| Actor / Role | Responsibilities |
|---|---|
| Student | Apply for opportunities, attend interviews, track application status |
| Recruiter | Share job roles, screen candidates, conduct recruitment rounds |
| Placement Cell | Approve opportunities, enforce rules, coordinate the process |
| Alumni | Provide referrals and recommendations |
| Faculty | Guide students and monitor placement progress |

---

## Core Workflows

The following workflows describe how placements and internships are handled in
practice, as explained by the domain expert.

---

### Workflow 1: Opportunity Approval Process

- **Trigger / Start Condition:**  
  A Recruiter submits an Opportunity to the Placement Cell.

- **Steps Involved:**  
  1. The Placement Cell reviews the Opportunity details.  
  2. EligibilityCriteria and company information are verified.  
  3. The Placement Cell decides to approve or reject the Opportunity.  
  4. If rejected, remarks are added and communicated to the Recruiter.

- **Outcome / End Condition:**  
  Approved Opportunities are published and made visible to Students.

---

### Workflow 2: Student Application Process

- **Trigger / Start Condition:**  
  A Student views an approved Opportunity.

- **Steps Involved:**  
  1. The Student checks the EligibilityCriteria.  
  2. If eligible, the Student submits an Application along with a resume.  
  3. The Application is created and its ApplicationStatus is set to *Applied*.  
  4. The Student receives a Notification confirming the submission.

- **Outcome / End Condition:**  
  The Application moves to the screening stage for review by the Recruiter.

---

### Workflow 3: Recruitment and Selection Process

- **Trigger / Start Condition:**  
  A Recruiter begins reviewing Applications for an Opportunity.

- **Steps Involved:**  
  1. The Recruiter screens Applications and shortlists eligible candidates.  
  2. One or more RecruitmentRounds (such as online assessment or interview) are scheduled.  
  3. Students are informed of RecruitmentRound details through Notifications.  
  4. After completion of RecruitmentRounds, the Recruiter updates the final outcome.

- **Outcome / End Condition:**  
  The ApplicationStatus is updated to *Selected* or *Rejected*, and the Student
  is notified of the outcome.

---

### Workflow 4: Alumni Referral Process

- **Trigger / Start Condition:**  
  A Student requests a Referral for an existing Application.

- **Steps Involved:**  
  1. The Student selects an Alumni and submits a referral request.  
  2. The Alumni reviews the Student profile and Application.  
  3. The Alumni approves or declines the Referral request.  

- **Outcome / End Condition:**  
  If approved, the Application is marked as *Referred* and visible to the Recruiter.

  ---

  ## Rules, Constraints, and Exceptions

- *Mandatory Rules or Policies:*  
  - Students must meet eligibility criteria to apply  
  - All opportunities must be approved by the placement cell  

- *Constraints or Limitations:*  
  - Recruitment decisions are made by companies, not the system  
  - Timelines depend on recruiter availability  

- *Common Exceptions or Edge Cases:*  
  - Borderline CGPA cases  
  - Late updates from recruiters  

- *Situations Where Things Usually Go Wrong:*  
  - Missed communication  
  - Manual tracking errors  

---

## Current Challenges and Pain Points

- Tracking ApplicationStatus across different recruitment stages is difficult
  when information is maintained manually.

- Heavy reliance on emails and spreadsheets makes it hard to maintain a
  single source of truth for placement-related information.

- Interview and RecruitmentRound schedules are sometimes shared late or
  through multiple channels, leading to confusion among students.

- Alumni Referrals are often managed informally, which makes them difficult
  to track and verify during the recruitment process.

