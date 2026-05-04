import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { ApplicationsRepository, Application } from './applications.repository';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { AssessmentsService } from '../assessments/assessments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly repo: ApplicationsRepository,
    private readonly oppsService: OpportunitiesService,
    @Inject(forwardRef(() => AssessmentsService))
    private readonly assessmentsService: AssessmentsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(): Application[] {
    return this.repo.findAll();
  }

  findByCandidate(candidateId: number): Application[] {
    return this.repo.findByCandidate(candidateId);
  }

  findByOpportunity(opportunityId: number): Application[] {
    return this.repo.findByOpportunity(opportunityId);
  }

  findOne(id: number): Application {
    const app = this.repo.findById(id);
    if (!app) throw new NotFoundException(`Application with id ${id} not found`);
    return app;
  }

  apply(dto: CreateApplicationDto): Application {
    const opp = this.oppsService.findOne(dto.opportunityId);
    const candidateId = dto.candidateId ?? 1;

    if (this.repo.existsByOpportunityAndCandidate(dto.opportunityId, candidateId)) {
      throw new ConflictException('You have already applied to this opportunity');
    }

    const now = new Date().toISOString().split('T')[0];
    const application = this.repo.create({
      opportunityId: dto.opportunityId,
      candidateId,
      candidateName: dto.candidateName ?? 'Candidate',
      branch: dto.branch,
      cgpa: dto.cgpa,
      title: opp.title,
      company: opp.company,
      type: opp.type,
      status: 'Applied',
      appliedDate: now,
      hasReferral: dto.hasReferral ?? false,
      currentStageIndex: 1,
      initials: (dto.candidateName ?? 'CA').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      rounds: { resume: 'Scheduled', assessment: 'Scheduled', technical: 'Scheduled', hr: 'Scheduled' },
      timeline: [{ stage: 'Applied', date: now, desc: 'Submitted', status: 'completed' }],
    });

    this.oppsService.incrementApplications(dto.opportunityId);

    // ── Assessment Announcement ────────────────────────────────────────────
    // If the recruiter has linked assessments to this opportunity, notify the candidate.
    const assessments = this.assessmentsService.findByOpportunity(dto.opportunityId);
    for (const assessment of assessments) {
      this.notificationsService.create(
        {
          type: 'assessment',
          title: `📝 Assessment Scheduled: ${assessment.title}`,
          message:
            `${opp.company} has scheduled an assessment for the ${opp.title} role. ` +
            `Platform: ${assessment.platform} · ` +
            `Date: ${assessment.date} at ${assessment.time} · ` +
            `Duration: ${assessment.duration}. ` +
            `Join here: ${assessment.link}`,
          href: 'applications.html',
          isRead: false,
        },
        candidateId,
      );
    }

    return application;
  }

  updateStatus(id: number, dto: UpdateApplicationDto): Application {
    const app = this.repo.findById(id);
    if (!app) throw new NotFoundException(`Application with id ${id} not found`);

    const now = new Date().toISOString().split('T')[0];
    const updates: Partial<Application> = {};

    // Persist round results if provided
    if (dto.rounds) {
      updates.rounds = { ...app.rounds, ...dto.rounds };
    }

    if (dto.status && dto.status !== app.status) {
      const timeline = [...app.timeline];
      // Mark the last active stage as completed
      const lastActive = timeline.findIndex((t) => t.status === 'active');
      if (lastActive !== -1) timeline[lastActive].status = 'completed';

      // Add new stage entry
      timeline.push({
        stage: dto.status,
        date: dto.interviewDate ?? now,
        desc: dto.remarks ?? `Moved to ${dto.status}`,
        status: 'active',
      });
      updates.status = dto.status;
      updates.timeline = timeline;
      updates.currentStageIndex = timeline.length;
    }

    const updated = this.repo.update(id, updates);
    return updated!;
  }

  withdraw(id: number): Application {
    const app = this.repo.findById(id);
    if (!app) throw new NotFoundException(`Application with id ${id} not found`);
    if (['Rejected', 'Offer', 'Withdrawn'].includes(app.status)) {
      throw new ConflictException(`Cannot withdraw an application with status '${app.status}'`);
    }
    const now = new Date().toISOString().split('T')[0];
    return this.repo.update(id, {
      status: 'Withdrawn',
      timeline: [
        ...app.timeline,
        { stage: 'Withdrawn', date: now, desc: 'Self withdrawn', status: 'completed' },
      ],
    })!;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`Application with id ${id} not found`);
    return { message: `Application ${id} deleted successfully` };
  }

  getStats(candidateId: number): Record<string, number> {
    const apps = this.repo.findByCandidate(candidateId);
    return {
      total: apps.length,
      applied: apps.filter((a) => a.status === 'Applied').length,
      shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
      interviews: apps.filter((a) => a.status === 'Interview').length,
      offers: apps.filter((a) => a.status === 'Offer').length,
      rejected: apps.filter((a) => a.status === 'Rejected').length,
    };
  }
}
