import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository, User } from '../users/users.repository';
import { CollegesRepository, College } from '../colleges/colleges.repository';
import { ApplicationsRepository } from '../applications/applications.repository';

export interface CollegeWithAdmin extends College {
  admin?: Omit<User, 'password'>;
  stats?: {
    students: number;
    placementOfficers: number;
    alumni: number;
    recruiters: number;
    placed: number;
  };
}

/** Strip password from a user object */
function safeUser(user: User): Omit<User, 'password'> {
  const { password: _, ...rest } = user as any;
  return rest;
}

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly collegesRepo: CollegesRepository,
    private readonly applicationsRepo: ApplicationsRepository,
  ) {}

  /** Platform-wide aggregate stats */
  getPlatformStats() {
    const colleges = this.collegesRepo.findAll();
    const users = this.usersRepo.findAll();
    const apps = this.applicationsRepo.findAll();

    return {
      totalColleges: colleges.length,
      activeColleges: colleges.filter(c => c.status === 'active').length,
      inactiveColleges: colleges.filter(c => c.status === 'inactive').length,
      suspendedColleges: colleges.filter(c => c.status === 'suspended').length,
      totalStudents: users.filter(u => u.role === 'candidate').length,
      totalAlumni: users.filter(u => u.role === 'alumni').length,
      totalPlacementOfficers: users.filter(u => u.role === 'placement_officer').length,
      totalCollegeAdmins: users.filter(u => u.role === 'college_admin').length,
      totalPlaced: apps.filter(a => ['Offer', 'Offered'].includes(a.status)).length,
    };
  }

  /**
   * Revenue model stats — computed from college subscription tiers and drive fees.
   *
   * Revenue streams:
   *   1. Monthly subscription fees per college (basic/standard/premium)
   *   2. Per-placement-drive fees from recruiters (free/growth/enterprise)
   */
  getRevenueStats() {
    const colleges = this.collegesRepo.findAll();
    const active   = colleges.filter(c => c.status === 'active');

    // ── Subscription Revenue ─────────────────────────────────────────────
    const subscriptionMRR = active.reduce((sum, c) => sum + (c.subscriptionFee ?? 0), 0);
    const subscriptionARR = subscriptionMRR * 12;

    const byTier = {
      premium:  active.filter(c => c.subscriptionTier === 'premium'),
      standard: active.filter(c => c.subscriptionTier === 'standard'),
      basic:    active.filter(c => c.subscriptionTier === 'basic'),
    };

    // ── Recruiter Drive Revenue ──────────────────────────────────────────
    const driveRevenue = active.reduce((sum, c) => sum + (c.driveFee ?? 0) * (c.drivesThisYear ?? 0), 0);
    const totalDrives  = active.reduce((sum, c) => sum + (c.drivesThisYear ?? 0), 0);

    // ── Total Annual Revenue ─────────────────────────────────────────────
    const totalAnnualRevenue = subscriptionARR + driveRevenue;

    // ── Top 3 Revenue Colleges ───────────────────────────────────────────
    const topColleges = [...active]
      .map(c => ({
        id:   c.id,
        name: c.name,
        revenue: (c.subscriptionFee ?? 0) * 12 + (c.driveFee ?? 0) * (c.drivesThisYear ?? 0),
        tier: c.subscriptionTier,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    return {
      // Subscription revenue
      subscriptionMRR,
      subscriptionARR,
      // Drive revenue
      driveRevenue,
      totalDrives,
      // Combined
      totalAnnualRevenue,
      // Tier breakdown
      tiers: {
        premium:  { count: byTier.premium.length,  mrr: byTier.premium.reduce((s, c)  => s + c.subscriptionFee, 0),  pricePerMonth: 50000 },
        standard: { count: byTier.standard.length, mrr: byTier.standard.reduce((s, c) => s + c.subscriptionFee, 0), pricePerMonth: 30000 },
        basic:    { count: byTier.basic.length,    mrr: byTier.basic.reduce((s, c)    => s + c.subscriptionFee, 0),  pricePerMonth: 15000 },
      },
      // Top earning colleges
      topColleges,
    };
  }

  /** All colleges with their college admin and stats */
  getAllCollegesWithAdmins(): CollegeWithAdmin[] {
    const colleges = this.collegesRepo.findAll();
    const users = this.usersRepo.findAll();
    const apps = this.applicationsRepo.findAll();

    return colleges.map(college => {
      const admin = users.find(u => u.role === 'college_admin' && u.collegeId === college.id && u.status !== 'inactive');
      return {
        ...college,
        admin: admin ? safeUser(admin) : undefined,
        stats: {
          students: users.filter(u => u.role === 'candidate' && u.collegeId === college.id).length,
          placementOfficers: users.filter(u => u.role === 'placement_officer' && u.collegeId === college.id).length,
          alumni: users.filter(u => u.role === 'alumni' && u.collegeId === college.id).length,
          recruiters: users.filter(u => u.role === 'recruiter' && u.collegeId === college.id).length,
          placed: apps.filter(a => a.collegeId === college.id && ['Offer', 'Offered'].includes(a.status)).length,
        },
      };
    });
  }

  /** Single college with admin + stats */
  getCollegeWithAdmin(collegeId: number): CollegeWithAdmin {
    const college = this.collegesRepo.findById(collegeId);
    if (!college) throw new NotFoundException(`College ${collegeId} not found`);

    const users = this.usersRepo.findAll();
    const apps = this.applicationsRepo.findAll();
    const admin = users.find(u => u.role === 'college_admin' && u.collegeId === collegeId && u.status !== 'inactive');

    return {
      ...college,
      admin: admin ? safeUser(admin) : undefined,
      stats: {
        students: users.filter(u => u.role === 'candidate' && u.collegeId === collegeId).length,
        placementOfficers: users.filter(u => u.role === 'placement_officer' && u.collegeId === collegeId).length,
        alumni: users.filter(u => u.role === 'alumni' && u.collegeId === collegeId).length,
        recruiters: users.filter(u => u.role === 'recruiter' && u.collegeId === collegeId).length,
        placed: apps.filter(a => a.collegeId === collegeId && ['Offer', 'Offered'].includes(a.status)).length,
      },
    };
  }

  /** Get the active college admin for a college */
  getCollegeAdmin(collegeId: number): Omit<User, 'password'> | null {
    const college = this.collegesRepo.findById(collegeId);
    if (!college) throw new NotFoundException(`College ${collegeId} not found`);
    const admin = this.usersRepo.findAll().find(u => u.role === 'college_admin' && u.collegeId === collegeId);
    return admin ? safeUser(admin) : null;
  }

  /** Create or assign a new college admin for a college */
  createCollegeAdmin(collegeId: number, data: { name: string; email: string; password?: string }): Omit<User, 'password'> {
    const college = this.collegesRepo.findById(collegeId);
    if (!college) throw new NotFoundException(`College ${collegeId} not found`);

    // Prevent duplicate email
    const existingByEmail = this.usersRepo.findByEmail(data.email);
    if (existingByEmail && existingByEmail.role !== 'college_admin') {
      throw new ConflictException(`User with email '${data.email}' already exists with role '${existingByEmail.role}'`);
    }
    if (existingByEmail && existingByEmail.collegeId === collegeId) {
      throw new ConflictException(`A college admin for college ${collegeId} with this email already exists`);
    }

    // Deactivate previous admin for this college (if any)
    const oldAdmin = this.usersRepo.findAll().find(u => u.role === 'college_admin' && u.collegeId === collegeId && u.status === 'active');
    if (oldAdmin) {
      this.usersRepo.update(oldAdmin.id, { status: 'inactive' });
    }

    const user = this.usersRepo.create({
      name: data.name,
      email: data.email,
      role: 'college_admin',
      collegeId,
      status: 'active',
      password: data.password ?? '123',
      avatar: data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    });

    return safeUser(user);
  }

  /** Update college admin profile */
  updateCollegeAdmin(collegeId: number, data: Partial<{ name: string; email: string; status: string }>): Omit<User, 'password'> {
    const admin = this.usersRepo.findAll().find(u => u.role === 'college_admin' && u.collegeId === collegeId);
    if (!admin) throw new NotFoundException(`No college admin found for college ${collegeId}`);
    const updated = this.usersRepo.update(admin.id, data);
    return safeUser(updated!);
  }

  /** Toggle college admin active/inactive status */
  toggleCollegeAdminStatus(collegeId: number, status: 'active' | 'inactive'): Omit<User, 'password'> {
    return this.updateCollegeAdmin(collegeId, { status });
  }

  /** Get all users of a specific college (for super admin oversight) */
  getCollegeUsers(collegeId: number): Omit<User, 'password'>[] {
    const college = this.collegesRepo.findById(collegeId);
    if (!college) throw new NotFoundException(`College ${collegeId} not found`);
    return this.usersRepo.findByCollegeId(collegeId).map(safeUser);
  }
}
