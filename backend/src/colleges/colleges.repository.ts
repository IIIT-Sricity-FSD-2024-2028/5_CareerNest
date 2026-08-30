import { Injectable } from '@nestjs/common';

/**
 * Subscription tiers and pricing for the CareerNest Revenue Model:
 *
 *  Basic    — ₹15,000 /month  → up to 200 students, 2 drives/yr
 *  Standard — ₹30,000 /month  → up to 500 students, 5 drives/yr
 *  Premium  — ₹50,000 /month  → unlimited students, unlimited drives
 *
 * Additionally, recruiters pay a per-drive fee:
 *  Free Tier    —  ₹0      (up to 1 drive/yr)
 *  Growth Tier  —  ₹5,000  per drive
 *  Enterprise   —  ₹15,000 per drive
 */

export type SubscriptionTier = 'basic' | 'standard' | 'premium';
export type RecruiterTier    = 'free' | 'growth' | 'enterprise';

export const SUBSCRIPTION_PRICING: Record<SubscriptionTier, number> = {
  basic:    15000,
  standard: 30000,
  premium:  50000,
};

export const RECRUITER_DRIVE_PRICING: Record<RecruiterTier, number> = {
  free:       0,
  growth:  5000,
  enterprise: 15000,
};

export interface College {
  id: number;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  // ── Revenue fields ──────────────────────────────────────
  subscriptionTier: SubscriptionTier;
  subscriptionFee: number;          // monthly fee in ₹
  recruiterTier: RecruiterTier;
  driveFee: number;                 // per-drive fee in ₹
  drivesThisYear: number;           // number of placement drives conducted
  studentLimit: number;             // max students allowed on plan
  // ─────────────────────────────────────────────────────────
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class CollegesRepository {
  private colleges: College[] = [
    {
      id: 1,
      name: 'IIIT Sri City',
      code: 'IIITSRICITY',
      email: 'admin@iiitsricity.ac.in',
      phone: '+91 8626 252525',
      address: 'Chittoor, Andhra Pradesh',
      website: 'https://iiits.ac.in',
      status: 'active',
      subscriptionTier: 'premium',
      subscriptionFee: 50000,
      recruiterTier: 'enterprise',
      driveFee: 15000,
      drivesThisYear: 12,
      studentLimit: 99999,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'VIT University',
      code: 'VIT',
      email: 'admin@vit.ac.in',
      phone: '+91 416 2202020',
      address: 'Vellore, Tamil Nadu',
      website: 'https://vit.ac.in',
      status: 'active',
      subscriptionTier: 'premium',
      subscriptionFee: 50000,
      recruiterTier: 'enterprise',
      driveFee: 15000,
      drivesThisYear: 18,
      studentLimit: 99999,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 3,
      name: 'SRM Institute',
      code: 'SRM',
      email: 'admin@srm.edu.in',
      phone: '+91 44 27417000',
      address: 'Kattankulathur, Tamil Nadu',
      website: 'https://srmist.edu.in',
      status: 'active',
      subscriptionTier: 'standard',
      subscriptionFee: 30000,
      recruiterTier: 'growth',
      driveFee: 5000,
      drivesThisYear: 8,
      studentLimit: 500,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 4,
      name: 'BITS Pilani',
      code: 'BITS',
      email: 'admin@bits-pilani.ac.in',
      phone: '+91 1596 242192',
      address: 'Pilani, Rajasthan',
      website: 'https://www.bits-pilani.ac.in',
      status: 'active',
      subscriptionTier: 'premium',
      subscriptionFee: 50000,
      recruiterTier: 'enterprise',
      driveFee: 15000,
      drivesThisYear: 22,
      studentLimit: 99999,
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
    },
    {
      id: 5,
      name: 'Manipal Institute of Technology',
      code: 'MIT',
      email: 'admin@manipal.edu',
      phone: '+91 820 2922222',
      address: 'Manipal, Karnataka',
      website: 'https://manipal.edu',
      status: 'active',
      subscriptionTier: 'standard',
      subscriptionFee: 30000,
      recruiterTier: 'growth',
      driveFee: 5000,
      drivesThisYear: 6,
      studentLimit: 500,
      createdAt: '2024-04-01',
      updatedAt: '2024-04-01',
    },
    {
      id: 6,
      name: 'Amity University',
      code: 'AMITY',
      email: 'admin@amity.edu',
      phone: '+91 120 4392000',
      address: 'Noida, Uttar Pradesh',
      website: 'https://amity.edu',
      status: 'inactive',
      subscriptionTier: 'basic',
      subscriptionFee: 15000,
      recruiterTier: 'free',
      driveFee: 0,
      drivesThisYear: 1,
      studentLimit: 200,
      createdAt: '2024-02-15',
      updatedAt: '2024-06-01',
    },
  ];

  private nextId = 7;

  findAll(): College[] {
    return this.colleges;
  }

  findById(id: number): College | undefined {
    return this.colleges.find(c => c.id === id);
  }

  findByCode(code: string): College | undefined {
    return this.colleges.find(c => c.code === code);
  }

  create(data: Omit<College, 'id'>): College {
    const college: College = { id: this.nextId++, ...data };
    this.colleges.push(college);
    return college;
  }

  update(id: number, data: Partial<College>): College | undefined {
    const idx = this.colleges.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.colleges[idx] = {
      ...this.colleges[idx],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return this.colleges[idx];
  }

  remove(id: number): boolean {
    const idx = this.colleges.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.colleges.splice(idx, 1);
    return true;
  }
}
