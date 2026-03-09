-- Create Database
DROP DATABASE IF EXISTS placement_portal;
CREATE DATABASE placement_portal;
USE placement_portal;

-- USERS TABLE
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidate','recruiter','alumni','placement_officer') NOT NULL
);

-- BRANCH TABLE
CREATE TABLE Branch (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) UNIQUE NOT NULL
);

-- BATCH TABLE
CREATE TABLE Batch (
    batch_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_year INT UNIQUE NOT NULL
);

-- COMPANY TABLE
CREATE TABLE Company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL UNIQUE,
    industry VARCHAR(100),
    location VARCHAR(100),
    website VARCHAR(200)
);

-- CANDIDATE TABLE
CREATE TABLE Candidate (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    branch_id INT,
    cgpa DECIMAL(3,2),
    graduation_year INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);

-- RECRUITER TABLE
CREATE TABLE Recruiter (
    recruiter_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_id INT,
    recruiter_designation VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

-- ALUMNI TABLE
CREATE TABLE Alumni (
    alumni_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_id INT,
    designation VARCHAR(100),
    graduation_year INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

-- PLACEMENT OFFICER
CREATE TABLE PlacementOfficer (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- RESUME TABLE
CREATE TABLE Resume (
    resume_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    resume_link VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INT DEFAULT 1,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id)
);

-- OPPORTUNITY TABLE
CREATE TABLE Opportunity (
    opportunity_id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT,
    company_id INT,
    title VARCHAR(150) NOT NULL,
    opp_type ENUM('job','internship'),
    description TEXT,
    location VARCHAR(100),
    salary DECIMAL(10,2),
    deadline DATE,
    approval_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    FOREIGN KEY (recruiter_id) REFERENCES Recruiter(recruiter_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

-- ELIGIBILITY CRITERIA
CREATE TABLE EligibilityCriteria (
    eligibility_id INT AUTO_INCREMENT PRIMARY KEY,
    opportunity_id INT,
    min_cgpa DECIMAL(3,2),
    FOREIGN KEY (opportunity_id) REFERENCES Opportunity(opportunity_id)
);

-- APPLICATION TABLE
CREATE TABLE Application (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    opportunity_id INT,
    applied_date DATE DEFAULT CURRENT_DATE,
    app_status ENUM('applied','shortlisted','rejected','selected') DEFAULT 'applied',
    resume_id INT,
    UNIQUE(candidate_id, opportunity_id),
    FOREIGN KEY (resume_id) REFERENCES Resume(resume_id),
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id),
    FOREIGN KEY (opportunity_id) REFERENCES Opportunity(opportunity_id)
);

-- RECRUITMENT ROUND
CREATE TABLE RecruitmentRound (
    round_id INT AUTO_INCREMENT PRIMARY KEY,
    opportunity_id INT,
    round_type VARCHAR(50),
    round_date DATE,
    meeting_link VARCHAR(255),
    round_description VARCHAR(255),
    FOREIGN KEY (opportunity_id) REFERENCES Opportunity(opportunity_id)
);

-- ROUND RESULT
CREATE TABLE RoundResult (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT,
    application_id INT,
    round_status ENUM('passed','failed','pending'),
    remarks TEXT,
    FOREIGN KEY (round_id) REFERENCES RecruitmentRound(round_id),
    FOREIGN KEY (application_id) REFERENCES Application(application_id)
);

-- REFERRAL TABLE
CREATE TABLE Referral (
    referral_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    alumni_id INT,
    opportunity_id INT,
    message TEXT,
    ref_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    request_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id),
    FOREIGN KEY (alumni_id) REFERENCES Alumni(alumni_id),
    FOREIGN KEY (opportunity_id) REFERENCES Opportunity(opportunity_id)
);

-- SKILL TABLE
CREATE TABLE Skill (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL
);

-- NOTIFICATION TABLE
CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- CANDIDATE SKILL
CREATE TABLE CandidateSkill (
    candidate_id INT,
    skill_id INT,
    PRIMARY KEY(candidate_id, skill_id),
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

-- OPPORTUNITY SKILL
CREATE TABLE OpportunitySkill (
    opportunity_id INT,
    skill_id INT,
    PRIMARY KEY(opportunity_id, skill_id),
    FOREIGN KEY (opportunity_id) REFERENCES Opportunity(opportunity_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

-- ELIGIBILITY BRANCH
CREATE TABLE EligibilityBranch (
    eligibility_id INT,
    branch_id INT,
    PRIMARY KEY (eligibility_id, branch_id),
    FOREIGN KEY (eligibility_id) REFERENCES EligibilityCriteria(eligibility_id),
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);

-- ELIGIBILITY BATCH
CREATE TABLE EligibilityBatch (
    eligibility_id INT,
    batch_id INT,
    PRIMARY KEY (eligibility_id, batch_id),
    FOREIGN KEY (eligibility_id) REFERENCES EligibilityCriteria(eligibility_id),
    FOREIGN KEY (batch_id) REFERENCES Batch(batch_id)
);