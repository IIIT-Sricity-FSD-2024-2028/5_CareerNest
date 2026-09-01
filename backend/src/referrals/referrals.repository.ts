import { Injectable } from '@nestjs/common';

export interface Referral {
  id: number;
  opportunityId: number;
  candidateId: number;
  candidateName: string;
  candidateInitials: string;
  alumniId: number;
  alumniName: string;
  alumniInitials: string;
  alumniAvatarColor: string;
  alumniCompany: string;
  alumniBatch: string;
  status: string;
  appliedRole: string;
  appliedCompany: string;
  requestedDate: string;
  userMessage: string;
  alumniResponse: string | null;
  department?: string;
  cgpa?: number;
  skills?: string[];
}

@Injectable()
export class ReferralsRepository {
  private referrals: Referral[] = [
    // ── Shameer's "My Requests" — each to a DIFFERENT alumni ─────────────────
    // Karan Verma (id:90) at Analytics Hub — Pending
    {
      id: 1,
      opportunityId: 2,
      candidateId: 1,
      candidateName: 'Shameer Basha Shaik',
      candidateInitials: 'SB',
      alumniId: 90,
      alumniName: 'Karan Verma',
      alumniInitials: 'KV',
      alumniAvatarColor: '#3b82f6',
      alumniCompany: 'Analytics Hub',
      alumniBatch: '2023 Batch',
      status: 'Pending',
      appliedRole: 'Data Analyst Intern',
      appliedCompany: 'Analytics Hub',
      requestedDate: '2026-02-19',
      userMessage: "Hello Karan, I'm Shameer from CareerNest University. I'm targeting the data analyst internship at your firm and would greatly appreciate a referral if you find my profile suitable.",
      alumniResponse: null,
      department: 'Computer Science',
      cgpa: 8.7,
      skills: ['Python', 'SQL', 'Power BI'],
    },
    // Priya Sharma (id:91) at InnovateTech — Rejected
    {
      id: 2,
      opportunityId: 3,
      candidateId: 1,
      candidateName: 'Shameer Basha Shaik',
      candidateInitials: 'SB',
      alumniId: 91,
      alumniName: 'Priya Sharma',
      alumniInitials: 'PS',
      alumniAvatarColor: '#ef4444',
      alumniCompany: 'InnovateTech',
      alumniBatch: '2020 Batch',
      status: 'Rejected',
      appliedRole: 'Full Stack Developer',
      appliedCompany: 'InnovateTech',
      requestedDate: '2026-01-08',
      userMessage: 'Hi Priya! Could you please refer me for the Full Stack position? I have experience in Node and React.',
      alumniResponse: "Hi Shameer, unfortunately, our team has already filled our quota for referrals this quarter. Keep up the good work though!",
      department: 'Computer Science',
      cgpa: 8.7,
      skills: ['React', 'Node.js'],
    },
    // ── Referrals received by Sneha Reddy (alumniId:7, Google) from OTHER candidates ──
    // Sneha Reddy (id:7) has NO referral from candidateId:1 (Shameer) — so Shameer can request fresh
    {
      id: 3,
      opportunityId: 16,
      candidateId: 2,
      candidateName: 'Arjun Sharma',
      candidateInitials: 'AS',
      alumniId: 7,
      alumniName: 'Sneha Reddy',
      alumniInitials: 'SR',
      alumniAvatarColor: '#d97706',
      alumniCompany: 'Google',
      alumniBatch: '2021 Batch',
      status: 'approved',
      appliedRole: 'Software Engineer',
      appliedCompany: 'Google',
      requestedDate: '2026-02-10',
      userMessage: 'Hi Sneha, I am applying for the Software Engineer role at Google. I have strong Java and problem-solving skills. Could you please refer me?',
      alumniResponse: 'Arjun is a strong candidate with excellent coding skills. Happy to refer him.',
      department: 'Computer Science',
      cgpa: 8.7,
      skills: ['Java', 'Spring Boot', 'SQL', 'Problem Solving'],
    },
    {
      id: 4,
      opportunityId: 16,
      candidateId: 3,
      candidateName: 'Rahul Verma',
      candidateInitials: 'RV',
      alumniId: 7,
      alumniName: 'Sneha Reddy',
      alumniInitials: 'SR',
      alumniAvatarColor: '#d97706',
      alumniCompany: 'Google',
      alumniBatch: '2021 Batch',
      status: 'pending',
      appliedRole: 'Software Engineer',
      appliedCompany: 'Google',
      requestedDate: '2026-03-01',
      userMessage: 'Hi Sneha, I noticed you work at Google and I am very interested in the Software Engineer position. I have strong React and TypeScript skills and would be grateful for your referral.',
      alumniResponse: null,
      department: 'Electronics Engineering',
      cgpa: 8.5,
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    },
    {
      id: 5,
      opportunityId: 16,
      candidateId: 5,
      candidateName: 'Priya Patel',
      candidateInitials: 'PP',
      alumniId: 7,
      alumniName: 'Sneha Reddy',
      alumniInitials: 'SR',
      alumniAvatarColor: '#d97706',
      alumniCompany: 'Google',
      alumniBatch: '2021 Batch',
      status: 'declined',
      appliedRole: 'Software Engineer',
      appliedCompany: 'Google',
      requestedDate: '2026-02-20',
      userMessage: 'Hello Sneha, I would like to apply for a Software Engineer position at Google. I have strong experience in Python and distributed systems. Would appreciate your referral!',
      alumniResponse: 'This role requires deeper systems experience. I suggest reaching out to someone on the infra team.',
      department: 'Data Science',
      cgpa: 8.9,
      skills: ['Python', 'Machine Learning', 'Distributed Systems'],
    },
  ];

  private nextId = 6;

  findAll(): Referral[] {
    return this.referrals;
  }

  findByCandidate(candidateId: number): Referral[] {
    return this.referrals.filter((r) => r.candidateId === candidateId);
  }

  findByAlumni(alumniId: number): Referral[] {
    return this.referrals.filter((r) => r.alumniId === alumniId);
  }

  findById(id: number): Referral | undefined {
    return this.referrals.find((r) => r.id === id);
  }

  create(data: Omit<Referral, 'id'>): Referral {
    const ref: Referral = { id: this.nextId++, ...data };
    this.referrals.push(ref);
    return ref;
  }

  update(id: number, data: Partial<Referral>): Referral | undefined {
    const idx = this.referrals.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.referrals[idx] = { ...this.referrals[idx], ...data };
    return this.referrals[idx];
  }

  remove(id: number): boolean {
    const idx = this.referrals.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.referrals.splice(idx, 1);
    return true;
  }
}
