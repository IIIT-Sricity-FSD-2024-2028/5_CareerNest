import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ReferralsRepository, Referral } from './referrals.repository';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly repo: ReferralsRepository,
    private readonly oppsService: OpportunitiesService,
  ) {}

  findAll(): Referral[] {
    return this.repo.findAll();
  }

  findByCandidate(candidateId: number): Referral[] {
    return this.repo.findByCandidate(candidateId);
  }

  findByAlumni(alumniId: number): Referral[] {
    return this.repo.findByAlumni(alumniId);
  }

  findOne(id: number): Referral {
    const ref = this.repo.findById(id);
    if (!ref) throw new NotFoundException(`Referral with id ${id} not found`);
    return ref;
  }

  create(dto: CreateReferralDto): Referral {
    const opp = this.oppsService.findOne(dto.opportunityId);
    const candidateId = dto.candidateId ?? 1;
    const now = new Date().toISOString().split('T')[0];
    const alumniName = dto.alumniName ?? 'Alumni';

    return this.repo.create({
      opportunityId:     dto.opportunityId,
      candidateId,
      candidateName:     dto.candidateName ?? 'Candidate',
      candidateInitials: dto.candidateInitials ?? 'CA',
      alumniId:          dto.alumniId ?? 7,
      alumniName,
      alumniInitials:    dto.alumniInitials ?? alumniName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      alumniAvatarColor: dto.alumniAvatarColor ?? '#3b82f6',
      alumniCompany:     dto.alumniCompany ?? opp.company,
      alumniBatch:       dto.alumniBatch ?? '',
      status:            'Pending',
      appliedRole:       dto.appliedRole ?? opp.title,
      appliedCompany:    dto.appliedCompany ?? opp.company,
      requestedDate:     dto.requestedDate ?? now,
      userMessage:       dto.userMessage,
      alumniResponse:    null,
      department:        dto.department,
      cgpa:              dto.cgpa,
    });
  }


  update(id: number, dto: UpdateReferralDto): Referral {
    const ref = this.repo.findById(id);
    if (!ref) throw new NotFoundException(`Referral with id ${id} not found`);
    const updated = this.repo.update(id, dto as Partial<Referral>);
    return updated!;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`Referral with id ${id} not found`);
    return { message: `Referral ${id} deleted successfully` };
  }

  getStats(alumniId: number): Record<string, number> {
    const refs = this.repo.findByAlumni(alumniId);
    return {
      total: refs.length,
      pending: refs.filter((r) => r.status === 'pending' || r.status === 'Pending').length,
      approved: refs.filter((r) => r.status === 'approved' || r.status === 'Approved').length,
      declined: refs.filter((r) => r.status === 'declined' || r.status === 'Rejected').length,
    };
  }
}
