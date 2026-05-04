import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository, Opportunity } from './opportunities.repository';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly repo: OpportunitiesRepository) {}

  findAll(): Opportunity[] {
    return this.repo.findAll();
  }

  findPublished(): Opportunity[] {
    return this.repo.findPublished();
  }

  findOne(id: number): Opportunity {
    const opp = this.repo.findById(id);
    if (!opp) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return opp;
  }

  create(dto: CreateOpportunityDto, submittedBy?: string): Opportunity {
    return this.repo.create({ ...dto, status: 'pending', applications: 0, submittedBy });
  }

  update(id: number, dto: UpdateOpportunityDto): Opportunity {
    const updated = this.repo.update(id, dto as Partial<Opportunity>);
    if (!updated) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return updated;
  }

  approve(id: number): Opportunity {
    const opp = this.repo.findById(id);
    if (!opp) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return this.repo.update(id, { status: 'approved' })!;
  }

  publish(id: number): Opportunity {
    const opp = this.repo.findById(id);
    if (!opp) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return this.repo.update(id, { status: 'Published' })!;
  }

  reject(id: number, remark: string): Opportunity {
    const opp = this.repo.findById(id);
    if (!opp) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return this.repo.update(id, { status: 'rejected', rejectionRemark: remark })!;
  }

  remove(id: number): { message: string } {
    const removed = this.repo.remove(id);
    if (!removed) throw new NotFoundException(`Opportunity with id ${id} not found`);
    return { message: `Opportunity ${id} deleted successfully` };
  }

  incrementApplications(id: number): void {
    const opp = this.repo.findById(id);
    if (opp) {
      this.repo.update(id, { applications: opp.applications + 1 });
    }
  }
}
