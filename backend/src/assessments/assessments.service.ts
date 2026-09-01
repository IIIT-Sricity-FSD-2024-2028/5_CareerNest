import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { AssessmentsRepository, Assessment } from './assessments.repository';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { ApplicationsService } from '../applications/applications.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly repo: AssessmentsRepository,
    // forwardRef breaks the circular dep: AssessmentsModule ↔ ApplicationsModule
    @Inject(forwardRef(() => ApplicationsService))
    private readonly appsService: ApplicationsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(): Assessment[] {
    return this.repo.findAll();
  }

  findOne(id: number): Assessment {
    const a = this.repo.findById(id);
    if (!a) throw new NotFoundException(`Assessment with id ${id} not found`);
    return a;
  }

  findByOpportunity(opportunityId: number): Assessment[] {
    return this.repo.findByOpportunity(opportunityId);
  }

  create(dto: CreateAssessmentDto): Assessment {
    const assessment = this.repo.create({ ...dto, isDraft: dto.isDraft ?? false });

    // ── Notify ALL existing applicants for this opportunity ─────────────────
    // This fires when a recruiter schedules an assessment AFTER candidates have applied.
    if (dto.opportunityId) {
      const applications = this.appsService.findByOpportunity(dto.opportunityId);
      for (const app of applications) {
        this.notificationsService.create(
          {
            type: 'assessment',
            title: `📝 Assessment Scheduled: ${assessment.title}`,
            message:
              `${app.company} has scheduled an assessment for the ${app.title} role. ` +
              `Platform: ${assessment.platform} · ` +
              `Date: ${assessment.date} at ${assessment.time} · ` +
              `Duration: ${assessment.duration}. ` +
              `Join here: ${assessment.link}`,
            href: 'applications.html',
            isRead: false,
          },
          app.candidateId,
        );
      }
    }

    return assessment;
  }

  update(id: number, dto: UpdateAssessmentDto): Assessment {
    const updated = this.repo.update(id, dto as Partial<Assessment>);
    if (!updated) throw new NotFoundException(`Assessment with id ${id} not found`);
    return updated;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`Assessment with id ${id} not found`);
    return { message: `Assessment ${id} deleted successfully` };
  }
}
